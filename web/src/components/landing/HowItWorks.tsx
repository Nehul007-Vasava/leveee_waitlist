"use client";

import { motion, useReducedMotion } from "motion/react";

/*
  "How it works" from the sample HTML: three points in a disagreement, on a line that
  runs from heat (rose) to calm (lilac). Copy follows docs/product_specs.md: the user
  brings the message to Leveee; it never watches them type.
*/

const POINTS = [
  {
    when: "Before you send",
    title: "A pause, not a filter",
    body: "Paste the message you're about to send. Leveee offers a version that still says what you mean, in a way the other person can hear.",
    ring: "border-rose text-rose-text",
    label: "text-rose-text",
  },
  {
    when: "When it happens again",
    title: "It remembers the context",
    body: "If an argument follows a pattern you've been through before, Leveee points it out and reminds you what helped last time.",
    ring: "border-[#8d83ac] text-[#6b6396]",
    label: "text-[#6b6396]",
  },
  {
    when: "After it's over",
    title: "One step towards repair",
    body: "Instead of replaying it for hours, you get one concrete next step that's in your control, with no blame on either of you.",
    ring: "border-calm text-calm-text",
    label: "text-calm-text",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function HowItWorks() {
  const reduce = useReducedMotion();
  const inView = { once: true, amount: 0.35 } as const;

  return (
    <section id="how" className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-7">
        <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <span className="text-sm font-medium text-calm-text">How it works</span>
            <h2 className="mt-3 max-w-[14ch] text-4xl leading-[1.1] font-semibold tracking-[-0.028em] text-ink md:text-5xl">
              Three points in a disagreement.
            </h2>
          </div>
          <p className="max-w-[42ch] text-lg leading-relaxed text-body md:pb-2">
            No lectures, no scores, no taking sides. One quiet suggestion in the seconds that decide how the rest of the evening goes.
          </p>
        </div>

        <div className="relative mt-16 md:mt-20">
          {/* heat-to-calm line: horizontal on desktop, vertical on mobile. Draws itself in. */}
          <motion.span
            aria-hidden="true"
            className="absolute top-[13px] right-0 left-0 hidden h-[1.5px] origin-left bg-[linear-gradient(90deg,var(--rose),#9a8fb5,var(--calm))] md:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={inView}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[13px] w-[1.5px] origin-top bg-[linear-gradient(180deg,var(--rose),#9a8fb5,var(--calm))] md:hidden"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={inView}
            transition={{ duration: 1.4, ease: EASE }}
          />

          <ol className="grid gap-12 pl-12 md:grid-cols-3 md:gap-10 md:pl-0">
            {POINTS.map((p, i) => (
              <motion.li
                key={p.when}
                className="relative"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.3, ease: EASE }}
              >
                <span
                  className={`absolute top-0 -left-12 grid size-7 place-items-center rounded-full border-[1.5px] bg-linen text-[13px] font-semibold md:static ${p.ring}`}
                >
                  {i + 1}
                </span>
                <span className={`block text-sm font-medium md:mt-10 ${p.label}`}>{p.when}</span>
                <h3 className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-ink md:text-[26px]">{p.title}</h3>
                <p className="mt-3 max-w-[34ch] text-base leading-relaxed text-body">{p.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
