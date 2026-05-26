import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { getStaffOrders } from '../api/staffOrders.api';
import { normalizeOrderListRow } from '@/features/order/utils/normalizeOrderListRow';
import type { OrderListRow } from '../types/order';
import { VI } from '@/shared/i18n/vi';

export function useStaffOrders() {
  const [orders, setOrders] = useState<OrderListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await getStaffOrders();
      const rows = (Array.isArray(raw) ? raw : []).map((item) =>
        normalizeOrderListRow(item as Record<string, unknown>)
      );
      setOrders(rows);
    } catch {
      message.error(VI.staff.orders.loadError);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, orderTypeFilter]);

  const statusOptions = useMemo(() => {
    const set = new Set(orders.map((o) => o.status).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const orderTypeOptions = useMemo(() => {
    const set = new Set(orders.map((o) => o.orderType).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (orderTypeFilter && o.orderType !== orderTypeFilter) return false;
      if (!q) return true;
      return (
        String(o.id).includes(q) ||
        String(o.cosplayerId).includes(q) ||
        String(o.providerId).includes(q) ||
        o.orderType.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter, orderTypeFilter]);

  const total = filtered.length;
  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return {
    rows,
    total,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    orderTypeFilter,
    setOrderTypeFilter,
    statusOptions,
    orderTypeOptions,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch: fetchOrders,
  };
}
