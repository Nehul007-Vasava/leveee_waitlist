import { CheckIcon, MinusIcon, PlusIcon, LockIcon, LockKeyIcon, ProhibitIcon, UserFocusIcon } from "@phosphor-icons/react/ssr";
// Helpline link hidden for now. To restore, add ArrowUpRightIcon above and uncomment the next line.
import { JoinButton } from "@/components/join/JoinButton";
import { Reveal } from "@/components/Reveal";
// import { HELPLINE_URL } from "@/lib/content";
import {
  FounderMark,
  Logo,
  PrivacyArt,
  Rings,
} from "@/components/vectors";
import { HeroDemo } from "./HeroDemo";

const W = "mx-auto w-full max-w-[1200px] px-4 sm:px-7";

/* ---------------- 1. Hero ---------------- */

export function Hero() {
  return (
    <section className="pt-12 pb-16 md:pt-20 md:pb-24">
      <div className={`${W} grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-anchor-wash px-3.5 py-1.5 text-[13.5px] font-medium text-anchor">
            <Logo className="size-4" />
            Private beta, limited spots
          </span>
          <h1 className="mt-6 max-w-[16ch] text-[42px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[54px] xl:text-[60px]">
            The fight isn&apos;t the problem. <span className="text-anchor">The ten seconds before it is.</span>
          </h1>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-body">
            Paste the text you&apos;re about to send, or the one that just stung. See what&apos;s underneath, and how to say it so it lands.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <JoinButton />
            <span className="text-sm text-muted">Takes 20 seconds</span>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {["Private by design", "Your partner isn't involved", "Free to join"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckIcon size={15} weight="bold" className="text-anchor" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}

/* ---------------- 1b. Promise strip: the three things people worry about first ---------------- */

const PROMISES = [
  { Icon: UserFocusIcon, title: "Only what you share", body: "It never connects to your chats or their phone." },
  { Icon: LockKeyIcon, title: "Unreadable to us", body: "Encrypted on your device before it's stored." },
  { Icon: ProhibitIcon, title: "Never used for training", body: "Your words don't teach any AI model." },
];

export function Promises() {
  return (
    <section className="py-14 md:py-16">
      <div className={`${W} grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-rule`}>
        {PROMISES.map(({ Icon, title, body }) => (
          <div key={title} className="flex items-start gap-4 sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <span className="grid size-11 flex-none place-items-center rounded-full bg-anchor-wash text-anchor">
              <Icon size={20} weight="duotone" />
            </span>
            <div>
              <b className="block font-semibold text-ink">{title}</b>
              <span className="text-[15px] text-body">{body}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 3. What we measure (spec principle 4: success is needing the app less) ---------------- */

export function Measure() {
  return (
    <section className="py-24 md:py-32">
      <Reveal className="mx-auto max-w-[980px] px-4 text-center sm:px-7">
        <p className="text-3xl leading-[1.2] font-semibold tracking-[-0.025em] text-ink md:text-[44px]">
          We measure one thing: how many arguments end <span className="text-anchor">resolved</span>.{" "}
          <span className="text-muted">Not time in the app. If you need us less, it&apos;s working.</span>
        </p>
      </Reveal>
    </section>
  );
}

/* ---------------- 4. What Leveee is, and isn't ---------------- */

// CHECK before launch: every line below must be true for the product.
const IS = [
  "Encrypted on your device. Our servers only hold what they can't open.",
  "Never used to train AI.",
  "Locked with a PIN or Face ID, with a one-tap panic delete.",
  "Neutral. Every insight about them comes with a move that's yours to make.",
];
const ISNT = [
  "Therapy. When something keeps coming back, Leveee will tell you a therapist is the right tool.",
  "A way to monitor or corner someone. It won't polish a controlling message.",
  "For relationships involving fear, control or violence.",
];

export function Trust() {
  return (
    <section id="privacy" className="py-24 md:py-32">
      <div className={W}>
        <h2 className="max-w-[18ch] text-4xl leading-[1.1] font-semibold tracking-[-0.028em] text-ink md:text-5xl">
          Built for your most private moments.
        </h2>
        <p className="mt-5 max-w-[48ch] text-lg text-body">
          We&apos;re asking to be present when things are hard. You should know exactly what that means.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <Reveal className="relative overflow-hidden rounded-[28px] bg-anchor-wash md:col-span-3 md:row-span-2">
            <div className="flex h-full flex-col p-7 sm:p-9">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">Only what you bring it.</h3>
              <p className="mt-2 max-w-[34ch] text-body">Leveee never connects to your messages or your partner&apos;s phone. It only sees what you paste in.</p>
              <PrivacyArt className="mx-auto mt-6 w-full max-w-[340px]" />
            </div>
          </Reveal>

          <Reveal delay={0.06} className="rounded-[28px] bg-paper p-7 shadow-soft sm:p-9 md:col-span-3">
            <h3 className="text-lg font-semibold text-ink">What Leveee is</h3>
            <ul className="mt-4 grid gap-3.5">
              {IS.map((t) => (
                <li key={t} className="flex gap-3 text-[15.5px] leading-snug">
                  <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-anchor-wash text-anchor">
                    <CheckIcon size={12} weight="bold" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="rounded-[28px] border border-rule p-7 sm:p-9 md:col-span-3">
            <h3 className="text-lg font-semibold text-ink">What Leveee isn&apos;t</h3>
            <ul className="mt-4 grid gap-3.5">
              {ISNT.map((t) => (
                <li key={t} className="flex gap-3 text-[15.5px] leading-snug">
                  <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-rose-wash text-rose-text">
                    <MinusIcon size={12} weight="bold" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14} className="rounded-[28px] bg-warm-wash p-7 sm:p-8 md:col-span-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="max-w-[62ch] text-[15.5px] text-body">
                <b className="font-semibold text-ink">If you ever feel unsafe with your partner, an app isn&apos;t the answer.</b>{" "}
                Please reach out to a local helpline or someone you trust. Leveee won&apos;t suggest ways to de-escalate someone who hurts you.
              </p>
              {/* Helpline link hidden for now. When restoring, point NEXT_PUBLIC_HELPLINE_URL at a helpline
                  for your launch markets and restore the imports at the top of this file.
              <a
                href={HELPLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-none items-center gap-1.5 self-start rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper md:self-auto"
              >
                Find a helpline <ArrowUpRightIcon size={14} />
              </a>
              */}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5. Founder note ---------------- */

export function Founder() {
  return (
    <section className="pb-24 md:pb-32">
      <Reveal className="mx-auto max-w-[780px] px-4 sm:px-7">
        <span className="text-sm font-medium text-anchor">A note from the founder</span>
        <div className="mt-4 rounded-[32px_32px_32px_10px] border border-warm bg-warm-wash p-8 sm:p-12">
          <p className="text-[21px] leading-[1.55] tracking-[-0.01em] text-ink sm:text-2xl">
            I started Leveee after a message I wrote in ten angry seconds took us three days to recover from. I didn&apos;t need anyone to
            tell me I was wrong. I needed something to tap me on the shoulder before I pressed send.
          </p>
        </div>
        {/* REPLACE the mark with a real founder photo (next/image, 96x96) and add the founder's name */}
        <div className="mt-5 ml-2 flex items-center gap-3 text-[15px]">
          <FounderMark className="size-11" />
          <span>
            <b className="block font-semibold text-ink">The founder</b>
            <span className="text-muted">Leveee</span>
          </span>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- 6. FAQ ---------------- */

const FAQ = [
  { q: "Does Leveee read my texts?", a: "No. It doesn't connect to your messages, your keyboard or your partner's phone. It only sees what you choose to paste in." },
  { q: "Will my partner know I'm using it?", a: "No. Leveee is for your side of things. Whether you tell them is entirely up to you, and the app locks with a PIN or Face ID." },
  { q: "Who can read what I paste in?", a: "Only you. Everything is encrypted on your device before it's stored, and our servers can't open it. It's never used to train AI. The trade-off: if you lose your passphrase and recovery code, we can't recover your history." },
  { q: "Is this a replacement for couples therapy?", a: "No. Leveee helps with everyday moments. If the same issue keeps coming back, it will tell you plainly that a couples therapist is the right tool." },
  { q: "What will it cost?", a: "Joining the waitlist is free. There will be a free tier with a few Cooldowns and Decodes each month. We'll share pricing well before anyone is asked to pay." },
  { q: "When can I use it?", a: "The free Decoder opens on the web first, then the full app. We're letting people in small groups, and you'll get an email when your place opens." },
];

export function Faq() {
  return (
    <section id="faq" className="pb-24 md:pb-32">
      <div className={`${W} grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
        <h2 className="text-4xl leading-[1.1] font-semibold tracking-[-0.028em] text-ink md:text-5xl">Before you join.</h2>
        <div className="divide-y divide-rule border-y border-rule">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <PlusIcon size={16} className="flex-none text-muted transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pr-10 pb-6 text-[15.5px] leading-relaxed text-body">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 7. Closing CTA + footer ---------------- */

export function Closing() {
  return (
    <section className="relative overflow-hidden rounded-t-[36px] bg-warm px-4 py-28 text-center md:rounded-t-[56px] md:py-36">
      <Rings className="pointer-events-none absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2" />
      <Reveal className="relative">
        <h2 className="mx-auto max-w-[18ch] text-4xl leading-[1.1] font-semibold tracking-[-0.028em] text-ink md:text-[52px]">
          The next argument doesn&apos;t have to go like the last one.
        </h2>
        <p className="mx-auto mt-5 max-w-[44ch] text-lg text-ink/75">
          We&apos;re opening the beta in small groups, so everyone who joins gets real attention.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3.5">
          <JoinButton />
          <p className="flex items-center gap-2 text-sm text-ink/70">
            <LockIcon size={15} />
            Private. Your partner doesn&apos;t need to be involved. Takes 20 seconds.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer({ note }: { note?: string }) {
  return (
    <footer className="bg-warm text-sm text-ink/70">
      <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-4 border-t border-ink/10 px-4 py-7 sm:px-7">
        <span>&copy; 2026 Leveee</span>
        {note ? (
          <span>{note}</span>
        ) : (
          <nav aria-label="Footer" className="flex gap-6">
            {/* Hidden until real policy pages exist.
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
            */}
            <a href="mailto:hello@leveee.app" className="hover:text-ink">Contact</a>
          </nav>
        )}
      </div>
    </footer>
  );
}
