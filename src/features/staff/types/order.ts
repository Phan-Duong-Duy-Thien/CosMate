import type {
  OrderAccessory,
  OrderAddress,
  OrderDetailItem,
  OrderImage,
  OrderSurcharge,
  OrderTracking,
  OrderStatus,
} from '@/features/order/types';

export interface StaffOrderTransaction {
  id: number;
  amount: number;
  type: string;
  status: string;
  paymentMethod: string;
  walletId?: number;
  orderId: number;
  createdAt: string;
}

/** Full order from GET /api/orders/{id} (rentalOptions omitted in UI). */
export interface StaffOrderDetail {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: OrderStatus | string;
  totalAmount: number;
  totalDepositAmount: number;
  createdAt: string;
  rentDate: string | null;
  details: OrderDetailItem[];
  surcharges: OrderSurcharge[];
  addresses: OrderAddress[];
  accessories: OrderAccessory[];
  images: OrderImage[];
  trackings: OrderTracking[];
  transactions: StaffOrderTransaction[];
}

export type { OrderListRow } from '@/features/order/utils/normalizeOrderListRow';
