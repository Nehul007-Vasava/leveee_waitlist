/*
  Leveee vector set. Hand-drawn illustrations built on two brand motifs:
  1. two overlapping rings (two people, one shared space)
  2. a line that starts jagged and rose (heat) and resolves into a calm lilac wave
  Colors come from theme tokens via Tailwind fill-/stroke- classes so dark mode follows.
*/

type SvgProps = React.SVGProps<SVGSVGElement>;

export function Logo({ className = "", ...rest }: SvgProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} {...rest}>
      <circle cx="12.5" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="19.5" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

/* ---------- Mirror section spot illustrations (one per moment) ---------- */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className="h-full w-full">
      <circle cx="60" cy="60" r="58" className="fill-calm-wash" />
      {children}
    </svg>
  );
}

/** 1:07 am: phone glowing in the dark, crescent moon, replay arrows. */
export function ArtNight() {
  return (
    <Frame>
      <path d="M84 30a14 14 0 1 1-16-4 11 11 0 0 0 16 4Z" className="fill-calm-2" />
      <circle cx="30" cy="36" r="1.6" className="fill-calm" />
      <circle cx="40" cy="24" r="1.1" className="fill-calm" />
      <rect x="42" y="44" width="36" height="58" rx="8" className="fill-paper stroke-ink" strokeWidth="1.8" />
      <rect x="48" y="54" width="18" height="7" rx="3.5" className="fill-sand" />
      <rect x="54" y="65" width="18" height="7" rx="3.5" className="fill-calm-2" />
      <rect x="48" y="76" width="14" height="7" rx="3.5" className="fill-sand" />
      <path d="M28 70a10 10 0 0 1 10-10" className="stroke-rose" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M36 57l3 3-3.4 2.6" className="stroke-rose" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** Same fight, different month: a looping track around two dots. */
export function ArtLoop() {
  return (
    <Frame>
      <path d="M30 60c0-17 13-26 30-26s30 9 30 26-13 26-30 26" className="stroke-calm" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 5" />
      <path d="M60 86c-17 0-30-9-30-26" className="stroke-rose" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 66l5-6 5 6" className="stroke-rose" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="47" cy="60" r="9" className="fill-paper stroke-ink" strokeWidth="1.8" />
      <circle cx="73" cy="60" r="9" className="fill-calm-2 stroke-ink" strokeWidth="1.8" />
    </Frame>
  );
}

/** Said the one thing: a speech bubble with a crack through it. */
export function ArtCrack() {
  return (
    <Frame>
      <path d="M30 36h60a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H58l-14 12V80H30a8 8 0 0 1-8-8V44a8 8 0 0 1 8-8Z" className="fill-paper stroke-ink" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M62 36l-6 12 9 6-7 10 5 16" className="stroke-rose" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="32" y="50" width="16" height="5" rx="2.5" className="fill-sand" />
      <rect x="32" y="60" width="11" height="5" rx="2.5" className="fill-sand" />
      <rect x="70" y="56" width="18" height="5" rx="2.5" className="fill-rose-wash" />
    </Frame>
  );
}

/** The next morning: a sun rising over a horizon, two cups. */
export function ArtMorning() {
  return (
    <Frame>
      <path d="M36 72a24 24 0 0 1 48 0" className="fill-warm" />
      <path d="M60 34v8M36 46l5 5M84 46l-5 5" className="stroke-calm" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 72h84" className="stroke-ink" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M40 80h14v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-8Z" className="fill-paper stroke-ink" strokeWidth="1.6" />
      <path d="M66 80h14v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-8Z" className="fill-calm-2 stroke-ink" strokeWidth="1.6" />
    </Frame>
  );
}

/* ---------- Privacy section: a phone that only shows your side ---------- */

export function PrivacyArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 320" fill="none" aria-hidden="true" className={className}>
      <circle cx="180" cy="160" r="150" className="fill-calm-wash" />
      <circle cx="180" cy="160" r="112" className="stroke-calm" strokeWidth="1.2" strokeDasharray="2 6" />
      {/* phone */}
      <rect x="122" y="54" width="116" height="214" rx="24" className="fill-paper stroke-ink" strokeWidth="2" />
      <rect x="160" y="66" width="40" height="6" rx="3" className="fill-sand" />
      <rect x="138" y="96" width="60" height="18" rx="9" className="fill-sand" />
      <rect x="162" y="124" width="60" height="18" rx="9" className="fill-calm-2" />
      <rect x="138" y="152" width="44" height="18" rx="9" className="fill-sand" />
      {/* Leveee suggestion card */}
      <rect x="134" y="186" width="92" height="56" rx="14" className="fill-calm-wash stroke-calm" strokeWidth="1.4" />
      <circle cx="148" cy="200" r="5" className="stroke-calm" strokeWidth="1.5" />
      <circle cx="153" cy="200" r="5" className="stroke-calm" strokeWidth="1.5" />
      <rect x="164" y="197" width="44" height="6" rx="3" className="fill-calm" opacity=".6" />
      <rect x="144" y="214" width="70" height="6" rx="3" className="fill-calm" opacity=".35" />
      <rect x="144" y="226" width="48" height="6" rx="3" className="fill-calm" opacity=".35" />
      {/* lock badge */}
      <circle cx="252" cy="82" r="26" className="fill-warm stroke-ink" strokeWidth="1.8" />
      <rect x="241" y="80" width="22" height="16" rx="4" className="fill-paper stroke-ink" strokeWidth="1.8" />
      <path d="M245 80v-4a7 7 0 0 1 14 0v4" className="stroke-ink" strokeWidth="1.8" strokeLinecap="round" />
      {/* the other phone, out of reach */}
      <g opacity=".45">
        <rect x="36" y="150" width="54" height="96" rx="12" className="stroke-muted" strokeWidth="1.6" strokeDasharray="4 5" />
        <path d="M48 176l30 30M78 176l-30 30" className="stroke-muted" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ---------- Founder: an abstract portrait placeholder ---------- */

export function FounderMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="32" className="fill-warm" />
      <circle cx="32" cy="26" r="10" className="fill-paper stroke-ink" strokeWidth="1.6" />
      <path d="M14 54c3-9 10-14 18-14s15 5 18 14" className="fill-paper stroke-ink" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Closing section rings ---------- */

export function Rings({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 900" fill="none" aria-hidden="true" className={className}>
      <g className="stroke-paper" strokeWidth="1.2" opacity=".75">
        <circle className="anim-breathe" cx="450" cy="450" r="200" />
        <circle className="anim-breathe" style={{ animationDelay: "-1.2s" }} cx="450" cy="450" r="290" />
        <circle className="anim-breathe" style={{ animationDelay: "-2.4s" }} cx="450" cy="450" r="380" />
      </g>
    </svg>
  );
}

/* ---------- Thank-you: video poster art ---------- */

export function VideoPoster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 320" fill="none" aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="560" height="320" className="fill-calm" />
      <circle cx="430" cy="80" r="170" className="fill-calm-2" opacity=".55" />
      <circle cx="120" cy="300" r="140" className="fill-warm" opacity=".5" />
      <g className="stroke-paper" strokeWidth="1.2" opacity=".5">
        <circle cx="250" cy="150" r="90" />
        <circle cx="310" cy="150" r="90" />
      </g>
      <path d="M40 240 l16 -22 l14 34 l16 -44 l16 54 l12 -30 C 190 250, 240 226, 290 236 S 380 250, 420 238 S 500 226, 530 232" className="stroke-paper" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
    </svg>
  );
}
