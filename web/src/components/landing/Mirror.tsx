"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

/*
  "Moments you might recognise", rebuilt to match the sample HTML
  (docs/leveee_funnel_brand_colors.html): a sticky heading on the left, and on the
  right four moments that appear one per scroll step while the section is pinned.
  The icons are the sample's own monoline set.
*/

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MOMENTS = [
  {
    when: "Tuesday, 1:07 am",
    text: "Still replaying what they said, and everything I should have said instead.",
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <path d="M19.5 14.5A8 8 0 019.5 4.5a8 8 0 1010 10z" />
        <path d="M17 3v3M15.5 4.5h3" />
      </svg>
    ),
  },
  {
    when: "Three weeks later",
    text: "Same argument, different month. I could have written their next line.",
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
        <path d="M9 15.3a3 3 0 015.2-2M15 15.3a3 3 0 01-5.2 2" />
      </svg>
    ),
  },
  {
    when: "Sunday evening",
    text: "I said the one thing I promised myself I wouldn't say.",
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <path d="M5 4h14a2.5 2.5 0 012.5 2.5v8A2.5 2.5 0 0119 17h-7.5L7 20.5V17H5a2.5 2.5 0 01-2.5-2.5v-8A2.5 2.5 0 015 4z" />
        <path d="M12 7.5v3.8" />
        <circle cx="12" cy="13.8" r=".5" fill="currentColor" />
      </svg>
    ),
  },
  {
    when: "The next morning",
    text: "We're both calm now, and I'm apologising for how I said it, not for what I meant.",
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <path d="M2.5 18h19M6.5 18a5.5 5.5 0 0111 0" />
        <path d="M12 6v2.5M5 9.8l1.8 1.4M19 9.8l-1.8 1.4M7 21h10" />
      </svg>
    ),
  },
];

/** Scroll progress at which each moment appears, as in the sample. */
const STEPS = [0.06, 0.3, 0.54, 0.78];
const W = "mx-auto w-full max-w-[1120px] px-4 sm:px-7";

export function Mirror() {
  return (
    <section className="py-[120px]">
      <div className="hidden lg:block">
        <Pinned />
      </div>
      <div className={`${W} lg:hidden`}>
        <Stacked />
      </div>
      <div className={W}>
        <Statement />
      </div>
    </section>
  );
}

function Intro() {
  return (
    <>
      <span className="mb-3.5 block text-sm font-medium text-calm-text">Why Leveee exists</span>
      <h2 className="text-[clamp(32px,4vw,48px)] leading-[1.12] font-semibold tracking-[-0.028em] text-ink">Moments you might recognise.</h2>
      <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-body">If any of these feel familiar, Leveee is being built for you.</p>
    </>
  );
}

function Row({ m, shown, animateY }: { m: (typeof MOMENTS)[number]; shown: boolean; animateY: boolean }) {
  return (
    <div
      className={`grid grid-cols-[52px_1fr] items-start gap-6 transition-[opacity,transform] ease-[cubic-bezier(.2,.8,.2,1)] ${
        animateY ? "duration-700" : "duration-300"
      } ${shown ? "translate-y-0 opacity-100" : `opacity-0 ${animateY ? "translate-y-7" : ""}`}`}
    >
      <span
        className={`grid size-[52px] place-items-center rounded-full border bg-paper text-calm transition-colors duration-500 ${
          shown ? "border-calm-2" : "border-calm/30"
        }`}
      >
        <span className="size-6">{m.icon}</span>
      </span>
      <div>
        <span className="mt-0.5 mb-1.5 block text-[14.5px] font-semibold text-calm-text">{m.when}</span>
        <p className="max-w-[30ch] text-[clamp(20px,2.3vw,27px)] leading-[1.3] font-bold tracking-[-0.02em] text-ink">{m.text}</p>
      </div>
    </div>
  );
}

/* ---------- desktop: pinned, one moment per scroll step ---------- */

function Pinned() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  // Re-render only when another moment crosses its step.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const c = STEPS.filter((s) => p >= s).length;
    if (c === countRef.current) return;
    countRef.current = c;
    setCount(c);
  });

  return (
    <div ref={track} className="relative h-[300vh]">
      <div className="sticky top-[92px] flex min-h-[calc(100dvh-92px)] items-center py-10">
        <div className={`${W} grid grid-cols-[0.85fr_1.15fr] items-center gap-[72px]`}>
          <div>
            <Intro />
          </div>
          <ol className="grid">
            {MOMENTS.map((m, i) => (
              <li key={m.when} className="py-3">
                <Row m={m} shown={!!reduce || i < count} animateY={false} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ---------- mobile and tablet: each moment fades up as it scrolls in ---------- */

function Stacked() {
  const reduce = useReducedMotion();
  return (
    <>
      <Intro />
      <ol className="mt-8 border-t border-rule">
        {MOMENTS.map((m) => (
          <motion.li
            key={m.when}
            className="border-b border-rule py-[30px]"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Row m={m} shown animateY={false} />
          </motion.li>
        ))}
      </ol>
    </>
  );
}

/* ---------- closing line ---------- */

function Statement() {
  return (
    <motion.div
      className="mt-[110px] grid items-center gap-10 border-t border-rule pt-14 md:grid-cols-[auto_1fr]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <svg width="96" height="64" viewBox="0 0 96 64" aria-hidden="true">
        <circle cx="34" cy="32" r="28" className="fill-calm-2" />
        <circle cx="62" cy="32" r="28" className="fill-warm" style={{ mixBlendMode: "multiply" }} />
      </svg>
      <p className="max-w-[26ch] text-[clamp(26px,3.3vw,40px)] leading-[1.25] font-normal tracking-[-0.01em] text-ink">
        You&apos;re not bad at relationships. <span className="text-muted">You&apos;re just alone in the moment that matters most.</span>
      </p>
    </motion.div>
  );
}
