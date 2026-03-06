/**
 * Hook for fetching shop reviews
 */
import { useState, useEffect, useMemo } from 'react'
import { getMockShopReviews, getMockShopReviewStats, type ShopReview } from '../mocks/shopReviews.mock'

interface UseShopReviewsResult {
  reviews: ShopReview[]
  stats: {
    averageRating: number
    totalReviews: number
    ratingDistribution: Record<number, number>
  }
  loading: boolean
}

export function useShopReviews(providerId: number | undefined): UseShopReviewsResult {
  const [reviews, setReviews] = useState<ShopReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (providerId === undefined || providerId === null) {
      setReviews([])
      setLoading(false)
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockReviews = getMockShopReviews(providerId)
      setReviews(mockReviews)
      setLoading(false)
    }, 300)
  }, [providerId])

  const stats = useMemo(() => {
    return getMockShopReviewStats(reviews)
  }, [reviews])

  return {
    reviews,
    stats,
    loading,
  }
}
