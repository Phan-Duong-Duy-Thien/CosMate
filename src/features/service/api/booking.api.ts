/**
 * Service Booking API
 *
 * HTTP layer only — no business logic.
 * Handles booking a photographer or event staff service from chat context.
 */
import axiosInstance from '@/services/axiosInstance';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * Service booking response
 */
export interface ServiceBookingResult {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: string;
  totalAmount: number;
  totalDepositAmount: number | null;
  createdAt: string;
  rentDate: string;
  paymentUrl: string | null;
}

export interface ServiceOrderBooking {
  id: number;
  serviceId: number;
  bookingDate: string;
  timeSlot: string;
  numberOfHuman: number;
  rentSlotAmount: number;
  depositSlotAmount?: number; // from provider API response
}

export interface ServiceOrder {
  id: number;
  cosplayerId: number;
  cosplayerName?: string;
  providerId: number;
  orderType: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  bookings: ServiceOrderBooking[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * GET /api/service-orders/cosplayer/{userId}
 * Fetches service orders for the current user (cosplayer side).
 * @param userId - the cosplayer's user ID
 * @param statuses - optional comma-separated list of statuses to filter by
 * @param page - Page number (1-based), default 1
 * @param size - Page size, default 10
 */
export async function getServiceOrdersByCosplayer(
  userId: number,
  statuses?: string,
  page: number = 1,
  size: number = 10
): Promise<{ orders: ServiceOrder[]; total: number; isPaginated: boolean }> {
  const response = await axiosInstance.get<ApiResponse<ServiceOrder[] | { content: ServiceOrder[]; totalElements: number }>>(
    `/api/service-orders/cosplayer/${userId}`,
    {
      params: statuses ? { statuses, page, size } : { page, size },
    }
  );
  const result = response.data.result;
  if (Array.isArray(result)) {
    return { orders: result, total: result.length, isPaginated: false };
  }
  return {
    orders: result.content,
    total: result.totalElements,
    isPaginated: true,
  };
}

/**
 * Fetch all service orders for a user (client-side pagination).
 * Use this when BE does NOT support pagination.
 */
export async function getAllServiceOrdersByCosplayer(
  userId: number,
  statuses?: string
): Promise<ServiceOrder[]> {
  const response = await axiosInstance.get<ApiResponse<ServiceOrder[]>>(
    `/api/service-orders/cosplayer/${userId}`,
    {
      params: statuses ? { statuses } : undefined,
    }
  );
  return response.data.result;
}

/**
 * POST /api/service-orders/provider-create
 * Creates a service booking (photographer / event staff) from chat.
 */
export async function createServiceBooking(
  payload: ServiceBookingPayload
): Promise<ServiceBookingResult> {
  console.log("[booking.api] createServiceBooking payload:", payload)
  const response = await axiosInstance.post<ApiResponse<ServiceBookingResult>>(
    '/api/service-orders/provider-create',
    payload
  )
  console.log("[booking.api] response:", response.data)
  return response.data.result
}

export interface ServiceBookingPayload {
  serviceId: number
  bookingDate: string       // YYYY-MM-DD
  timeSlot: string         // HH:mm
  numberOfHuman: number    // default 1
  rentSlotAmount: number   // default 1
  cosplayerId: number
}

export type PaymentMethod = 'MOMO' | 'VNPAY' | 'WALLET';

/**
 * POST /api/service-orders/{id}/confirm-by-cosplayer
 * Confirms a service order (cosplayer side).
 */
export async function confirmServiceOrder(orderId: number): Promise<void> {
  const response = await axiosInstance.post<ApiResponse<void>>(
    `/api/service-orders/${orderId}/confirm-by-cosplayer`
  );
  return response.data.result;
}

/**
 * POST /api/service-orders/{id}/pay
 * Triggers payment for a service order.
 */
export async function payServiceOrder(
  orderId: number,
  paymentMethod: PaymentMethod,
  returnUrl: string
): Promise<string> {
  // ── Debug: log exact payload sent to BE ────────────────────────────────
  console.log('SERVICE PAY PAYLOAD:', {
    id: orderId,
    paymentMethod,
    returnUrl,
  });

  const baseUrl = axiosInstance.defaults.baseURL || '';
  const endpoint = `/api/service-orders/${orderId}/pay`;
  const finalUrl = `${baseUrl}${endpoint}?paymentMethod=${encodeURIComponent(paymentMethod)}&returnUrl=${encodeURIComponent(returnUrl)}`;
  console.log('FINAL REQUEST URL:', finalUrl);

  const response = await axiosInstance.post<ApiResponse<{ paymentUrl: string }>>(
    endpoint,
    null,
    {
      params: { paymentMethod, returnUrl },
    }
  );
  console.log('[booking.api] payServiceOrder ← response:', response.data);
  return response.data.result.paymentUrl;
}

/**
 * POST /api/service-orders/{id}/start-service-now
 * Moves an order from WAITING_SERVICE_DATE → IN_SERVICE (provider side).
 */
export async function startServiceNow(orderId: number): Promise<{ id: number; status: string }> {
  console.log('[booking.api] startServiceNow → orderId:', orderId);
  const response = await axiosInstance.post<ApiResponse<{ id: number; status: string }>>(
    `/api/service-orders/${orderId}/start-service-now`
  );
  console.log('[booking.api] startServiceNow ← response:', response.data);
  return response.data.result;
}

/**
 * POST /api/service-orders/{id}/provider-set-waiting
 * Moves an order from PAID → WAITING_SERVICE_DATE (provider side).
 */
export async function setWaitingServiceDate(orderId: number): Promise<void> {
  console.log('[booking.api] setWaitingServiceDate → orderId:', orderId);
  const response = await axiosInstance.post<ApiResponse<void>>(
    `/api/service-orders/${orderId}/provider-set-waiting`
  );
  console.log('[booking.api] setWaitingServiceDate ← response:', response.data);
  return response.data.result;
}

/**
 * POST /api/service-orders/{id}/provider-complete
 * Moves an order from IN_SERVICE → COMPLETED (provider side).
 */
export async function completeServiceByProvider(
  orderId: number
): Promise<{ id: number; status: string }> {
  console.log('[booking.api] completeServiceByProvider → orderId:', orderId);
  const response = await axiosInstance.post<ApiResponse<{ id: number; status: string }>>(
    `/api/service-orders/${orderId}/provider-complete`
  );
  console.log('[booking.api] completeServiceByProvider ← response:', response.data);
  return response.data.result;
}

/**
 * GET /api/service-orders/provider
 * Fetches service orders for the provider (staff/photographer side).
 * @param statuses - optional comma-separated list of statuses to filter by
 */
export async function getProviderServiceOrders(
  statuses?: string
): Promise<ServiceOrder[]> {
  const response = await axiosInstance.get<ApiResponse<ServiceOrder[]>>(
    '/api/service-orders/provider',
    {
      params: statuses ? { statuses } : undefined,
    }
  );
  return response.data.result;
}
