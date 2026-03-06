/**
 * User Address API
 * Handles GET and POST operations for user addresses
 */
import axiosInstance from '@/services/axiosInstance';
import type { ApiResponse } from '@/features/admin/types';
import type { UserAddress, UpsertUserAddressPayload } from '../types';

/**
 * Get user addresses
 * @param userId - User ID
 * @returns Array of user addresses
 */
export async function getUserAddresses(userId: number): Promise<UserAddress[]> {
  const response = await axiosInstance.get<ApiResponse<UserAddress[]>>(
    `/api/users/${userId}/addresses`
  );
  return response.data.result;
}

/**
 * Create a new user address
 * @param userId - User ID
 * @param payload - Address data
 * @returns Created address
 */
export async function createUserAddress(
  userId: number,
  payload: UpsertUserAddressPayload
): Promise<UserAddress> {
  const response = await axiosInstance.post<ApiResponse<UserAddress>>(
    `/api/users/${userId}/addresses`,
    payload
  );
  return response.data.result;
}

/**
 * Update an existing user address
 * @param userId - User ID
 * @param addressId - Address ID
 * @param payload - Updated address data
 * @returns Updated address
 */
export async function updateUserAddress(
  userId: number,
  addressId: number,
  payload: UpsertUserAddressPayload
): Promise<UserAddress> {
  const response = await axiosInstance.put<ApiResponse<UserAddress>>(
    `/api/users/${userId}/addresses/${addressId}`,
    payload
  );
  return response.data.result;
}

/**
 * Delete an existing user address
 * @param userId - User ID
 * @param addressId - Address ID
 */
export async function deleteUserAddress(
  userId: number,
  addressId: number
): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(
    `/api/users/${userId}/addresses/${addressId}`
  );
}
