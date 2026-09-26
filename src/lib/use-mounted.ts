import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Modern React 19 / Next.js safe hydration hook using useSyncExternalStore.
 * Avoids cascading setState within useEffect and prevents SSR hydration mismatch.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
