/**
 * Admin orders list — enriches list rows when cosplayer display name is missing.
 */

import * as adminOrdersApi from '../api/adminOrders.api';
import { getPublicUserName, getPublicShopName } from '@/shared/api/publicDisplayNames.api';
import {
  normalizeOrderListRow,
  type OrderListRow,
} from '@/features/order/utils/normalizeOrderListRow';

export interface AdminOrderRow extends OrderListRow {
  code?: string;
  userName?: string;
  cosplayerName?: string;
  providerName?: string;
  /** @deprecated use totalAmount */
  total?: number;
}

const publicUserNameCache: Record<number, string> = {};
const providerNameCache: Record<number, string> = {};

export async function fetchAdminOrdersEnriched(): Promise<{
  content: AdminOrderRow[];
  totalElements: number;
}> {
  const data = await adminOrdersApi.getOrders(1, 9999);

  let content: AdminOrderRow[] = (data.content || []).map((raw) => {
    const row = normalizeOrderListRow(raw as Record<string, unknown>);
    return {
      ...row,
      code: String(row.id),
      total: row.totalAmount,
    };
  });

  // 1. Resolve Cosplayer / Customer Name using public API
  const uniqueCosplayerIds = [...new Set(content.map((r) => r.cosplayerId).filter((id): id is number => id != null))];
  if (uniqueCosplayerIds.length > 0) {
    const cosplayerResults = await Promise.all(
      uniqueCosplayerIds.map(async (id) => {
        if (publicUserNameCache[id]) {
          return { id, name: publicUserNameCache[id] };
        }
        try {
          const name = await getPublicUserName(id);
          publicUserNameCache[id] = name;
          return { id, name };
        } catch {
          return { id, name: `User #${id}` };
        }
      })
    );
    const cosplayerMap = Object.fromEntries(cosplayerResults.map((c) => [c.id, c.name]));
    content = content.map((r) => {
      const name = cosplayerMap[r.cosplayerId] || `User #${r.cosplayerId}`;
      return {
        ...r,
        userName: r.userName || name,
        cosplayerName: r.cosplayerName || name,
      };
    });
  }

  // 2. Resolve Provider Name
  const uniqueProviderIds = [...new Set(content.map((r) => r.providerId).filter((id): id is number => id != null))];
  if (uniqueProviderIds.length > 0) {
    const providerResults = await Promise.all(
      uniqueProviderIds.map(async (id) => {
        if (providerNameCache[id]) {
          return { id, shopName: providerNameCache[id] };
        }
        try {
          const shopName = await getPublicShopName(id);
          providerNameCache[id] = shopName;
          return { id, shopName };
        } catch {
          return { id, shopName: `Shop #${id}` };
        }
      })
    );
    const providerMap = Object.fromEntries(providerResults.map((p) => [p.id, p.shopName]));
    content = content.map((r) => ({
      ...r,
      providerName: r.providerName || providerMap[r.providerId] || `Shop #${r.providerId}`,
    }));
  }

  return {
    content,
    totalElements: data.totalElements ?? content.length,
  };
}
