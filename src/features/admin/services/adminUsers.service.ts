/**
 * Admin Users Service
 * 
 * Business logic layer for admin user management
 * Validates API responses and throws readable errors
 */

import * as api from '../api/adminUsers.api';
import type { AdminUser, AdminUserProfile } from '../types';

/**
 * List all users
 * @throws Error if API call fails or returns non-zero code
 */
export async function listUsers(): Promise<AdminUser[]> {
  const response = await api.getUsers();
  
  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể tải danh sách người dùng');
  }
  
  return response.result;
}

/**
 * Get user profile by ID (includes avatarUrl)
 * @throws Error if API call fails or returns non-zero code
 */
export async function getUserProfile(userId: number): Promise<AdminUserProfile> {
  const response = await api.getUserProfile(userId);
  
  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể tải thông tin người dùng');
  }
  
  return response.result;
}

/**
 * Ban a user
 * @throws Error if API call fails or returns non-zero code
 */
export async function ban(id: number): Promise<void> {
  const response = await api.banUser(id);
  
  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể ban người dùng');
  }
}

/**
 * Unban a user
 * @throws Error if API call fails or returns non-zero code
 */
export async function unban(id: number): Promise<void> {
  const response = await api.unbanUser(id);
  
  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể mở ban người dùng');
  }
}

/**
 * Lock a user
 * @throws Error if API call fails or returns non-zero code
 */
export async function lock(id: number): Promise<void> {
  const response = await api.lockUser(id);
  
  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể khoá người dùng');
  }
}

/**
 * Unlock a user
 * @throws Error if API call fails or returns non-zero code
 */
export async function unlock(id: number): Promise<void> {
  const response = await api.unlockUser(id);
  
  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể mở khoá người dùng');
  }
}

/**
 * Export users to Excel
 */
export async function exportUsersExcel(): Promise<Blob> {
  return await api.exportUsersExcel();
}

/**
 * Download template for import
 */
export async function downloadUserTemplate(): Promise<Blob> {
  return await api.downloadUserTemplate();
}

/**
 * Import users from Excel
 */
export async function importUsersExcel(file: File): Promise<any> {
  return await api.importUsersExcel(file);
}

/**
 * Get admin users page
 */
export async function getAdminUsersPage(params: any): Promise<any> {
  return await api.getAdminUsersPage(params);
}