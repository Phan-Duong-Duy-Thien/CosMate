import { Star } from "lucide-react"
import { Card } from "@/shared/components/Card"
import { useCostumeReviews } from "../../hooks/useCostumeReviews"
import { VI } from "@/shared/i18n/vi"
import type { ReviewItem } from "../../api/review.api"

interface ProductReviewsSectionProps {
  costumeId: number
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function ProductReviewsSection({ costumeId }: ProductReviewsSectionProps) {
  const { reviews, loading, error } = useCostumeReviews(costumeId)
  const average =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#c4b5fd] px-4 py-1.5 shadow-[4px_4px_0_0_#1e1b4b]">
        <h3 className="text-center text-sm font-extrabold uppercase tracking-wide text-indigo-950">
          {VI.costumeRental.detail.reviewsTitle}
        </h3>
      </div>

      <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text text-2xl font-extrabold text-transparent">{average.toFixed(1)}</p>
            <div className="mt-1 flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(average) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold text-indigo-900/70">
              {reviews.length} {VI.costumeRental.detail.totalReviews}
            </p>
          </div>
        </div>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse rounded-2xl border-[3px] border-indigo-950/25 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-pink-100" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-24 rounded bg-pink-100" />
                  <div className="h-3 w-16 rounded bg-pink-100" />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-pink-100" />
                <div className="h-3 w-3/4 rounded bg-pink-100" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <Card className="border-[3px] border-[#DC2626] bg-[#FEE2E2] p-4 text-center text-sm text-[#991B1B]">
          {error}
        </Card>
      )}

      {/* Reviews List */}
      {!loading && !error && reviews.length === 0 && (
        <Card className="rounded-2xl border-[3px] border-indigo-950/30 bg-white p-4 text-center text-sm font-semibold text-indigo-900/75">
          {VI.costumeRental.detail.noReviews}
        </Card>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <Card className="rounded-2xl border-[3px] border-indigo-950 bg-white p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.45)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#ddd6fe] text-sm font-semibold text-indigo-950">
            U
          </div>
          <div>
            <p className="font-semibold text-indigo-950">{VI.costumeRental.detail.reviewer}</p>
            <div className="mt-0.5 flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-current" : "text-slate-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs font-semibold text-indigo-900/65">{formatDate(review.createdAt)}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-indigo-900/85">{review.comment}</p>
      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt=""
              className="h-16 w-16 rounded-xl border-[3px] border-indigo-950 object-cover"
            />
          ))}
        </div>
      )}
    </Card>
  )
}
