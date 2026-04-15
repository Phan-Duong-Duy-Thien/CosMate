/**
 * Service Order Service (Provider side)
 *
 * Business logic layer for provider service orders.
 * Wraps API calls from booking.api.ts
 */
import { getProviderServiceOrders, setWaitingServiceDate, type ServiceOrder } from '../api/booking.api';

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
