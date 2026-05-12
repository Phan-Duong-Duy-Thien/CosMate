/**
 * usePublicCostumes
 *
 * Fetches GET /api/costumes and maps the backend Costume model
 * into the CostumeItem shape expected by CostumeCard / CostumeGrid.
 *
 * Data flow: Hook -> API -> axiosInstance
 * No direct API calls from page or components.
 */

import { useState, useEffect, useCallback } from 'react'
import { getCostumes } from '../api/costume.api'
import { getProviderById } from '../api/provider.api'
import type { CostumeItem, Costume } from '../types'
import { VI } from '@/shared/i18n/vi'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_BASE}${url}`
}

function roundToNearest10k(value: number): number {
  return Math.round(value / 10000) * 10000
}

function computePriceRange(costume: Costume): { priceMin: number; priceMax: number }{
  const baseDaily = costume.pricePerDay ?? 0
  const deposit = costume.depositAmount ?? 0
  const options = costume.rentalOptions ?? []
  const optionAvg =
    options.length > 0
      ? options.reduce((sum, o) => sum + (o.price ?? 0), 0) / options.length
      : 0
  const minTotal = 1 * baseDaily + deposit + optionAvg
  const maxTotal = 3 * baseDaily + deposit + optionAvg
  const minVnd = roundToNearest10k(minTotal)
  const maxVnd = roundToNearest10k(maxTotal)
  return { priceMin: minVnd, priceMax: maxVnd }
}

/** First linked character for list cards: "Name (từ Anime)"; empty if none */
export function formatFirstCharacterListLine(costume: Pick<Costume, 'characters'>): string {
  const chars = costume.characters ?? []
  if (!chars.length) return ''
  const first = chars[0]
  const name = (first?.name ?? '').trim()
  const anime = (first?.anime ?? '').trim()
  if (name && anime) return `${name} (${VI.costumeRental.characterFromWork} ${anime})`
  return name || anime
}

export function mapCostumeToItem(
  costume: Costume,
  shopName: string
): CostumeItem {
  const images = (costume.imageUrls ?? []).map(resolveImageUrl).filter(Boolean)
  const accessoryListLength = costume.accessories?.length ?? 0
  const { priceMin, priceMax } = computePriceRange(costume)

  return {
    id: String(costume.id),
    name: costume.name ?? '',
    description: costume.description ?? '',
    characterName: formatFirstCharacterListLine(costume) || '—',
    seriesName: '',
    seriesType: 'anime',
    shopId: String(costume.providerId),
    shopName,
    tags: [],
    isAdult18: false,
    bestSeller: costume.bestSeller === true,
    isAvailable: costume.status === 'AVAILABLE',
    rating: 0,
    reviewCount: 0,
    rentalsCount: costume.rentalsCount ?? 0,
    priceMin,
    priceMax,
    brand: '',
    brandType: 'non_brand',
    region: 'hcm',
    images: images.length > 0 ? images : [],
    hasAccessories: accessoryListLength > 0,
    accessoryCount: accessoryListLength > 0 ? accessoryListLength : undefined,
    accessoryOptions: (costume.accessories ?? []).map((a) => ({
      id: String(a.id),
      name: a.name,
      price: a.price,
    })),
    sizeOptions: costume.size
      ? [costume.size.toLowerCase() as CostumeItem['sizeOptions'][number]]
      : [],
    createdAt: new Date().toISOString(),
    details: [],
    rentalPurposes: ['fes_shoot'],
    basePriceByPurpose: {
      test: costume.pricePerDay ?? 0,
      fes_shoot: costume.pricePerDay ?? 0,
      event: costume.pricePerDay ?? 0,
    },
    deposit: costume.depositAmount ?? 0,
    laundryFee: 0,
  }
}

export function usePublicCostumes() {
  const [items, setItems] = useState<CostumeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCostumes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Call real API
      const costumes = await getCostumes()
      const visibleCostumes = costumes.filter((c) => c.status !== 'DELETED')

      // Batch fetch shop names — deduplicate providerIds, fetch in parallel
      const uniqueProviderIds = [...new Set(visibleCostumes.map((c) => c.providerId))]
      const providerResults = await Promise.all(
        uniqueProviderIds.map((id) => getProviderById(id).catch(() => null))
      )
      const providerMap = Object.fromEntries(
        providerResults
          .filter((p): p is NonNullable<typeof p> => p !== null)
          .map((p) => [p.id, p.shopName ?? '—'])
      )

      const mapped = visibleCostumes.map((c) =>
        mapCostumeToItem(c, providerMap[c.providerId] ?? '—')
      )
      setItems(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong the tai danh sach trang phuc.')
    }finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCostumes()
  }, [fetchCostumes])

  return { items, isLoading, error, refetch: fetchCostumes }
}
