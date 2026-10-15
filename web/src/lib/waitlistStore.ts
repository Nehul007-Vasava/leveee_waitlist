import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHmac, randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Waitlist storage.
  Production: Supabase Postgres (schema in supabase/migrations). Needs SUPABASE_URL plus a server-side
  key: SUPABASE_SECRET_KEY (sb_secret_...) or the legacy SUPABASE_SERVICE_ROLE_KEY. Never expose either
  to the browser (no NEXT_PUBLIC_ prefix).
  Local dev: falls back to .data/waitlist.json when Supabase isn't configured. The fallback is refused
  on Vercel, whose filesystem is read-only.
*/

export type JoinInput = {
  name: string;
  email: string;
  ref: string;
  pain: string | null;
  other?: string;
  referredBy?: string;
  /** Client IP, used only for rate limiting. Stored as a keyed hash, never raw. */
  ip?: string;
};

export type JoinResult = { id: string; ref: string; position: number; returning: boolean };

export type FollowUp = { together?: string; partnerOpen?: string; loop?: string[] };

type Store = {
  join(input: JoinInput): Promise<JoinResult>;
  /** Returns false when no signup has this id. */
  update(id: string, fields: FollowUp): Promise<boolean>;
};

/** Thrown when the generated referral code is already taken; the caller retries with a new one. */
export class RefTakenError extends Error {}

/** Thrown when one network has made too many join attempts recently. */
export class RateLimitedError extends Error {}

// Signup attempts allowed per network per window. Generous enough for a household or office on one IP.
const RATE_LIMIT = 10;
const RATE_WINDOW = "10 minutes";

/* ---------- Supabase ---------- */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | undefined;
function db() {
  client ??= createClient(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}

const supabaseStore: Store = {
  async join(input) {
    const { data, error } = await db().rpc("join_waitlist", {
      p_name: input.name,
      p_email: input.email,
      p_ref: input.ref,
      p_pain: input.pain,
      p_other: input.other ?? null,
      p_referred_by: input.referredBy ?? null,
      p_ip_hash: input.ip ? createHmac("sha256", SUPABASE_KEY!).update(input.ip).digest("hex") : null,
      p_limit: RATE_LIMIT,
      p_window: RATE_WINDOW,
    });
    if (error) {
      if (error.code === "23505" && error.message.includes("waitlist_ref_key")) {
        throw new RefTakenError(`referral code ${input.ref} already taken`);
      }
      throw new Error(`join_waitlist: ${error.code} ${error.message}`);
    }
    if (data?.rate_limited) throw new RateLimitedError("too many join attempts from this network");
    return data as JoinResult;
  },
  async update(id, fields) {
    const { data, error } = await db()
      .from("waitlist")
      .update({ together: fields.together, partner_open: fields.partnerOpen, loop: fields.loop })
      .eq("id", id)
      .select("id");
    if (error) throw new Error(`waitlist update: ${error.code} ${error.message}`);
    return data.length > 0;
  },
};

/* ---------- Local JSON file (dev only) ---------- */

type FileEntry = JoinInput & FollowUp & { id: string; createdAt: string };

const FILE = path.join(process.cwd(), ".data", "waitlist.json");

async function readAll(): Promise<FileEntry[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeAll(entries: FileEntry[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2));
}

const fileStore: Store = {
  async join(input) {
    const entries = await readAll();
    const existing = entries.find((e) => e.email === input.email);
    if (existing) {
      return { id: existing.id, ref: existing.ref, position: entries.indexOf(existing) + 1, returning: true };
    }
    const entry: FileEntry = { ...input, ip: undefined, id: randomUUID(), createdAt: new Date().toISOString() };
    entries.push(entry);
    await writeAll(entries);
    return { id: entry.id, ref: entry.ref, position: entries.length, returning: false };
  },
  async update(id, fields) {
    const entries = await readAll();
    const entry = entries.find((e) => e.id === id);
    if (!entry) return false;
    Object.assign(entry, Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined)));
    await writeAll(entries);
    return true;
  },
};

export function getStore(): Store {
  if (SUPABASE_URL && SUPABASE_KEY) return supabaseStore;
  if (process.env.VERCEL) {
    throw new Error("waitlist: Supabase not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel.");
  }
  return fileStore;
}
