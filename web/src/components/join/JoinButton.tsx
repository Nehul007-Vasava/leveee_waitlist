"use client";

import { useJoin } from "./JoinProvider";

const SIZES = {
  md: "h-13 px-7 text-[15.5px]",
  sm: "h-10 px-5 text-sm",
};

export function JoinButton({
  size = "md",
  label = "Join the waitlist",
  className = "",
}: {
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}) {
  const { open } = useJoin();
  return (
    <button
      type="button"
      onClick={open}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full bg-btn font-semibold text-btn-fg shadow-[0_8px_24px_-10px_rgb(94_86_137/0.55)] transition-[background-color,transform] duration-200 ease-(--ease-calm) hover:bg-btn-hover active:scale-[0.98] ${SIZES[size]} ${className}`}
    >
      {label}
    </button>
  );
}
