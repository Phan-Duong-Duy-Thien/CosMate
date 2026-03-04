/**
 * Subscription API
 * HTTP layer only — no business logic.
 */
import axiosInstance from '@/services/axiosInstance';
import type { SubscriptionPlan, SubscribeRequest } from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * GET /api/subscription-plans
 * Returns all subscription plans.
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await axiosInstance.get<ApiResponse<SubscriptionPlan[]>>(
    '/api/subscription-plans'
  );
  console.log('[getSubscriptionPlans] raw response.data:', response.data);
  return response.data.result;
}

/**
 * POST /api/providers/subscriptions/subscribe
 * Initiates a subscription payment and returns the payment URL.
 */
export async function subscribeProvider(payload: SubscribeRequest): Promise<string> {
  console.log('[subscribeProvider] payload:', payload);
  const response = await axiosInstance.post<ApiResponse<string>>(
    '/api/providers/subscriptions/subscribe',
    payload
  );
  const raw = response.data;
  console.log('[subscribeProvider] full response.data:', JSON.stringify(raw));
  console.log('[subscribeProvider] result field:', raw.result, '| type:', typeof raw.result);
  // Backend trả result là string URL trực tiếp
  return raw.result;
}
