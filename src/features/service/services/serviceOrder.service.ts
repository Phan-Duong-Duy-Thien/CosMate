/**
 * Service Order Service (Provider side)
 *
 * Business logic layer for provider service orders.
 * Wraps API calls from booking.api.ts
 */
import { getProviderServiceOrders, type ServiceOrder } from '../api/booking.api';

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
