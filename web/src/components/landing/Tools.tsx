"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowsClockwiseIcon,
  BellIcon,
  ChatTeardropTextIcon,
  CheckIcon,
  ClockIcon,
  FileTextIcon,
  WindIcon,
} from "@phosphor-icons/react";
import { Logo } from "@/components/vectors";

/* The five tools from docs/product_specs.md §4, one per moment. */

type ToolKey = "cooldown" | "decoder" | "repair" | "patterns" | "prep";

const TOOLS: { key: ToolKey; name: string; when: string; body: string; points: string[]; Icon: typeof WindIcon; badge?: string }[] = [
  {
    key: "cooldown",
    name: "Cooldown",
    when: "Before you send",
    body: "Paste the angry draft. See what you mean, how it will land, and a rewrite that keeps your point.",
    points: ["Keeps your point, drops what would backfire", "Won't polish threats or contempt", "“Wait an hour” sets a quiet reminder"],
    Icon: WindIcon,
  },
  {
    key: "decoder",
    name: "Decoder",
    when: "When their message stings",
    body: "Paste what they sent. Get a few possible readings, the real ask underneath, and replies in the tone you choose.",
    points: ["A few readings, never one verdict", "Separates the complaint from the ask", "Replies in five tones, including “Buy time”"],
    Icon: ChatTeardropTextIcon,
    badge: "Free on the web",
  },
  {
    key: "repair",
    name: "Repair Loop",
    when: "Two days later",
    body: "One check-in: how did it land? What worked goes into your own playbook for next time.",
    points: ["One check-in, a couple of days later", "Resolved, still open, or went worse", "What worked builds your own playbook"],
    Icon: BellIcon,
  },
  {
    key: "patterns",
    name: "Patterns",
    when: "Over weeks, not minutes",
    body: "After enough history, Leveee may notice the loop you're in. Shared rarely, framed as a question.",
    points: ["Only after five sessions", "At most one every two weeks, never mid-argument", "“That's not right” really turns it off"],
    Icon: ArrowsClockwiseIcon,
  },
  {
    key: "prep",
    name: "Conversation Prep",
    when: "Before the big talk",
    body: "Money, moving in, family. Build a short prep sheet you can actually walk in with.",
    points: ["For money, moving in, family and the future", "Five questions, answered while you're calm", "Save it as a note to walk in with"],
    Icon: FileTextIcon,
  },
];

export function Tools() {
  return (
    <section id="tools">
      <div className="hidden lg:block">
        <HorizontalTrack />
      </div>
      <div className="lg:hidden">
        <SwipeRow />
      </div>
    </section>
  );
}

function Intro({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <span className="text-sm font-medium text-calm-text">Inside Leveee</span>
      <h2 className="mt-3 max-w-[14ch] text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-ink xl:text-[48px]">
        One tool for each moment that matters.
      </h2>
      <p className="mt-4 max-w-[34ch] text-lg leading-relaxed text-body">
        Leveee doesn&apos;t read your chats. You bring it the message, when you want help with it.
      </p>
    </div>
  );
}

