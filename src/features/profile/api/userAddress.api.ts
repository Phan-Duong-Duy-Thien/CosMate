/**
 * User Address API
 * Handles GET and POST operations for user addresses
 */
import axiosInstance from '@/services/axiosInstance';
import type { UserAddress, CreateUserAddressPayload } from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

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
  payload: CreateUserAddressPayload
): Promise<UserAddress> {
  const response = await axiosInstance.post<ApiResponse<UserAddress>>(
    `/api/users/${userId}/addresses`,
    payload
  );
  return response.data.result;
}
