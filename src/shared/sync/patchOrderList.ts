import type { OrderItem, OrderStatus } from '@/features/order/types';
import {
  mergeListWithPendingField,
  patchListItemById,
  PENDING_LIST_DEFAULT_TTL_MS,
  type PendingFieldEntry,
} from '@/shared/sync/pendingListMerge';

export type PendingOrderStatus = {
  status: OrderStatus;
  updatedAt: number;
};

const DEFAULT_PENDING_TTL_MS = PENDING_LIST_DEFAULT_TTL_MS;

/**
 * After mutation, BE list may lag — keep optimistic status until server matches or TTL expires.
 */
export function mergeOrdersWithPendingStatus(
  fetched: OrderItem[],
  pending: Map<number, PendingOrderStatus>,
  ttlMs = DEFAULT_PENDING_TTL_MS,
): { orders: OrderItem[]; pending: Map<number, PendingOrderStatus> } {
  const legacyPending = new Map<number, PendingFieldEntry<OrderStatus>>();
  pending.forEach((entry, id) => {
    legacyPending.set(id, { value: entry.status, updatedAt: entry.updatedAt });
  });

  const { items, pending: nextLegacy } = mergeListWithPendingField(
    fetched,
    legacyPending,
    (o) => o.id,
    (o) => o.status,
    (o, status) => ({ ...o, status }),
    ttlMs,
  );

  const nextPending = new Map<number, PendingOrderStatus>();
  nextLegacy.forEach((entry, id) => {
    nextPending.set(id, { status: entry.value, updatedAt: entry.updatedAt });
  });

  return { orders: items, pending: nextPending };
}

/** Immutably update one order's status in a list (optimistic UI). */
export function patchOrderStatus(
  orders: OrderItem[],
  orderId: number,
  status: OrderStatus,
): OrderItem[] {
  return patchListItemById(orders, orderId, { status });
}

/** Merge fields from POST response into list item when API returns partial OrderItem. */
export function mergeOrderFromMutation(
  orders: OrderItem[],
  orderId: number,
  partial: Partial<OrderItem> & { status?: OrderStatus },
): OrderItem[] {
  return orders.map((o) => (o.id === orderId ? { ...o, ...partial, status: partial.status ?? o.status } : o));
}

export {
  mergeListWithPendingField,
  patchListItemById,
  scheduleBackgroundRefetch,
  PENDING_LIST_DEFAULT_TTL_MS,
  REFETCH_AFTER_MUTATION_MS,
} from '@/shared/sync/pendingListMerge';
