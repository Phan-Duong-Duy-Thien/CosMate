import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { ShopReview } from '../../mocks/shopReviews.mock'
import { VI } from '@/shared/i18n/vi'

interface ShopReviewsSectionProps {
  reviews: ShopReview[]
  stats: {
    averageRating: number
    totalReviews: number
    ratingDistribution: Record<number, number>
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ShopReviewsSection({ reviews, stats }: ShopReviewsSectionProps) {
  // Convert 5-star to 10-point scale
  const rating10 = (stats.averageRating * 2).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-2xl border-2 border-cosmate-soft-pink bg-white px-4 py-2">
        <h3 className="text-lg font-semibold tracking-wide text-slate-800">
          {VI.provider.shop.reviews.title}
        </h3>
      </div>

      {/* Rating Summary */}
      <Card className="border-pink-100 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-pink-600">{rating10}</p>
              <p className="text-sm text-slate-500">/ 10</p>
            </div>
            <div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(stats.averageRating) ? 'fill-current' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {stats.totalReviews} {VI.provider.shop.reviews.title.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.ratingDistribution[star] || 0
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 text-xs text-slate-500">{star}</span>
                  <Star className="h-3 w-3 text-amber-400" />
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs text-slate-400">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="border-pink-100 p-5 text-center text-slate-500">
          {VI.provider.shop.reviews.noReviews}
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: ShopReview }) {
  return (
    <Card className="border-pink-100 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-semibold text-pink-600">
          {review.userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700">{review.userName}</p>
              {review.productName && (
                <p className="text-xs text-slate-400">đã thuê: {review.productName}</p>
              )}
            </div>
            <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
          {review.images && review.images.length > 0 && (
            <div className="mt-2 flex gap-2">
              {review.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
