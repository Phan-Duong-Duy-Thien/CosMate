import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import { ProviderReplyBlock } from '@/shared/components/ProviderReplyBlock'
import {
  getPublicReviewCommentText,
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
  const rating5 = stats.averageRating.toFixed(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [reviews],
  )
  const previewReviews = sortedReviews.slice(0, 3)
  const hasMoreReviews = sortedReviews.length > 3

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
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-0.5 font-extrabold">
                <span className="text-4xl bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text text-transparent">{rating5}</span>
                <span className="text-sm text-indigo-900/60">/5</span>
              </div>
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
        <div className="space-y-4">
          <div className="space-y-3">
            {previewReviews.map(review => (
              <ReviewCard key={review.id} review={review} onImageClick={setZoomedImage} />
            ))}
          </div>

          {hasMoreReviews && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl border-[3px] border-indigo-950 bg-cyan-200 px-5 py-2 text-sm font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-indigo-950/45 px-4 py-6"
          onClick={() => setIsModalOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-4xl rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_#1e1b4b]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={VI.provider.shop.reviews.title}
          >
            <div className="flex items-center justify-between border-b-[3px] border-indigo-950 px-5 py-4">
              <h3 className="text-lg font-extrabold text-indigo-950">{VI.provider.shop.reviews.title}</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border-[3px] border-indigo-950 bg-rose-200 px-3 py-1 text-xs font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] transition hover:bg-rose-300"
              >
                Đóng
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-5">
              <div className="space-y-3">
                {sortedReviews.map(review => (
                  <ReviewCard key={review.id} review={review} onImageClick={setZoomedImage} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="relative max-h-[85vh] max-w-[90vw] rounded-2xl border-[4px] border-indigo-950 bg-white p-2 shadow-[8px_8px_0_0_#1e1b4b] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute -top-4 -right-4 flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-pink-500 text-sm font-black text-white hover:bg-pink-600 shadow-[3px_3px_0_0_#1e1b4b] transition-all cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed Review Media"
              className="max-h-[80vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ 
  review, 
  onImageClick 
}: { 
  review: ProviderReview
  onImageClick: (url: string) => void 
}) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmate.site'
  const resolveUrl = (url: string) =>
    !url ? '' : url.startsWith('http') ? url : `${API_BASE}${url}`

  const displayName = getReviewReviewerName(review, VI.provider.reviews.detailReviewerFallback)
  const avatarUrl = resolveReviewAvatarUrl(review.avatarUrl)
  const initial = getReviewReviewerInitial(displayName)
  const reviewComment = getPublicReviewCommentText(review)

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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-indigo-950">{displayName}</p>
                {review.isConflicting === true && (
                  <span className="inline-flex items-center rounded-full border-2 border-indigo-950 bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold uppercase text-indigo-950 shadow-[2px_2px_0_0_#1e1b4b]">
                    Không tính vào điểm trung bình
                  </span>
                )}
              </div>
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

          {review.isSpamOrToxic === true ? (
            <div className="mt-3 rounded-xl border-[3px] border-rose-500 bg-rose-50 p-3 text-sm font-bold text-rose-600 flex items-center gap-2 shadow-[2px_2px_0_0_#dc2626]">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span>Đánh giá này đã bị ẩn do vi phạm tiêu chuẩn cộng đồng</span>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm font-semibold text-indigo-900/85">
                {reviewComment}
              </p>
              {review.images && review.images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {review.images.map((img, idx) => {
                    const url = resolveUrl(img.url)
                    return (
                      <button
                        key={img.id ?? idx}
                        type="button"
                        onClick={() => onImageClick(url)}
                        className="group relative overflow-hidden rounded-xl border-[3px] border-indigo-950 shadow-[2px_2px_0_0_#1e1b4b] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[3px_3px_0_0_#1e1b4b] transition-all cursor-pointer"
                      >
                        <img
                          src={url}
                          alt="review thumbnail"
                          className="h-16 w-16 object-cover"
                        />
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {review.providerReply && (
            <div className="mt-4 pl-4 border-l-4 border-indigo-300">
              <ProviderReplyBlock
                providerReply={review.providerReply}
                repliedAt={review.repliedAt}
                variant="indigo"
                className="mt-0"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}


