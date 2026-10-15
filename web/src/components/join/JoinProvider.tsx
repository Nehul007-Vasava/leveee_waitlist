"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { JoinModal } from "./JoinModal";

type JoinCtx = { open: () => void };
const Ctx = createContext<JoinCtx>({ open: () => {} });

export const useJoin = () => useContext(Ctx);

export const SIGNUP_KEY = "leveee:signup";
export const REF_KEY = "leveee:ref";

export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);

  // Remember who invited this visitor (leveee.app/?ref=code) for the invite perk.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      try {
        sessionStorage.setItem(REF_KEY, ref.slice(0, 40));
      } catch {}
    }
  }, []);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <JoinModal open={isOpen} onClose={() => setOpen(false)} />
    </Ctx.Provider>
  );
}
