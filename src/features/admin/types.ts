/**
 * Admin feature types
 */

/**
 * Admin user model from backend
 */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  status: string;
  roles: string[];
  createdAt: string;
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
