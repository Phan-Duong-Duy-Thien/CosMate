/**
 * useExtendOrder Hook
 * Handles extend rental API call and payment flow (WALLET vs MoMo/VNPay).
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { extendOrderDetail } from '../api/order.api';
import { fetchOrderDetail } from '../services/order.service';
import type { PaymentMethod } from '../utils/paymentReturnUrls';
import { getReturnUrl } from '../utils/paymentReturnUrls';

interface ExtendOrderPayload {
  extendDays: number;
  paymentMethod: PaymentMethod;
  payNow: boolean;
}

export function useExtendOrder() {
  const [isExtending, setIsExtending] = useState(false);

  const extendOrder = useCallback(
    async (orderId: number, detailId: number, payload: ExtendOrderPayload) => {
      setIsExtending(true);
      try {
        const returnUrl = getReturnUrl(payload.paymentMethod);

        const result = await extendOrderDetail(orderId, detailId, {
          extendDays: payload.extendDays,
          paymentMethod: payload.paymentMethod,
          returnUrl,
          payNow: payload.payNow,
        });

        // WALLET: BE processed internally — navigate to result page.
        if (payload.paymentMethod === 'WALLET') {
          const status = result.status === 'EXTENDING' || result.status === 'IN_USE' ? 'success' : 'failed';
          window.location.href = `/payment/result?status=${status}&orderId=${orderId}`;
          return { type: 'wallet', orderId, status: status as 'success' | 'failed' };
        }

        // MoMo/VNPay: BE returns paymentUrl — redirect to gateway.
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
          return { type: 'gateway', paymentUrl: result.paymentUrl };
        }

        message.error('Gia hạn thất bại.');
        return { type: 'failed' };
      } catch {
        message.error('Đã xảy ra lỗi khi gia hạn. Vui lòng thử lại.');
        return { type: 'failed' };
      } finally {
        setIsExtending(false);
      }
    },
    []
  );

  /** Get detailId from orderId — used when only orderId is known (e.g. PurchaseHistoryPage) */
  const getDetailIdFromOrder = useCallback(async (orderId: number): Promise<number | null> => {
    try {
      const detail = await fetchOrderDetail(orderId);
      return detail.details?.[0]?.id ?? null;
    } catch {
      return null;
    }
  }, []);

  return { extendOrder, isExtending, getDetailIdFromOrder };
}
