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

/**
 * Provider review types
 */
export interface ProviderReview {
  id: number;
  orderId: number;
  rating: number;
  comment: string;
  createdAt: string;
  images: {
    id: number;
    url: string;
  }[];
}

/**
 * GET /api/reviews/provider/{providerId}
 * Returns reviews for a specific provider.
 */
export async function getReviewsByProvider(providerId: number): Promise<ProviderReview[]> {
  const response = await axiosInstance.get<ApiResponse<ProviderReview[]>>(
    `/api/reviews/provider/${providerId}`
  );
  return response.data.result;
}

/**
 * PUT /api/providers/{id}
 * Updates the provider profile fields.
 */
export interface UpdateProviderPayload {
  shopName: string;
  shopAddressId: number;
  bio: string;
  bankAccountNumber: string;
  bankName: string;
}

export async function updateProviderProfile(
  providerId: number,
  payload: UpdateProviderPayload
): Promise<void> {
  await axiosInstance.put(`/api/providers/${providerId}`, payload);
}
