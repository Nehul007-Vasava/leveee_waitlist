"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CheckIcon, ClockIcon } from "@phosphor-icons/react";
import { Logo } from "@/components/vectors";

/*
  Cooldown, as specced (docs/product_specs.md §4.1), laid out as floating pieces:
  the message you got, the reply you're about to send, and Leveee's read on it.
  Leveee never touches the chat app; the user copies the rewrite back themselves.
*/

const DRAFT = "You ALWAYS do this. Forget it, I don't know why I bother.";
const REWRITE = "I was hurt the plans changed without me. Can we talk about it when you're home?";

type Phase = "typing" | "reading" | "results" | "tap" | "copied";

export function HeroDemo() {
  const reduce = useReducedMotion();
  const [livePhase, setPhase] = useState<Phase>("typing");
  const [liveTyped, setTyped] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    (async function loop() {
      while (!cancelled) {
        await wait(0);
        setPhase("typing");
        setTyped(0);
        await wait(700);
        for (let i = 1; i <= DRAFT.length && !cancelled; i++) {
          setTyped(i);
          await wait(40);
        }
        await wait(400);
        setPhase("reading");
        await wait(1000);
        setPhase("results");
        await wait(4200);
        setPhase("tap");
        await wait(250);
        setPhase("copied");
        await wait(3800);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  const phase: Phase = reduce ? "results" : livePhase;
  const typed = reduce ? DRAFT.length : liveTyped;
  const flagged = phase === "results" || phase === "tap";
  const panelOn = phase === "reading" || flagged;
  const copied = phase === "copied";

  return (
    <div
      role="img"
      aria-label="Example of Cooldown: you paste a heated reply before sending it, and Leveee shows what you mean, how it will land, and a calmer way to say it."
      className="relative w-full max-w-[480px]"
    >
      {/* the message that started it */}
      <div className="mb-5 flex items-end gap-2.5">
        <span className="grid size-9 flex-none place-items-center rounded-full bg-paper text-[13px] font-semibold text-ink shadow-soft">S</span>
        <div className="max-w-[82%] rounded-[18px_18px_18px_6px] bg-paper px-4 py-2.5 text-[15px] leading-normal text-ink shadow-soft">
          <small className="block text-xs font-medium text-muted">Sam</small>
          You said you&apos;d be home by 8. It&apos;s 9:40. Again.
        </div>
      </div>

      {/* your reply, pasted into Leveee before sending */}
      <div
        className={`rounded-[22px] border-[1.5px] bg-paper px-5 py-4 shadow-soft transition-[border-color,box-shadow] duration-500 ${
          flagged ? "border-rose/45 shadow-[0_0_0_6px_var(--rose-wash)]" : copied ? "border-anchor/30" : "border-transparent"
        }`}
      >
        <span className="mb-1 flex items-center justify-between text-[12px] font-medium text-muted">
          {copied ? "Your reply, rewritten" : "Your reply, not sent yet"}
          {flagged && <span className="text-rose-text">2 phrases to look at</span>}
        </span>
        <p className={`min-h-[52px] text-[16.5px] leading-snug ${copied ? "text-anchor" : "text-ink"}`}>
          {copied ? REWRITE : flagged ? <Flagged /> : DRAFT.slice(0, typed)}
          {phase === "typing" && <span className="anim-blink ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[3px] bg-ink" />}
        </p>
      </div>

      {/* Leveee's read, or the confirmation once copied (same cell, so height never jumps) */}
      <div className="mt-3.5 grid sm:ml-7">
        <div
          className={`col-start-1 row-start-1 rounded-[22px] border border-anchor/15 bg-paper/95 p-5 shadow-lift backdrop-blur transition-[opacity,transform] duration-500 ease-(--ease-calm) ${
            panelOn ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-[0.98] opacity-0"
          }`}
        >
          <div className="mb-3 flex items-center gap-2 text-sm">
            <Logo className="size-5 text-anchor" />
            <b className="font-semibold text-ink">Leveee</b>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-calm-wash px-2.5 py-1 text-[12px] font-medium text-calm-text">
              <i className="anim-pulse-dot size-1.5 rounded-full bg-calm" />
              Take a breath
            </span>
          </div>

          {phase === "reading" ? (
            <div className="grid gap-2" aria-hidden="true">
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-sand" />
              <div className="h-3 w-3/5 animate-pulse rounded-full bg-sand" />
              <div className="mt-2 h-14 animate-pulse rounded-2xl bg-sand" />
            </div>
          ) : (
            <>
              <dl className="grid gap-2 text-[14px] leading-snug">
                <div>
                  <dt className="text-[12px] font-semibold text-calm-text">What you mean</dt>
                  <dd className="text-ink">You felt left out when the plans changed.</dd>
                </div>
                <div>
                  <dt className="text-[12px] font-semibold text-rose-text">What they&apos;ll hear</dt>
                  <dd className="text-ink">&ldquo;Always&rdquo; sounds like a verdict on who they are.</dd>
                </div>
              </dl>
              <div className="mt-3 rounded-2xl bg-anchor-wash px-3.5 py-3 text-[14.5px] leading-snug text-ink">
                <span className="mb-0.5 block text-[12px] font-semibold text-anchor">Try this</span>
                {REWRITE}
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2 text-[13px] font-medium">
                <span className={`rounded-full bg-btn px-4 py-2 text-btn-fg transition-transform ${phase === "tap" ? "scale-90" : ""}`}>Use this</span>
                <span className="rounded-full border border-rule px-4 py-2 text-muted">Send anyway</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rule px-4 py-2 text-muted">
                  <ClockIcon size={13} /> Wait an hour
                </span>
              </div>
            </>
          )}
        </div>

        <div
          className={`col-start-1 row-start-1 inline-flex items-center gap-2 self-start justify-self-start rounded-full bg-warm px-4 py-2.5 text-sm text-ink shadow-soft transition-[opacity,transform] duration-500 ${
            copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <CheckIcon size={16} weight="bold" className="text-calm-text" />
          Copied. Paste it back into your chat.
        </div>
      </div>
    </div>
  );
}

/** The draft with the two phrases that will cost the outcome marked. The feeling stays. */
function Flagged() {
  const mark = "rounded bg-rose/15 px-0.5 text-rose-text";
  return (
    <>
      You <mark className={mark}>ALWAYS</mark> do this. Forget it, <mark className={mark}>I don&apos;t know why I bother.</mark>
    </>
  );
}
