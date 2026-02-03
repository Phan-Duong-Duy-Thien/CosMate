import * as React from "react"

import { costumeItems } from "../mocks/costumes.mock"
import { shops } from "../mocks/shops.mock"
import type { CostumeItem, FilterState, SortKey, UIState } from "../types"
import { FilterSidebar } from "../components/filters/FilterSidebar"
import { ShopResultCard } from "../components/ShopResultCard"
import { SortBar } from "../components/SortBar"
import { CostumeGrid } from "../components/CostumeGrid"
import { Pagination } from "../components/Pagination"
import { Button } from "@/shared/components/Button"

const PAGE_SIZE = 16

const tagOptions = [
  { key: "anime", label: "Anime" },
  { key: "game", label: "Game" },
  { key: "event", label: "Event" },
  { key: "photoshoot", label: "Photoshoot" },
  { key: "new", label: "New" },
  { key: "adult18", label: "18+" },
]

const regionOptions = [
  { key: "hcm", label: "TP. Hồ Chí Minh" },
  { key: "hn", label: "Hà Nội" },
  { key: "dn", label: "Đà Nẵng" },
  { key: "ct", label: "Cần Thơ" },
  { key: "hp", label: "Hải Phòng" },
]

const initialFilters: FilterState = {
  keyword: "",
  regionKeys: [],
  brandKeys: [],
  minRating: null,
  priceMin: null,
  priceMax: null,
  tagKeys: [],
  hasAccessories: false,
  onlyAvailable: false,
  onlyBestSeller: false,
}

const scoreByKeyword = (item: CostumeItem, keyword: string) => {
  if (!keyword) return 0
  const lowered = keyword.toLowerCase()
  let score = 0
  if (item.name.toLowerCase().includes(lowered)) score += 5
  if (item.characterName.toLowerCase().includes(lowered)) score += 4
  if (item.seriesName.toLowerCase().includes(lowered)) score += 3
  if (item.shopName.toLowerCase().includes(lowered)) score += 2
  return score
}

