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
  tokenBalance?: number | null;
  coinBalance?: number | null;
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

/**
 * Subscription plan from GET /api/subscription-plans (admin catalog)
 */
export interface AdminSubscriptionPlan {
  id: number;
  name: string;
  billingCycle: string;
  cycleMonths: number;
  price: number;
  isActive: boolean;
  monthlyToken: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * POST /api/subscription-plans — tạo gói mới
 */
export interface CreateSubscriptionPlanRequest {
  name: string;
  billingCycle: string;
  cycleMonths: number;
  price: number;
  isActive: boolean;
  monthlyToken: number;
  description: string;
}

/** PUT /api/subscription-plans/{id} — cùng schema với tạo mới */
export type UpdateSubscriptionPlanRequest = CreateSubscriptionPlanRequest;
