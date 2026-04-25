/**
 * Service Booking Service
 *
 * Orchestration layer — calls the API.
 * Called by hooks only; never by components or pages.
 */
import { createServiceBooking, type ServiceBookingPayload, type ServiceBookingResult, getServiceOrdersByCosplayer, getAllServiceOrdersByCosplayer, type ServiceOrder, confirmServiceOrder as apiConfirmServiceOrder, payServiceOrder as apiPayServiceOrder, type PaymentMethod, getProviderServiceOrders as apiGetProviderServiceOrders, setWaitingServiceDate as apiSetWaitingServiceDate } from '../api/booking.api'

export interface CreateServiceBookingParams {
  serviceId: number
  bookingDate: string       // YYYY-MM-DD
  timeSlot: string        // HH:mm
  numberOfHuman: number   // default 1
  rentSlotAmount: number  // default 1
  cosplayerId: number
}

export async function submitServiceBooking(
  params: CreateServiceBookingParams
): Promise<ServiceBookingResult> {
  console.log("[booking.service] submitServiceBooking params:", params)
  const payload: ServiceBookingPayload = {
    serviceId: params.serviceId,
    bookingDate: params.bookingDate,
    timeSlot: params.timeSlot,
    numberOfHuman: params.numberOfHuman,
    rentSlotAmount: params.rentSlotAmount,
    cosplayerId: params.cosplayerId,
  }
  console.log("[booking.service] payload:", payload)
  return createServiceBooking(payload)
}

export async function fetchServiceOrders(
  userId: number,
  statuses?: string,
  page: number = 1,
  size: number = 10
): Promise<{ orders: ServiceOrder[]; total: number; isPaginated: boolean }> {
  console.log("[booking.service] fetchServiceOrders userId:", userId, "statuses:", statuses, "page:", page, "size:", size)
  return getServiceOrdersByCosplayer(userId, statuses, page, size)
}

export async function fetchAllServiceOrders(
  userId: number,
  statuses?: string
): Promise<ServiceOrder[]> {
  console.log("[booking.service] fetchAllServiceOrders userId:", userId, "statuses:", statuses)
  return getAllServiceOrdersByCosplayer(userId, statuses)
}

export async function confirmServiceOrder(orderId: number): Promise<void> {
  console.log("[booking.service] confirmServiceOrder orderId:", orderId)
  return apiConfirmServiceOrder(orderId)
}

export async function payServiceOrderFn(
  orderId: number,
  paymentMethod: PaymentMethod,
  returnUrl: string
): Promise<string | null> {
  console.log('[booking.service] payServiceOrderFn → orderId:', orderId, '| method:', paymentMethod, '| returnUrl:', returnUrl);
  const result = await apiPayServiceOrder(orderId, paymentMethod, returnUrl);
  console.log('[booking.service] payServiceOrderFn ← paymentUrl:', result);
  return result;
}

export async function fetchProviderServiceOrders(
  statuses?: string
): Promise<ServiceOrder[]> {
  console.log("[booking.service] fetchProviderServiceOrders statuses:", statuses)
  return apiGetProviderServiceOrders(statuses)
}

export async function setWaitingStatus(orderId: number): Promise<void> {
  console.log('[booking.service] setWaitingStatus → orderId:', orderId);
  return apiSetWaitingServiceDate(orderId);
}
