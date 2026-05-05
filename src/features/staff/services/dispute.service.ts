/**
 * Dispute Service (Staff Layer)
 * Delegates to the dispute feature module
 */
import * as disputeService from '@/features/dispute/services/dispute.service';

export async function getDisputes(params?: { status?: string; userId?: number }) {
  return disputeService.getDisputes(params);
}