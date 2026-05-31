import { getUserById } from '@/features/admin/api/adminUsers.api';
import { searchUsers } from '@/features/chat/api/user.api';
import { getOrCreateChatRoom, getChatPartner } from '@/features/chat/api/chat.api';
import { getUserId } from '@/features/auth/services/tokenStorage';
import type { OrderItem } from '@/features/order/types';

/**
 * Fill missing cosplayerName by attempting direct profile lookup,
 * falling back to chat partner resolution (provider-safe), and then
 * a broad searchUsers query.
 */
export async function enrichOrderCosplayerNames(orders: OrderItem[]): Promise<OrderItem[]> {
  const ordersNeedingName = orders.filter((o) => !o.cosplayerName?.trim());
  if (ordersNeedingName.length === 0) return orders;

  const uniqueCosplayerIds = [...new Set(ordersNeedingName.map((o) => o.cosplayerId))];
  const currentUserId = getUserId();
  const userResults = await Promise.all(
    uniqueCosplayerIds.map(async (id) => {
      const direct = await getUserById(id);
      if (direct) return direct;
      if (currentUserId) {
        try {
          const room = await getOrCreateChatRoom(currentUserId, id);
          const partner = await getChatPartner(room.id, currentUserId);
          if (partner?.fullName) {
            return { id, fullName: partner.fullName, username: '' } as any;
          }
        } catch {}
      }
      try {
        const list = await searchUsers(String(id));
        const found = list.find((u) => u.id === id);
        if (found) {
          return { id, fullName: found.fullName, username: found.username } as any;
        }
      } catch {}
      return null;
    })
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
