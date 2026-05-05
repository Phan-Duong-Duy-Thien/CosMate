import { useCallback, useEffect, useState } from "react"

import { getCostumes } from "../api/costume.api"
import { resolveImageUrl } from "./usePublicCostumeDetail"
import type { Costume } from "../types"

export function useFeaturedCostumes() {
  const [items, setItems] = useState<Costume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedCostumes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const costumes = await getCostumes()
      const visibleCostumes = costumes.filter((costume) => costume.status !== 'DELETED')
      const normalized = visibleCostumes.map((costume) => ({
        ...costume,
        imageUrls: (costume.imageUrls ?? []).map(resolveImageUrl),
      }))
      setItems(normalized.slice(0, 10))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load costumes.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeaturedCostumes()
  }, [fetchFeaturedCostumes])

  return {
    items,
    isLoading,
    error,
    refetch: fetchFeaturedCostumes,
  }
}
