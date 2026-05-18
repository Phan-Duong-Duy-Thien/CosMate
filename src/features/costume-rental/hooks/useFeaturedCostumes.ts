import { useCallback, useEffect, useState } from "react"

import { getCostumes } from "../api/costume.api"
import { getProviderById } from "../api/provider.api"
import { resolveImageUrl } from "./usePublicCostumeDetail"
import { mapCostumeToItem } from "./usePublicCostumes"
import type { CostumeItem } from "../types"

export function useFeaturedCostumes() {
  const [items, setItems] = useState<CostumeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedCostumes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const costumes = await getCostumes()
      const visibleCostumes = costumes
        .filter((costume) => costume.status !== "DELETED")
        .slice(0, 8)
      const normalized = visibleCostumes.map((costume) => ({
        ...costume,
        imageUrls: (costume.imageUrls ?? []).map(resolveImageUrl),
      }))

      const uniqueProviderIds = [...new Set(normalized.map((c) => c.providerId))]
      const providerResults = await Promise.all(
        uniqueProviderIds.map((id) => getProviderById(id).catch(() => null))
      )
      const providerMap = Object.fromEntries(
        providerResults
          .filter((p): p is NonNullable<typeof p> => p !== null)
          .map((p) => [p.id, p.shopName ?? "—"])
      )

      const mapped = normalized.map((c) =>
        mapCostumeToItem(c, providerMap[c.providerId] ?? "—")
      )
      setItems(mapped)
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
