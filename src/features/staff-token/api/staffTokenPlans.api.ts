/**
 * Staff AI token plans API — HTTP only.
 */
import axiosInstance from '@/services/axiosInstance';
import type { ApiResponse } from '@/features/admin/types';
import type { AiTokenPlan, CreateAiTokenPlanRequest, UpdateAiTokenPlanRequest } from '../types';

export type AiTokenPlanListParams = {
  isActive?: boolean;
  includeInactive?: boolean;
  all?: boolean;
};

/**
 * GET /api/ai-token-plans
 */
export async function getStaffAiTokenPlans(
  params?: AiTokenPlanListParams
): Promise<ApiResponse<AiTokenPlan[]>> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPlan[]>>('/api/ai-token-plans', {
    params,
  });
  return response.data;
}

/**
 * GET /api/ai-token-plans/{id}
 * Returns a single plan (including inactive) when authorized.
 */
export async function getStaffAiTokenPlanById(id: number): Promise<ApiResponse<AiTokenPlan>> {
  const response = await axiosInstance.get<ApiResponse<AiTokenPlan>>(`/api/ai-token-plans/${id}`);
  return response.data;
}

/**
 * POST /api/ai-token-plans
 */
export async function createStaffAiTokenPlan(
  body: CreateAiTokenPlanRequest
): Promise<ApiResponse<AiTokenPlan>> {
  const response = await axiosInstance.post<ApiResponse<AiTokenPlan>>('/api/ai-token-plans', body);
  return response.data;
}

/**
 * PUT /api/ai-token-plans/{id}
 */
export async function updateStaffAiTokenPlan(
  id: number,
  body: UpdateAiTokenPlanRequest
): Promise<ApiResponse<AiTokenPlan>> {
  const response = await axiosInstance.put<ApiResponse<AiTokenPlan>>(
    `/api/ai-token-plans/${id}`,
    body
  );
  return response.data;
}

/**
 * POST /api/ai-token-plans/{id}/activate
 */
export async function activateStaffAiTokenPlan(id: number): Promise<ApiResponse<unknown>> {
  const response = await axiosInstance.post<ApiResponse<unknown>>(
    `/api/ai-token-plans/${id}/activate`
  );
  return response.data;
}

/**
 * POST /api/ai-token-plans/{id}/deactivate
 */
export async function deactivateStaffAiTokenPlan(id: number): Promise<ApiResponse<unknown>> {
  const response = await axiosInstance.post<ApiResponse<unknown>>(
    `/api/ai-token-plans/${id}/deactivate`
  );
  return response.data;
}

/**
 * DELETE /api/ai-token-plans/{id}
 * Soft-delete a token plan.
 */
export async function deleteStaffAiTokenPlan(id: number): Promise<ApiResponse<unknown>> {
  const response = await axiosInstance.delete<ApiResponse<unknown>>(`/api/ai-token-plans/${id}`);
  return response.data;
}
