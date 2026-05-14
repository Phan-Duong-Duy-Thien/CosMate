import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { createAdminSubscriptionPlan, getAdminSubscriptionPlans, updateAdminSubscriptionPlan } from '../api/adminSubscriptionPlans.api';
import type { AdminSubscriptionPlan, CreateSubscriptionPlanRequest } from '../types';
import { formatBillingCycleMonths } from '../utils/formatBillingCycleMonths';

export function useAdminSubscriptionPlans() {
  const [plans, setPlans] = useState<AdminSubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPlans = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    try {
      if (!silent) setLoading(true);
      const data = await getAdminSubscriptionPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch {
      if (!silent) {
        message.error('Không thể tải danh sách gói đăng ký');
        setPlans([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

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
        await fetchPlans({ silent: true });
        return true;
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        message.error(typeof msg === 'string' && msg ? msg : 'Không thể tạo gói đăng ký');
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchPlans]
  );

  const updatePlan = useCallback(
    async (id: number, payload: CreateSubscriptionPlanRequest): Promise<boolean> => {
      try {
        setIsUpdating(true);
        await updateAdminSubscriptionPlan(id, payload);
        message.success('Cập nhật gói đăng ký thành công');
        await fetchPlans({ silent: true });
        return true;
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        message.error(typeof msg === 'string' && msg ? msg : 'Không thể cập nhật gói đăng ký');
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchPlans]
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
