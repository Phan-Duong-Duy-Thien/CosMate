/**
 * Hook for fetching provider orders with filtering
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchProviderOrders,
  prepareProviderOrder,
  deliverOutProviderOrder,
  shipProviderOrder,
  completeProviderOrder,
} from '../services/order.service';
import { getAuth } from '@/features/auth/services/tokenStorage';
import { notifyOrdersChanged } from '@/shared/sync/dataSync';
import {
  mergeOrderFromMutation,
  patchOrderStatus,
} from '@/shared/sync/patchOrderList';
import { enrichOrderCosplayerNames } from '@/shared/utils/enrichOrderCosplayerNames';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { usePendingListMutation } from '@/shared/hooks/usePendingListMutation';
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge';
import { DATA_SYNC_EVENTS } from '@/shared/sync/dataSync';
import type { OrderItem, OrderStatus } from '../types';

// Fixed status tabs configuration
export const ORDER_STATUS_TABS: Array<{ key: OrderStatus | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'all' },
  { key: 'UNPAID', label: 'unpaid' },
  { key: 'PAID', label: 'paid' },
  { key: 'PREPARING', label: 'preparing' },
  { key: 'SHIPPING_OUT', label: 'shippingOut' },
  { key: 'DELIVERING_OUT', label: 'deliveringOut' },
  { key: 'IN_USE', label: 'inUse' },
  { key: 'SHIPPING_BACK', label: 'shippingBack' },
  { key: 'COMPLETED', label: 'completed' },
  { key: 'CANCELLED', label: 'cancelled' },
  { key: 'DISPUTE', label: 'dispute' },
  { key: 'EXTENDING', label: 'extending' },
];

type TabKey = OrderStatus | 'ALL';

const STATUS_AFTER_ACTION: Record<string, OrderStatus> = {
  ship: 'SHIPPING_OUT',
};

export function useProviderOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [preparingOrderId, setPreparingOrderId] = useState<number | null>(null);
  const [deliveringOutOrderId, setDeliveringOutOrderId] = useState<number | null>(null);
  const [shippingOrderId, setShippingOrderId] = useState<number | null>(null);
  const [completingOrderId, setCompletingOrderId] = useState<number | null>(null);

  const { mergeFetched, setPendingField } = usePendingListMutation<OrderItem, OrderStatus>({
    getItemId: (o) => o.id,
    getFieldValue: (o) => o.status,
    setFieldValue: (o, status) => ({ ...o, status }),
  });

  const providerId = useMemo(() => {
    const auth = getAuth();
    if (!auth?.token) return null;

    try {
      const parts = auth.token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      const decoded = JSON.parse(jsonPayload);
      return decoded?.providerId ?? decoded?.provider_id ?? null;
    } catch {
      return null;
    }
  }, []);

  const refetch = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!providerId) {
        setError('Không tìm thấy thông tin provider. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      if (!options?.silent) {
        setLoading(true);
      }
      setError(null);
      try {
        const result = await fetchProviderOrders(providerId);
        let costumeOrders = result.filter((o) => o.orderType === 'RENT_COSTUME');
        costumeOrders = await enrichOrderCosplayerNames(costumeOrders);

        const unexpected = result.filter((o) => o.orderType !== 'RENT_COSTUME');
        if (unexpected.length > 0) {
          console.warn(
            '[useProviderOrders] BE returned',
            unexpected.length,
            'non-RENT_COSTUME orders — filtered out:',
            unexpected.map((o) => ({ id: o.id, type: o.orderType })),
          );
        }

        setOrders(mergeFetched(costumeOrders));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch orders';
        setError(message);
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [providerId, mergeFetched],
  );

  const scheduleRefetch = useCallback(() => {
    scheduleBackgroundRefetch(() => refetch({ silent: true }));
  }, [refetch]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useDataSyncRefetch(() => refetch({ silent: true }), DATA_SYNC_EVENTS.ORDERS_CHANGED);

  const applyOrderMutation = useCallback(
    (orderId: number, nextStatus: OrderStatus, partial?: Partial<OrderItem>) => {
      setPendingField(orderId, nextStatus);
      setOrders((prev) =>
        partial
          ? mergeOrderFromMutation(prev, orderId, { ...partial, status: nextStatus })
          : patchOrderStatus(prev, orderId, nextStatus),
      );
      notifyOrdersChanged({ orderId, orderType: 'RENT_COSTUME' });
    },
    [setPendingField],
  );

  const runMutation = useCallback(
    async (
      orderId: number,
      action: () => Promise<OrderItem | void>,
      nextStatus: OrderStatus,
    ): Promise<boolean> => {
      try {
        const result = await action();
        const partial =
          result && typeof result === 'object'
            ? (() => {
                const { status: _ignored, ...rest } = result as OrderItem;
                return rest as Partial<OrderItem>;
              })()
            : undefined;
        applyOrderMutation(orderId, nextStatus, partial);
        scheduleRefetch();
        return true;
      } catch {
        return false;
      }
    },
    [applyOrderMutation, scheduleRefetch],
  );

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (activeTab !== 'ALL') {
      result = result.filter((order) => order.status === activeTab);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (order) =>
          order.id.toString().includes(term) ||
          order.cosplayerId.toString().includes(term) ||
          (order.cosplayerName && order.cosplayerName.toLowerCase().includes(term)),
      );
    }

    return result;
  }, [orders, activeTab, searchTerm]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const prepareOrder = async (orderId: number) => {
    setPreparingOrderId(orderId);
    try {
      return await runMutation(orderId, () => prepareProviderOrder(orderId), 'PREPARING');
    } finally {
      setPreparingOrderId(null);
    }
  };

  const deliverOutOrder = async (orderId: number) => {
    setDeliveringOutOrderId(orderId);
    try {
      return await runMutation(orderId, () => deliverOutProviderOrder(orderId), 'DELIVERING_OUT');
    } finally {
      setDeliveringOutOrderId(null);
    }
  };

  const shipOrder = async (
    orderId: number,
    trackingCode: string,
    shippingCarrierName: string,
    notes: string[],
    images: File[],
    autoCreateGhn = false,
  ) => {
    setShippingOrderId(orderId);
    try {
      return await runMutation(
        orderId,
        async () => {
          await shipProviderOrder(orderId, trackingCode, shippingCarrierName, notes, images, {
            autoCreateGhn,
          });
        },
        STATUS_AFTER_ACTION.ship,
      );
    } finally {
      setShippingOrderId(null);
    }
  };

  const completeOrder = async (orderId: number) => {
    setCompletingOrderId(orderId);
    try {
      return await runMutation(orderId, () => completeProviderOrder(orderId), 'COMPLETED');
    } finally {
      setCompletingOrderId(null);
    }
  };

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    tabCounts,
    refetch,
    prepareOrder,
    preparingOrderId,
    deliverOutOrder,
    deliveringOutOrderId,
    shipOrder,
    shippingOrderId,
    completeOrder,
    completingOrderId,
    providerId,
  };
}
