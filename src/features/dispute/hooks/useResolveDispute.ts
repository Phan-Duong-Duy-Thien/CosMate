/**
 * useResolveDispute Hook
 * Resolves a dispute with penalty information
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import * as disputeService from '../services/dispute.service';
import type { ResolveDisputePayload } from '../types/dispute.type';
import { VI } from '@/shared/i18n/vi';

interface UseResolveDisputeResult {
  resolvingId: number | null;
  resolveDispute: (id: number, data: ResolveDisputePayload) => Promise<boolean>;
}

export function useResolveDispute(onSuccess?: () => void): UseResolveDisputeResult {
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const resolveDispute = useCallback(
    async (id: number, data: ResolveDisputePayload): Promise<boolean> => {
      setResolvingId(id);
      try {
        await disputeService.resolveDispute(id, data);
        message.success(VI.dispute.resolveSuccess);
        onSuccess?.();
        return true;
      } catch {
        message.error(VI.dispute.resolveError);
        return false;
      } finally {
        setResolvingId(null);
      }
    },
    [onSuccess]
  );

  return { resolvingId, resolveDispute };
}
