/**
 * AI token purchase — HTTP only.
 */
import axiosInstance from '@/services/axiosInstance';
import type { ApiResponse } from '@/features/admin/types';
import type { AiTokenPurchase, InitiateAiTokenPurchaseParams } from '../types';

/**
 * POST /api/ai-token-purchases/initiate — query: planId, paymentMethod, returnUrl?, IsMobile
 */
export async function initiateAiTokenPurchase(
  params: InitiateAiTokenPurchaseParams
): Promise<ApiResponse<unknown>> {
  const queryParams: Record<string, string | number | boolean> = {
    planId: params.planId,
    paymentMethod: params.paymentMethod,
    IsMobile: params.isMobile ?? false,
  };

  if (params.returnUrl) {
    queryParams.returnUrl = params.returnUrl;
  }

  const response = await axiosInstance.post<ApiResponse<unknown>>(
    '/api/ai-token-purchases/initiate',
    null,
    { params: queryParams }
  );
  return response.data;
}

/**
 * GET /api/ai-token-purchases/user/{userId}
 */
export async function getUserAiTokenPurchases(
  userId: number
): Promise<ApiResponse<AiTokenPurchase[]>> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPurchase[]>>(
    `/api/ai-token-purchases/user/${userId}`
  );
  return response.data;
}
