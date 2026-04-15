import { useState, useEffect, useCallback } from 'react'
import { getCostumeReviews } from '../services/reviews.service'
import { VI } from '@/shared/i18n/vi'
import type { ReviewItem } from '../api/review.api'

interface UseCostumeReviewsResult {
  reviews: ReviewItem[]
  loading: boolean
  error: string | null
}

export function useCostumeReviews(costumeId: number): UseCostumeReviewsResult {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    if (!costumeId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getCostumeReviews(costumeId)
      setReviews(data)
    } catch {
      setError(VI.costumeRental.detail.loadReviewsError)
    } finally {
      setLoading(false)
    }
  }, [costumeId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, loading, error }
}