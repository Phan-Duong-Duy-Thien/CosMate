import * as React from "react"

import { resolveImageUrl } from "@/constants/images"
import { getProvidersByRole } from "@/features/provider/api/providerShop.api"
import type { Shop } from "../pages/home.types"

const FALLBACK_AVATAR =
  "https://placehold.co/96x96/f8fafc/94a3b8?text=Shop"

function normalizeRating(totalRating: number, totalReviews: number): number {
  if (totalRating <= 0) return 0
  // Backend responses are inconsistent across environments:
  // - some return average rating in totalRating (0..5)
  // - some return rating sum and totalReviews separately.
  if (totalRating <= 5) return totalRating
  if (totalReviews > 0) return totalRating / totalReviews
  return 0
}

export function useTrustedShops() {
  const [shops, setShops] = React.useState<Shop[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const fetchShops = async () => {
      setLoading(true)
      setError(null)
      try {
        const providers = await getProvidersByRole("PROVIDER_RENTAL")
        if (cancelled) return
        const mapped = providers
          .map<Shop>((provider) => {
            const rating = normalizeRating(
              provider.totalRating ?? 0,
              provider.totalReviews ?? 0
            )
            return {
              id: String(provider.id),
              name: provider.shopName?.trim() || `Shop #${provider.id}`,
              rating,
              rentalsCount: provider.completedOrders ?? 0,
              topRated: rating >= 4.8 || provider.verified,
              avatarUrl: resolveImageUrl(provider.avatarUrl) || FALLBACK_AVATAR,
            }
          })
          .sort((a, b) => b.rating - a.rating || b.rentalsCount - a.rentalsCount)
          .slice(0, 12)
        setShops(mapped)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Không thể tải danh sách shop")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchShops()
    return () => {
      cancelled = true
    }
  }, [])

  return { shops, loading, error }
}
