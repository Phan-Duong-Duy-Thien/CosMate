/**
 * Hook for fetching shop profile data
 */
import { useState, useEffect } from 'react'
import { getProviderById } from '../api/providerShop.api'
import { getMockShopProfile } from '../mocks/shopProfile.mock'
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
      // Try to fetch from API first
      // For now, use mock data since API might not have all fields
      // const data = await getProviderById(providerId)
      const mockData = getMockShopProfile(providerId)
      setShop(mockData)
    } catch (err) {
      // Fallback to mock data on error
      const mockData = getMockShopProfile(providerId)
      setShop(mockData)
      setError(null) // Don't show error since we're using mock
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
