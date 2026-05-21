/**
 * Order API
 * Handles order creation API calls
 */
import axiosInstance from '@/services/axiosInstance';
import type { CreateOrderPayload, CreateOrderResponse, OrderItem, OrderDetail } from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Ship order response types
interface ShipImage {
  id: number;
  imageUrl: string;
  stage: string;
  note: string;
  confirm: boolean;
}

/**
 * Raw API response shape from GET /api/orders/user/{userId} and /api/orders/provider/{providerId}
 */
interface RawOrderItem {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: string;
  totalAmount: number;
  totalDepositAmount: number;
  createdAt: string;
  updatedAt?: string;
  cosplayerName?: string;
  details: Array<{
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
    rentDiscount: number;
  }>;
}

/** Map raw API order to OrderItem shape */
function mapRawOrder(raw: RawOrderItem): OrderItem {
  const detail = raw.details?.[0];
  return {
    id: raw.id,
    orderType: raw.orderType,
    status: raw.status as OrderItem['status'],
    totalAmount: raw.totalAmount,
    depositAmount: raw.totalDepositAmount,
    rentDay: detail?.rentDay ?? 0,
    rentStart: detail?.rentStart ?? '',
    rentEnd: detail?.rentEnd ?? '',
    costumeId: detail?.costumeId ?? 0,
    costumeName: '', // populated by usePurchaseOrders batch-fetch
    costumeImage: '',
    cosplayerId: raw.cosplayerId,
    cosplayerName: raw.cosplayerName ?? '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt ?? raw.createdAt,
  };
}

interface ShipTracking {
  id: number;
  trackingCode: string;
  trackingStatus: string;
  stage: string;
  createdAt: string;
}

interface ShipOrderResult {
  images: ShipImage[];
  tracking: ShipTracking;
}

/**
 * Create a new order
 * @param cosplayerId - The cosplayer user ID
 * @param payload - Order creation data
 * @returns Created order with payment URL
 */
export async function createOrder(
  cosplayerId: number,
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const response = await axiosInstance.post<ApiResponse<CreateOrderResponse>>(
    `/api/orders?cosplayerId=${cosplayerId}`,
    payload
  );
  return response.data.result;
}

/**
 * Get all orders for a provider
 * @param providerId - The provider ID
 * @returns List of orders for the provider
 */
export async function getOrdersByProvider(providerId: number): Promise<OrderItem[]> {
  const response = await axiosInstance.get<ApiResponse<RawOrderItem[]>>(
    `/api/orders/provider/${providerId}`
  );
  return response.data.result.map(mapRawOrder);
}

/**
 * Get all orders for a user (paginated)
 * @param userId - The user ID
 * @param page - Page number (1-based), default 1
 * @param size - Page size, default 10
 * @returns Paginated orders response
 */
export async function getOrdersByUserId(
  userId: number,
  page: number = 1,
  size: number = 10
): Promise<{ orders: OrderItem[]; total: number; isPaginated: boolean }> {
  const response = await axiosInstance.get<ApiResponse<RawOrderItem[] | { content: RawOrderItem[]; totalElements: number }>>(
    `/api/orders/user/${userId}`,
    {
      params: { page, size },
    }
  );
  const result = response.data.result;
  if (Array.isArray(result)) {
    return {
      orders: result.map(mapRawOrder),
      total: result.length,
      isPaginated: false,
    };
  }
  return {
    orders: result.content.map(mapRawOrder),
    total: result.totalElements,
    isPaginated: true,
  };
}

/**
 * Fetch all orders for a user (client-side pagination + filtering).
 * Use this when BE does NOT support pagination — fetches everything client-side.
 */
export async function getAllOrdersByUserId(userId: number): Promise<OrderItem[]> {
  const response = await axiosInstance.get<ApiResponse<RawOrderItem[]>>(
    `/api/orders/user/${userId}`
  );
  return response.data.result.map(mapRawOrder);
}

/**
 * Prepare an order (update status to PREPARING)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function prepareOrder(orderId: number): Promise<OrderItem> {
  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/prepare`
  );
  return response.data.result;
}

/**
 * Ship an order (update status to SHIPPING_OUT)
 * @param orderId - The order ID
 * @param trackingCode - The tracking code for shipment
 * @param notes - Array of notes mapped to images by index
 * @param images - Array of image files
 * @returns Ship order result with images and tracking info
 */
export interface ShipReturnQueryOptions {
  autoCreateGhn?: boolean;
}

