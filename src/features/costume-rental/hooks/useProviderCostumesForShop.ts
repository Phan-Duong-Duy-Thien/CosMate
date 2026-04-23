import { useState, useEffect } from 'react'
import { getAllCostumes } from '../api/costumeRental.api'
import type { Costume } from '../types'
import { formatFirstCharacterListLine } from './usePublicCostumes'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_BASE}${url}`
}

export interface MoreFromShopItem {
  id: string
  name: string
  characterName: string
  imageUrl: string
  pricePerDay: number
  rentalCount: number
  brandName?: string
}

interface UseProviderCostumesForShopResult {
  items: MoreFromShopItem[]
  loading: boolean
  error: string | null
}

export function useProviderCostumesForShop(
  providerId: number,
  currentCostumeId?: string
): UseProviderCostumesForShopResult {
  const [items, setItems] = useState<MoreFromShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetch_ = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getAllCostumes()
        const costumes: Costume[] = res.result ?? []

        const mapped: MoreFromShopItem[] = costumes
          .filter((c) => c.providerId === providerId && String(c.id) !== currentCostumeId)
          .slice(0, 4)
          .map((c) => ({
            id: String(c.id),
            name: c.name ?? '',
            characterName: formatFirstCharacterListLine(c) || '—',
            imageUrl: resolveImageUrl(c.imageUrls?.[0] ?? ''),
            pricePerDay: c.pricePerDay ?? 0,
            rentalCount: c.rentalsCount ?? 0,
          }))

        if (!cancelled) {
          setItems(mapped)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách trang phục.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (providerId) {
      fetch_()
    }

    return () => { cancelled = true }
  }, [providerId, currentCostumeId])

  return { items, loading, error }
}
