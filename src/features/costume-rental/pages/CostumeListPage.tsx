import * as React from "react"
import { useNavigate } from "react-router-dom"

import type { CostumeItem, FilterState, RegionKey, SortKey, TagKey } from "../types"
import { usePublicCostumes } from "../hooks/usePublicCostumes"
import { FilterSidebar } from "../components/filters/FilterSidebar"
import { SortBar } from "../components/SortBar"
import { CostumeGrid } from "../components/CostumeGrid"
import { Pagination } from "../components/Pagination"
import { Button } from "@/shared/components/Button"
import AISearchBar from "@/features/search/components/AISearchBar"
import type { AISearchResultItem } from "@/features/search/hooks/useAISearch"

const PAGE_SIZE = 16

const tagOptions: Array<{ key: TagKey; label: string }> = [
  { key: "anime", label: "Anime" },
  { key: "game", label: "Game" },
  { key: "event", label: "Event" },
  { key: "photoshoot", label: "Photoshoot" },
  { key: "new", label: "New" },
  { key: "adult18", label: "18+" },
]

const regionOptions: Array<{ key: RegionKey; label: string }> = [
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

export default function CostumeListPage() {
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)
  const [sortKey, setSortKey] = React.useState<SortKey>("relevance")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [heroVisible, setHeroVisible] = React.useState(false)
  const [aiResults, setAiResults] = React.useState<AISearchResultItem[] | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)
  const navigate = useNavigate()

  const { items: allItems, isLoading, error, refetch } = usePublicCostumes()

  const brands = React.useMemo(
    () => Array.from(new Set(allItems.map((item) => item.brand).filter(Boolean))).sort(),
    [allItems]
  )

  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortKey])

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHeroVisible(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const keyword = filters.keyword.trim().toLowerCase()

  const filteredItems = React.useMemo(() => {
    let result = allItems
    if (keyword) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.characterName.toLowerCase().includes(keyword) ||
          item.seriesName.toLowerCase().includes(keyword) ||
          item.shopName.toLowerCase().includes(keyword)
      )
    }
    if (filters.regionKeys.length) result = result.filter((item) => filters.regionKeys.includes(item.region))
    if (filters.brandKeys.length) result = result.filter((item) => filters.brandKeys.includes(item.brand))
    if (filters.minRating) result = result.filter((item) => item.rating >= filters.minRating!)
    if (filters.priceMin !== null) result = result.filter((item) => item.priceMax >= filters.priceMin!)
    if (filters.priceMax !== null) result = result.filter((item) => item.priceMin <= filters.priceMax!)
    if (filters.tagKeys.length) result = result.filter((item) => filters.tagKeys.some((tag) => item.tags.includes(tag)))
    if (filters.hasAccessories) result = result.filter((item) => item.hasAccessories)
    if (filters.onlyAvailable) result = result.filter((item) => item.isAvailable)
    if (filters.onlyBestSeller) result = result.filter((item) => item.bestSeller)
    return result
  }, [allItems, filters, keyword])

  const sortedItems = React.useMemo(() => {
    const next = [...filteredItems]
    next.sort((a, b) => {
      if (sortKey === "newest") return Date.parse(b.createdAt) - Date.parse(a.createdAt)
      if (sortKey === "bestSeller") {
        if (a.bestSeller !== b.bestSeller) return a.bestSeller ? -1 : 1
        return b.rating - a.rating
      }
      if (sortKey === "priceAsc") return a.priceMin - b.priceMin
      if (sortKey === "priceDesc") return b.priceMin - a.priceMin
      return 0
    })
    return next
  }, [filteredItems, sortKey])

  const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE)
  const hasResults = sortedItems.length > 0
  const safePage = Math.min(currentPage, Math.max(totalPages || 1, 1))
  const displayPage = hasResults ? safePage : 0
  const displayTotalPages = hasResults ? totalPages : 0
  const pagedItems = hasResults ? sortedItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE) : []

  type UIState = "loading" | "error" | "empty" | "success"
  const uiState: UIState = isLoading ? "loading" : error ? "error" : sortedItems.length === 0 ? "empty" : "success"

  const handleReset = () => {
    setFilters(initialFilters)
    setAiResults(null)
    setMobileFiltersOpen(false)
  }

  const handleAISearchCompleted = React.useCallback((results: AISearchResultItem[]) => {
    setAiResults(results)
  }, [])

  const aiGridItems = React.useMemo<CostumeItem[]>(() => {
    if (!aiResults?.length) return []

    return aiResults.map((item) => ({
      id: String(item.costumeId),
      name: item.costumeName,
      characterName: "AI match",
      seriesName: "AI search",
      seriesType: "anime",
      tags: ["anime"],
      rating: 5,
      reviewCount: 0,
      rentalsCount: 0,
      priceMin: Number(item.price ?? 0),
      priceMax: Number(item.price ?? 0),
      isAdult18: false,
      isAvailable: true,
      bestSeller: false,
      brand: "",
      brandType: "freestyle",
      region: "hcm",
      shopId: "ai-shop",
      shopName: "CosMate AI",
      images: [item.imageUrl],
      hasAccessories: false,
      accessoryOptions: [],
      sizeOptions: ["m"],
      createdAt: new Date().toISOString(),
      description: "",
      details: [],
      rentalPurposes: ["test"],
      basePriceByPurpose: { test: Number(item.price ?? 0), fes_shoot: Number(item.price ?? 0), event: Number(item.price ?? 0) },
      deposit: 0,
      laundryFee: 0,
      aiSimilarityScore: item.similarityScore * 100,
    }))
  }, [aiResults])

  const handleViewDetail = (costumeId: string) => {
    navigate(`/costumes/${costumeId}`)
  }

  return (
    <section className="home-anime min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fce7f3_48%,#dbeafe_100%)] pb-20">
      <div className="mx-auto w-full max-w-[min(1400px,100%)] px-4 pt-6">
        <div
          className={
            "rounded-3xl border-[5px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] via-[#f9a8d4] to-[#c4b5fd] px-5 py-6 text-center shadow-[10px_10px_0_0_rgba(30,27,75,0.55)] transition-all duration-300 ease-out " +
            (heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")
          }
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-indigo-950/70">
            Costume Rental
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-indigo-950 md:text-4xl">
            Thuê đồ Cosplay
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-indigo-950/80">
            Lọc nhanh theo khu vực, thương hiệu, rating, giá và tags. Có thể dùng AI để tìm mẫu giống nhân vật bạn muốn cosplay.
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <Button
                type="button"
                variant="soft"
                size="sm"
                className="rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-amber-50"
                onClick={() => setMobileFiltersOpen((v) => !v)}
              >
                {mobileFiltersOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </Button>
              <span className="rounded-full border-[3px] border-indigo-950 bg-white px-3 py-1 text-xs font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b]">
                {sortedItems.length} kết quả
              </span>
            </div>

            <div className={mobileFiltersOpen ? "block" : "hidden lg:block"}>
              <FilterSidebar
                filters={filters}
                regions={regionOptions}
                brands={brands}
                tags={tagOptions}
                resultCount={sortedItems.length}
                onUpdate={(next) => setFilters((prev) => ({ ...prev, ...next }))}
                onReset={handleReset}
              />
            </div>
          </div>

          <div className="space-y-4">
            <AISearchBar onSearchCompleted={handleAISearchCompleted} />

            {!aiResults && (
              <div className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-indigo-950 shadow-[6px_6px_0_0_rgba(30,27,75,0.45)]">
                Gợi ý: Tải ảnh nhân vật bạn muốn cosplay + mô tả để AI đề xuất mẫu gần nhất.
              </div>
            )}

            <SortBar
              sortKey={sortKey}
              currentPage={displayPage}
              totalPages={displayTotalPages}
              onSortChange={setSortKey}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
            />

            {aiResults && (
              <div className="overflow-hidden rounded-3xl border-[5px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-white to-[#fce7f3] p-4 shadow-[10px_10px_0_0_rgba(30,27,75,0.55)] md:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-950/65">
                      AI MATCHES
                    </p>
                    <p className="text-base font-extrabold text-indigo-950 md:text-lg">
                      Kết quả gợi ý từ AI ({aiResults.length})
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-amber-50"
                    onClick={() => setAiResults(null)}
                  >
                    Ẩn kết quả AI
                  </Button>
                </div>

                <CostumeGrid
                  costumes={aiGridItems}
                  onViewDetail={handleViewDetail}
                />
              </div>
            )}

            {uiState === "loading" && (
              <div className="rounded-3xl border-[5px] border-dashed border-indigo-950/60 bg-white/80 p-10 text-center text-sm font-semibold text-indigo-950/70 shadow-[10px_10px_0_0_rgba(30,27,75,0.25)]">
                Đang tải danh sách trang phục...
              </div>
            )}

            {uiState === "error" && (
              <div className="rounded-3xl border-[5px] border-[#B91C1C] bg-[#FEE2E2] p-10 text-center text-sm font-semibold text-[#991B1B] shadow-[10px_10px_0_0_rgba(127,29,29,0.25)]">
                <p>{error || "Đã có lỗi xảy ra. Vui lòng thử lại."}</p>
                <Button
                  variant="soft"
                  size="sm"
                  className="mt-4 rounded-xl border-[3px] border-[#991B1B]"
                  onClick={refetch}
                >
                  Thử lại
                </Button>
              </div>
            )}

            {uiState === "empty" && (
              <div className="rounded-3xl border-[5px] border-indigo-950 bg-[#fffbeb] p-10 text-center text-sm font-semibold text-indigo-950 shadow-[10px_10px_0_0_rgba(30,27,75,0.45)]">
                <p>Chưa có trang phục phù hợp. Thử nới bộ lọc nhé!</p>
                <Button
                  variant="soft"
                  size="sm"
                  className="mt-4 rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-amber-50"
                  onClick={handleReset}
                >
                  Reset bộ lọc
                </Button>
              </div>
            )}

            {uiState === "success" && (
              <>
                <CostumeGrid
                  costumes={pagedItems}
                  onViewDetail={handleViewDetail}
                />
                <Pagination
                  currentPage={displayPage}
                  totalPages={displayTotalPages}
                  onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
