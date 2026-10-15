"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  FireIcon,
  LockIcon,
  PencilSimpleLineIcon,
  SnowflakeIcon,
  SpiralIcon,
  XIcon,
} from "@phosphor-icons/react";
import { PAINS, PARTNER_OPEN, TOGETHER, type PainKey } from "@/lib/content";
import { Logo } from "@/components/vectors";
import { REF_KEY, SIGNUP_KEY } from "./JoinProvider";

const PAIN_ICONS: Record<PainKey, typeof FireIcon> = {
  heat: FireIcon,
  loop: ArrowsClockwiseIcon,
  replay: SpiralIcon,
  distance: SnowflakeIcon,
  other: PencilSimpleLineIcon,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 0 | 1 | 2;

export function JoinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(0);
  const [pain, setPain] = useState<PainKey | null>(null);
  const [other, setOther] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: hidden from people, filled by bots
  const [together, setTogether] = useState<string | null>(null);
  const [partnerOpen, setPartnerOpen] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [signupId, setSignupId] = useState<string | null>(null);

  // Escape to close, lock page scroll, restore focus to the opener.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      opener?.focus?.();
    };
  }, [open, onClose]);

  // Move focus into the current step.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      boxRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }, 80);
    return () => clearTimeout(t);
  }, [open, step]);

  function reset() {
    setStep(0);
    setPain(null);
    setOther("");
    setTogether(null);
    setPartnerOpen(null);
    setError("");
    setSignupId(null);
  }

  async function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your first name.");
    if (!EMAIL.test(email.trim())) return setError("Please enter a valid email, like name@example.com.");
    setError("");
    setBusy(true);
    try {
      let referredBy: string | undefined;
      try {
        referredBy = sessionStorage.getItem(REF_KEY) ?? undefined;
      } catch {}
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pain, other, referredBy, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      try {
        sessionStorage.setItem(
          SIGNUP_KEY,
          JSON.stringify({ id: data.id, ref: data.ref, position: data.position, name: name.trim(), pain }),
        );
      } catch {}
      setSignupId(data.id);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function finish(skip: boolean) {
    if (!skip && signupId && (together || partnerOpen)) {
      setBusy(true);
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id: signupId, together, partnerOpen }),
      }).catch(() => {});
      setBusy(false);
    }
    onClose();
    router.push("/thanks");
    setTimeout(reset, 400);
  }

  const slide = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, x: -24 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgb(43_37_54/0.34)] backdrop-blur-sm sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={boxRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-title"
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-paper px-6 pt-8 pb-7 shadow-lift sm:max-w-[480px] sm:rounded-[28px] sm:px-9 sm:pt-10"
            initial={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink"
            >
              <XIcon size={16} weight="bold" />
            </button>

            {/* progress */}
            <div className="mb-6 flex items-center gap-3">
              <Logo className="size-8 text-anchor" />
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${i <= step ? "w-7 bg-calm" : "w-4 bg-sand"}`}
                  />
                ))}
              </div>
              <span className="sr-only">Step {step + 1} of 3</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div key="pain" {...slide}>
                  <h2 id="join-title" className="text-[26px] leading-tight font-semibold tracking-tight text-ink">
                    What hurts most right now?
                  </h2>
                  <p className="mt-2 text-[15px] text-body">One tap. It helps us build the right thing first.</p>
                  <div role="radiogroup" aria-labelledby="join-title" className="mt-6 grid gap-2">
                    {PAINS.map(({ key, label }, i) => {
                      const Icon = PAIN_ICONS[key];
                      const on = pain === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          data-autofocus={i === 0 ? "" : undefined}
                          onClick={() => {
                            setPain(key);
                            if (key !== "other") setStep(1);
                          }}
                          className={`group flex items-center gap-3.5 rounded-2xl border px-4 py-3 text-left text-[15px] text-ink transition-colors ${
                            on ? "border-calm bg-calm-wash" : "border-rule bg-linen hover:border-calm-2"
                          }`}
                        >
                          <span className={`grid size-9 flex-none place-items-center rounded-full ${key === "heat" ? "bg-rose-wash text-rose-text" : "bg-calm-wash text-calm-text"}`}>
                            <Icon size={18} weight="duotone" />
                          </span>
                          <span className="flex-1">{label}</span>
                          <ArrowRightIcon size={16} className="text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      );
                    })}
                  </div>
                  {pain === "other" && (
                    <form
                      className="mt-3 flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setStep(1);
                      }}
                    >
                      <label htmlFor="join-other" className="sr-only">Describe it in a few words</label>
                      <input
                        id="join-other"
                        autoFocus
                        value={other}
                        maxLength={280}
                        onChange={(e) => setOther(e.target.value)}
                        placeholder="In a few words..."
                        className="h-12 min-w-0 flex-1 rounded-2xl border border-rule bg-linen px-4 text-[15px] text-ink placeholder:text-muted focus:border-calm focus:bg-paper focus:outline-none"
                      />
                      <button type="submit" aria-label="Continue" className="grid size-12 flex-none place-items-center rounded-2xl bg-btn text-btn-fg">
                        <ArrowRightIcon size={18} weight="bold" />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {step === 1 && (
                <motion.form key="details" {...slide} onSubmit={submitDetails} noValidate>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="mb-3 -ml-1 inline-flex items-center gap-1.5 rounded-full px-1 text-sm text-muted hover:text-ink"
                  >
                    <ArrowLeftIcon size={14} /> Back
                  </button>
                  <h2 id="join-title" className="text-[26px] leading-tight font-semibold tracking-tight text-ink">
                    Got it. Where should we send your invite?
                  </h2>
                  <div className="mt-6 grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="join-name" className="text-sm font-medium text-ink">First name</label>
                      <input
                        id="join-name"
                        data-autofocus=""
                        autoComplete="given-name"
                        value={name}
                        maxLength={60}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 rounded-2xl border border-rule bg-linen px-4 text-base text-ink placeholder:text-muted focus:border-calm focus:bg-paper focus:outline-none"
                        placeholder="Your first name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="join-email" className="text-sm font-medium text-ink">Email</label>
                      <input
                        id="join-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        maxLength={120}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-2xl border border-rule bg-linen px-4 text-base text-ink placeholder:text-muted focus:border-calm focus:bg-paper focus:outline-none"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="join-website">Website</label>
                      <input
                        id="join-website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                  <p aria-live="polite" className="mt-3 min-h-5 text-sm text-rose-text">{error}</p>
                  <button
                    type="submit"
                    disabled={busy}
                    className="mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-btn text-[15.5px] font-semibold text-btn-fg transition-[background-color,transform] hover:bg-btn-hover active:scale-[0.98] disabled:opacity-70"
                  >
                    {busy ? "Joining..." : <>Join the waitlist <ArrowRightIcon size={16} weight="bold" /></>}
                  </button>
                  <p className="mt-4 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
                    <LockIcon size={14} /> Private. We only email you about the beta.
                  </p>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div key="extra" {...slide}>
                  <h2 id="join-title" className="text-[26px] leading-tight font-semibold tracking-tight text-ink">
                    You&apos;re in. Two optional questions?
                  </h2>
                  <p className="mt-2 text-[15px] text-body">They help us decide what to build first. Skip if you like.</p>

                  <fieldset className="mt-6">
                    <legend className="mb-2.5 text-sm font-medium text-ink">How long have you been together?</legend>
                    <div className="flex flex-wrap gap-2">
                      {TOGETHER.map((v, i) => (
                        <Chip key={v} on={together === v} onClick={() => setTogether(v)} autoFocus={i === 0}>{v}</Chip>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="mt-5">
                    <legend className="mb-2.5 text-sm font-medium text-ink">Would your partner be open to something like this?</legend>
                    <div className="flex flex-wrap gap-2">
                      {PARTNER_OPEN.map((v) => (
                        <Chip key={v} on={partnerOpen === v} onClick={() => setPartnerOpen(v)}>{v}</Chip>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-8 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => finish(false)}
                      className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-btn text-[15px] font-semibold text-btn-fg transition-[background-color,transform] hover:bg-btn-hover active:scale-[0.98] disabled:opacity-70"
                    >
                      Continue <ArrowRightIcon size={16} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => finish(true)}
                      className="h-12 rounded-full px-5 text-[15px] text-muted transition-colors hover:bg-sand hover:text-ink"
                    >
                      Skip
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Chip({
  on,
  onClick,
  autoFocus,
  children,
}: {
  on: boolean;
  onClick: () => void;
  autoFocus?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      data-autofocus={autoFocus ? "" : undefined}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[14.5px] transition-colors ${
        on ? "border-calm bg-calm-wash text-ink" : "border-rule text-ink hover:border-calm-2"
      }`}
    >
      {children}
    </button>
  );
}
