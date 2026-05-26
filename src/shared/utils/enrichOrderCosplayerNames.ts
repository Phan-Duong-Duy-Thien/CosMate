import { getUserById } from '@/features/admin/api/adminUsers.api';
import type { OrderItem } from '@/features/order/types';
import { canFetchOtherUserProfiles } from './canFetchUserProfile';

/**
 * Fill missing cosplayerName only when caller has admin profile access.
 * Provider tokens get 403 on /api/users/{id}/profile — skip to avoid noise.
 */
export async function enrichOrderCosplayerNames(orders: OrderItem[]): Promise<OrderItem[]> {
  if (!canFetchOtherUserProfiles()) {
    return orders;
  }

  const ordersNeedingName = orders.filter((o) => !o.cosplayerName?.trim());
  if (ordersNeedingName.length === 0) return orders;

  const uniqueCosplayerIds = [...new Set(ordersNeedingName.map((o) => o.cosplayerId))];
  const userResults = await Promise.all(
    uniqueCosplayerIds.map((id) => getUserById(id)),
  );
  const cosplayerMap = Object.fromEntries(
    userResults
      .filter((u): u is NonNullable<typeof u> => u !== null)
      .map((u) => [u.id, u.fullName ?? '—']),
  );

  return orders.map((order) =>
    !order.cosplayerName?.trim()
      ? { ...order, cosplayerName: cosplayerMap[order.cosplayerId] ?? order.cosplayerName }
      : order,
  );
}
