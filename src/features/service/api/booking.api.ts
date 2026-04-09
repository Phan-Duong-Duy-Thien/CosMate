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
