/**
 * Provider Service
 * Business logic layer for provider operations
 */
import { getReviewByOrderId, type ReviewItem } from '@/features/costume-rental/api/review.api';
import {
  getProviderReviewByReviewId,
  getReviewsByProvider,
  updateProviderProfile,
  uploadProviderCoverImage,
  type ProviderReview,
  type ProviderReviewDetail,
  type UpdateProviderPayload,
} from '../api/provider.api';
import { uploadAvatar } from '@/features/profile/services/userProfile.service';
import {
  getUserAddresses,
  getAddressById,
  createUserAddress,
  type UserAddress,
  type UpsertUserAddressPayload,
} from '@/features/profile/api/userAddress.api';
import { createUserAddress as createUserAddressSvc } from '@/features/profile/services/userAddress.service';
import axiosInstance from '@/services/axiosInstance';

/**
 * Get a single user address by ID
 */
export async function getProviderShopAddress(userId: number, addressId: number): Promise<UserAddress> {
  return getAddressById(userId, addressId);
}
import type { UpdateProviderProfilePayload } from '../types';

/**
 * Fetch provider reviews
 */
export async function fetchProviderReviews(providerId: number): Promise<ProviderReview[]> {
  return getReviewsByProvider(providerId);
}

/** Normalized detail for provider review modal (merged list row + API). */
export interface ProviderReviewDetailNormalized {
  id: number;
  orderId: number;
  rating: number;
  comment: string;
  createdAt: string;
  username: string | null;
  cosplayerName: string | null;
  avatarUrl: string | null;
  imageUrls: string[];
  providerReply: string | null;
  repliedAt: string | null;
}

function imageUrlsFromUnknown(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (typeof img === 'string') return img;
      if (
        img &&
        typeof img === 'object' &&
        'url' in img &&
        typeof (img as { url: string }).url === 'string'
      ) {
        return (img as { url: string }).url;
      }
      return '';
    })
    .filter(Boolean);
}

function normalizeProviderReviewDetail(
  primary: ProviderReview | ProviderReviewDetail | ReviewItem,
  fallback: ProviderReview,
): ProviderReviewDetailNormalized {
  const username =
    'username' in primary &&
    primary.username != null &&
    String(primary.username).trim() !== ''
      ? String(primary.username)
      : null;
  const cosplayerName =
    'cosplayerName' in primary &&
    primary.cosplayerName != null &&
    String(primary.cosplayerName).trim() !== ''
      ? String(primary.cosplayerName)
      : null;
  const avatarUrl =
    'avatarUrl' in primary &&
    primary.avatarUrl != null &&
    String(primary.avatarUrl).trim() !== ''
      ? String(primary.avatarUrl)
      : null;
  let urls = imageUrlsFromUnknown(primary.images);
  if (urls.length === 0) urls = imageUrlsFromUnknown(fallback.images);

  const primaryReply =
    'providerReply' in primary && primary.providerReply != null
      ? String(primary.providerReply).trim()
      : '';
  const fallbackReply =
    fallback.providerReply != null ? String(fallback.providerReply).trim() : '';
  const providerReply = primaryReply || fallbackReply || null;

  const primaryRepliedAt =
    'repliedAt' in primary && primary.repliedAt != null ? String(primary.repliedAt) : null;
  const repliedAt = primaryRepliedAt ?? fallback.repliedAt ?? null;

  return {
    id: primary.id ?? fallback.id,
    orderId: primary.orderId ?? fallback.orderId,
    rating: primary.rating ?? fallback.rating,
    comment: primary.comment ?? fallback.comment ?? '',
    createdAt: primary.createdAt ?? fallback.createdAt,
    username,
    cosplayerName,
    avatarUrl,
    imageUrls: urls,
    providerReply,
    repliedAt,
  };
}

/**
 * Load full review for dashboard: order endpoint first, then by review id, then list row fallback.
 */
export async function fetchProviderReviewDetailForDashboard(
  row: ProviderReview,
): Promise<ProviderReviewDetailNormalized> {
  const byOrder = await getReviewByOrderId(row.orderId);
  if (byOrder) {
    return normalizeProviderReviewDetail(byOrder, row);
  }
  const byId = await getProviderReviewByReviewId(row.id);
  if (byId) {
    return normalizeProviderReviewDetail(byId, row);
  }
  return normalizeProviderReviewDetail(row, row);
}

/**
 * Check if provider profile is complete
 */
export function isProviderProfileComplete(profile: {
  shopName: string | null;
  shopAddressId: number | null;
  bio: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
}): boolean {
  return !!(
    profile.shopName &&
    profile.shopAddressId &&
    profile.bio &&
    profile.bankAccountNumber &&
    profile.bankName
  );
}

/**
 * Update provider profile
 */
export async function saveProviderProfile(
  providerId: number,
  payload: UpdateProviderProfilePayload
): Promise<void> {
  const apiPayload: UpdateProviderPayload = {
    shopName: payload.shopName,
    shopAddressId: payload.shopAddressId,
    bio: payload.bio,
    bankAccountNumber: payload.bankAccountNumber,
    bankName: payload.bankName,
  };
  return updateProviderProfile(providerId, apiPayload);
}

/**
 * Fetch user addresses (for shop address selection in profile completion)
 */
export async function fetchUserAddresses(userId: number): Promise<UserAddress[]> {
  return getUserAddresses(userId);
}

/**
 * Create a new user address (for shop address selection in profile completion)
 */
export async function createUserAddressForShop(
  userId: number,
  formData: {
    name: string;
    phone: string;
    provinceCode: number | null;
    districtCode: number | null;
    streetAddress: string;
    addressName: string;
  },
  provinceName: string,
  districtName: string
): Promise<UserAddress> {
  return createUserAddressSvc(userId, formData, provinceName, districtName);
}

/**
 * Upload provider avatar — reuses cosplayer avatar API via userId
 */
export async function uploadProviderAvatar(userId: number, file: File): Promise<void> {
  await uploadAvatar(userId, file);
}

/**
 * Upload provider cover image
 *
 * Uses PUT /api/providers/{providerId}/cover-image which accepts a `coverImage` field.
 */
export async function uploadProviderCoverImageSvc(providerId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('coverImage', file);
  await axiosInstance.put(`/api/providers/${providerId}/cover-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
