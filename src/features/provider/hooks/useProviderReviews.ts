/**
 * Hook for fetching provider reviews
 */
import { useState, useEffect, useMemo } from 'react';
import { fetchProviderReviews } from '../services/provider.service';
import { getAuth } from '@/features/auth/services/tokenStorage';
import type { ProviderReview } from '../api/provider.api';

interface UseProviderReviewsResult {
  reviews: ProviderReview[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  providerId: number | null;
}

export function useProviderReviews(): UseProviderReviewsResult {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get providerId from JWT token
  const providerId = useMemo(() => {
    const auth = getAuth();
    if (!auth?.token) return null;

    try {
      const parts = auth.token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      return decoded?.providerId ?? decoded?.provider_id ?? null;
    } catch {
      return null;
    }
  }, []);

  const refetch = async () => {
    if (!providerId) {
      setError('Không tìm thấy thông tin provider. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchProviderReviews(providerId);
      setReviews(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [providerId]);

  return {
    reviews,
    loading,
    error,
    refetch,
    providerId,
  };
}
