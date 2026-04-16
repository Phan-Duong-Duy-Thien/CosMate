import * as disputeApi from '@/features/order/api/dispute.api';
import type { Dispute, GetDisputesParams } from '@/features/order/api/dispute.api';

export async function getDisputes(params?: GetDisputesParams): Promise<Dispute[]> {
  const response = await disputeApi.getDisputes(params);
  return response;
}
