import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/*
  Minimal waitlist store. Writes to .data/waitlist.json so the funnel works locally.
  INTEGRATION: swap readAll/writeAll for your email tool or database
  (Resend, Loops, ConvertKit, Supabase...). Serverless hosts have a read-only FS,
  so production needs a real store.
*/

type Entry = {
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

const FILE = path.join(process.cwd(), ".data", "waitlist.json");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAINS = new Set(["heat", "loop", "replay", "distance", "other"]);

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

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function refCode(name: string) {
  const base = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10) || "friend";
  return `${base}${randomUUID().slice(0, 4)}`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const entries = await readAll();

  // Follow-up answers (optional step 3, loop map) attach to an existing signup.
  if (body.action === "update") {
    const entry = entries.find((e) => e.id === str(body.id, 64));
    if (!entry) return Response.json({ error: "Signup not found." }, { status: 404 });
    if (body.together) entry.together = str(body.together, 40);
    if (body.partnerOpen) entry.partnerOpen = str(body.partnerOpen, 40);
    if (Array.isArray(body.loop)) entry.loop = body.loop.slice(0, 5).map((v) => str(v, 80));
    await writeAll(entries).catch(() => {});
    return Response.json({ ok: true });
  }

  const name = str(body.name, 60);
  const email = str(body.email, 120).toLowerCase();
  const pain = PAINS.has(str(body.pain)) ? str(body.pain) : null;

  if (!name) return Response.json({ error: "Please enter your first name." }, { status: 400 });
  if (!EMAIL.test(email)) {
    return Response.json({ error: "Please enter a valid email, like name@example.com." }, { status: 400 });
  }

  const existing = entries.find((e) => e.email === email);
  if (existing) {
    const position = entries.indexOf(existing) + 1;
    return Response.json({ id: existing.id, ref: existing.ref, position, returning: true });
  }

  const entry: Entry = {
    id: randomUUID(),
    ref: refCode(name),
    createdAt: new Date().toISOString(),
    name,
    email,
    pain,
    other: pain === "other" ? str(body.other, 280) : undefined,
    referredBy: str(body.referredBy, 40) || undefined,
  };
  entries.push(entry);

  try {
    await writeAll(entries);
  } catch (err) {
    console.error("waitlist: could not persist entry", err);
  }

  return Response.json({ id: entry.id, ref: entry.ref, position: entries.length });
}
