import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getMockProductReviews, type MockReviewItem } from "../../mocks/reviews.mock"
import { VI } from "@/shared/i18n/vi"

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
  const reviews = getMockProductReviews(costumeId)
  const average =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="space-y-4">
      <div className="inline-block rounded-xl border-2 border-[#FDCCD7] bg-[#FDCCD7] px-3 py-1.5">
        <h3 className="text-base font-bold tracking-wide text-slate-800 text-center">
          {VI.costumeRental.detail.reviewsTitle}
        </h3>
      </div>

      {/* Rating Summary */}
      <Card className="rounded-xl border border-pink-100 bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-3xl font-semibold text-pink-600">{average.toFixed(1)}</p>
            <div className="mt-1 flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(average) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {reviews.length} {VI.costumeRental.detail.totalReviews}
            </p>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="border-pink-100 bg-white p-5 text-center text-slate-500">
          {VI.costumeRental.detail.noReviews}
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: MockReviewItem }) {
  return (
    <Card className="border-pink-100 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-sm font-semibold text-pink-600">
            {review.userDisplayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-700">{review.userDisplayName}</p>
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
        <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
      {review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Review image ${idx + 1}`}
              className="h-16 w-16 rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </Card>
  )
}
