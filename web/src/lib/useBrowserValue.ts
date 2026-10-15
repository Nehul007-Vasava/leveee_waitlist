"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Reads a browser-only value without a setState-in-effect round trip.
 * Returns `serverValue` during SSR and hydration, then the client value.
 * `read` must return a stable primitive (string, number, boolean, null).
 */
export function useBrowserValue<T extends string | number | boolean | null | undefined>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return read();
      } catch {
        return serverValue;
      }
    },
    () => serverValue,
  );
}
