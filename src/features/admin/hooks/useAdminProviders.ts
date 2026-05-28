import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import * as adminProvidersService from '../services/adminProviders.service';
import type { AdminProviderRow } from '../services/adminProviders.service';
import { usePendingListMutation } from '@/shared/hooks/usePendingListMutation';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge';
import { DATA_SYNC_EVENTS, notifyProvidersChanged } from '@/shared/sync/dataSync';

export function useAdminProviders() {
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AdminProviderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const { mergeFetched, setPendingField } = usePendingListMutation<AdminProviderRow, boolean>({
    getItemId: (r) => r.id,
    getFieldValue: (r) => r.verified ?? false,
    setFieldValue: (r, verified) => ({ ...r, verified }),
  });

  const fetchProviders = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      try {
        if (!silent) {
          setLoading(true);
        }
        const { content, totalElements } = await adminProvidersService.getAdminProvidersPage(
          page,
          pageSize,
          {
            search: search.trim() || undefined,
            verified: verifiedFilter,
          },
        );
        setRows(mergeFetched(content));
        setTotal(totalElements);
      } catch {
        if (!silent) {
          message.error('Không thể tải danh sách provider');
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [page, pageSize, search, verifiedFilter, mergeFetched],
  );

  const scheduleSyncRefetch = useCallback(() => {
    scheduleBackgroundRefetch(() => fetchProviders({ silent: true }));
  }, [fetchProviders]);

  useEffect(() => {
    void fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    setPage(1);
  }, [search, verifiedFilter]);

  useDataSyncRefetch(() => fetchProviders({ silent: true }), DATA_SYNC_EVENTS.PROVIDERS_CHANGED);

  const runVerify = useCallback(
    async (providerId: number, verified: boolean) => {
      try {
        setActionLoadingId(providerId);
        await adminProvidersService.setProviderVerified(providerId, verified);
        message.success('Cập nhật trạng thái provider thành công');
        setPendingField(providerId, verified);
        setRows((prev) =>
          prev.map((r) => (r.id === providerId ? { ...r, verified } : r)),
        );
        notifyProvidersChanged({ providerId });
        scheduleSyncRefetch();
      } catch {
        message.error('Không thể cập nhật provider');
      } finally {
        setActionLoadingId(null);
      }
    },
    [setPendingField, scheduleSyncRefetch],
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
