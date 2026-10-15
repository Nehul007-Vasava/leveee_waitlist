import { promises as fs } from "node:fs";
import path from "node:path";

/*
  Waitlist storage.
  Production (Vercel): Upstash Redis over its REST API. Add the Upstash integration from the
  Vercel Marketplace and it injects KV_REST_API_URL / KV_REST_API_TOKEN (UPSTASH_REDIS_REST_* also work).
  Local dev: falls back to .data/waitlist.json when no Redis env is set.
  Serverless hosts have a read-only, ephemeral FS, so the file fallback is refused in production.
*/

export type Entry = {
  id: string;
  ref: string;
  createdAt: string;
  name: string;
  email: string;
  pain: string | null;
  other?: string;
  together?: string;
  partnerOpen?: string;
  loop?: string[];
  referredBy?: string;
};

type AddResult = { entry: Entry; position: number; returning: boolean };

type Store = {
  add(entry: Entry): Promise<AddResult>;
  get(id: string): Promise<Entry | null>;
  save(entry: Entry): Promise<void>;
};

/* ---------- Upstash Redis ---------- */

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const K = {
  ids: "waitlist:ids",
  entry: (id: string) => `waitlist:entry:${id}`,
  email: (email: string) => `waitlist:email:${email}`,
};

async function redis<T>(...command: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(`redis ${command[0]}: ${data.error ?? res.status}`);
  return data.result as T;
}

const redisStore: Store = {
  async add(entry) {
    // Claim the email atomically so two concurrent signups can't both get in.
    const claimed = await redis<string | null>("SET", K.email(entry.email), entry.id, "NX");
    if (!claimed) {
      const id = await redis<string>("GET", K.email(entry.email));
      const existing = await redisStore.get(id);
      const index = await redis<number | null>("LPOS", K.ids, id);
      if (existing) return { entry: existing, position: (index ?? 0) + 1, returning: true };
      // Claim left over from a half-finished signup: take it over.
      await redis("SET", K.email(entry.email), entry.id);
    }
    await redisStore.save(entry);
    const position = await redis<number>("RPUSH", K.ids, entry.id);
    return { entry, position, returning: false };
  },
  async get(id) {
    const raw = await redis<string | null>("GET", K.entry(id));
    return raw ? (JSON.parse(raw) as Entry) : null;
  },
  async save(entry) {
    await redis("SET", K.entry(entry.id), JSON.stringify(entry));
  },
};

/* ---------- Local JSON file (dev only) ---------- */

const FILE = path.join(process.cwd(), ".data", "waitlist.json");

async function readAll(): Promise<Entry[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeAll(entries: Entry[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2));
}

const fileStore: Store = {
  async add(entry) {
    const entries = await readAll();
    const existing = entries.find((e) => e.email === entry.email);
    if (existing) return { entry: existing, position: entries.indexOf(existing) + 1, returning: true };
    entries.push(entry);
    await writeAll(entries);
    return { entry, position: entries.length, returning: false };
  },
  async get(id) {
    return (await readAll()).find((e) => e.id === id) ?? null;
  },
  async save(entry) {
    const entries = await readAll();
    const i = entries.findIndex((e) => e.id === entry.id);
    if (i === -1) entries.push(entry);
    else entries[i] = entry;
    await writeAll(entries);
  },
};

export function getStore(): Store {
  if (REDIS_URL && REDIS_TOKEN) return redisStore;
  if (process.env.VERCEL) {
    throw new Error("waitlist: no Redis configured. Add Upstash Redis in Vercel → Storage.");
  }
  return fileStore;
}
