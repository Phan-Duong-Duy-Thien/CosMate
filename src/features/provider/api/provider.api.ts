/**
 * Provider API
 * HTTP layer only — no business logic.
 */
import axiosInstance from '@/services/axiosInstance';
import type { ProviderProfile } from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * GET /api/providers/user/{userId}
 * Returns the provider profile for the given user ID.
 */
export async function getProviderByUserId(userId: number): Promise<ProviderProfile> {
  console.log('[getProviderByUserId] userId:', userId);
  const response = await axiosInstance.get<ApiResponse<ProviderProfile>>(
    `/api/providers/user/${userId}`
  );
  console.log('[getProviderByUserId] raw response.data:', response.data);
  return response.data.result;
}
