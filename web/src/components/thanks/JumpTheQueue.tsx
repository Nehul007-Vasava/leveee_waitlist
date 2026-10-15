"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckIcon, CopyIcon, GiftIcon, MapTrifoldIcon, PhoneIcon, ShareNetworkIcon, UserPlusIcon } from "@phosphor-icons/react";
import { /* FOUNDER_CALL_URL, */ LOOP_QUESTIONS, loopSnapshot } from "@/lib/content";
import { useBrowserValue } from "@/lib/useBrowserValue";
import type { Signup } from "./ThanksView";

export function JumpTheQueue({ signup, onMove }: { signup: Signup | null; onMove: (n: number) => void }) {
  return (
    <section className="mt-24 md:mt-28">
      <h2 className="text-4xl leading-[1.1] font-semibold tracking-[-0.028em] text-ink md:text-5xl">Want access sooner?</h2>
      <p className="mt-4 text-lg text-body">Each of these moves you forward in line.</p>

      <div className="mt-10 grid gap-4">
        <LoopMap signup={signup} onDone={() => onMove(50)} />
        {/* Founder call hidden for now. To restore, set NEXT_PUBLIC_FOUNDER_CALL_URL, uncomment the
            FOUNDER_CALL_URL import above, and uncomment this row.
        <Row
          Icon={PhoneIcon}
          title="Talk to the founder"
          body="Tell me about your last fight. I'll tell you what we're building. 15 minutes."
          perk="First 50 calls get Alpha access"
        >
          <a
            href={FOUNDER_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full border border-rule px-5 text-[15px] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-paper active:scale-[0.98]"
          >
            Book a call
          </a>
        </Row>
        */}
        <Invite signup={signup} />
      </div>
    </section>
  );
}

function Row({
  Icon,
  title,
  body,
  perk,
  children,
  below,
}: {
  Icon: typeof PhoneIcon;
  title: string;
  body: string;
  perk: string;
  children?: React.ReactNode;
  below?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-rule bg-paper/60 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
        <span className="grid size-12 place-items-center rounded-full bg-calm-wash text-calm-text">
          <Icon size={22} weight="duotone" />
        </span>
        <div>
          <h3 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h3>
          <p className="mt-1 max-w-[50ch] text-[15.5px] text-body">{body}</p>
          <span className="mt-2 block text-[13.5px] font-medium text-calm-text">{perk}</span>
        </div>
        {children && <div className="sm:justify-self-end">{children}</div>}
      </div>
      {below}
    </div>
  );
}

/* ---------- Map your loop: 5 questions, then a Loop Snapshot ---------- */

function LoopMap({ signup, onDone }: { signup: Signup | null; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const i = answers.length;
  const done = i === LOOP_QUESTIONS.length;

  function answer(o: string) {
    const next = [...answers, o];
    setAnswers(next);
    if (next.length < LOOP_QUESTIONS.length) return;
    onDone();
    if (signup?.id) {
      fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id: signup.id, loop: next }),
      }).catch(() => {});
    }
  }

  const snap = done ? loopSnapshot(answers) : null;

  return (
    <Row
      Icon={MapTrifoldIcon}
      title="Map your loop"
      body="Five quick questions about your last argument. See your pattern now, and get a personal Loop Snapshot at launch."
      perk="Moves you forward 50 places"
      below={
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-7 border-t border-rule pt-7">
                {!done ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={i}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="mb-4 flex items-center gap-3 text-sm text-muted">
                        <div className="flex gap-1.5" aria-hidden="true">
                          {LOOP_QUESTIONS.map((_, k) => (
                            <span key={k} className={`h-1 w-6 rounded-full ${k <= i ? "bg-calm" : "bg-sand"}`} />
                          ))}
                        </div>
                        {i + 1} of {LOOP_QUESTIONS.length}
                      </div>
                      <h4 id={`loop-q-${i}`} className="text-xl font-semibold tracking-tight text-ink">{LOOP_QUESTIONS[i].q}</h4>
                      <div role="group" aria-labelledby={`loop-q-${i}`} className="mt-4 flex flex-wrap gap-2">
                        {LOOP_QUESTIONS[i].options.map((o, k) => (
                          <button
                            key={o}
                            type="button"
                            autoFocus={k === 0}
                            onClick={() => answer(o)}
                            className="rounded-full border border-rule bg-paper px-4 py-2.5 text-[15px] text-ink transition-colors hover:border-calm hover:bg-calm-wash"
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  snap && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl bg-calm-wash p-6 sm:p-7"
                      aria-live="polite"
                    >
                      <span className="text-[13px] font-semibold text-calm-text">Your pattern summary</span>
                      <h4 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{snap.name}</h4>
                      <p className="mt-2 max-w-[60ch] text-[15.5px] leading-relaxed text-body">{snap.body}</p>
                      <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-body">{snap.detail}</p>
                      <p className="mt-5 flex items-center gap-2 text-sm font-medium text-ink">
                        <CheckIcon size={16} weight="bold" className="text-calm-text" />
                        You&apos;ve moved forward 50 places. A fuller report arrives when the beta opens.
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      <button
        type="button"
        disabled={done}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="inline-flex h-11 items-center justify-center rounded-full bg-btn px-6 text-[15px] font-semibold whitespace-nowrap text-btn-fg transition-[background-color,transform] hover:bg-btn-hover active:scale-[0.98] disabled:opacity-50"
      >
        {done ? "Done" : open ? "In progress" : "Start"}
      </button>
    </Row>
  );
}

/* ---------- Invite: partner first, gift framing for friends ---------- */

function Invite({ signup }: { signup: Signup | null }) {
  const origin = useBrowserValue(() => window.location.origin, "");
  const canShare = useBrowserValue(() => typeof navigator.share === "function", false);
  const link = origin ? `${origin}/?ref=${signup?.ref ?? "friend"}` : "";
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const el = document.getElementById("invite-link") as HTMLInputElement | null;
      el?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function share(text: string) {
    try {
      await navigator.share({ title: "Leveee", text, url: link });
    } catch {}
  }

  return (
    <Row
      Icon={UserPlusIcon}
      title="Invite your partner"
      body="Leveee works best when you're both on the same page. Or gift a spot to a friend who needs this."
      perk="Moves you forward 10 places per person who joins"
      below={
        <div className="mt-6 grid gap-3 sm:ml-18">
          <div className="flex max-w-[520px] gap-2">
            <label htmlFor="invite-link" className="sr-only">Your invite link</label>
            <input
              id="invite-link"
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="h-11 min-w-0 flex-1 rounded-full border border-rule bg-paper px-5 text-sm text-muted focus:border-calm focus:outline-none"
            />
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-11 flex-none items-center gap-2 rounded-full bg-btn px-5 text-[15px] font-semibold text-btn-fg transition-[background-color,transform] hover:bg-btn-hover active:scale-[0.98]"
            >
              {copied ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          {canShare && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => share("I joined the Leveee beta. It helps in the moment before an argument goes wrong. Want to try it with me?")}
                className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm text-ink hover:bg-paper"
              >
                <ShareNetworkIcon size={15} /> Send to my partner
              </button>
              <button
                type="button"
                onClick={() => share("I saved you a spot in the Leveee beta. I thought of you.")}
                className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm text-ink hover:bg-paper"
              >
                <GiftIcon size={15} /> Gift a spot to a friend
              </button>
            </div>
          )}
        </div>
      }
    />
  );
}
