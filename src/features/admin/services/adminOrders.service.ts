/**
 * Admin orders list — enriches list rows when cosplayer display name is missing.
 */

import * as adminOrdersApi from '../api/adminOrders.api';
import { getUserById } from '../api/adminUsers.api';

export interface AdminOrderRow {
  id: number;
  code?: string;
  userName?: string;
  cosplayerName?: string;
  providerName?: string;
  status?: string;
  total?: number;
  cosplayerId?: number;
}

export async function fetchAdminOrdersEnriched(): Promise<{
  content: AdminOrderRow[];
  totalElements: number;
}> {
  const data = await adminOrdersApi.getOrders(1, 9999);

  let content = (data.content || []) as AdminOrderRow[];

  const rowsNeedingName = content.filter((r) => !r.cosplayerName && r.cosplayerId != null);
  if (rowsNeedingName.length > 0) {
    const uniqueIds = [...new Set(rowsNeedingName.map((r) => r.cosplayerId).filter((id): id is number => id != null))];
    const userResults = await Promise.all(uniqueIds.map((id) => getUserById(id).catch(() => null)));
    const cosplayerMap = Object.fromEntries(
      userResults
        .filter((u): u is NonNullable<typeof u> => u !== null)
        .map((u) => [u.id, u.fullName ?? '—'])
    );
    content = content.map((r) => {
      if (!r.cosplayerName && r.cosplayerId != null) {
        return { ...r, cosplayerName: cosplayerMap[r.cosplayerId] ?? r.cosplayerName };
      }
      return r;
    });
  }

  return {
    content,
    totalElements: data.totalElements ?? content.length,
  };
}
