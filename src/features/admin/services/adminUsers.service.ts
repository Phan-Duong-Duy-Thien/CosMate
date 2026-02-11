/**
 * Admin Users Service
 * 
 * Business logic layer for admin user management
 * Validates API responses and throws readable errors
 */

import * as api from '../api/adminUsers.api';
import type { AdminUser } from '../types';

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
