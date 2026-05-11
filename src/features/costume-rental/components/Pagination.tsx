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
  <div className="flex items-center justify-center gap-3 text-sm text-slate-600">
    <button
      type="button"
      aria-label="Trang trước"
      onClick={onPrev}
      disabled={currentPage <= 1}
      className="rounded-xl border-2 border-indigo-950/20 bg-white p-2 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
    <span className="rounded-xl border-2 border-indigo-950/15 bg-white px-4 py-2 font-semibold text-indigo-900">
      Trang {currentPage} / {totalPages}
    </span>
    <button
      type="button"
      aria-label="Trang sau"
      onClick={onNext}
      disabled={currentPage >= totalPages}
      className="rounded-xl border-2 border-indigo-950/20 bg-white p-2 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
)
