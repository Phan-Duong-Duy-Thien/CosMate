import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import {
  getStaffAiTokenPurchaseById,
  getStaffAiTokenPurchases,
} from '../api/staffTokenPurchases.api';
import type { AiTokenPurchase } from '../types';
import { VI } from '@/shared/i18n/vi';

export function useStaffAiTokenPurchases() {
  const [purchases, setPurchases] = useState<AiTokenPurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detail, setDetail] = useState<AiTokenPurchase | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPurchases = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    try {
      if (!silent) setLoading(true);
      const data = await getStaffAiTokenPurchases();
      setPurchases(Array.isArray(data) ? data : []);
    } catch {
      if (!silent) {
        message.error(VI.staff.tokenPurchases.loadError);
        setPurchases([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPurchases();
  }, [fetchPurchases]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const statusOptions = useMemo(() => {
    const set = new Set(purchases.map((p) => p.status).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [purchases]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return purchases.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        String(p.id).includes(q) ||
        String(p.userId).includes(q) ||
        String(p.subscriptionId).includes(q) ||
        String(p.transactionId).includes(q) ||
        p.status.toLowerCase().includes(q)
      );
    });
  }, [purchases, search, statusFilter]);

  const total = filtered.length;
  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const fetchDetail = useCallback(
    async (id: number, fallback?: AiTokenPurchase) => {
      setDetailLoading(true);
      setDetail(fallback ?? null);
      try {
        const data = await getStaffAiTokenPurchaseById(id);
        setDetail(data);
        return data;
      } catch {
        if (fallback) {
          setDetail(fallback);
          message.warning(VI.staff.tokenPurchases.detailFallback);
          return fallback;
        }
        message.error(VI.staff.tokenPurchases.detailError);
        setDetail(null);
        return null;
      } finally {
        setDetailLoading(false);
      }
    },
    []
  );

  const clearDetail = useCallback(() => {
    setDetail(null);
    setDetailLoading(false);
  }, []);

  return {
    rows,
    total,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusOptions,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch: fetchPurchases,
    detail,
    detailLoading,
    fetchDetail,
    clearDetail,
  };
}
