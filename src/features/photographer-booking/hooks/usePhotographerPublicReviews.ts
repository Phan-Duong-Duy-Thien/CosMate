/**
 * Public photographer profile — reviews for a provider (by URL id).
 * Data: GET /api/reviews/provider/{providerId} via provider feature service.
 */
import { useState, useEffect, useCallback } from 'react'
import { fetchProviderReviews } from '@/features/provider/services/provider.service'
import type { ProviderReview } from '@/features/provider/api/provider.api'

interface UsePhotographerPublicReviewsResult {
  reviews: ProviderReview[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePhotographerPublicReviews(
  providerId: number | undefined,
): UsePhotographerPublicReviewsResult {
  const [reviews, setReviews] = useState<ProviderReview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (providerId == null || providerId === 0) {
      setReviews([])
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProviderReviews(providerId)
      setReviews(data ?? [])
    } catch (err) {
      setReviews([])
      setError(err instanceof Error ? err.message : 'Không thể tải đánh giá')
    } finally {
      setLoading(false)
    }
  }, [providerId])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { reviews, loading, error, refetch }
}
