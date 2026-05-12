import { cn } from "@/lib/utils"

interface ListingPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

type PageToken = number | "ellipsis-left" | "ellipsis-right"

function buildPageTokens(current: number, total: number): PageToken[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const tokens: PageToken[] = [1]
  const windowStart = Math.max(2, current - 1)
  const windowEnd = Math.min(total - 1, current + 1)

  if (windowStart > 2) tokens.push("ellipsis-left")
  for (let p = windowStart; p <= windowEnd; p += 1) tokens.push(p)
  if (windowEnd < total - 1) tokens.push("ellipsis-right")

  tokens.push(total)
  return tokens
}

export function ListingPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: ListingPaginationProps) {
  if (totalPages <= 1) return null

  const tokens = buildPageTokens(currentPage, totalPages)
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const navButtonClass =
    "rounded-lg border-[2px] border-indigo-950/40 bg-white px-3 py-2 shadow-[3px_3px_0_0_rgba(30,27,75,0.15)] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"

  return (
    <nav
      aria-label="Phân trang"
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-indigo-900",
        className
      )}
    >
      <button
        type="button"
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        className={navButtonClass}
      >
        Trước
      </button>

      <div className="flex flex-wrap justify-center gap-2">
        {tokens.map((token) => {
          if (token === "ellipsis-left" || token === "ellipsis-right") {
            return (
              <span
                key={token}
                className="flex h-9 min-w-[2.25rem] items-center justify-center px-1 text-indigo-950/60"
                aria-hidden
              >
                …
              </span>
            )
          }

          const isActive = token === currentPage
          return (
            <button
              key={token}
              type="button"
              onClick={() => onPageChange(token)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border-[2px] px-2 transition",
                isActive
                  ? "border-indigo-950 bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white shadow-[3px_3px_0_0_#1e1b4b]"
                  : "border-indigo-950/35 bg-white text-indigo-900 shadow-[3px_3px_0_0_rgba(30,27,75,0.1)] hover:bg-amber-100"
              )}
            >
              {token}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        className={navButtonClass}
      >
        Tiếp
      </button>
    </nav>
  )
}
