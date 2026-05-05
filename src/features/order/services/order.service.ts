/**
 * Order Service
 * Orchestrates order creation and data formatting
 */
import * as orderApi from '../api/order.api';
import { createDispute as disputeApi, type CreateDisputePayload } from '../api/dispute.api';
import type { CreateOrderPayload, CreateOrderResponse, CreateOrderParams, PaymentMethod, OrderDetail } from '../types';
import { clearDraft, clearCheckoutSelections } from '../utils/rentalDraftStorage';

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

  // returnUrl is only sent for external gateways (MOMO/VNPAY).
  // For WALLET: BE processes internally — no returnUrl needed.
  const payload: CreateOrderPayload = {
    costumeId: params.costumeId,
    rentDay: params.rentDay,
    rentStart: formattedRentStart,
    paymentMethod: params.paymentMethod,
    cosplayerAddressId: params.cosplayerAddressId,
    selectedAccessoryIds: params.selectedAccessoryIds,
    selectedRentalOptionId: params.selectedRentalOptionId,
  };

  if (params.paymentMethod === 'MOMO' || params.paymentMethod === 'VNPAY') {
    payload.returnUrl = params.returnUrl;
  }

  return orderApi.createOrder(params.cosplayerId, payload);
}

export type OrderRedirectResult =
  | { type: 'wallet'; orderId: number; status: 'success' | 'failed' }
  | { type: 'gateway'; paymentUrl: string }
  | { type: 'failed'; orderId: number };

/**
 * Submit order and return navigation intent.
 * Caller (hook/component) handles actual navigation via React Router navigate().
 *
 * Decision logic:
 * A) paymentMethod === 'WALLET': BE processed internally → return wallet result
 * B) paymentUrl is non-empty string (MoMo/VNPay): return gateway redirect
 * C) Otherwise: return failed result
 */
export async function submitOrderAndHandleResult(
  params: CreateOrderParams
): Promise<OrderRedirectResult> {
  let result: CreateOrderResponse;

  try {
    result = await createOrder(params);
  } catch {
    return { type: 'failed', orderId: 0 };
  }

  const orderId = result.id;

  // WALLET: BE processes internally — FE must redirect manually with status/orderId.
  // BE returns UNPAID because no external gateway redirect occurred.
  // OrderId is trusted from the response regardless of status.
  if (params.paymentMethod === 'WALLET') {
    clearDraft();
    clearCheckoutSelections();
    return { type: 'wallet', orderId, status: 'success' };
  }

  // External gateway (MoMo/VNPay) — BE will redirect user after payment.
  // FE MUST redirect to paymentUrl; BE handles the return to /payment/result.
  if (result.paymentUrl) {
    return { type: 'gateway', paymentUrl: result.paymentUrl };
  }

  // No paymentUrl and not WALLET: BE failed — signal error, do NOT redirect.
  return { type: 'failed', orderId: 0 };
}

/**
 * Prepare an order (update status to PREPARING)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function prepareOrder(orderId: number) {
  return orderApi.prepareOrder(orderId);
}

/**
 * Get orders for a provider
 * @param providerId - The provider ID
 * @returns List of orders for the provider
 */
export async function fetchProviderOrders(providerId: number) {
  const result = await orderApi.getOrdersByProvider(providerId);
  return result;
}

/**
 * Prepare a provider's order (update status to PREPARING)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function prepareProviderOrder(orderId: number) {
  return orderApi.prepareOrder(orderId);
}

/**
 * Deliver out a provider's order (update status to DELIVERING_OUT)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function deliverOutProviderOrder(orderId: number) {
  return orderApi.deliverOutOrder(orderId);
}

/**
 * Ship a provider's order (update status to SHIPPING_OUT)
 * @param orderId - The order ID
 * @param trackingCode - The tracking code for shipment
 * @param notes - Array of notes mapped to images by index
 * @param images - Array of image files
 * @returns Ship order result with images and tracking info
 */
export async function shipProviderOrder(
  orderId: number,
  trackingCode: string,
  shippingCarrierName: string,
  notes: string[],
  images: File[]
) {
  return orderApi.shipOrder(orderId, trackingCode, shippingCarrierName, notes, images);
}

/**
 * Confirm delivery of an order (update status to IN_USE)
 * @param orderId - The order ID
 * @param images - Array of image files
 * @param notes - Array of notes (one per image)
 * @returns Updated order
 */
export async function confirmDeliveryOrder(
  orderId: number,
  images: File[],
  notes: string[]
) {
  return orderApi.confirmDeliveryOrder(orderId, images, notes);
}

/**
 * Fetch order detail by ID
 * @param orderId - The order ID
 * @returns Order detail with all related data
 */
export async function fetchOrderDetail(orderId: number): Promise<OrderDetail> {
  return orderApi.getOrderById(orderId);
}

/**
 * Complete a provider's order (update status to COMPLETED)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function completeProviderOrder(orderId: number) {
  return orderApi.completeOrder(orderId);
}

/**
 * Cancel an order (update status to CANCELLED)
 * NOTE: API response does NOT return updated order — caller must refetch after success.
 * @param orderId - The order ID
 */
export async function cancelOrder(orderId: number) {
  return orderApi.cancelOrder(orderId);
}

/**
 * Return a cosplayer's order (update status to SHIPPING_BACK)
 * @param orderId - The order ID
 * @param trackingCode - The tracking code for return shipment
 * @param notes - Array of notes (one per image)
 * @param images - Array of image files
 * @returns Updated order
 */
export async function returnCosplayerOrder(
  orderId: number,
  trackingCode: string,
  notes: string[],
  images: File[]
) {
  return orderApi.returnOrder(orderId, trackingCode, notes, images);
}

/**
 * Create a dispute for an order
 * @param orderId - The order ID
 * @param payload - { reason, files: string[] }
 */
export async function createDisputeService(
  orderId: number,
  payload: CreateDisputePayload
) {
  await disputeApi(orderId, payload);
}