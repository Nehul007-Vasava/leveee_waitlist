import { randomUUID } from "node:crypto";
import { getStore, RefTakenError, type FollowUp } from "@/lib/waitlistStore";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid request." }, { status: 400 });

  // Follow-up answers (optional step 3, loop map) attach to an existing signup.
  if (body.action === "update") {
    const id = str(body.id, 64);
    if (!UUID.test(id)) return Response.json({ error: "Signup not found." }, { status: 404 });
    const fields: FollowUp = {
      together: str(body.together, 40) || undefined,
      partnerOpen: str(body.partnerOpen, 40) || undefined,
      loop: Array.isArray(body.loop) ? body.loop.slice(0, 5).map((v) => str(v, 80)) : undefined,
    };
    if (Object.values(fields).every((v) => v === undefined)) return Response.json({ ok: true });
    try {
      const found = await getStore().update(id, fields);
      if (!found) return Response.json({ error: "Signup not found." }, { status: 404 });
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

  const input = {
    name,
    email,
    pain,
    other: pain === "other" ? str(body.other, 280) || undefined : undefined,
    referredBy: str(body.referredBy, 40) || undefined,
  };

  try {
    const store = getStore();
    // Referral codes are short, so retry on the rare collision.
    for (let attempt = 0; ; attempt++) {
      try {
        const { id, ref, position, returning } = await store.join({ ...input, ref: refCode(name) });
        return Response.json({ id, ref, position, ...(returning && { returning: true }) });
      } catch (err) {
        if (!(err instanceof RefTakenError) || attempt >= 2) throw err;
      }
    }
  } catch (err) {
    console.error("waitlist: could not persist entry", err);
    return Response.json({ error: SAVE_FAILED }, { status: 500 });
  }
}