export async function shipOrder(
  orderId: number,
  trackingCode: string,
  shippingCarrierName: string,
  notes: string[],
  images: File[],
  options?: ShipReturnQueryOptions
): Promise<ShipOrderResult> {
  const formData = new FormData();

  images.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post<ApiResponse<ShipOrderResult>>(
    `/api/orders/${orderId}/ship`,
    formData,
    {
      params: {
        trackingCode: trackingCode || undefined,
        shippingCarrierName: shippingCarrierName || undefined,
        notes,
        autoCreateGhn: options?.autoCreateGhn ?? false,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.result;
}

/**
 * Deliver out an order (update status to DELIVERING_OUT)
 * @param orderId - The order ID
 * @returns Updated order with tracking info
 */
export async function deliverOutOrder(orderId: number): Promise<OrderItem> {
  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/deliver-out`
  );
  return response.data.result;
}

/**
 * Confirm delivery of an order (update status to IN_USE)
 * @param orderId - The order ID
 * @param images - Array of image files
 * @param notes - Array of notes (one per image, can be empty strings)
 * @returns Updated order
 */
export async function confirmDeliveryOrder(
  orderId: number,
  images: File[],
  notes: string[]
): Promise<OrderItem> {
  const formData = new FormData();

  // Append each image with the same key 'images'
  images.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/confirm-delivery`,
    formData,
    {
      params: {
        notes: notes,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.result;
}

/**
 * Get order detail by ID
 * @param orderId - The order ID
 * @returns Order detail with all related data
 */
export async function getOrderById(orderId: number): Promise<OrderDetail> {
  const response = await axiosInstance.get<ApiResponse<OrderDetail>>(
    `/api/orders/${orderId}`
  );
  return response.data.result;
}

/**
 * Complete an order (update status to COMPLETED)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function completeOrder(orderId: number): Promise<OrderItem> {
  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/complete`
  );
  return response.data.result;
}

/**
 * Cancel an order (update status to CANCELLED)
 * NOTE: API response does NOT return updated order — caller must refetch after success.
 * @param orderId - The order ID
 */
export async function cancelOrder(orderId: number): Promise<void> {
  const response = await axiosInstance.post<ApiResponse<string>>(
    `/api/orders/${orderId}/cancel`
  );
  return response.data.result;
}

/**
 * Return an order (update status to SHIPPING_BACK)
 * @param orderId - The order ID
 * @param trackingCode - The tracking code for return shipment
 * @param notes - Array of notes (one per image, empty strings as safe default)
 * @param images - Array of image files
 * @returns Updated order
 */
export async function returnOrder(
  orderId: number,
  trackingCode: string,
  shippingCarrierName: string,
  notes: string[],
  images: File[],
  options?: ShipReturnQueryOptions
): Promise<OrderItem> {
  const formData = new FormData();

  images.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/return`,
    formData,
    {
      params: {
        trackingCode: trackingCode || undefined,
        shippingCarrierName: shippingCarrierName || undefined,
        notes,
        autoCreateGhn: options?.autoCreateGhn ?? false,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.result;
}

// createDispute moved to dispute.api.ts

// Extend order detail response
export interface ExtendOrderResponse {
  id: number;
  paymentUrl: string | null;
  status: string;
}

/**
 * Extend rental duration for an order detail in IN_USE status.
 * @param orderId - The order ID
 * @param detailId - The order detail ID
 * @param payload - { extendDays, paymentMethod, returnUrl, payNow }
 * @returns Extended order with optional paymentUrl (MoMo/VNPay) or null (WALLET)
 */
export async function extendOrderDetail(
  orderId: number,
  detailId: number,
  payload: {
    extendDays: number;
    paymentMethod: string;
    returnUrl: string;
    payNow: boolean;
  }
): Promise<ExtendOrderResponse> {
  const response = await axiosInstance.post<ApiResponse<ExtendOrderResponse>>(
    `/api/orders/${orderId}/details/${detailId}/extend`,
    payload
  );
  return response.data.result;
}

// ─── Extend History ───────────────────────────────────────────────────────────

/** Payment status for an extend transaction */
export type ExtendPaymentStatus = 'PAID' | 'PENDING' | 'FAILED';

/** Extend list item */
export interface OrderExtend {
  id: number;
  extendDays: number;
  extendPrice: number;
  paymentStatus: ExtendPaymentStatus;
  createdAt: string;
}

/** Full extend detail */
export interface OrderExtendDetail extends OrderExtend {
  oldReturnDate: string;
  newReturnDate: string;
  paymentUrl: string | null;
}

/**
 * Get list of extend transactions for an order.
 * GET /api/orders/{orderId}/extends
 */
export async function getOrderExtends(orderId: number): Promise<OrderExtend[]> {
  const response = await axiosInstance.get<ApiResponse<OrderExtend[]>>(
    `/api/orders/${orderId}/extends`
  );
  return response.data.result;
}

/**
 * Get full detail of a single extend transaction.
 * GET /api/orders/{orderId}/details/{detailId}/extend/{extendId}
 */
export async function getExtendDetail(
  orderId: number,
  detailId: number,
  extendId: number
): Promise<OrderExtendDetail> {
  const response = await axiosInstance.get<ApiResponse<OrderExtendDetail>>(
    `/api/orders/${orderId}/details/${detailId}/extend/${extendId}`
  );
  return response.data.result;
}
