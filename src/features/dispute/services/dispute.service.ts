/**
 * Dispute Service
 * Business logic layer wrapping dispute API
 */
import * as disputeApi from '../api/disputeApi';
import type {
  Dispute,
  GetDisputesParams,
  ResolveDisputePayload,
  ResolveDisputeResponse,
} from '../types/dispute.type';

export async function getDisputes(params?: GetDisputesParams): Promise<Dispute[]> {
  return disputeApi.getDisputes(params);
}

export async function resolveDispute(
  id: number,
  data: ResolveDisputePayload
): Promise<ResolveDisputeResponse> {
  return disputeApi.resolveDispute(id, data);
}
