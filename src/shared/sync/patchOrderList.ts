import type { OrderItem, OrderStatus } from '@/features/order/types';

export type PendingOrderStatus = {
  status: OrderStatus;
  updatedAt: number;
};

const DEFAULT_PENDING_TTL_MS = 90_000;

/**
 * After mutation, BE list may lag — keep optimistic status until server matches or TTL expires.
 */
export function mergeOrdersWithPendingStatus(
  fetched: OrderItem[],
  pending: Map<number, PendingOrderStatus>,
  ttlMs = DEFAULT_PENDING_TTL_MS,
): { orders: OrderItem[]; pending: Map<number, PendingOrderStatus> } {
  const now = Date.now();
  const nextPending = new Map(pending);

  const orders = fetched.map((order) => {
    const entry = nextPending.get(order.id);
    if (!entry || now - entry.updatedAt > ttlMs) {
      if (entry && now - entry.updatedAt > ttlMs) {
        nextPending.delete(order.id);
      }
      return order;
    }
    if (order.status === entry.status) {
      nextPending.delete(order.id);
      return order;
    }
    return { ...order, status: entry.status };
  });

  return { orders, pending: nextPending };
}

/** Immutably update one order's status in a list (optimistic UI). */
export function patchOrderStatus(
  orders: OrderItem[],
  orderId: number,
  status: OrderStatus,
): OrderItem[] {
  return orders.map((o) => (o.id === orderId ? { ...o, status } : o));
}

/** Merge fields from POST response into list item when API returns partial OrderItem. */
export function mergeOrderFromMutation(
  orders: OrderItem[],
  orderId: number,
  partial: Partial<OrderItem> & { status?: OrderStatus },
): OrderItem[] {
  return orders.map((o) => (o.id === orderId ? { ...o, ...partial, status: partial.status ?? o.status } : o));
}
