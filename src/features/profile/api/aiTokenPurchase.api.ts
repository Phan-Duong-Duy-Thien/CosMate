/**
 * AI token purchase — HTTP only.
 */
import axiosInstance from '@/services/axiosInstance';
import type { ApiResponse } from '@/features/admin/types';
import type { AiTokenPurchase, InitiateAiTokenPurchaseParams } from '../types';

/**
 * POST /api/ai-token-purchases/initiate — query: planId, paymentMethod, returnUrl, IsMobile
 */
export async function initiateAiTokenPurchase(
  params: InitiateAiTokenPurchaseParams
): Promise<ApiResponse<string>> {
  const response = await axiosInstance.post<ApiResponse<string>>(
    '/api/ai-token-purchases/initiate',
    null,
    {
      params: {
        planId: params.planId,
        paymentMethod: params.paymentMethod,
        returnUrl: params.returnUrl,
        IsMobile: params.isMobile ?? false,
      },
    }
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
