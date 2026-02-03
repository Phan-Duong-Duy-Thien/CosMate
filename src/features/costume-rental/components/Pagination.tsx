import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PaginationProps) => (
  <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
    <button
      type="button"
      aria-label="Trang trước"
      onClick={onPrev}
      disabled={currentPage <= 1}
      className="rounded-full border border-slate-200 p-2 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
    <span className="rounded-full bg-white/80 px-4 py-2 text-slate-600">
      Trang {currentPage} / {totalPages}
    </span>
    <button
      type="button"
      aria-label="Trang sau"
      onClick={onNext}
      disabled={currentPage >= totalPages}
      className="rounded-full border border-slate-200 p-2 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
)