export default function CostumeListPage() {
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)
  const [sortKey, setSortKey] = React.useState<SortKey>("relevance")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [uiState, setUiState] = React.useState<UIState>("loading")
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([])
  const [errorMessage, setErrorMessage] = React.useState("")

  const brands = React.useMemo(
    () => Array.from(new Set(costumeItems.map((item) => item.brand))).sort(),
    []
  )

  const startLoading = React.useCallback(() => {
    setUiState("loading")
    setErrorMessage("")
    const delay = 400 + Math.round(Math.random() * 300)
    const timer = window.setTimeout(() => {
      setUiState("success")
    }, delay)
    return () => window.clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    const cleanup = startLoading()
    return () => cleanup?.()
  }, [startLoading])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortKey])

  const keyword = filters.keyword.trim().toLowerCase()
  const keywordShopMatches = React.useMemo(() => {
    if (keyword.length < 3) return []
    return shops.filter((shop) => shop.name.toLowerCase().includes(keyword))
  }, [keyword])

  const activeShopId =
    keywordShopMatches.length === 1 ? keywordShopMatches[0].id : null

  const shopCard = activeShopId
    ? shops.find((shop) => shop.id === activeShopId) ?? null
    : null

  const filteredItems = React.useMemo(() => {
    let result = costumeItems

    if (keyword) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.characterName.toLowerCase().includes(keyword) ||
          item.seriesName.toLowerCase().includes(keyword) ||
          item.shopName.toLowerCase().includes(keyword)
      )
    }

    if (activeShopId) {
      result = result.filter((item) => item.shopId === activeShopId)
    }

    if (filters.regionKeys.length) {
      result = result.filter((item) => filters.regionKeys.includes(item.region))
    }

    if (filters.brandKeys.length) {
      result = result.filter((item) => filters.brandKeys.includes(item.brand))
    }

    if (filters.minRating) {
      result = result.filter((item) => item.rating >= filters.minRating!)
    }

    if (filters.priceMin !== null) {
      result = result.filter((item) => item.priceMax >= filters.priceMin!)
    }

    if (filters.priceMax !== null) {
      result = result.filter((item) => item.priceMin <= filters.priceMax!)
    }

    if (filters.tagKeys.length) {
      result = result.filter((item) =>
        filters.tagKeys.some((tag) => item.tags.includes(tag))
      )
    }

    if (filters.hasAccessories) {
      result = result.filter((item) => item.hasAccessories)
    }

    if (filters.onlyAvailable) {
      result = result.filter((item) => item.isAvailable)
    }

    if (filters.onlyBestSeller) {
      result = result.filter((item) => item.bestSeller)
    }

    return result
  }, [filters, keyword, activeShopId])

  const sortedItems = React.useMemo(() => {
    const next = [...filteredItems]
    next.sort((a, b) => {
      if (sortKey === "newest") {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt)
      }
      if (sortKey === "bestSeller") {
        if (a.bestSeller !== b.bestSeller) {
          return a.bestSeller ? -1 : 1
        }
        return b.rating - a.rating
      }
      if (sortKey === "priceAsc") {
        return a.priceMin - b.priceMin
      }
      if (sortKey === "priceDesc") {
        return b.priceMin - a.priceMin
      }
      const scoreDiff =
        scoreByKeyword(b, keyword) - scoreByKeyword(a, keyword)
      if (scoreDiff !== 0) return scoreDiff
      return Date.parse(b.createdAt) - Date.parse(a.createdAt)
    })
    return next
  }, [filteredItems, sortKey, keyword])

  const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE)
  const hasResults = sortedItems.length > 0
  const safePage = Math.min(
    currentPage,
    Math.max(totalPages || 1, 1)
  )
  const displayPage = hasResults ? safePage : 0
  const displayTotalPages = hasResults ? totalPages : 0
  const pagedItems = hasResults
    ? sortedItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    : []

  const derivedState =
    uiState === "success" && sortedItems.length === 0 ? "empty" : uiState

  const handleReset = () => setFilters(initialFilters)

  const handleToggleWishlist = (costumeId: string) => {
    setWishlistIds((prev) =>
      prev.includes(costumeId)
        ? prev.filter((id) => id !== costumeId)
        : [...prev, costumeId]
    )
  }

  const handleRetry = () => startLoading()

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-10">
        <div className="rounded-3xl border border-white/80 bg-white/70 px-6 py-8 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-bold text-slate-900">Thuê đồ Cosplay</h1>
          <p className="mt-2 text-sm text-slate-600">
            Tìm theo nhân vật, anime/game, shop và ngân sách. Phụ kiện cho thuê kèm
            với bộ đồ.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
          <FilterSidebar
            filters={filters}
            regions={regionOptions}
            brands={brands}
            tags={tagOptions}
            resultCount={sortedItems.length}
            onUpdate={(next) => setFilters((prev) => ({ ...prev, ...next }))}
            onReset={handleReset}
          />

          <div className="space-y-5">
            {shopCard && derivedState !== "error" && (
              <ShopResultCard shop={shopCard} />
            )}

            <SortBar
              sortKey={sortKey}
              currentPage={displayPage}
              totalPages={displayTotalPages}
              onSortChange={setSortKey}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onNext={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages || 1)
                )
              }
            />

            {derivedState === "loading" && (
              <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 p-10 text-center text-sm text-slate-500">
                Đang tải danh sách trang phục...
              </div>
            )}

            {derivedState === "error" && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-600">
                <p>{errorMessage || "Đã có lỗi xảy ra. Vui lòng thử lại."}</p>
                <Button
                  variant="soft"
                  size="sm"
                  className="mt-4 rounded-full"
                  onClick={handleRetry}
                >
                  Thử lại
                </Button>
              </div>
            )}

            {derivedState === "empty" && (
              <div className="rounded-3xl border border-pink-100 bg-white/80 p-10 text-center text-sm text-slate-600">
                <p>Chưa có trang phục phù hợp. Thử nới bộ lọc nhé!</p>
                <Button
                  variant="soft"
                  size="sm"
                  className="mt-4 rounded-full"
                  onClick={handleReset}
                >
                  Reset bộ lọc
                </Button>
              </div>
            )}

            {derivedState === "success" && (
              <>
                <CostumeGrid
                  costumes={pagedItems}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                />
                <Pagination
                  currentPage={displayPage}
                  totalPages={displayTotalPages}
                  onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  onNext={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages || 1)
                    )
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
