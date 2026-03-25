/**
 * Admin feature types
 */

/**
 * Admin user model from backend (list response)
 */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  status: string;
  role?: string;
  roles?: string[];
  createdAt: string;
}

/**
 * User profile from GET /api/users/{id}/profile (includes avatarUrl)
 */
export interface AdminUserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  status: 'ACTIVE' | 'BANNED' | 'INACTIVE' | string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * API response without result payload
 */
export interface ApiResponseVoid {
  code: number;
  message: string;
}

/**
 * User action types
 */
export type UserActionType = 'ban' | 'unban' | 'lock' | 'unlock';
