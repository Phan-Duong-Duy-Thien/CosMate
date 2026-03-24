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
  shopName: string | null;
  description: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  // Profile completion fields
  shopAddressId: number | null;
  bio: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
  // Extended fields for shop profile (may come from different endpoints or mock)
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  messengerUrl?: string | null;
  websiteUrl?: string | null;
}

/**
 * Payload for updating provider profile
 */
export interface UpdateProviderProfilePayload {
  shopName: string;
  shopAddressId: number;
  bio: string;
  bankAccountNumber: string;
  bankName: string;
}

/**
 * Provider shop with full details (combines API + mock data)
 */
export interface ProviderShop extends ProviderProfile {
  // Mock/derived fields
  isFeatured?: boolean;
  totalRentals?: number;
  totalReviews?: number;
  rating?: number;
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
