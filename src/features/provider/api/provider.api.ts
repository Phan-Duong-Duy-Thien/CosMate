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
export interface ProviderStatisticsLabelValue {
  label: string;
  value: number;
}

export interface ProviderStatistics {
  totalCostumes: number;
  totalOrders: number;
  totalOrderItems: number;
  completedOrders: number;
  totalRevenue: number;
  revenueByMonth: ProviderStatisticsLabelValue[];
  revenueByQuarter: ProviderStatisticsLabelValue[];
}

/**
 * GET /api/providers/{id}/statistics
 * Provider dashboard statistics (optional months query for chart range).
 */
export async function getProviderStatistics(
  providerId: number,
  months?: number
): Promise<ProviderStatistics> {
  const response = await axiosInstance.get<ApiResponse<ProviderStatistics>>(
    `/api/providers/${providerId}/statistics`,
    { params: months != null ? { months } : undefined }
  );
  if (response.data.code !== 0) {
    throw new Error(response.data.message || 'Không thể tải thống kê');
  }
  return response.data.result;
}

type RawProviderProfile = Record<string, unknown>;

/** BE may use snake_case; `id` is provider record id, `userId` is account id. */
export function normalizeProviderProfile(raw: RawProviderProfile): ProviderProfile {
  const id = Number(raw.id) || 0;
  const userId = Number(raw.userId ?? raw.user_id) || 0;

  return {
    id,
    userId,
    shopName: (raw.shopName ?? raw.shop_name ?? null) as string | null,
    shopAddressId: (() => {
      const n = Number(raw.shopAddressId ?? raw.shop_address_id);
      return Number.isFinite(n) ? n : null;
    })(),
    avatarUrl: (raw.avatarUrl ?? raw.avatar_url ?? null) as string | null,
    coverImageUrl: (raw.coverImageUrl ?? raw.cover_image_url ?? null) as string | null,
    bio: (raw.bio ?? null) as string | null,
    bankAccountNumber: (raw.bankAccountNumber ?? raw.bank_account_number ?? null) as string | null,
    bankName: (raw.bankName ?? raw.bank_name ?? null) as string | null,
    verified: Boolean(raw.verified),
    completedOrders: Number(raw.completedOrders ?? raw.completed_orders) || 0,
    totalRating: Number(raw.totalRating ?? raw.total_rating) || 0,
    totalReviews: Number(raw.totalReviews ?? raw.total_reviews) || 0,
  };
}

export async function getProviderByUserId(userId: number): Promise<ProviderProfile> {
  const response = await axiosInstance.get<ApiResponse<RawProviderProfile>>(
    `/api/providers/user/${userId}`,
  );
  const { code, message, result } = response.data;
  if (code !== 0 || !result) {
    throw new Error(message || 'Không thể tải hồ sơ nhà cung cấp.');
  }
  return normalizeProviderProfile(result);
}

/**
 * Provider review types
 */
export interface ProviderReview {
  id: number;
  orderId: number;
  username?: string | null;
  userName?: string | null;
  avatarUrl?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  images: {
    id: number;
    url: string;
  }[];
  providerReply?: string | null;
  repliedAt?: string | null;
  repliedByProviderId?: number | null;
}

/** Detail payload (GET by id) — may include reviewer fields from backend */
export type ProviderReviewDetail = ProviderReview & {
  username?: string | null;
  avatarUrl?: string | null;
  cosplayerName?: string | null;
};

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
 * GET /api/reviews/{reviewId}
 * Full review for detail modal (images + optional reviewer info). Safe no-op if route missing.
 */
export async function getProviderReviewByReviewId(reviewId: number): Promise<ProviderReviewDetail | null> {
  try {
    const response = await axiosInstance.get<ApiResponse<ProviderReviewDetail>>(`/api/reviews/${reviewId}`);
    if (response.data.code !== 0) return null;
    return response.data.result ?? null;
  } catch {
    return null;
  }
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

/**
 * PUT /api/providers/{id}/cover-image
 * Upload provider cover image.
 */
export async function uploadProviderCoverImage(providerId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('coverImage', file);
  await axiosInstance.put(`/api/providers/${providerId}/cover-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

