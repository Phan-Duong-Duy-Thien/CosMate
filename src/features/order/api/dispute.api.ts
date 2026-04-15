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

export interface DisputeImage {
  id: number;
  disputeImageUrl: string;
}

export interface DisputeResult {
  penaltyAmount: number | null;
  penaltyPercent: number | null;
}

export interface CreateDisputeResponse {
  id: number;
  order: {
    id: number;
    status: string;
    [key: string]: unknown;
  };
  reason: string;
  status: string;
  images: DisputeImage[];
  result: DisputeResult | null;
}

export interface CreateDisputePayload {
  reason: string;
  files: string[];
}

/**
 * Create a dispute for an order
 * @param orderId - The order ID (passed as query param)
 * @param payload - { reason, files: string[] } (files = pre-uploaded image URLs)
 */
export async function createDispute(
  orderId: number,
  payload: CreateDisputePayload
): Promise<CreateDisputeResponse> {
  console.log('[DISPUTE PAYLOAD]', payload);

  const response = await axiosInstance.post<ApiResponse<CreateDisputeResponse>>(
    '/api/disputes',
    payload,
    { params: { orderId } }
  );

  console.log('[DISPUTE RESPONSE]', response.data.result);
  return response.data.result;
}
