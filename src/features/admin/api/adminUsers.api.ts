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

/**
 * Export users to Excel
 */
export async function exportUsersExcel(): Promise<Blob> {
  const response = await axiosInstance.get('/api/admin/users/export', {
    responseType: 'blob', // Bắt buộc phải có để nhận file nhị phân
  });
  return response.data;
}

/**
 * Download template for import
 */
export async function downloadUserTemplate(): Promise<Blob> {
  const response = await axiosInstance.get('/api/import/template?entity=user', {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Import users from Excel
 */
export async function importUsersExcel(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post('/api/admin/users/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Get admin users page
 */
export async function getAdminUsersPage(params: any): Promise<any> {
  const response = await axiosInstance.get('/api/admin/users', { params });
  return response.data; 
}