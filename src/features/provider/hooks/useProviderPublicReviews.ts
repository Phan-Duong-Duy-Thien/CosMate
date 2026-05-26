/**
 * Hook for fetching public provider reviews (shop profile, photographer, staff).
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchProviderReviews } from '../services/provider.service';
import type { ProviderReview } from '../api/provider.api';

interface UseProviderPublicReviewsResult {
  reviews: ProviderReview[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProviderPublicReviews(
  providerId: number | undefined
): UseProviderPublicReviewsResult {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (providerId == null || Number.isNaN(providerId)) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchProviderReviews(providerId);
      setReviews(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải đánh giá';
      setError(message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { reviews, loading, error, refetch };
}
