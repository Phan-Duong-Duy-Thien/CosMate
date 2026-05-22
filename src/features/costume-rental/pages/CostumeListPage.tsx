import * as React from "react"
import { useNavigate }from "react-router-dom"

import type { CostumeItem, FilterState, RegionKey, SortKey } from "../types"
import { usePublicCostumes } from "../hooks/usePublicCostumes"
import { FilterSidebar } from "../components/filters/FilterSidebar"
import { SortBar }from "../components/SortBar"
import { CostumeGrid } from "../components/CostumeGrid"
import { Pagination } from "../components/Pagination"
import { Button } from "@/shared/components/Button"
import AISearchBar from "@/features/search/components/AISearchBar"
import type { AISearchResultItem } from "@/features/search/hooks/useAISearch"
import { useWishlist } from "@/features/wishlist/hooks/useWishlist"

const PAGE_SIZE = 16

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
  const [wishlistTogglingId, setWishlistTogglingId] = React.useState<number | null>(null)
  const navigate = useNavigate()

  const { items: allItems, isLoading, error, refetch }= usePublicCostumes()
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useWishlist()

  const brands = React.useMemo(
    () => Array.from(new Set(allItems.map((item) => item.brand).filter(Boolean))).sort(),
    [allItems]
  )

  const priceBounds = React.useMemo(() => ({ min: 0, max: 5_000_000 }), [])

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
    if (filters.priceMin !== null) result = result.filter((item) => item.priceMin >= filters.priceMin!)
    if (filters.priceMax !== null) result = result.filter((item) => item.priceMin <= filters.priceMax!)
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

  const exactMatches = React.useMemo(() => {
    return aiGridItems.filter((item) => (item.aiSimilarityScore ?? 0) > 70)
  }, [aiGridItems])

  const suggestedMatches = React.useMemo(() => {
    return aiGridItems.filter((item) => {
      const score = item.aiSimilarityScore ?? 0
      return score <= 70 && score > 50
    })
  }, [aiGridItems])

  const handleViewDetail = (costumeId: string) => {
    navigate(`/costumes/${costumeId}`)
  }

  const handleToggleWishlist = async (costumeId: number) => {
    if (wishlistTogglingId === costumeId) return

    setWishlistTogglingId(costumeId)
    try {
      if (isInWishlist(costumeId)) {
        const item = wishlistItems.find((w) => w.costumeId === costumeId)
        if (item) await removeFromWishlist(item.id)
      } else {
        await addToWishlist(costumeId)
      }
    } finally {
      setWishlistTogglingId(null)
    }
  }

  return (
    <section className="home-anime min-h-screen bg-transparent pb-20">
      <style>{`
        @keyframes softSparkle {
          0% { opacity: 0.6; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-1px); }
          100% { opacity: 0.6; transform: translateY(0px); }
        }
      `}</style>
      <div className="mx-auto w-full max-w-[min(1680px,100%)] pt-6">
        <div
          className={
            "rounded-[1.4rem] border-[4px] border-indigo-950 bg-gradient-to-r from-pink-200 via-rose-100 to-violet-200 px-5 py-5 text-center shadow-[12px_12px_0_0_rgba(30,27,75,0.33)] backdrop-blur transition-all duration-300 ease-out " +
            (heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")
          }
        >
          <h1 className="mt-1 flex flex-wrap items-center justify-center gap-2 text-3xl font-extrabold tracking-tight text-indigo-950 md:mt-2 md:text-5xl">
            <span
              aria-hidden="true"
              className="text-[20px] tracking-[0.5px] text-indigo-900 motion-reduce:animate-none md:text-[40px]"
            >
              ･:*🌸࿔   ⋆. 𐙚˚࿔  Thuê đồ Cosplay  𝜗𝜚˚⋆   ࿔🌸*:･
            </span>
          </h1>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:gap-6">
          <FilterSidebar
            filters={filters}
            regions={regionOptions}
            brands={brands}
            priceBounds={priceBounds}
            resultCount={sortedItems.length}
            onUpdate={(next) => setFilters((prev) => ({ ...prev, ...next }))}
            onReset={handleReset}
          />

          <div className="space-y-4">
            <AISearchBar onSearchCompleted={handleAISearchCompleted} />

            {!aiResults && (
              <div className="rounded-xl border-[3px] border-indigo-950/20 bg-white px-4 py-3 text-sm font-semibold text-indigo-800">
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
              <div className="overflow-hidden rounded-[1.2rem] border-[4px] border-indigo-950 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-4 shadow-[10px_10px_0_0_rgba(30,27,75,0.22)] md:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">AI MATCHES</p>
                    <p className="text-base font-extrabold text-indigo-900 md:text-lg">
                      Kết quả gợi ý từ AI ({aiResults.length})
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl border-2 border-indigo-950/30 bg-white text-indigo-800 hover:bg-indigo-50"
                    onClick={() => setAiResults(null)}
                  >
                    Ẩn kết quả AI
                  </Button>
                </div>

                {exactMatches.length > 0 && (
                  <>
                    <h3 className="mb-3 text-lg font-bold text-indigo-900">Kết quả chính xác nhất</h3>
                    <CostumeGrid
                      costumes={exactMatches}
                      onViewDetail={handleViewDetail}
                      isWishlisted={isInWishlist}
                      wishlistLoadingId={wishlistTogglingId}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </>
                )}

                {suggestedMatches.length > 0 && (
                  <>
                    {exactMatches.length > 0 && <hr className="my-6 border-indigo-950/10" />}
                    <h3 className="mb-3 text-lg font-bold text-indigo-800">Có thể bạn cũng thích</h3>
                    <CostumeGrid
                      costumes={suggestedMatches}
                      onViewDetail={handleViewDetail}
                      isWishlisted={isInWishlist}
                      wishlistLoadingId={wishlistTogglingId}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </>
                )}
              </div>
            )}

            {uiState === "loading" && (
              <div className="rounded-[1.2rem] border-[3px] border-dashed border-indigo-950/25 bg-white/85 p-10 text-center text-sm text-slate-500">
                Đang tải danh sách trang phục...
              </div>
            )}

            {uiState === "error" && (
              <div className="rounded-[1.2rem] border-[3px] border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">
                <p>{error || "Đã có lỗi xảy ra. Vui lòng thử lại."}</p>
                <Button variant="soft" size="sm" className="mt-4 rounded-xl border-2 border-red-300" onClick={refetch}>
                  Thử lại
                </Button>
              </div>
            )}

            {uiState === "empty" && (
              <div className="rounded-[1.2rem] border-[3px] border-indigo-950/20 bg-white/85 p-10 text-center text-sm text-slate-600">
                <p>Chưa có trang phục phù hợp. Thử nới bộ lọc nhé!</p>
                <Button variant="soft" size="sm" className="mt-4 rounded-xl border-2 border-indigo-950/25" onClick={handleReset}>
                  Reset bộ lọc
                </Button>
              </div>
            )}

            {uiState === "success" && (
              <>
                <CostumeGrid
                  costumes={pagedItems}
                  onViewDetail={handleViewDetail}
                  isWishlisted={isInWishlist}
                  wishlistLoadingId={wishlistTogglingId}
                  onToggleWishlist={handleToggleWishlist}
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
