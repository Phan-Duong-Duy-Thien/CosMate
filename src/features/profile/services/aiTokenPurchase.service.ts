import * as api from '../api/aiTokenPurchase.api';
import type { AiTokenPurchase, InitiateAiTokenPurchaseParams } from '../types';

export type AiTokenPurchaseRedirectResult =
  | { type: 'gateway'; paymentUrl: string }
  | { type: 'wallet'; status: 'success' | 'failed'; purchaseId?: number }
  | { type: 'failed' };

function extractPaymentUrl(result: unknown): string | null {
  if (typeof result === 'string' && result.startsWith('http')) {
    return result;
  }
  if (result && typeof result === 'object' && 'paymentUrl' in result) {
    const url = (result as { paymentUrl?: string }).paymentUrl;
    if (typeof url === 'string' && url.startsWith('http')) {
      return url;
    }
  }
  return null;
}

function extractPurchaseId(result: unknown): number | undefined {
  if (typeof result === 'number' && Number.isFinite(result)) {
    return result;
  }
  if (result && typeof result === 'object') {
    const obj = result as { id?: number; purchaseId?: number };
    if (typeof obj.id === 'number') return obj.id;
    if (typeof obj.purchaseId === 'number') return obj.purchaseId;
  }
  return undefined;
}

/**
 * Initiate token purchase — gateway redirect or wallet (internal BE processing).
 */
export async function submitAiTokenPurchase(
  params: InitiateAiTokenPurchaseParams
): Promise<AiTokenPurchaseRedirectResult> {
  const apiParams: InitiateAiTokenPurchaseParams = {
    planId: params.planId,
    paymentMethod: params.paymentMethod,
    isMobile: params.isMobile ?? false,
  };

  if (params.paymentMethod === 'MOMO' || params.paymentMethod === 'VNPAY') {
    apiParams.returnUrl = params.returnUrl;
  }

  const response = await api.initiateAiTokenPurchase(apiParams);

  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể tạo thanh toán');
  }

  if (params.paymentMethod === 'WALLET') {
    return {
      type: 'wallet',
      status: 'success',
      purchaseId: extractPurchaseId(response.result),
    };
  }

  const paymentUrl = extractPaymentUrl(response.result);
  if (!paymentUrl) {
    throw new Error('invalid_payment_url');
  }

  return { type: 'gateway', paymentUrl };
}

export async function fetchUserAiTokenPurchases(userId: number): Promise<AiTokenPurchase[]> {
  const response = await api.getUserAiTokenPurchases(userId);

  if (response.code !== 0 || !Array.isArray(response.result)) {
    throw new Error(response.message || 'Không thể tải lịch sử mua token');
  }

  return response.result;
}
