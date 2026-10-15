-- Per-network rate limit for joining the waitlist.
-- Enforced in the database so it holds across every serverless instance. Only a keyed hash of the
-- client IP is stored, never the IP itself, and attempts older than a day are pruned.

create table public.waitlist_attempts (
  id         bigint generated always as identity primary key,
  ip_hash    text not null,
  created_at timestamptz not null default now()
);

create index waitlist_attempts_ip_time_idx on public.waitlist_attempts (ip_hash, created_at);
create index waitlist_attempts_time_idx on public.waitlist_attempts (created_at);

alter table public.waitlist_attempts enable row level security;
revoke all on table public.waitlist_attempts from anon, authenticated;

-- Same as before, plus an optional rate limit. Returns {"rate_limited": true} when the
-- network has made more than p_limit attempts in the last p_window.
drop function public.join_waitlist(text, text, text, text, text, text);

create function public.join_waitlist(
  p_name text,
  p_email text,
  p_ref text,
  p_pain text default null,
  p_other text default null,
  p_referred_by text default null,
  p_ip_hash text default null,
  p_limit int default 10,
  p_window interval default interval '10 minutes'
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  r public.waitlist;
  is_new boolean := true;
  recent int;
begin
  if p_ip_hash is not null then
    -- Serialize attempts from one network so concurrent requests can't all slip under the limit.
    perform pg_advisory_xact_lock(hashtextextended(p_ip_hash, 0));

    insert into public.waitlist_attempts (ip_hash) values (p_ip_hash);
    select count(*) into recent
      from public.waitlist_attempts a
      where a.ip_hash = p_ip_hash and a.created_at > now() - p_window;

    if random() < 0.01 then
      delete from public.waitlist_attempts a where a.created_at < now() - interval '1 day';
    end if;

    if recent > p_limit then
      return jsonb_build_object('rate_limited', true);
    end if;
  end if;

  insert into public.waitlist (name, email, ref, pain, other, referred_by)
  values (p_name, p_email, p_ref, p_pain, p_other, p_referred_by)
  on conflict (email) do nothing
  returning * into r;

  if not found then
    is_new := false;
    select * into r from public.waitlist w where w.email = p_email;
  end if;

  return jsonb_build_object(
    'id', r.id,
    'ref', r.ref,
    'position', (select count(*) from public.waitlist w where w.seq <= r.seq),
    'returning', not is_new
  );
end;
$$;

revoke execute on function public.join_waitlist(text, text, text, text, text, text, text, int, interval)
  from public, anon, authenticated;
grant execute on function public.join_waitlist(text, text, text, text, text, text, text, int, interval)
  to service_role;
