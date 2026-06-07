import * as React from "react"
import { Star } from "lucide-react"
import { Card } from "@/shared/components/Card"
import { ProviderReplyBlock } from "@/shared/components/ProviderReplyBlock"
import {
  getPublicReviewCommentText,
  getReviewReviewerInitial,
  getReviewReviewerName,
  resolveReviewAvatarUrl,
} from "@/shared/utils/reviewDisplay"
import { useCostumeReviews } from "../../hooks/useCostumeReviews"
import { VI } from "@/shared/i18n/vi"
import type { ReviewItem } from "../../api/review.api"
import aiMascotUrl from "@/assets/ai-mascot.png"

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
  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null)

  const validReviews = React.useMemo(() => {
    return reviews.filter(
      (r) => r.isSpamOrToxic !== true && r.isConflicting !== true
    )
  }, [reviews])

  const average = React.useMemo(() => {
    if (validReviews.length === 0) return 0
    return validReviews.reduce((acc, r) => acc + r.rating, 0) / validReviews.length
  }, [validReviews])

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
              {validReviews.length} {VI.costumeRental.detail.totalReviews}
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
            <ReviewCard key={review.id} review={review} onImageClick={setZoomedImage} />
          ))}
        </div>
      )}

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
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
  review: ReviewItem
  onImageClick: (url: string) => void 
}) {
  const displayName = getReviewReviewerName(review, VI.costumeRental.detail.reviewer)
  const avatarUrl = resolveReviewAvatarUrl(review.avatarUrl)
  const initial = getReviewReviewerInitial(displayName)
  
  const [showToxicContent, setShowToxicContent] = React.useState(false)
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)
  const isToxic = review.isSpamOrToxic === true
  const shouldHide = isToxic && !showToxicContent

  const reviewComment = shouldHide 
    ? getPublicReviewCommentText(review) 
    : (review.comment ?? "")

  return (
    <Card className="rounded-2xl border-[3px] border-indigo-950 bg-white p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.45)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-10 w-10 rounded-xl border-[3px] border-indigo-950 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#ddd6fe] text-sm font-semibold text-indigo-950">
              {initial}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-indigo-950">{displayName}</p>
              {review.isConflicting === true && (
                <span className="inline-flex items-center rounded-full border-2 border-indigo-950 bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold uppercase text-indigo-950 shadow-[2px_2px_0_0_#1e1b4b]">
                  Không tính vào điểm trung bình
                </span>
              )}
            </div>
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

      {shouldHide ? (
        <div 
          onClick={() => setShowConfirmModal(true)}
          className="mt-3 rounded-xl border-[3px] border-rose-500 bg-rose-50 p-3 text-sm font-bold text-rose-600 flex items-center justify-between gap-2 shadow-[2px_2px_0_0_#dc2626] cursor-pointer hover:bg-rose-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span>Đánh giá này đã bị ẩn do vi phạm tiêu chuẩn cộng đồng</span>
          </div>
          <span className="text-xs underline font-extrabold text-rose-700 hover:text-rose-900 shrink-0">Mở xem</span>
        </div>
      ) : (
        <>
          {isToxic && (
            <div className="mt-3 rounded-lg border-2 border-rose-300 bg-rose-100 p-2 text-xs font-bold text-rose-700">
              ⚠️ Cảnh báo: Đánh giá này chứa ngôn từ vi phạm tiêu chuẩn cộng đồng.
            </div>
          )}
          
          <p className="mt-3 text-sm font-semibold text-indigo-900/85">
            {reviewComment}
          </p>

          {review.images && review.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.images.map((img, idx) => {
                const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.cosmate.site"
                const rawUrl = typeof img === "string" ? img : img.url
                const url = !rawUrl ? "" : rawUrl.startsWith("http") ? rawUrl : `${API_BASE}${rawUrl}`
                return (
                  <button
                    key={typeof img === "string" ? idx : img.id ?? idx}
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

      {/* Confirmation Modal with Mascot */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border-[4px] border-indigo-950 bg-gradient-to-b from-[#fffbeb] to-[#fce7f3] p-8 shadow-[10px_10px_0_0_#1e1b4b] animate-in zoom-in-95 duration-200 text-center">
            {/* Mascot Image */}
            <div className="mx-auto mb-4 w-40 h-40 flex items-center justify-center overflow-visible">
              <img
                src={aiMascotUrl}
                alt="AI Mascot"
                className="h-full w-full object-contain scale-[2.2] transform"
              />
            </div>
            
            <h4 className="text-base font-extrabold text-indigo-950 mb-2">
              Cảnh báo từ AI Mascot
            </h4>
            
            <p className="text-sm font-semibold text-indigo-900/80 leading-relaxed mb-6">
              Review này chứa ngôn từ tục tĩu hoặc vi phạm tiêu chuẩn cộng đồng. Bạn có chắc chắn muốn mở xem không?
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-xl border-[3px] border-indigo-950 bg-white py-2 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 hover:shadow-[5px_5px_0_0_#1e1b4b] active:shadow-[4px_4px_0_0_#1e1b4b] transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false)
                  setShowToxicContent(true)
                }}
                className="flex-1 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-rose-600 py-2 text-sm font-extrabold text-white shadow-[4px_4px_0_0_#1e1b4b] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 hover:shadow-[5px_5px_0_0_#1e1b4b] active:shadow-[4px_4px_0_0_#1e1b4b] transition-all cursor-pointer"
              >
                Đồng ý mở
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
