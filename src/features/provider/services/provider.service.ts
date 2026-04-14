/**
 * Provider Service
 * Business logic layer for provider operations
 */
import {
  getReviewsByProvider,
  updateProviderProfile,
  uploadProviderCoverImage,
  type ProviderReview,
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
 * Uses PUT /api/users/{userId}/avatar which accepts a `coverImage` field.
 * This works on BOTH the creation page (no providerId yet) and the update page
 * (provider already exists), as the BE routes by userId internally.
 */
export async function uploadProviderCoverImageSvc(userId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('coverImage', file);
  await axiosInstance.put(`/api/users/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
