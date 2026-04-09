import { useState, useCallback, useEffect } from 'react'
import type { WithdrawResult } from '@/features/profile/api/withdraw.api'
import * as withdrawService from '../services/withdraw.service'

interface UseWithdrawRequestsResult {
  withdrawRequests: WithdrawResult[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useWithdrawRequests(): UseWithdrawRequestsResult {
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await withdrawService.fetchWithdrawRequests()
      setWithdrawRequests(result)
    } catch (err) {
      console.error('Failed to fetch withdraw requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load withdraw requests')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    void refetch()
  }, [refetch])

  return { withdrawRequests, loading, error, refetch }
}
