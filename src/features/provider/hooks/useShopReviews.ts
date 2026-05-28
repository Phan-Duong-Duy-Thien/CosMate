/**
 * Hook for fetching shop reviews (public shop profile).
 */
import { useMemo } from 'react';
import { useProviderPublicReviews } from './useProviderPublicReviews';
import type { ProviderReview } from '../api/provider.api';

interface UseShopReviewsResult {
  reviews: ProviderReview[];
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  };
  loading: boolean;
  error: string | null;
}

function computeStats(reviews: ProviderReview[]) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const k = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingDistribution[k] = (ratingDistribution[k] ?? 0) + 1;
  }

  return { averageRating, totalReviews, ratingDistribution };
}

export function useShopReviews(providerId: number | undefined): UseShopReviewsResult {
  const { reviews, loading, error } = useProviderPublicReviews(providerId);
  const stats = useMemo(() => computeStats(reviews), [reviews]);

  return { reviews, stats, loading, error };
}
