/**
 * Admin AI token purchases API — HTTP only.
 */
import axiosInstance from '@/services/axiosInstance';
import type { AiTokenPurchase, ApiResponse } from '../types';

/**
 * GET /api/ai-token-purchases
 */
export async function getAdminAiTokenPurchases(): Promise<AiTokenPurchase[]> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPurchase[]>>(
    '/api/ai-token-purchases'
  );
  return response.data.result ?? [];
}

/**
 * GET /api/ai-token-purchases/{id}
 */
export async function getAdminAiTokenPurchaseById(id: number): Promise<AiTokenPurchase> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPurchase>>(
    `/api/ai-token-purchases/${id}`
  );
  return response.data.result;
}
