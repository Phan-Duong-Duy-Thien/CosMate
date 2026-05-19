import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { VI } from '@/shared/i18n/vi';
import * as staffTokenPlansService from '../services/staffTokenPlans.service';
import type { AiTokenPlan, CreateAiTokenPlanRequest } from '../types';
import {
  removeInactivePlanFromCache,
  removePlanFromCaches,
  trackKnownPlanId,
  upsertInactivePlanCache,
} from '../utils/inactivePlansCache';

export function useStaffAiTokenPlans() {
  const [plans, setPlans] = useState<AiTokenPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPlans = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    try {
      if (!silent) setLoading(true);
      const data = await staffTokenPlansService.listAiTokenPlansForManagement();
      setPlans(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : VI.staff.tokenPlans.loadError;
      if (!silent) {
        message.error(msg);
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
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        String(p.numberOfToken).includes(q)
      );
    });
  }, [plans, search, activeFilter]);

  const total = filtered.length;
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const createPlan = useCallback(
    async (payload: CreateAiTokenPlanRequest): Promise<boolean> => {
      try {
        setIsCreating(true);
        const created = await staffTokenPlansService.createAiTokenPlan(payload);
        if (created) {
          trackKnownPlanId(created.id);
          if (!created.isActive) upsertInactivePlanCache(created);
        }
        message.success(VI.staff.tokenPlans.createSuccess);
        await fetchPlans({ silent: true });
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : VI.staff.tokenPlans.createError);
        message.error(typeof msg === 'string' && msg ? msg : VI.staff.tokenPlans.createError);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchPlans]
  );

  const updatePlan = useCallback(
    async (id: number, payload: CreateAiTokenPlanRequest): Promise<boolean> => {
      try {
        setIsUpdating(true);
        await staffTokenPlansService.updateAiTokenPlan(id, payload);
        message.success(VI.staff.tokenPlans.updateSuccess);
        await fetchPlans({ silent: true });
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : VI.staff.tokenPlans.updateError);
        message.error(typeof msg === 'string' && msg ? msg : VI.staff.tokenPlans.updateError);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchPlans]
  );

  const activatePlan = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setTogglingId(id);
        await staffTokenPlansService.activateAiTokenPlan(id);
        removeInactivePlanFromCache(id);
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: true } : p)));
        setActiveFilter((f) => (f === false ? null : f));
        message.success(VI.staff.tokenPlans.activateSuccess);
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : VI.staff.tokenPlans.activateError);
        message.error(typeof msg === 'string' && msg ? msg : VI.staff.tokenPlans.activateError);
        return false;
      } finally {
        setTogglingId(null);
      }
    },
    [fetchPlans]
  );

  const deactivatePlan = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setTogglingId(id);
        await staffTokenPlansService.deactivateAiTokenPlan(id);
        setPlans((prev) => {
          const target = prev.find((p) => p.id === id);
          if (target) {
            upsertInactivePlanCache({ ...target, isActive: false });
          }
          return prev.map((p) => (p.id === id ? { ...p, isActive: false } : p));
        });
        setActiveFilter((f) => (f === true ? null : f));
        message.success(VI.staff.tokenPlans.deactivateSuccess);
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : VI.staff.tokenPlans.deactivateError);
        message.error(typeof msg === 'string' && msg ? msg : VI.staff.tokenPlans.deactivateError);
        return false;
      } finally {
        setTogglingId(null);
      }
    },
    [fetchPlans]
  );

  const deletePlan = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setDeletingId(id);
        await staffTokenPlansService.deleteAiTokenPlan(id);
        removePlanFromCaches(id);
        setPlans((prev) => prev.filter((p) => p.id !== id));
        message.success(VI.staff.tokenPlans.deleteSuccess);
        await fetchPlans({ silent: true });
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : VI.staff.tokenPlans.deleteError);
        message.error(typeof msg === 'string' && msg ? msg : VI.staff.tokenPlans.deleteError);
        return false;
      } finally {
        setDeletingId(null);
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
    togglingId,
    deletingId,
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
    activatePlan,
    deactivatePlan,
    deletePlan,
  };
}
