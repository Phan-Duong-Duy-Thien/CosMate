/**
 * Service Order Service (Provider side)
 *
 * Business logic layer for provider service orders.
 * Wraps API calls from booking.api.ts
 */
import { getProviderServiceOrders, setWaitingServiceDate, startServiceNow, completeServiceByProvider, type ServiceOrder } from '../api/booking.api';

/**
 * Fetch service orders for the provider
 * @param statuses - optional comma-separated list of statuses to filter by
 * @returns Array of service orders
 */
export async function fetchProviderServiceOrders(
  statuses?: string
): Promise<ServiceOrder[]> {
  return getProviderServiceOrders(statuses);
}

/**
 * Set order status to WAITING_SERVICE_DATE (provider action)
 * @param orderId - the service order ID
 */
export async function setWaitingStatus(orderId: number): Promise<void> {
  console.log('[serviceOrder.service] setWaitingStatus → orderId:', orderId);
  return setWaitingServiceDate(orderId);
}

/**
 * Start service now — moves order from WAITING_SERVICE_DATE → IN_SERVICE (provider action)
 * @param orderId - the service order ID
 */
export async function startService(orderId: number): Promise<void> {
  console.log('[serviceOrder.service] startService → orderId:', orderId);
  return startServiceNow(orderId);
}

/**
 * Complete service — moves order from IN_SERVICE → COMPLETED (provider action)
 * @param orderId - the service order ID
 */
export async function completeService(orderId: number): Promise<void> {
  console.log('[serviceOrder.service] completeService → orderId:', orderId);
  return completeServiceByProvider(orderId);
}
