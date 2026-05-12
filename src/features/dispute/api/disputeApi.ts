/**
 * Dispute API
 * HTTP layer for dispute operations
 */
import axiosInstance from '@/services/axiosInstance';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// ─── Re-export types from feature ───────────────────────────────────────────

export type {
  Dispute,
  DisputeResult,
  DisputeImage,
  DisputeOrder,
  DisputeStatus,
  GetDisputesParams,
  CreateDisputePayload,
  CreateDisputeResponse,
  ResolveDisputePayload,
  ResolveDisputeResponse,
} from '../types/dispute.type';

// ─── Get Disputes ─────────────────────────────────────────────────────────────

export async function getDisputes(
  params?: { status?: string; userId?: number }
): Promise<import('../types/dispute.type').Dispute[]> {
  const response = await axiosInstance.get<ApiResponse<import('../types/dispute.type').Dispute[]>>(
    '/api/disputes',
    { params }
  );
  return response.data.result;
}

// ─── Create Dispute ───────────────────────────────────────────────────────────

/**
 * Create a dispute for an order (multipart/form-data)
 */
export async function createDispute(
  orderId: number,
  payload: { reason: string; files: File[] }
): Promise<import('../types/dispute.type').CreateDisputeResponse> {
  const formData = new FormData();
  formData.append('reason', payload.reason);
  for (const file of payload.files) {
    formData.append('files', file);
  }

  const response = await axiosInstance.post<ApiResponse<import('../types/dispute.type').CreateDisputeResponse>>(
    '/api/disputes',
    formData,
    { params: { orderId } }
  );

  return response.data.result;
}

// ─── Resolve Dispute ──────────────────────────────────────────────────────────

/**
 * Resolve a dispute (staff action)
 */
export async function resolveDispute(
  id: number,
  data: {
    result: string;
    penaltyAmount: number;
    penaltyPercent: number;
    notes: string;
  }
): Promise<import('../types/dispute.type').ResolveDisputeResponse> {
  const response = await axiosInstance.post<ApiResponse<import('../types/dispute.type').ResolveDisputeResponse>>(
    `/api/disputes/${id}/resolve`,
    data
  );
  return response.data.result;
}
