import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ReviewItem {
  id: string
  author: string
  rating: number
  content: string
  date: string
  hasMedia?: boolean
}

interface ReviewsSectionProps {
  average: number
  total: number
  reviews: ReviewItem[]
}

const filters = [
  { key: "all", label: "Tất cả" },
  { key: "5", label: "5 sao" },
  { key: "4", label: "4 sao" },
  { key: "media", label: "Có ảnh/video" },
]

export const ReviewsSection = ({ average, total, reviews }: ReviewsSectionProps) => {
  const [activeFilter, setActiveFilter] = React.useState("all")

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === "media") return review.hasMedia
    if (activeFilter === "5") return review.rating === 5
    if (activeFilter === "4") return review.rating === 4
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3">
        <div>
          <p className="text-2xl font-semibold text-pink-600">{average.toFixed(1)}</p>
          <p className="text-xs text-slate-500">{total} đánh giá</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                activeFilter === filter.key
                  ? "border-pink-200 bg-pink-100 text-pink-700"
                  : "border-slate-200 text-slate-600"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-slate-100 bg-white px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-700">{review.author}</p>
              <span className="text-xs text-slate-400">{review.date}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-amber-400">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={index} className="h-4 w-4" />
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-600">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
