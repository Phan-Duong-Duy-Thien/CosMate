/**
 * Service Booking Service
 *
 * Orchestration layer — calls the API.
 * Called by hooks only; never by components or pages.
 */
import { createServiceBooking, type ServiceBookingPayload, type ServiceBookingResult, getServiceOrdersByCosplayer, type ServiceOrder } from '../api/booking.api'

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
  statuses?: string
): Promise<ServiceOrder[]> {
  console.log("[booking.service] fetchServiceOrders userId:", userId, "statuses:", statuses)
  return getServiceOrdersByCosplayer(userId, statuses)
}
