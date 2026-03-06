import { useState, useCallback } from "react"
import { createReview, type CreateReviewParams, type CreateReviewResponse } from "../api/review.api"

interface UseCreateReviewResult {
  submit: (params: CreateReviewParams) => Promise<CreateReviewResponse | null>
  loading: boolean
  error: string | null
  success: boolean
  result: CreateReviewResponse | null
}

export function useCreateReview(): UseCreateReviewResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState<CreateReviewResponse | null>(null)

  const submit = useCallback(async (params: CreateReviewParams): Promise<CreateReviewResponse | null> => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setResult(null)

    try {
      const response = await createReview(params)
      setResult(response)
      setSuccess(true)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gửi đánh giá thất bại"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { submit, loading, error, success, result }
}
