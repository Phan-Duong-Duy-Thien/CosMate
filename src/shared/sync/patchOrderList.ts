import type { OrderItem, OrderStatus } from '@/features/order/types';

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
