import { Star } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import { ProviderReplyBlock } from '@/shared/components/ProviderReplyBlock'
import {
  getReviewReviewerInitial,
  getReviewReviewerName,
  resolveReviewAvatarUrl,
} from '@/shared/utils/reviewDisplay'
import type { ProviderReview } from '../../api/provider.api'
import { VI } from '@/shared/i18n/vi'

interface ShopReviewsSectionProps {
  reviews: ProviderReview[]
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
  const rating10 = (stats.averageRating * 2).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#c4b5fd] px-4 py-1.5 shadow-[4px_4px_0_0_#1e1b4b]">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-indigo-950">
          {VI.provider.shop.reviews.title}
        </h3>
      </div>

      <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-5 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text">{rating10}</p>
              <p className="text-sm font-semibold text-indigo-900/60">/ 10</p>
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
              <p className="mt-1 text-sm font-semibold text-indigo-900/65">
                {stats.totalReviews} {VI.provider.shop.reviews.title.toLowerCase()}
              </p>
            </div>
          </div>

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

      {reviews.length === 0 ? (
        <Card className="rounded-2xl border-[3px] border-indigo-950/30 bg-white p-5 text-center text-sm font-semibold text-indigo-900/75 shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]">
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

function ReviewCard({ review }: { review: ProviderReview }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const resolveUrl = (url: string) =>
    !url ? '' : url.startsWith('http') ? url : `${API_BASE}${url}`

  const displayName = getReviewReviewerName(review, VI.provider.reviews.detailReviewerFallback)
  const avatarUrl = resolveReviewAvatarUrl(review.avatarUrl)
  const initial = getReviewReviewerInitial(displayName)

  return (
    <Card className="rounded-2xl border-[3px] border-indigo-950 bg-white p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.45)]">
      <div className="flex items-start gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl border-[3px] border-indigo-950 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#ddd6fe] text-sm font-extrabold text-indigo-950">
            {initial}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-indigo-950">{displayName}</p>
              <p className="text-xs font-semibold text-indigo-900/55">#{review.orderId}</p>
            </div>
            <span className="text-xs font-semibold text-indigo-900/60">{formatDate(review.createdAt)}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm font-semibold text-indigo-900/85">{review.comment}</p>
          {review.images && review.images.length > 0 && (
            <div className="mt-2 flex gap-2">
              {review.images.map((img, idx) => (
                <img
                  key={img.id ?? idx}
                  src={resolveUrl(img.url)}
                  alt=""
                  className="h-16 w-16 rounded-xl border-[3px] border-indigo-950 object-cover"
                />
              ))}
            </div>
          )}
          <ProviderReplyBlock
            providerReply={review.providerReply}
            repliedAt={review.repliedAt}
            variant="indigo"
          />
        </div>
      </div>
    </Card>
  )
}


