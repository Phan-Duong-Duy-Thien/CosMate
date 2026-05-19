/**
 * Staff AI token purchases API — HTTP only.
 */
import axiosInstance from '@/services/axiosInstance';
import type { ApiResponse } from '@/features/admin/types';
import type { AiTokenPurchase } from '../types';

/**
 * GET /api/ai-token-purchases
 */
export async function getStaffAiTokenPurchases(): Promise<AiTokenPurchase[]> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPurchase[]>>(
    '/api/ai-token-purchases'
  );
  return response.data.result ?? [];
}

/**
 * GET /api/ai-token-purchases/{id}
 */
export async function getStaffAiTokenPurchaseById(id: number): Promise<AiTokenPurchase> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPurchase>>(
    `/api/ai-token-purchases/${id}`
  );
  return response.data.result;
}
