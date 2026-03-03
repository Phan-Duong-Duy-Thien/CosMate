/**
 * Order Service
 * Orchestrates order creation and data formatting
 */
import * as orderApi from '../api/order.api';
import type { CreateOrderPayload, CreateOrderResponse, CreateOrderParams, PaymentMethod } from '../types';
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
