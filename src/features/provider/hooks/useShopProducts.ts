/**
 * Hook for managing shop products with filtering/sorting
 */
import { useState, useMemo } from 'react'
import type { ShopProduct } from '../mocks/shopProducts.mock'
import { useProviderCostumesForShop } from '@/features/costume-rental/hooks/useProviderCostumesForShop'
import { usePublicCostumes } from '@/features/costume-rental/hooks/usePublicCostumes'

export type SortOption = 'bestSelling' | 'newest'

export interface ProductFilterState {
  search: string
  sort: SortOption
  minPrice: number | null
  maxPrice: number | null
}

interface UseShopProductsResult {
  products: ShopProduct[]
  recommendedProducts: ShopProduct[]
  filterState: ProductFilterState
  setSearch: (search: string) => void
  setSort: (sort: SortOption) => void
  setMinPrice: (price: number | null) => void
  setMaxPrice: (price: number | null) => void
  resetFilters: () => void
}

const initialFilterState: ProductFilterState = {
  search: '',
  sort: 'bestSelling',
  minPrice: null,
  maxPrice: null,
}

export function useShopProducts(providerId: number | undefined): UseShopProductsResult {
  const [filterState, setFilterState] = useState<ProductFilterState>(initialFilterState)
  const safeProviderId = providerId ?? 0
  const { items: shopItems } = useProviderCostumesForShop(safeProviderId, undefined, Number.MAX_SAFE_INTEGER)
  const { items: publicItems } = usePublicCostumes()

  const mapToShopProduct = (input: {
    id: string
    name: string
    characterName: string
    imageUrl: string
    pricePerDay: number
    rentalCount: number
    status?: 'AVAILABLE' | 'RENTED'
    brandName?: string
  }): ShopProduct => ({
    id: input.id,
    name: input.name,
    characterName: input.characterName,
    seriesName: '',
    imageUrl: input.imageUrl,
    pricePerDay: input.pricePerDay,
    rentalCount: input.rentalCount,
    brandType: input.brandName ? 'brand' : 'non_brand',
    brandName: input.brandName,
    hasAccessories: false,
    status: input.status ?? 'AVAILABLE',
  })

  // "Sản phẩm khác của shop" - reuse same source logic as costume detail.
  const allProducts = useMemo<ShopProduct[]>(() => {
    if (!providerId) return []
    return shopItems.map((item) =>
      mapToShopProduct({
        id: item.id,
        name: item.name,
        characterName: item.characterName,
        imageUrl: item.imageUrl,
        pricePerDay: item.pricePerDay,
        rentalCount: item.rentalCount,
        brandName: item.brandName,
      }),
    )
  }, [providerId, shopItems])

  // "Gợi ý sản phẩm phù hợp với bạn" - from existing public costumes hook.
  const recommendedProducts = useMemo<ShopProduct[]>(() => {
    if (!publicItems.length) return []
    const shuffled = [...publicItems].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4).map((item) =>
      mapToShopProduct({
        id: item.id,
        name: item.name,
        characterName: item.characterName,
        imageUrl: item.images?.[0] ?? '',
        pricePerDay: item.basePriceByPurpose?.fes_shoot ?? item.priceMin ?? 0,
        rentalCount: item.rentalsCount ?? 0,
        status: item.isAvailable ? 'AVAILABLE' : 'RENTED',
        brandName: item.brand || undefined,
      }),
    )
  }, [publicItems])

  // Filter and sort products
  const products = useMemo(() => {
    let filtered = [...allProducts]

    // Filter by search
    if (filterState.search) {
      const searchLower = filterState.search.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.characterName.toLowerCase().includes(searchLower) ||
          p.seriesName.toLowerCase().includes(searchLower)
      )
    }

    // Filter by price
    if (filterState.minPrice !== null) {
      filtered = filtered.filter(p => p.pricePerDay >= filterState.minPrice!)
    }
    if (filterState.maxPrice !== null) {
      filtered = filtered.filter(p => p.pricePerDay <= filterState.maxPrice!)
    }

    // Sort
    switch (filterState.sort) {
      case 'bestSelling':
        filtered.sort((a, b) => b.rentalCount - a.rentalCount)
        break
      case 'newest':
        // In real app, sort by createdAt; for now, use id as proxy
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
    }

    return filtered
  }, [allProducts, filterState])

  const setSearch = (search: string) => {
    setFilterState(prev => ({ ...prev, search }))
  }

  const setSort = (sort: SortOption) => {
    setFilterState(prev => ({ ...prev, sort }))
  }

  const setMinPrice = (minPrice: number | null) => {
    setFilterState(prev => ({ ...prev, minPrice }))
  }

  const setMaxPrice = (maxPrice: number | null) => {
    setFilterState(prev => ({ ...prev, maxPrice }))
  }

  const resetFilters = () => {
    setFilterState(initialFilterState)
  }

  return {
    products,
    recommendedProducts,
    filterState,
    setSearch,
    setSort,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  }
}
