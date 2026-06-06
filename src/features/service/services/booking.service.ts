/**
 * Service Booking Service
 *
 * Orchestration layer — calls the API.
 * Called by hooks only; never by components or pages.
 */
import { createServiceBooking, type ServiceBookingPayload, type ServiceBookingResult, getServiceOrdersByCosplayer, getAllServiceOrdersByCosplayer, type ServiceOrder, confirmServiceOrder as apiConfirmServiceOrder, payServiceOrder as apiPayServiceOrder, type PaymentMethod, getProviderServiceOrders as apiGetProviderServiceOrders, setWaitingServiceDate as apiSetWaitingServiceDate } from '../api/booking.api'
import { getServiceById } from '../api/service.api'
import {
  normalizeServiceOrder,
  resolveServiceOrderPayableTotal,
  type ServicePackageFees,
} from '../utils/serviceOrderPricing'

import { getProviderById } from '@/features/provider/api/providerShop.api'

const servicePackageFeesCache = new Map<number, ServicePackageFees>()

async function loadServicePackageFees(serviceId: number): Promise<ServicePackageFees> {
  const cached = servicePackageFeesCache.get(serviceId)
  if (cached) return cached

  try {
    const service = await getServiceById(serviceId)
    const fees: ServicePackageFees = {
      depositAmount: service.depositAmount ?? 0,
      equipmentDepreciationCost: service.equipmentDepreciationCost ?? 0,
    }
    servicePackageFeesCache.set(serviceId, fees)
    return fees
  } catch {
    const empty = { depositAmount: 0, equipmentDepreciationCost: 0 }
    servicePackageFeesCache.set(serviceId, empty)
    return empty
  }
}

async function enrichServiceOrdersForDisplay(orders: ServiceOrder[]): Promise<ServiceOrder[]> {
  const normalized = orders.map((o) =>
    normalizeServiceOrder(o as unknown as Record<string, unknown>),
  )

  const serviceIds = new Set<number>()
  const providerIds = new Set<number>()
  for (const order of normalized) {
    if (order.providerId > 0 && !order.providerName) {
      providerIds.add(order.providerId)
    }
    for (const booking of order.bookings) {
      if (booking.serviceId > 0) serviceIds.add(booking.serviceId)
    }
  }

  const providerMap = new Map<number, string>()
  await Promise.all([
    ...[...serviceIds].map((id) => loadServicePackageFees(id)),
    ...[...providerIds].map(async (pId) => {
      try {
        const provider = await getProviderById(pId)
        if (provider?.shopName) {
          providerMap.set(pId, provider.shopName)
        }
      } catch (err) {
        console.error("Failed to load provider profile", pId, err)
      }
    })
  ])

  return normalized.map((order) => ({
    ...order,
    providerName: order.providerName || providerMap.get(order.providerId) || `Shop #${order.providerId}`,
    payableTotalAmount: resolveServiceOrderPayableTotal(order, servicePackageFeesCache),
  }))
}

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
  const res = await getServiceOrdersByCosplayer(userId, statuses, page, size)
  const orders = await enrichServiceOrdersForDisplay(res.orders)
  return { ...res, orders }
}

export async function fetchAllServiceOrders(
  userId: number,
  statuses?: string
): Promise<ServiceOrder[]> {
  console.log("[booking.service] fetchAllServiceOrders userId:", userId, "statuses:", statuses)
  const orders = await getAllServiceOrdersByCosplayer(userId, statuses)
  return enrichServiceOrdersForDisplay(orders)
}

export async function confirmServiceOrder(orderId: number): Promise<void> {
  console.log("[booking.service] confirmServiceOrder orderId:", orderId)
  return apiConfirmServiceOrder(orderId)
}

export async function payServiceOrderFn(
  orderId: number,
  paymentMethod: PaymentMethod,
  returnUrl: string
) {
  console.log('[booking.service] payServiceOrderFn → orderId:', orderId, '| method:', paymentMethod, '| returnUrl:', returnUrl);
  const result = await apiPayServiceOrder(orderId, paymentMethod, returnUrl);
  console.log('[booking.service] payServiceOrderFn ←', result);
  return result;
}

export async function fetchProviderServiceOrders(
  statuses?: string
): Promise<ServiceOrder[]> {
  console.log("[booking.service] fetchProviderServiceOrders statuses:", statuses)
  const orders = await apiGetProviderServiceOrders(statuses)
  return enrichServiceOrdersForDisplay(orders)
}

export async function setWaitingStatus(orderId: number): Promise<void> {
  console.log('[booking.service] setWaitingStatus → orderId:', orderId);
  return apiSetWaitingServiceDate(orderId);
}
