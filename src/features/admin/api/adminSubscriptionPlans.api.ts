/**
 * Admin subscription plans API — HTTP only.
 */
import axiosInstance from '@/services/axiosInstance';
import type { AdminSubscriptionPlan, ApiResponse, CreateSubscriptionPlanRequest, UpdateSubscriptionPlanRequest } from '../types';

/**
 * GET /api/subscription-plans
 */
export async function getAdminSubscriptionPlans(): Promise<AdminSubscriptionPlan[]> {
  const response = await axiosInstance.get<ApiResponse<AdminSubscriptionPlan[]>>(
    '/api/subscription-plans'
  );
  return response.data.result ?? [];
}

/**
 * POST /api/subscription-plans
 */
export async function createAdminSubscriptionPlan(body: CreateSubscriptionPlanRequest): Promise<void> {
  await axiosInstance.post<ApiResponse<unknown>>('/api/subscription-plans', body);
}

/**
 * PUT /api/subscription-plans/{id}
 */
export async function updateAdminSubscriptionPlan(
  id: number,
  body: UpdateSubscriptionPlanRequest
): Promise<void> {
  await axiosInstance.put<ApiResponse<unknown>>(`/api/subscription-plans/${id}`, body);
}
