/**
 * Generic pending-field merge for list UIs after mutations.
 * BE list endpoints may lag behind POST/PATCH — keep optimistic values until server matches or TTL expires.
 */

export const PENDING_LIST_DEFAULT_TTL_MS = 90_000;
export const REFETCH_AFTER_MUTATION_MS = 4_000;

export type PendingFieldEntry<V> = {
  value: V;
  updatedAt: number;
};

export type PendingFieldMap<V> = Map<number, PendingFieldEntry<V>>;

/**
 * Merge fetched list with pending field overrides (by item id).
 */
export function mergeListWithPendingField<T, V>(
  fetched: T[],
  pending: PendingFieldMap<V>,
  getItemId: (item: T) => number,
  getFieldValue: (item: T) => V,
  setFieldValue: (item: T, value: V) => T,
  ttlMs = PENDING_LIST_DEFAULT_TTL_MS,
): { items: T[]; pending: PendingFieldMap<V> } {
  const now = Date.now();
  const nextPending = new Map(pending);

  const items = fetched.map((item) => {
    const id = getItemId(item);
    const entry = nextPending.get(id);
    if (!entry || now - entry.updatedAt > ttlMs) {
      if (entry && now - entry.updatedAt > ttlMs) {
        nextPending.delete(id);
      }
      return item;
    }
    if (getFieldValue(item) === entry.value) {
      nextPending.delete(id);
      return item;
    }
    return setFieldValue(item, entry.value);
  });

  return { items, pending: nextPending };
}

/** Immutably patch one list item by id. */
export function patchListItemById<T extends { id: number }>(
  list: T[],
  id: number,
  patch: Partial<T>,
): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

/** Schedule a silent background refetch (avoids overwriting optimistic UI immediately). */
export function scheduleBackgroundRefetch(
  refetch: () => void | Promise<void>,
  delayMs = REFETCH_AFTER_MUTATION_MS,
): ReturnType<typeof setTimeout> {
  return window.setTimeout(() => {
    void refetch();
  }, delayMs);
}
