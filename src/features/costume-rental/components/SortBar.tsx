import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"
import type { SortKey } from "../types"

interface SortBarProps {
  sortKey: SortKey
  currentPage: number
  totalPages: number
  onSortChange: (key: SortKey) => void
  onPrev: () => void
  onNext: () => void
}

const sortButtons: { label: string; key: SortKey }[] = [
  { label: "Liên quan", key: "relevance" },
  { label: "Mới nhất", key: "newest" },
  { label: "Bán chạy", key: "bestSeller" },
]

export const SortBar = ({
  sortKey,
  currentPage,
  totalPages,
  onSortChange,
  onPrev,
  onNext,
}: SortBarProps) => {
  const priceValue =
    sortKey === "priceAsc" || sortKey === "priceDesc" ? sortKey : ""

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.1rem] border-[3px] border-indigo-950/20 bg-white px-4 py-2.5 shadow-[6px_6px_0_0_rgba(30,27,75,0.12)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-sm font-extrabold text-indigo-900">Sắp xếp</span>
        {sortButtons.map((button) => (
          <Button
            key={button.key}
            type="button"
            variant={sortKey === button.key ? "soft" : "outline"}
            size="sm"
            className={cn(
              "rounded-xl border-[2px]",
              sortKey === button.key
                ? "border-indigo-950 bg-pink-500 text-white"
                : "border-indigo-950/20 bg-white text-slate-600"
            )}
            onClick={() => onSortChange(button.key)}
          >
            {button.label}
          </Button>
        ))}
        <select
          aria-label="Sắp xếp theo giá"
          value={priceValue}
          onChange={(event) =>
            onSortChange(
              (event.target.value || "relevance") as SortKey
            )
          }
          className="h-9 rounded-xl border-2 border-indigo-950/20 bg-white px-3 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
        >
          <option value="">Giá</option>
          <option value="priceAsc">Giá: thấp đến cao</option>
          <option value="priceDesc">Giá: cao đến thấp</option>
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <span>
          {currentPage}/{totalPages}
        </span>
        <button
          type="button"
          aria-label="Trang trước"
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="rounded-xl border-2 border-indigo-950/20 p-1 text-slate-500 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Trang sau"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="rounded-xl border-2 border-indigo-950/20 p-1 text-slate-500 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
