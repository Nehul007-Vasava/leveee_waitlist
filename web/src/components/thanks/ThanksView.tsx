"use client";

import { useMemo /* , useState */ } from "react";
import { motion, useReducedMotion } from "motion/react";
// import { PlayIcon } from "@phosphor-icons/react"; // walkthrough card hidden
import { VALIDATION, type PainKey } from "@/lib/content";
import { Logo /* , VideoPoster */ } from "@/components/vectors";
import { SIGNUP_KEY } from "@/components/join/JoinProvider";
import { useBrowserValue } from "@/lib/useBrowserValue";
// import { JumpTheQueue } from "./JumpTheQueue"; // "Want access sooner?" hidden

export type Signup = { id: string; ref: string; position: number; name: string; pain: PainKey | null };

export function ThanksView() {
  const reduce = useReducedMotion();
  // undefined while hydrating, null when there's no signup in this session
  const raw = useBrowserValue<string | null | undefined>(() => sessionStorage.getItem(SIGNUP_KEY), undefined);
  const ready = raw !== undefined;
  const signup = useMemo<Signup | null>(() => {
    try {
      return raw ? (JSON.parse(raw) as Signup) : null;
    } catch {
      return null;
    }
  }, [raw]);
  // Queue-jump perks are hidden, so the place in line is shown as stored.
  // const [moved, setMoved] = useState(0);
  // const position = signup?.position ? Math.max(1, signup.position - moved) : null;
  const position = signup?.position ?? null;
  // const [videoNote, setVideoNote] = useState(false);

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  // Skeleton while session data loads, so the layout doesn't jump.
  if (!ready) {
    return (
      <div className="mx-auto max-w-[840px] px-4 pt-16 sm:px-7" aria-busy="true">
        <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-sand" />
        <div className="mt-10 h-36 animate-pulse rounded-3xl bg-sand" />
      </div>
    );
  }

  const pain = signup?.pain ?? "general";

  return (
    <div className="mx-auto max-w-[840px] px-4 pt-14 sm:px-7 md:pt-20">
      <motion.h1 {...fade(0)} className="text-[40px] leading-[1.06] font-semibold tracking-[-0.03em] text-ink md:text-[56px]">
        {signup ? `Thank you, ${signup.name}. You're on the list.` : "You're on the list."}
      </motion.h1>
      {/* Hidden until confirmation emails are actually sent.
      <motion.p {...fade(0.05)} className="mt-3 text-[17px] text-body">
        We&apos;ve sent a confirmation to your inbox.
      </motion.p>
      */}

      {/* validation first, before anything else */}
      <motion.div {...fade(0.15)} className="mt-10 flex items-end gap-3">
        <Logo className="size-9 flex-none text-anchor" />
        <div className="rounded-[28px_28px_28px_8px] border border-warm bg-warm-wash px-7 py-6 sm:px-8">
          <div className="mb-1.5 text-[13px] font-semibold text-calm-text">Leveee</div>
          <p className="text-lg leading-[1.55] text-ink sm:text-xl">{VALIDATION[pain]}</p>
        </div>
      </motion.div>

      {/* Was "mt-6 grid gap-4 md:grid-cols-[0.75fr_1.25fr]" with the walkthrough card beside it. */}
      <motion.div {...fade(0.25)} className="mt-6 grid gap-4">
        <div className="flex flex-col justify-center rounded-[28px] bg-[linear-gradient(135deg,var(--calm-wash),var(--mist))] p-7">
          <span className="text-sm text-muted">Your place in line</span>
          <div className="my-1 text-[56px] leading-none font-semibold tracking-tight text-ink tabular-nums">
            {position ? position.toLocaleString() : "Saved"}
          </div>
          <p className="text-[14.5px] text-body">We&apos;re opening the beta in small groups.</p>
        </div>

        {/* Walkthrough card hidden until the video exists (it promised to email it).
            REPLACE: swap this poster for the 2 to 3 minute prototype walkthrough embed
        <button
          type="button"
          onClick={() => setVideoNote(true)}
          className="group relative min-h-[240px] overflow-hidden rounded-[28px] text-left"
          aria-label="Play the product walkthrough"
        >
          <VideoPoster className="absolute inset-0 size-full" />
          <span className="absolute top-[42%] left-1/2 grid size-[70px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lift transition-transform duration-300 group-hover:scale-105">
            <PlayIcon size={24} weight="fill" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-6">
            <b className="block text-[17px] font-semibold text-[#2b2536]">See what we&apos;re building</b>
            <span className="text-sm text-[#2b2536]/75">
              {videoNote ? "The walkthrough is coming soon. We'll email it to you." : "A three-minute prototype walkthrough"}
            </span>
          </span>
        </button>
        */}
      </motion.div>

      {/* "Want access sooner?" hidden: its move-up-in-line perks aren't implemented server-side.
          Restoring it also brings back the invite link and Map your loop.
      <JumpTheQueue signup={signup} onMove={(n) => setMoved((m) => m + n)} />
      */}
    </div>
  );
}
