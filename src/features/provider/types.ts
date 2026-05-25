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
  shopAddressId: number | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
  verified: boolean;
  completedOrders: number;
  totalRating: number;
  totalReviews: number;
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
  /** From BE admin catalog (optional). */
  cycleMonths?: number;
  billingCycle?: string;
  /** Precomputed display label for activation UI. */
  cycleLabel?: string;
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

/**
 * Current provider subscription summary from GET /api/providers/id/{id}/subscriptions-info
 */
export interface ProviderSubscriptionInfo {
  currentPlanName: string;
  currentDaysRemaining: number;
  totalRemainingDays: number;
}

// Placeholder to allow component file creation
export type PaymentMethod = 'VNPAY' | 'MOMO';
