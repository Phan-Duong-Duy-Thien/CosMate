/**
 * Cosplayer AI token plans catalog — HTTP only.
 */
import axiosInstance from '@/services/axiosInstance';
import type { ApiResponse } from '@/features/admin/types';
import type { AiTokenPlan } from '../types';

/**
 * GET /api/ai-token-plans — storefront catalog (active plans).
 */
export async function getAiTokenPlans(): Promise<ApiResponse<AiTokenPlan[]>> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPlan[]>>('/api/ai-token-plans');
  return response.data;
}
