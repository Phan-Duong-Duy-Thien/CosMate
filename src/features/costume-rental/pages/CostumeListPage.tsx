import * as React from "react"
import { useNavigate }from "react-router-dom"

import type { FilterState, SortKey } from "../types"
import { usePublicCostumes } from "../hooks/usePublicCostumes"
import { FilterSidebar } from "../components/filters/FilterSidebar"
import { SortBar }from "../components/SortBar"
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

export default function CostumeListPage() {
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)
  const [sortKey, setSortKey] = React.useState<SortKey>("relevance")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([])
  const [heroVisible, setHeroVisible] = React.useState(false)
  const navigate = useNavigate()

  const { items: allItems, isLoading, error, refetch }= usePublicCostumes()

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

  const handleReset = () => setFilters(initialFilters)
  const handleToggleWishlist = (costumeId: string) => {
    setWishlistIds((prev) => prev.includes(costumeId) ? prev.filter((id) => id !== costumeId) : [...prev, costumeId])
  }

  return (
    <section className="min-h-screen bg-transparent pb-20">
      <style>{`
        @keyframes softSparkle {
          0% { opacity: 0.6; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-1px); }
          100% { opacity: 0.6; transform: translateY(0px); }
        }
      `}</style>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10">
        <div
          className={
            "rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200 px-6 py-8 text-center shadow-[0_12px_28px_rgba(236,72,153,0.16)] backdrop-blur transition-all duration-300 ease-out " +
            (heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")
          }
        >
          <h1 className="mt-2 flex flex-wrap items-center justify-center gap-2 text-5xl font-extrabold text-pink-700 md:mt-3 md:text-6xl">
            <span
              aria-hidden="true"
              className="text-[20px] tracking-[0.5px] text-pink-700 motion-reduce:animate-none md:text-[40px]"
            >
              ･:*🌸࿔   ⋆. 𐙚˚࿔  Thuê đồ Cosplay  𝜗𝜚˚⋆   ࿔🌸*:･
            </span>
          </h1>
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
            <SortBar
              sortKey={sortKey}
              currentPage={displayPage}
              totalPages={displayTotalPages}
              onSortChange={setSortKey}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
            />

            {uiState === "loading" && (
              <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 p-10 text-center text-sm text-slate-500">
                Đang tải danh sách trang phục...
              </div>
            )}

            {uiState === "error" && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-600">
                <p>{error || "Đã có lỗi xảy ra. Vui lòng thử lại."}</p>
                <Button variant="soft" size="sm" className="mt-4 rounded-full" onClick={refetch}>
                  Thử lại
                </Button>
              </div>
            )}

            {uiState === "empty" && (
              <div className="rounded-3xl border border-pink-100 bg-white/80 p-10 text-center text-sm text-slate-600">
                <p>Chưa có trang phục phù hợp. Thử nới bộ lọc nhé!</p>
                <Button variant="soft" size="sm" className="mt-4 rounded-full" onClick={handleReset}>
                  Reset bộ lọc
                </Button>
              </div>
            )}

            {uiState === "success" && (
              <>
                <CostumeGrid
                  costumes={pagedItems}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  onViewDetail={(costumeId) => navigate(`/costumes/${costumeId}`)}
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
