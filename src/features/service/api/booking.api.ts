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
}

export interface ServiceOrder {
  id: number;
  cosplayerId: number;
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
 */
export async function getServiceOrdersByCosplayer(
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
