/**
 * Provider Service
 * Business logic layer for provider operations
 */
import {
  getReviewsByProvider,
  updateProviderProfile,
  type ProviderReview,
  type UpdateProviderPayload,
} from '../api/provider.api';
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
