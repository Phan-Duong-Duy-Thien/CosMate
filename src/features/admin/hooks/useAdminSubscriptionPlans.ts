import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { createAdminSubscriptionPlan, getAdminSubscriptionPlans, updateAdminSubscriptionPlan } from '../api/adminSubscriptionPlans.api';
import type { AdminSubscriptionPlan, CreateSubscriptionPlanRequest } from '../types';
import { formatBillingCycleMonths } from '../utils/formatBillingCycleMonths';
import { usePendingListMutation } from '@/shared/hooks/usePendingListMutation';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge';
import { DATA_SYNC_EVENTS, notifySubscriptionPlansChanged } from '@/shared/sync/dataSync';

export function useAdminSubscriptionPlans() {
  const [plans, setPlans] = useState<AdminSubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { mergeFetched, setPendingField } = usePendingListMutation<AdminSubscriptionPlan, boolean>({
    getItemId: (p) => p.id,
    getFieldValue: (p) => p.isActive,
    setFieldValue: (p, isActive) => ({ ...p, isActive }),
  });

  const fetchPlans = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent === true;
      try {
        if (!silent) setLoading(true);
        const data = await getAdminSubscriptionPlans();
        setPlans(mergeFetched(Array.isArray(data) ? data : []));
      } catch {
        if (!silent) {
          message.error('Không thể tải danh sách gói đăng ký');
          setPlans([]);
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [mergeFetched],
  );

  const scheduleSyncRefetch = useCallback(() => {
    scheduleBackgroundRefetch(() => fetchPlans({ silent: true }));
  }, [fetchPlans]);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  useDataSyncRefetch(
    () => fetchPlans({ silent: true }),
    DATA_SYNC_EVENTS.SUBSCRIPTION_PLANS_CHANGED,
  );

  useEffect(() => {
    setPage(1);
  }, [search, activeFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return plans.filter((p) => {
      if (activeFilter !== null && p.isActive !== activeFilter) return false;
      if (!q) return true;
      const cycleLabel = formatBillingCycleMonths(p.cycleMonths, p.billingCycle).toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.billingCycle.toLowerCase().includes(q) ||
        cycleLabel.includes(q) ||
        String(p.cycleMonths).includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [plans, search, activeFilter]);

  const total = filtered.length;
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const createPlan = useCallback(
    async (payload: CreateSubscriptionPlanRequest): Promise<boolean> => {
      try {
        setIsCreating(true);
        await createAdminSubscriptionPlan(payload);
        message.success('Tạo gói đăng ký thành công');
        notifySubscriptionPlansChanged();
        scheduleSyncRefetch();
        return true;
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        message.error(typeof msg === 'string' && msg ? msg : 'Không thể tạo gói đăng ký');
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [scheduleSyncRefetch],
  );

  const updatePlan = useCallback(
    async (id: number, payload: CreateSubscriptionPlanRequest): Promise<boolean> => {
      try {
        setIsUpdating(true);
        await updateAdminSubscriptionPlan(id, payload);
        message.success('Cập nhật gói đăng ký thành công');
        setPendingField(id, payload.isActive);
        setPlans((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  name: payload.name,
                  billingCycle: payload.billingCycle,
                  cycleMonths: payload.cycleMonths,
                  price: payload.price,
                  isActive: payload.isActive,
                  monthlyToken: payload.monthlyToken,
                  description: payload.description,
                }
              : p,
          ),
        );
        notifySubscriptionPlansChanged({ planId: id });
        scheduleSyncRefetch();
        return true;
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        message.error(typeof msg === 'string' && msg ? msg : 'Không thể cập nhật gói đăng ký');
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [setPendingField, scheduleSyncRefetch],
  );

  return {
    rows: pagedRows,
    total,
    loading,
    isCreating,
    isUpdating,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch: fetchPlans,
    createPlan,
    updatePlan,
  };
}
