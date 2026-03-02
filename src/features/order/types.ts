/**
 * Order Feature Types
 * Types for checkout and order creation
 */

// Re-export UserAddress from profile feature
export type { UserAddress } from '@/features/profile/types';

// Payment method enum
export type PaymentMethod = 'MOMO' | 'VNPAY' | 'WALLET';

// Rental draft - stored in sessionStorage for checkout
export interface RentalDraft {
  costumeId: number;
  rentDay: number;
  rentStart: string; // ISO format-ready (YYYY-MM-DD)
  selectedAccessoryIds: number[];
  selectedRentalOptionId: number | null;
}

// Create order request payload
export interface CreateOrderPayload {
  costumeId: number;
  rentDay: number;
  rentStart: string; // ISO format: YYYY-MM-DDTHH:mm:ss
  paymentMethod: PaymentMethod;
  returnUrl: string;
  cosplayerAddressId: number;
  selectedAccessoryIds: number[];
  selectedRentalOptionId: number | null;
}

// Create order response
export interface CreateOrderResponse {
  id: number;
  status: 'UNPAID';
  totalAmount: number;
  paymentUrl: string;
}

// Create order params (for service layer)
export interface CreateOrderParams {
  cosplayerId: number;
  costumeId: number;
  rentDay: number;
  rentStart: string; // date-only format YYYY-MM-DD
  paymentMethod: PaymentMethod;
  returnUrl: string;
  cosplayerAddressId: number;
  selectedAccessoryIds: number[];
  selectedRentalOptionId: number | null;
}
