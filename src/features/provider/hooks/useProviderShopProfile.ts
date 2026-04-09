/**
 * Hook for fetching shop profile data
 */
import { useState, useEffect } from 'react'
import { getProviderById } from '../api/providerShop.api'
import type { ProviderShop } from '../types'

interface UseProviderShopProfileResult {
  shop: ProviderShop | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProviderShopProfile(providerId: number | undefined): UseProviderShopProfileResult {
  const [shop, setShop] = useState<ProviderShop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShop = async () => {
    if (providerId === undefined || providerId === null) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getProviderById(providerId)
      setShop(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shop profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShop()
  }, [providerId])

  return {
    shop,
    loading,
    error,
    refetch: fetchShop,
  }
}
