import { randomUUID } from "node:crypto";
import { getStore, type Entry } from "@/lib/waitlistStore";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAINS = new Set(["heat", "loop", "replay", "distance", "other"]);
const SAVE_FAILED = "We couldn't save your spot just now. Please try again in a moment.";

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

  // Follow-up answers (optional step 3, loop map) attach to an existing signup.
  if (body.action === "update") {
    try {
      const store = getStore();
      const entry = await store.get(str(body.id, 64));
      if (!entry) return Response.json({ error: "Signup not found." }, { status: 404 });
      if (body.together) entry.together = str(body.together, 40);
      if (body.partnerOpen) entry.partnerOpen = str(body.partnerOpen, 40);
      if (Array.isArray(body.loop)) entry.loop = body.loop.slice(0, 5).map((v) => str(v, 80));
      await store.save(entry);
      return Response.json({ ok: true });
    } catch (err) {
      console.error("waitlist: could not update entry", err);
      return Response.json({ error: SAVE_FAILED }, { status: 500 });
    }
  }

  const name = str(body.name, 60);
  const email = str(body.email, 120).toLowerCase();
  const pain = PAINS.has(str(body.pain)) ? str(body.pain) : null;

  if (!name) return Response.json({ error: "Please enter your first name." }, { status: 400 });
  if (!EMAIL.test(email)) {
    return Response.json({ error: "Please enter a valid email, like name@example.com." }, { status: 400 });
  }

  const candidate: Entry = {
    id: randomUUID(),
    ref: refCode(name),
    createdAt: new Date().toISOString(),
    name,
    email,
    pain,
    other: pain === "other" ? str(body.other, 280) : undefined,
    referredBy: str(body.referredBy, 40) || undefined,
  };

  try {
    const { entry, position, returning } = await getStore().add(candidate);
    return Response.json({ id: entry.id, ref: entry.ref, position, ...(returning && { returning: true }) });
  } catch (err) {
    console.error("waitlist: could not persist entry", err);
    return Response.json({ error: SAVE_FAILED }, { status: 500 });
  }
}
