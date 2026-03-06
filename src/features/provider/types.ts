/**
 * Provider Feature Types
 * Defines types for provider profile, subscription plans, and related data
 */

/**
 * Provider profile response from API
 */
export interface ProviderProfile {
  id: number;
  userId: number;
  shopName: string;
  description: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription plan from API
 */
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string | null;
  price: number;
  billingCycleMonths: number;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscribe request payload
 */
export interface SubscribeRequest {
  subscriptionPlanId: number;
  returnUrl: string;
  paymentMethod: 'VNPAY' | 'MOMO';
}

/**
 * Subscribe response from API
 * result is a plain string (the payment URL), not an object.
 */
export type SubscribeResponse = string;

// Placeholder to allow component file creation
export type PaymentMethod = 'VNPAY' | 'MOMO';
