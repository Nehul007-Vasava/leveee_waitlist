-- Leveee waitlist.
-- Only the server (secret / service_role key) touches this table. RLS is on with no policies,
-- and anon/authenticated have no grants, so the public anon key can't read or write signups.

create table public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  seq          bigint generated always as identity unique, -- signup order; place in line = rank by seq
  ref          text not null unique,                       -- referral code shared by this person
  created_at   timestamptz not null default now(),
  name         text not null check (char_length(name) between 1 and 60),
  email        text not null unique check (email = lower(email) and char_length(email) <= 120),
  pain         text check (pain in ('heat', 'loop', 'replay', 'distance', 'other')),
  other        text check (char_length(other) <= 280),
  referred_by  text check (char_length(referred_by) <= 40),
  -- optional follow-up answers
  together     text check (char_length(together) <= 40),
  partner_open text check (char_length(partner_open) <= 40),
  loop         text[] check (cardinality(loop) <= 5)
);

create index waitlist_referred_by_idx on public.waitlist (referred_by) where referred_by is not null;

alter table public.waitlist enable row level security;
revoke all on table public.waitlist from anon, authenticated;

-- Join in one round trip: insert, or return the existing signup for this email.
-- ON CONFLICT makes concurrent submits with the same email safe.
create function public.join_waitlist(
  p_name text,
  p_email text,
  p_ref text,
  p_pain text default null,
  p_other text default null,
  p_referred_by text default null
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  r public.waitlist;
  is_new boolean := true;
begin
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

revoke execute on function public.join_waitlist(text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.join_waitlist(text, text, text, text, text, text) to service_role;