/** Wide two-pane card: the tool's story on the left, its screen on a linen tray on the right. */
function ToolCard({ tool, className = "" }: { tool: (typeof TOOLS)[number]; className?: string }) {
  const { key, name, when, body, points, Icon, badge } = tool;
  return (
    <article className={`grid gap-3 rounded-[32px] bg-paper p-3 shadow-soft lg:grid-cols-[0.85fr_1.15fr] ${className}`}>
      <div className="flex flex-col p-4 sm:p-5">
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-calm-wash py-1.5 pr-3.5 pl-1.5 text-[13px] font-medium text-calm-text">
          <span className="grid size-7 place-items-center rounded-full bg-btn text-btn-fg">
            <Icon size={15} weight="bold" />
          </span>
          {when}
        </span>

        <div className="mt-7 lg:mt-auto">
          <span className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.025em] text-ink">{name}</h3>
            {badge && <span className="rounded-full border border-calm/40 px-2.5 py-0.5 text-[11.5px] font-semibold text-calm-text">{badge}</span>}
          </span>
          <p className="mt-2 max-w-[34ch] text-[14.5px] leading-relaxed text-body">{body}</p>
        </div>

        <ul className="mt-5 grid gap-2 border-t border-rule pt-4">
          {points.map((pt) => (
            <li key={pt} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink">
              <CheckIcon size={15} weight="bold" className="mt-0.5 flex-none text-calm" />
              {pt}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid place-items-center overflow-hidden rounded-[24px] bg-linen p-4 sm:p-5">
        <div className="w-full max-w-[460px] lg:[zoom:0.8]">
          <Preview tool={key} />
        </div>
      </div>
    </article>
  );
}

/* ---------- desktop: the section pins and vertical scroll moves the cards sideways ---------- */

function HorizontalTrack() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the track has to travel: its full width minus the visible width.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    // Scroll length equals travel distance, so one pixel down moves the cards one pixel left.
    <div ref={wrap} className="relative" style={{ height: `calc(100dvh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pt-20">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-6 pr-[8vw] pl-[max(1.75rem,calc((100vw-1200px)/2+1.75rem))]">
          <Intro className="w-[380px] flex-none pr-6" />
          {TOOLS.map((t) => (
            <ToolCard key={t.key} tool={t} className="h-[min(480px,calc(100dvh-170px))] w-[min(780px,70vw)] flex-none overflow-hidden" />
          ))}
        </motion.div>

        <div className="mx-auto mt-8 w-full max-w-[1200px] px-7">
          <div className="h-[3px] overflow-hidden rounded-full bg-rule">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left rounded-full bg-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- mobile and tablet: a native swipe row that snaps card by card ---------- */

function SwipeRow() {
  return (
    <div className="py-20">
      <Intro className="px-4 sm:px-7" />
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-7 [scrollbar-width:none]">
        {TOOLS.map((t) => (
          <ToolCard key={t.key} tool={t} className="w-[86vw] max-w-[560px] flex-none snap-center" />
        ))}
      </div>
      <p className="mt-2 px-4 text-sm text-muted sm:px-7">Swipe to see all five tools.</p>
    </div>
  );
}

function Preview({ tool }: { tool: ToolKey }) {
  return (
    <>
      {tool === "cooldown" && <CooldownPreview />}
      {tool === "decoder" && <DecoderPreview />}
      {tool === "repair" && <RepairPreview />}
      {tool === "patterns" && <PatternsPreview />}
      {tool === "prep" && <PrepPreview />}
    </>
  );
}

/* ---------- previews: small, real renderings of each screen ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[22px] bg-paper p-4 shadow-soft sm:p-5 ${className}`}>{children}</div>;
}

function Label({ children, className = "text-muted" }: { children: React.ReactNode; className?: string }) {
  return <span className={`block text-[12px] font-semibold ${className}`}>{children}</span>;
}

function CooldownPreview() {
  return (
    <Card>
      <Label>Your draft, not sent</Label>
      <p className="mt-1 rounded-2xl bg-rose-wash px-4 py-3 text-[14.5px] leading-relaxed text-ink">
        We&apos;ve talked about this a hundred times. You never listen and I&apos;m sick of it.
      </p>
      <div className="mt-4 grid gap-2.5">
        <div className="rounded-2xl bg-calm-wash px-4 py-3">
          <Label className="text-calm-text">What you mean</Label>
          <p className="mt-0.5 text-[14px] text-ink">You don&apos;t feel heard on something that keeps coming back.</p>
        </div>
        <div className="rounded-2xl bg-rose-wash px-4 py-3">
          <Label className="text-rose-text">What they&apos;ll hear</Label>
          <p className="mt-0.5 text-[14px] text-ink">&ldquo;Never&rdquo; and &ldquo;sick of it&rdquo; sound like you&apos;ve given up on them.</p>
        </div>
        <div className="rounded-2xl border border-anchor/25 bg-anchor-wash px-4 py-3">
          <Label className="text-anchor">Try this</Label>
          <p className="mt-0.5 text-[14px] text-ink">This keeps coming up and I don&apos;t feel heard. Can we sit down properly this week?</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-medium">
        <span className="rounded-full border border-rule bg-paper px-4 py-2 text-body">Send anyway</span>
        <span className="rounded-full bg-btn px-4 py-2 text-btn-fg">Use a rewrite</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper px-4 py-2 text-body">
          <ClockIcon size={14} /> Wait an hour
        </span>
      </div>
    </Card>
  );
}

function DecoderPreview() {
  const tones = ["Warm", "Direct", "Curious", "Buy time", "Hold the boundary"];
  return (
    <Card>
      <Label>They sent</Label>
      <p className="mt-1 max-w-[80%] rounded-[18px_18px_18px_6px] bg-sand px-4 py-2.5 text-[14.5px] text-ink">Fine. Do whatever you want.</p>
      <Label className="mt-4 text-anchor">Possible readings</Label>
      <ol className="mt-2 grid gap-2 text-[14px] text-ink">
        <li className="rounded-2xl bg-linen px-4 py-2.5">
          <b className="font-semibold">They feel overruled and are pulling back.</b>
          <span className="block text-[12.5px] text-muted">More likely if the decision was made without them.</span>
        </li>
        <li className="rounded-2xl bg-linen px-4 py-2.5">
          <b className="font-semibold">They&apos;re tired and want tonight to be over.</b>
          <span className="block text-[12.5px] text-muted">More likely if it&apos;s late or they had a hard day.</span>
        </li>
      </ol>
      <div className="mt-3 rounded-2xl bg-calm-wash px-4 py-2.5 text-[14px] text-ink">
        <Label className="text-calm-text">The actual ask</Label>
        To be included before decisions that affect you both.
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {tones.map((t) => (
          <span key={t} className={`rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap ${t === "Buy time" ? "bg-btn text-btn-fg" : "border border-rule text-body"}`}>
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 rounded-2xl border border-anchor/25 bg-anchor-wash px-4 py-2.5 text-[14px] text-ink">
        I want to answer this properly, not in a rush. Can we talk tonight after dinner?
      </p>
    </Card>
  );
}

function RepairPreview() {
  return (
    <div className="grid gap-4">
      <Card className="flex items-start gap-3">
        <span className="grid size-10 flex-none place-items-center rounded-xl bg-anchor text-paper">
          <Logo className="size-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[12px] text-muted">
            <b className="font-semibold text-ink">Leveee</b>2 days later
          </div>
          <p className="mt-0.5 text-[15px] font-medium text-ink">How did the plans conversation land?</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[13px] font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-btn px-3.5 py-1.5 text-btn-fg">
              <CheckIcon size={13} weight="bold" /> Resolved
            </span>
            <span className="rounded-full border border-rule px-3.5 py-1.5 text-body">Still open</span>
            <span className="rounded-full border border-rule px-3.5 py-1.5 text-body">Went worse</span>
          </div>
        </div>
      </Card>
      <Card>
        <Label className="text-anchor">What worked?</Label>
        <p className="mt-2 w-fit rounded-[18px_18px_6px_18px] bg-sand px-4 py-2.5 text-[14.5px] text-ink">Talking over dinner instead of over text.</p>
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-warm-wash px-4 py-3 text-[14px] text-ink">
          <CheckIcon size={16} weight="bold" className="text-calm-text" />
          Saved to your playbook. Glad you two found your way back.
        </div>
      </Card>
      <p className="px-2 text-[12.5px] text-muted">If it went worse, Leveee skips the menus and goes straight into a short session.</p>
    </div>
  );
}

function PatternsPreview() {
  return (
    <div className="grid gap-4">
      <Card className="bg-[linear-gradient(160deg,var(--paper),var(--calm-wash))]">
        <div className="flex items-center gap-2">
          <ArrowsClockwiseIcon size={18} className="text-calm-text" />
          <Label className="text-calm-text">A pattern, from the last 9 weeks</Label>
        </div>
        <p className="mt-3 text-[19px] leading-snug font-medium tracking-[-0.01em] text-ink">
          Money has come up 4 times. Each time it starts with a purchase and ends about respect. The purchase probably isn&apos;t the issue.
        </p>
        <p className="mt-4 text-[15px] text-body">Does that match how it feels?</p>
        <div className="mt-3 flex flex-wrap gap-2 text-[13px] font-medium">
          <span className="rounded-full bg-btn px-4 py-2 text-btn-fg">That&apos;s right</span>
          <span className="rounded-full border border-rule bg-paper px-4 py-2 text-body">That&apos;s not right</span>
        </div>
      </Card>
    </div>
  );
}

function PrepPreview() {
  const rows = [
    ["What outcome do you want?", "To be heard, not to win the argument."],
    ["The one sentence", "I want us to plan money together, not find out after."],
    ["What they'll likely say", "“You're overthinking it.” Answer with the sentence, not a list."],
    ["What you'll move on", "Who runs the budget app."],
    ["When and where", "Saturday morning at home. Not late, not over text."],
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <b className="text-[16px] font-semibold text-ink">The money talk</b>
        <span className="rounded-full bg-sand px-3 py-1 text-[12px] text-muted">Prep sheet</span>
      </div>
      <ol className="mt-4 grid gap-3">
        {rows.map(([q, a], i) => (
          <li key={q} className="grid grid-cols-[28px_1fr] gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-anchor-wash text-[12.5px] font-semibold text-anchor">{i + 1}</span>
            <span>
              <span className="block text-[13px] font-semibold text-ink">{q}</span>
              <span className="text-[14px] text-body">{a}</span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
