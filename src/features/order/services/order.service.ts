/**
 * Order Service
 * Orchestrates order creation and data formatting
 */
import * as orderApi from '../api/order.api';
import type { CreateOrderPayload, CreateOrderResponse, CreateOrderParams, PaymentMethod, OrderDetail } from '../types';
import { clearDraft } from '../utils/rentalDraftStorage';

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

/**
 * Submit order and handle post-submit behavior
 *
 * Decision logic:
 * A) If paymentUrl is non-empty string: redirect to payment gateway
 * B) Else if paymentUrl is null AND status === "PAID" (WALLET): redirect to success page
 * C) Else: redirect to failed page
 */
export async function submitOrderAndHandleResult(
  params: CreateOrderParams
): Promise<{ redirected: boolean }> {
  console.log('[DEBUG] === submitOrderAndHandleResult START ===');
  console.log('[DEBUG] params:', params);

  let result: CreateOrderResponse;

  try {
    console.log('[DEBUG] Calling createOrder API...');
    result = await createOrder(params);
    console.log('[DEBUG] createOrder returned:', result);
  } catch (error: unknown) {
    console.error('[DEBUG] Error creating order:', error);
    // Check if error has response data
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } };
      console.error('[DEBUG] Error response data:', axiosError.response?.data);
    }
    // Redirect to failed page on error
    const failedUrl = `/payment/result?status=failed&orderId=unknown`;
    window.location.href = failedUrl;
    return { redirected: true };
  }

  // DEBUG: Log full API response
  console.log('[DEBUG] Order API Response:', JSON.stringify(result, null, 2));

  // API returns result directly, not wrapped in .result
  const orderId = (result as unknown as { id?: number }).id;
  const paymentUrl = (result as unknown as { paymentUrl?: string }).paymentUrl;
  const status = (result as unknown as { status?: string }).status;

  // DEBUG: Log decision variables
  console.log('[DEBUG] orderId:', orderId);
  console.log('[DEBUG] paymentUrl:', paymentUrl, '- type:', typeof paymentUrl);
  console.log('[DEBUG] status:', status, '- type:', typeof status);
  console.log('[DEBUG] Check: paymentUrl is truthy:', !!paymentUrl);
  console.log('[DEBUG] Check: paymentUrl === null:', paymentUrl === null);
  console.log('[DEBUG] Check: status === "PAID":', status === 'PAID');

  // Case A: Redirect to payment gateway (MoMo/VNPAY)
  if (paymentUrl) {
    console.log('[DEBUG] Case A: Redirecting to payment gateway');
    window.location.href = paymentUrl;
    return { redirected: true };
  }

  // Case B: WALLET payment - check if already PAID
  if (paymentUrl === null && status === 'PAID') {
    // DEBUG
    console.log('[DEBUG] Case B: WALLET payment - PAID');

    // Clear rental draft on successful wallet payment
    clearDraft();

    // Redirect to success page
    const successUrl = `/payment/result?status=success&orderId=${orderId}`;
    window.location.href = successUrl;
    return { redirected: true };
  }

  // Case C: Payment failed or other error
  // DEBUG
  console.log('[DEBUG] Case C: Redirecting to failed page');
  console.log('[DEBUG] Reason: paymentUrl is', paymentUrl, 'status is', status);

  // Redirect to failed page
  const failedUrl = `/payment/result?status=failed&orderId=${orderId}`;
  window.location.href = failedUrl;
  return { redirected: true };
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
  notes: string[],
  images: File[]
) {
  return orderApi.shipOrder(orderId, trackingCode, notes, images);
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
 * @param reason - The dispute reason
 */
export async function createDisputeService(orderId: number, reason: string) {
  await orderApi.createDispute(orderId, reason);
}