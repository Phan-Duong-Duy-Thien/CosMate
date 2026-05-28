import { useEffect, useRef } from 'react';

const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Refetch when the user returns to this browser tab/window.
 * Complements dataSync events (which only fire for in-session mutations).
 */
export function useRefetchOnWindowFocus(
  refetch: () => void | Promise<void>,
  enabled = true,
  debounceMs = DEFAULT_DEBOUNCE_MS,
): void {
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefetch = () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        void refetchRef.current();
      }, debounceMs);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scheduleRefetch();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [enabled, debounceMs]);
}
