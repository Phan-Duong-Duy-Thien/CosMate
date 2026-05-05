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

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface DisputeResult {
  penaltyAmount: number | null;
  penaltyPercent: number | null;
  id?: number;
  dispute?: string;
  result?: string;
  createdAt?: string;
}

export interface DisputeImage {
  id: number;
  disputeImageUrl: string;
  dispute?: string;
}

export interface DisputeOrder {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: string;
  totalAmount: number;
  totalDepositAmount?: number;
  createdAt: string;
  rentDate?: string;
}

// ─── Create Dispute ──────────────────────────────────────────────────────────

export interface CreateDisputeResponse {
  id: number;
  order: {
    id: number;
    status: string;
    [key: string]: unknown;
  };
  createdByUserId: number;
  staffId: number;
  reason: string;
  status: string;
  createdAt: string;
  result: DisputeResult | null;
  images: DisputeImage[];
}

export interface CreateDisputePayload {
  reason: string;
  files: File[];
}

/**
 * Create a dispute for an order (multipart/form-data)
 * @param orderId - The order ID (passed as query param)
 * @param payload - { reason, files: File[] }
 */
export async function createDispute(
  orderId: number,
  payload: { reason: string; files: File[] }
): Promise<CreateDisputeResponse> {
  const formData = new FormData();
  formData.append('reason', payload.reason);
  for (const file of payload.files) {
    formData.append('files', file);
  }

  const response = await axiosInstance.post<ApiResponse<CreateDisputeResponse>>(
    '/api/disputes',
    formData,
    { params: { orderId } }
  );

  return response.data.result;
}

// ─── Get Disputes (Staff) ────────────────────────────────────────────────────

export interface GetDisputesParams {
  status?: string;
  userId?: number;
}

export interface Dispute {
  id: number;
  order: DisputeOrder;
  createdByUserId: number;
  staffId: number;
  reason: string;
  status: string;
  createdAt: string;
  result: DisputeResult | null;
  images: DisputeImage[];
}

export async function getDisputes(
  params?: GetDisputesParams
): Promise<Dispute[]> {
  const response = await axiosInstance.get<ApiResponse<Dispute[]>>(
    '/api/disputes',
    { params }
  );
  return response.data.result;
}
