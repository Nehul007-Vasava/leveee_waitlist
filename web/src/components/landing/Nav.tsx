"use client";

import { useState } from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/vectors";
import { JoinButton } from "@/components/join/JoinButton";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/#faq", label: "Questions" },
];

export function Nav({ showLinks = true, showCta = true }: { showLinks?: boolean; showCta?: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled((prev) => (prev === y > 12 ? prev : y > 12)));

  return (
    <header className="sticky top-3.5 z-40 mt-3.5 px-4 sm:px-5">
      <div
        className={`mx-auto grid h-16 max-w-[1320px] grid-cols-[1fr_auto] items-center rounded-full border border-[rgb(43_37_54/0.07)] pr-2 pl-5 backdrop-blur-md transition-[background-color,box-shadow] duration-300 lg:grid-cols-[1fr_auto_1fr] ${
          scrolled ? "bg-paper/90 shadow-soft" : "bg-paper/60"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 text-[22px] font-semibold tracking-tight text-ink">
          <Logo className="size-7 text-anchor" />
          Leveee
        </Link>
        {showLinks && (
          <nav aria-label="Main" className="hidden gap-1 text-[15px] lg:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-body transition-colors hover:bg-sand hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
        )}
        {showCta && (
          <div className="justify-self-end">
            <JoinButton size="sm" />
          </div>
        )}
      </div>
    </header>
  );
}
