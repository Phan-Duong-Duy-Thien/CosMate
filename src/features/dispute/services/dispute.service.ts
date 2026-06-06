import * as disputeApi from '../api/disputeApi';
import { getUserById } from '@/features/admin/api/adminUsers.api';
import { getProviderById } from '@/features/provider/api/providerShop.api';
import type {
  Dispute,
  GetDisputesParams,
  ResolveDisputePayload,
  ResolveDisputeResponse,
} from '../types/dispute.type';

export async function getDisputes(params?: GetDisputesParams): Promise<Dispute[]> {
  const disputes = await disputeApi.getDisputes(params);
  if (!disputes || disputes.length === 0) return [];

  const uniqueCosplayerIds = [...new Set(disputes.map(d => d.order.cosplayerId))];
  const uniqueProviderIds = [...new Set(disputes.map(d => d.order.providerId))];

  const cosplayerResults = await Promise.all(
    uniqueCosplayerIds.map(async (id) => {
      try {
        const user = await getUserById(id);
        return { id, name: user?.fullName || `User #${id}` };
      } catch {
        return { id, name: `User #${id}` };
      }
    })
  );

  const providerResults = await Promise.all(
    uniqueProviderIds.map(async (id) => {
      try {
        const provider = await getProviderById(id);
        return { id, name: provider?.shopName || `Shop #${id}` };
      } catch {
        return { id, name: `Shop #${id}` };
      }
    })
  );

  const cosplayerMap = Object.fromEntries(cosplayerResults.map(r => [r.id, r.name]));
  const providerMap = Object.fromEntries(providerResults.map(r => [r.id, r.name]));

  return disputes.map(dispute => ({
    ...dispute,
    order: {
      ...dispute.order,
      cosplayerName: cosplayerMap[dispute.order.cosplayerId],
      providerName: providerMap[dispute.order.providerId],
    }
  }));
}

export async function resolveDispute(
  id: number,
  data: ResolveDisputePayload
): Promise<ResolveDisputeResponse> {
  return disputeApi.resolveDispute(id, data);
}
