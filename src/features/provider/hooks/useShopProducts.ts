/**
 * Hook for managing shop products with filtering/sorting
 */
import { useState, useMemo } from 'react'
import { getMockShopProducts, getMockRecommendedProducts, type ShopProduct } from '../mocks/shopProducts.mock'

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

  // Get all products
  const allProducts = useMemo(() => {
    if (providerId === undefined || providerId === null) return []
    return getMockShopProducts(providerId)
  }, [providerId])

  // Get recommended products
  const recommendedProducts = useMemo(() => {
    if (providerId === undefined || providerId === null) return []
    return getMockRecommendedProducts(providerId)
  }, [providerId])

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
