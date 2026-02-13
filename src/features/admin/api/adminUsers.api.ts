/**
 * Admin Users API
 * 
 * HTTP layer for admin user management
 * All requests go through axiosInstance
 */

import axiosInstance from '@/services/axiosInstance';
import type { AdminUser, AdminUserProfile, ApiResponse, ApiResponseVoid } from '../types';

/**
 * Fetch all users
 */
export async function getUsers(): Promise<ApiResponse<AdminUser[]>> {
  const response = await axiosInstance.get<ApiResponse<AdminUser[]>>('/api/users');
  return response.data;
}

/**
 * Fetch user profile by ID (includes avatarUrl)
 */
export async function getUserProfile(userId: number): Promise<ApiResponse<AdminUserProfile>> {
  const response = await axiosInstance.get<ApiResponse<AdminUserProfile>>(
    `/api/users/${userId}/profile`
  );
  return response.data;
}

/**
 * Ban a user by ID
 */
export async function banUser(id: number): Promise<ApiResponseVoid> {
  const response = await axiosInstance.post<ApiResponseVoid>(`/api/users/${id}/ban`);
  return response.data;
}

/**
 * Unban a user by ID
 */
export async function unbanUser(id: number): Promise<ApiResponseVoid> {
  const response = await axiosInstance.post<ApiResponseVoid>(`/api/users/${id}/unban`);
  return response.data;
}

/**
 * Lock a user by ID
 */
export async function lockUser(id: number): Promise<ApiResponseVoid> {
  const response = await axiosInstance.post<ApiResponseVoid>(`/api/users/${id}/lock`);
  return response.data;
}

/**
 * Unlock a user by ID
 */
export async function unlockUser(id: number): Promise<ApiResponseVoid> {
  const response = await axiosInstance.post<ApiResponseVoid>(`/api/users/${id}/unlock`);
  return response.data;
}
