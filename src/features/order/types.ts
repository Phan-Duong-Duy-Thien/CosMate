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
  /** Display name for checkout breadcrumb (set on detail page). */
  costumeName?: string;
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
// Matches BE: POST /api/orders returns full order object
// paymentUrl: null for WALLET (no external redirect), string for MoMo/VNPay
// status: "PAID" if BE processed payment (e.g. WALLET success, MoMo resultCode=0)
//         "UNPAID" if payment still pending
export interface CreateOrderResponse {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: OrderStatus;
  totalAmount: number;
  totalDepositAmount: number;
  createdAt: string;
  rentDate: string;
  paymentUrl: string | null;
}

// Create order params (for service layer)
export interface CreateOrderParams {
  cosplayerId: number;
  costumeId: number;
  rentDay: number;
  rentStart: string; // date-only format YYYY-MM-DD
  paymentMethod: PaymentMethod;
  returnUrl?: string;
  cosplayerAddressId: number;
  selectedAccessoryIds: number[];
  selectedRentalOptionId: number | null;
}

// Order item from GET /api/orders/user/{userId}
export type OrderStatus =
  | 'UNPAID'
  | 'PAID'
  | 'PREPARING'
  | 'SHIPPING_OUT'
  | 'DELIVERING_OUT'
  | 'IN_USE'
  | 'SHIPPING_BACK'
  | 'RETURNED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTE'
  | 'EXTENDING';

export interface OrderItem {
  id: number;
  orderType: string; // 'RENT_COSTUME' = costume/rental order, 'RENT_SERVICE' = service order
  status: OrderStatus;
  totalAmount: number;
  depositAmount: number;
  rentDay: number;
  rentStart: string;
  rentEnd: string;
  costumeId: number;
  costumeName: string;
  costumeImage: string;
  cosplayerId: number;
  cosplayerName: string;
  createdAt: string;
  updatedAt: string;
}

// Order detail types from GET /api/orders/{id}
export interface OrderDetailItem {
  id: number;
  orderId: number;
  costumeId: number;
  size: string;
  numberOfItems: number;
  rentDay: number;
  rentStart: string;
  rentEnd: string;
  returnDay: string | null;
  depositAmount: number;
  rentAmount: number;
  surchargeAmount: number;
  accessoriesAmount: number;
  rentOptionAmount: number;
}

export interface OrderSurcharge {
  id: number;
  orderId: number;
  costumeId: number;
  name: string;
  description: string;
  price: number;
}

export interface OrderAddress {
  id: number;
  orderId: number;
  addressFrom: 'COSPLAYER' | 'PROVIDER';
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
}

export interface OrderAccessory {
  id: number;
  accessoryId: number;
  name: string;
  imageUrl: string;
  price: number;
}

export interface OrderRentalOption {
  id: number;
  optionName: string;
  price: number;
  description: string;
}

export interface OrderImage {
  id: number;
  imageUrl: string;
  stage: string;
  note: string;
  confirm: boolean;
}

export interface OrderTracking {
  id: number;
  trackingCode: string;
  trackingStatus: string;
  stage: string;
  createdAt: string;
}

export interface OrderDetail {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  details: OrderDetailItem[];
  surcharges: OrderSurcharge[];
  addresses: OrderAddress[];
  accessories: OrderAccessory[];
  rentalOptions: OrderRentalOption[];
  images: OrderImage[];
  trackings: OrderTracking[];
}