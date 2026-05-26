import { useCallback, useRef } from 'react';
import {
  mergeListWithPendingField,
  scheduleBackgroundRefetch,
  type PendingFieldMap,
  PENDING_LIST_DEFAULT_TTL_MS,
  REFETCH_AFTER_MUTATION_MS,
} from '@/shared/sync/pendingListMerge';

export interface UsePendingListMutationOptions<T, V> {
  getItemId: (item: T) => number;
  getFieldValue: (item: T) => V;
  setFieldValue: (item: T, value: V) => T;
  refetch?: (options?: { silent?: boolean }) => void | Promise<void>;
  ttlMs?: number;
  refetchDelayMs?: number;
}

/**
 * Encapsulates pending-field map + optimistic patch + delayed background refetch.
 * Getter/setter callbacks are stored in refs so mergeFetched identity stays stable
 * (avoids infinite useEffect loops when callers pass inline arrow functions).
 */
export function usePendingListMutation<T extends { id: number }, V>({
  getItemId,
  getFieldValue,
  setFieldValue,
  refetch,
  ttlMs = PENDING_LIST_DEFAULT_TTL_MS,
  refetchDelayMs = REFETCH_AFTER_MUTATION_MS,
}: UsePendingListMutationOptions<T, V>) {
  const pendingRef = useRef<PendingFieldMap<V>>(new Map());
  const refetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getItemIdRef = useRef(getItemId);
  const getFieldValueRef = useRef(getFieldValue);
  const setFieldValueRef = useRef(setFieldValue);
  const refetchRef = useRef(refetch);
  getItemIdRef.current = getItemId;
  getFieldValueRef.current = getFieldValue;
  setFieldValueRef.current = setFieldValue;
  refetchRef.current = refetch;

  const mergeFetched = useCallback(
    (fetched: T[]): T[] => {
      const merged = mergeListWithPendingField(
        fetched,
        pendingRef.current,
        (item) => getItemIdRef.current(item),
        (item) => getFieldValueRef.current(item),
        (item, value) => setFieldValueRef.current(item, value),
        ttlMs,
      );
      pendingRef.current = merged.pending;
      return merged.items;
    },
    [ttlMs],
  );

  const setPendingField = useCallback((id: number, value: V) => {
    pendingRef.current.set(id, { value, updatedAt: Date.now() });
  }, []);

  const applyFieldMutation = useCallback(
    (
      id: number,
      nextValue: V,
      patchItem?: (list: T[]) => T[],
    ): ((prev: T[]) => T[]) => {
      setPendingField(id, nextValue);
      return (prev) => {
        if (patchItem) return patchItem(prev);
        return prev.map((item) =>
          getItemIdRef.current(item) === id
            ? setFieldValueRef.current(item, nextValue)
            : item,
        );
      };
    },
    [setPendingField],
  );

  const scheduleRefetch = useCallback(() => {
    if (!refetchRef.current) return;
    if (refetchTimerRef.current != null) {
      clearTimeout(refetchTimerRef.current);
    }
    refetchTimerRef.current = scheduleBackgroundRefetch(
      () => refetchRef.current?.({ silent: true }),
      refetchDelayMs,
    );
  }, [refetchDelayMs]);

  return {
    pendingRef,
    mergeFetched,
    setPendingField,
    applyFieldMutation,
    scheduleRefetch,
  };
}
