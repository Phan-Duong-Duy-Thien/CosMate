import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import * as adminProvidersService from '../services/adminProviders.service';
import type { AdminProviderRow } from '../services/adminProviders.service';

export function useAdminProviders() {
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AdminProviderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const { content, totalElements } = await adminProvidersService.getAdminProvidersPage(page, pageSize, {
        search: search.trim() || undefined,
        verified: verifiedFilter,
      });
      setRows(content);
      setTotal(totalElements);
    } catch {
      message.error('Không thể tải danh sách provider');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, verifiedFilter]);

  useEffect(() => {
    void fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    setPage(1);
  }, [search, verifiedFilter]);

  const runVerify = useCallback(
    async (providerId: number, verified: boolean) => {
      try {
        setActionLoadingId(providerId);
        await adminProvidersService.setProviderVerified(providerId, verified);
        message.success('Cập nhật trạng thái provider thành công');
        await fetchProviders();
      } catch {
        message.error('Không thể cập nhật provider');
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchProviders]
  );

  return {
    search,
    setSearch,
    verifiedFilter,
    setVerifiedFilter,
    loading,
    rows,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    actionLoadingId,
    refetch: fetchProviders,
    runVerify,
  };
}
