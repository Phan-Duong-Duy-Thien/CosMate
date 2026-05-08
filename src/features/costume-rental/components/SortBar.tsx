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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] px-4 py-2.5 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-sm font-extrabold text-indigo-950">Sắp xếp</span>
        {sortButtons.map((button) => (
          <Button
            key={button.key}
            type="button"
            variant={sortKey === button.key ? "soft" : "outline"}
            size="sm"
            className={cn(
              "rounded-full border-[3px] border-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]",
              sortKey === button.key
                ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white"
                : "bg-white font-bold text-indigo-950 hover:bg-amber-50"
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
          className="h-9 rounded-full border-[3px] border-indigo-950 bg-white px-3 text-sm font-bold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-950/30"
        >
          <option value="">Giá</option>
          <option value="priceAsc">Giá: thấp đến cao</option>
          <option value="priceDesc">Giá: cao đến thấp</option>
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm font-bold text-indigo-950/80">
        <span>
          {currentPage}/{totalPages}
        </span>
        <button
          type="button"
          aria-label="Trang trước"
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="rounded-full border-[3px] border-indigo-950 bg-white p-1 text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Trang sau"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="rounded-full border-[3px] border-indigo-950 bg-white p-1 text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
