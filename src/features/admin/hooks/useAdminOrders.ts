import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import * as adminOrdersService from '../services/adminOrders.service';
import type { AdminOrderRow } from '../services/adminOrders.service';

export function useAdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allRows, setAllRows] = useState<AdminOrderRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminOrdersService.fetchAdminOrdersEnriched();
      setAllRows(data.content);
    } catch {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) =>
        `${r.code ?? ''} ${r.userName ?? ''} ${r.cosplayerName ?? ''} ${r.providerName ?? ''} ${r.id ?? ''}`
          .toLowerCase()
          .includes(q)
      );
    }
    if (statusFilter) {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    return rows;
  }, [allRows, search, statusFilter]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loading,
    allRows,
    filteredRows,
    paginatedRows,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch: fetchOrders,
  };
}
