import { useState, useEffect } from "react"
import { getProviderById, type ProviderDto } from "../api/provider.api"

interface UseProviderInfoResult {
  provider: ProviderDto | null
  loading: boolean
  error: string | null
}

export function useProviderInfo(providerId?: number): UseProviderInfoResult {
  const [provider, setProvider] = useState<ProviderDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (providerId === undefined || providerId === null) {
      setProvider(null)
      setError(null)
      return
    }

    const fetchProvider = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getProviderById(providerId)
        setProvider(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải thông tin shop")
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [providerId])

  return { provider, loading, error }
}
