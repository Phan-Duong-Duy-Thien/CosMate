import { useState, useEffect } from 'react'
import { checkReviewPermission } from '../services/reviews.service'

interface UseReviewPermissionResult {
  canReview: boolean
  orderId?: number
  loading: boolean
}

export function useReviewPermission(costumeId: number): UseReviewPermissionResult {
  const [result, setResult] = useState<UseReviewPermissionResult>({ canReview: false, loading: true })

  useEffect(() => {
    if (!costumeId) {
      setResult({ canReview: false, loading: false })
      return
    }

    let cancelled = false

    const check = async () => {
      try {
        const perm = await checkReviewPermission(costumeId)
        if (!cancelled) {
          setResult({ ...perm, loading: false })
        }
      } catch {
        if (!cancelled) {
          setResult({ canReview: false, loading: false })
        }
      }
    }

    check()
    return () => { cancelled = true }
  }, [costumeId])

  return result
}
