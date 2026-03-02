/**
 * Order Service
 * Orchestrates order creation and data formatting
 */
import * as orderApi from '../api/order.api';
import type { CreateOrderPayload, CreateOrderResponse, CreateOrderParams, PaymentMethod } from '../types';

/**
 * Format date to ISO string with T separator
 * Converts YYYY-MM-DD to YYYY-MM-DDTHH:mm:ss
 */
function formatRentStartToISO(dateString: string): string {
  // If already has T, return as-is
  if (dateString.includes('T')) {
    return dateString;
  }
  // Append T00:00:00 for ISO format
  return `${dateString}T00:00:00`;
}

/**
 * Create a new order
 * Handles data formatting and API call
 */
export async function createOrder(
  params: CreateOrderParams
): Promise<CreateOrderResponse> {
  // Format rentStart to ISO with T separator
  const formattedRentStart = formatRentStartToISO(params.rentStart);

  const payload: CreateOrderPayload = {
    costumeId: params.costumeId,
    rentDay: params.rentDay,
    rentStart: formattedRentStart,
    paymentMethod: params.paymentMethod,
    returnUrl: params.returnUrl,
    cosplayerAddressId: params.cosplayerAddressId,
    selectedAccessoryIds: params.selectedAccessoryIds,
    selectedRentalOptionId: params.selectedRentalOptionId,
  };

  return orderApi.createOrder(params.cosplayerId, payload);
}
