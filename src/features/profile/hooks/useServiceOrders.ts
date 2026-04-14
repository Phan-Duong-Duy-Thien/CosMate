/**
 * Service Orders Hook
 * Fetches and filters service booking orders for the current user
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { fetchServiceOrders, confirmServiceOrder, payServiceOrderFn } from '@/features/service/services/booking.service';
import type { ServiceOrder, PaymentMethod } from '@/features/service/api/booking.api';

export type ServiceOrderTab = 'all' | 'UNCONFIRM' | 'UNPAID' | 'PAID' | 'WAITING_SERVICE_DATE' | 'IN_SERVICE' | 'COMPLETED' | 'DISPUTE' | 'CANCELLED';

export interface ServiceOrderCounts {
  all: number;
  UNCONFIRM: number;
  UNPAID: number;
  PAID: number;
  WAITING_SERVICE_DATE: number;
  IN_SERVICE: number;
  COMPLETED: number;
  DISPUTE: number;
  CANCELLED: number;
}

export interface UseServiceOrdersResult {
  serviceOrders: ServiceOrder[];
  filteredOrders: ServiceOrder[];
  counts: ServiceOrderCounts;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedStatus: ServiceOrderTab;
  setStatus: (status: ServiceOrderTab) => void;
  confirmingOrderId: number | null;
  confirmAndPay: (orderId: number, paymentMethod: PaymentMethod) => Promise<string | null>;
  payOnly: (orderId: number, paymentMethod: PaymentMethod) => Promise<string | null>;
}

export function useServiceOrders(): UseServiceOrdersResult {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ServiceOrderTab>('all');
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

  const userId = getUserId();

  const fetchData = useCallback(async (status?: ServiceOrderTab) => {
    if (!userId) {
      setError('User not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiStatuses = status && status !== 'all' ? status : undefined;
      const data = await fetchServiceOrders(userId, apiStatuses);
      setServiceOrders(data);
    } catch (err) {
      console.error('[useServiceOrders] Failed to fetch service orders:', err);
      setError('Failed to load service orders');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter orders based on selected status (server-side filter applied, client-side for counts)
  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') {
      return serviceOrders;
    }
    return serviceOrders.filter((order) => order.status === selectedStatus);
  }, [serviceOrders, selectedStatus]);

  // Calculate counts for each status tab
  const counts = useMemo(() => {
    const countByStatus = (status: string) =>
      serviceOrders.filter((order) => order.status === status).length;

    return {
      all: serviceOrders.length,
      UNCONFIRM: countByStatus('UNCONFIRM'),
      UNPAID: countByStatus('UNPAID'),
      PAID: countByStatus('PAID'),
      WAITING_SERVICE_DATE: countByStatus('WAITING_SERVICE_DATE'),
      IN_SERVICE: countByStatus('IN_SERVICE'),
      COMPLETED: countByStatus('COMPLETED'),
      DISPUTE: countByStatus('DISPUTE'),
      CANCELLED: countByStatus('CANCELLED'),
    };
  }, [serviceOrders]);

  const handleSetStatus = useCallback((status: ServiceOrderTab) => {
    setSelectedStatus(status);
    fetchData(status);
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(selectedStatus);
  }, [fetchData, selectedStatus]);

  const confirmAndPay = useCallback(async (orderId: number, paymentMethod: PaymentMethod): Promise<string | null> => {
    const returnUrl = `${window.location.origin}/payment/result`;
    setConfirmingOrderId(orderId);
    try {
      await confirmServiceOrder(orderId);
      const paymentUrl = await payServiceOrderFn(orderId, paymentMethod, returnUrl);
      return paymentUrl;
    } catch (err: unknown) {
      console.error('[useServiceOrders] confirmAndPay failed:', err);
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Xác nhận và thanh toán thất bại';
      throw new Error(message || 'Xác nhận và thanh toán thất bại');
    } finally {
      setConfirmingOrderId(null);
    }
  }, []);

  const payOnly = useCallback(async (orderId: number, paymentMethod: PaymentMethod): Promise<string | null> => {
    const returnUrl = `${window.location.origin}/payment/result`;
    setPayingOrderId(orderId);
    try {
      const paymentUrl = await payServiceOrderFn(orderId, paymentMethod, returnUrl);
      return paymentUrl;
    } catch (err: unknown) {
      console.error('[useServiceOrders] payOnly failed:', err);
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Thanh toán thất bại';
      throw new Error(message || 'Thanh toán thất bại');
    } finally {
      setPayingOrderId(null);
    }
  }, []);

  return {
    serviceOrders,
    filteredOrders,
    counts,
    loading,
    error,
    refetch,
    selectedStatus,
    setStatus: handleSetStatus,
    confirmingOrderId,
    confirmAndPay,
    payingOrderId,
    payOnly,
  };
}
