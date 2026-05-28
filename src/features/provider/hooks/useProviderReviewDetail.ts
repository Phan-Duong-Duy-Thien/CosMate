/**
 * Loads merged review detail (order API → review id API → list row) for provider dashboard modal.
 */
import { useState, useCallback } from 'react';
import type { ProviderReview } from '../api/provider.api';
import {
  fetchProviderReviewDetailForDashboard,
  type ProviderReviewDetailNormalized,
} from '../services/provider.service';

export function useProviderReviewDetail() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ProviderReviewDetailNormalized | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDetail = useCallback(async (row: ProviderReview) => {
    setOpen(true);
    setDetail(null);
    setError(null);
    setLoading(true);
    try {
      const normalized = await fetchProviderReviewDetailForDashboard(row);
      setDetail(normalized);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setOpen(false);
    setDetail(null);
    setError(null);
  }, []);

  const updateDetailReply = useCallback(
    (providerReply: string | null, repliedAt: string | null) => {
      setDetail((prev) =>
        prev ? { ...prev, providerReply, repliedAt } : prev
      );
    },
    []
  );

  return { open, detail, loading, error, openDetail, closeDetail, updateDetailReply };
}
