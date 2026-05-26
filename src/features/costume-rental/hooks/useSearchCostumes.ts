/**
 * useSearchCostumes
 *
 * Hook for keyword-based costume search.
 * Data flow: Hook -> API -> axiosInstance
 * No direct API calls from page or components.
 */

import { useCallback, useRef, useState } from 'react'
import { searchCostumes } from '../api/costume.api'
import { getProviderById } from '../api/provider.api'
import { mapCostumeToItem } from './usePublicCostumes'
import type { CostumeItem } from '../types'

const DEBOUNCE_MS = 400

export function useSearchCostumes() {
  const [results, setResults] = useState<CostumeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(
    async (keyword: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }

      const trimmed = keyword.trim()

      if (!trimmed) {
        setResults([])
        setIsLoading(false)
        setError(null)
        return
      }

      debounceTimer.current = setTimeout(async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await searchCostumes(trimmed)
          const costumes = response.result ?? []
          const uniqueProviderIds = [...new Set(costumes.map((c) => c.providerId))]
          const providerResults = await Promise.all(
            uniqueProviderIds.map((id) => getProviderById(id).catch(() => null)),
          )
          const providerMap = Object.fromEntries(
            providerResults
              .filter((p): p is NonNullable<typeof p> => p !== null)
              .map((p) => [p.id, p.shopName ?? '—']),
          )
          const mapped = costumes.map((c) =>
            mapCostumeToItem(c, providerMap[c.providerId] ?? '—'),
          )
          setResults(mapped)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Search failed.')
          setResults([])
        } finally {
          setIsLoading(false)
        }
      }, DEBOUNCE_MS)
    },
    []
  )

  const clearResults = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    setResults([])
    setIsLoading(false)
    setError(null)
  }, [])

  return { search, clearResults, results, isLoading, error }
}
