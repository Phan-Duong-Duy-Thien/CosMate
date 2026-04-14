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
import type { CostumeItem, Costume } from '../types'

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
  const minK = roundToNearest10k(minTotal) / 1000
  const maxK = roundToNearest10k(maxTotal) / 1000
  return { priceMin: minK, priceMax: maxK }
}

function mapCostumeToItem(costume: Costume): CostumeItem {
  const images = (costume.imageUrls ?? []).map(resolveImageUrl).filter(Boolean)
  const accessoryCount = Math.max((costume.numberOfItems ?? 1) - 1, 0)
  const { priceMin, priceMax } = computePriceRange(costume)

  return {
    id: String(costume.id),
    name: costume.name ?? '',
    description: costume.description ?? '',
    characterName: '—',
    seriesName: '',
    seriesType: 'anime',
    shopId: String(costume.providerId),
    shopName: '—',
    tags: [],
    isAdult18: false,
    bestSeller: costume.status !== 'RENTED',
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
    hasAccessories: accessoryCount > 0,
    accessoryCount: accessoryCount > 0 ? accessoryCount : undefined,
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
      // Mock rentalsCount for testing (API chua tra ve truong nay)
      const mapped = visibleCostumes.map((c) => mapCostumeToItem({ ...c, rentalsCount: 120 + Math.floor(Math.random() * 100) }))
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
