/**
 * ReviewModal — cosplayer order history (home-anime / neobrutal shell).
 */

import { useState, useEffect } from "react"
import { Modal, Upload, message } from "antd"
import type { UploadFile, UploadProps } from "antd"
import { ImagePlus, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { ProviderReplyBlock } from "@/shared/components/ProviderReplyBlock"
import type { ReviewItem } from "@/features/costume-rental/api/review.api"

interface ReviewModalProps {
  open: boolean
  orderId: number
  cosplayerId: number
  loading: boolean
  existingReview?: ReviewItem | null
  onCancel: () => void
  onSubmit: (data: { rating: number; comment: string; images: File[] }) => Promise<void>
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.cosmate.site").replace(
  /\/+$/,
  ""
)

function resolveImageUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${API_BASE}${url}`
}

function normalizeReviewImages(images: Array<{ id?: number; url?: string } | string> = []): string[] {
  return images.map((img) => (typeof img === "string" ? img : img?.url || "")).filter(Boolean)
}

export function ReviewModal({
  open,
  loading,
  existingReview,
  onCancel,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const isReadOnly = !!existingReview
  const modalTitle = isReadOnly
    ? VI.profile.orders.reviewModal.readOnlyTitle
    : VI.profile.orders.reviewModal.title

  useEffect(() => {
    if (!open) {
      setRating(0)
      setHoverRating(0)
      setComment("")
      setFileList([])
      return
    }

    if (existingReview) {
      setRating(existingReview.rating ?? 0)
      setComment(existingReview.comment ?? "")
    }
  }, [open, existingReview])

  const handleFileChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      message.error(VI.profile.orders.validationReview.ratingRequired)
      return
    }

    const images: File[] = []
    for (const file of fileList) {
      if (file.originFileObj) {
        images.push(file.originFileObj)
      }
    }

    if (!isReadOnly) {
      await onSubmit({ rating, comment, images })
    }
  }

  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    onChange: handleFileChange,
    beforeUpload: () => false,
    listType: "picture-card",
    accept: "image/*",
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={520}
      destroyOnClose
      centered
      closable
      className="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-[1.35rem] [&_.ant-modal-content]:border-[4px] [&_.ant-modal-content]:border-indigo-950 [&_.ant-modal-content]:bg-[#fffbeb] [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:shadow-[12px_12px_0_0_rgba(30,27,75,0.33)] [&_.ant-modal-header]:mb-0 [&_.ant-modal-header]:rounded-t-[1.1rem] [&_.ant-modal-header]:border-b-[3px] [&_.ant-modal-header]:border-indigo-950/15 [&_.ant-modal-header]:bg-gradient-to-r [&_.ant-modal-header]:from-cosmate-soft-pink/80 [&_.ant-modal-header]:to-cosmate-lavender-surface [&_.ant-modal-header]:px-5 [&_.ant-modal-header]:py-4 [&_.ant-modal-body]:px-5 [&_.ant-modal-body]:py-5 [&_.ant-modal-close]:text-indigo-950"
      title={
        <span className="text-base font-extrabold tracking-tight text-indigo-950 md:text-lg">
          {modalTitle}
        </span>
      }
    >
      <div className="space-y-5">
        {/* Rating */}
        <section className="rounded-2xl border-[3px] border-indigo-950/20 bg-white/80 p-4">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-indigo-900/70">
            {VI.profile.orders.reviewModal.ratingLabel}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => !isReadOnly && setRating(star)}
                onMouseEnter={() => !isReadOnly && setHoverRating(star)}
                onMouseLeave={() => !isReadOnly && setHoverRating(0)}
                disabled={isReadOnly}
                className={cn(
                  "rounded-lg p-1 transition-transform",
                  !isReadOnly && "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/40"
                )}
                aria-label={`${star} sao`}
              >
                <Star
                  className={cn(
                    "h-8 w-8 md:h-9 md:w-9",
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-indigo-950/25"
                  )}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Comment */}
        <section>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-indigo-900/70">
            {VI.profile.orders.reviewModal.commentLabel}
          </p>
          <textarea
            value={comment}
            onChange={(e) => !isReadOnly && setComment(e.target.value)}
            placeholder={VI.profile.orders.reviewModal.commentPlaceholder}
            readOnly={isReadOnly}
            className={cn(
              "min-h-[108px] w-full resize-y rounded-xl border-[3px] border-indigo-950 bg-white p-3 text-sm font-semibold text-indigo-950 placeholder:text-indigo-900/45",
              !isReadOnly &&
                "focus:border-cosmate-pink focus:outline-none focus:ring-4 focus:ring-cosmate-pink/25",
              isReadOnly && "cursor-default bg-indigo-50/40"
            )}
          />
        </section>

        {/* Images */}
        <section>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-indigo-900/70">
            {VI.profile.orders.reviewModal.imagesLabel}
          </p>

          {!isReadOnly ? (
            <div className="review-modal-upload [&_.ant-upload]:!w-full [&_.ant-upload-drag]:!rounded-xl [&_.ant-upload-drag]:!border-[3px] [&_.ant-upload-drag]:!border-dashed [&_.ant-upload-drag]:!border-indigo-950/35 [&_.ant-upload-drag]:!bg-white/70 [&_.ant-upload-drag:hover]:!border-cosmate-pink/60 [&_.ant-upload-drag]:!p-4">
              <Upload.Dragger {...uploadProps} showUploadList>
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-cosmate-soft-pink/50 text-indigo-950">
                    <ImagePlus className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="text-sm font-bold text-indigo-950">
                    {VI.profile.orders.reviewModal.uploadHint}
                  </p>
                  <p className="text-xs font-semibold text-indigo-900/55">
                    {VI.profile.orders.reviewModal.uploadSupport}
                  </p>
                </div>
              </Upload.Dragger>
            </div>
          ) : existingReview?.images?.length ? (
            <div className="flex flex-wrap gap-2">
              {normalizeReviewImages(existingReview.images).map((url, idx) => (
                <img
                  key={`${url}-${idx}`}
                  src={resolveImageUrl(url)}
                  alt=""
                  className="h-20 w-20 rounded-xl border-[3px] border-indigo-950 object-cover shadow-[3px_3px_0_0_rgba(30,27,75,0.2)]"
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border-[3px] border-dashed border-indigo-950/20 bg-white/60 px-4 py-6 text-center text-sm font-semibold text-indigo-900/50">
              {VI.common.status.noData}
            </p>
          )}
        </section>

        {isReadOnly && existingReview?.providerReply?.trim() ? (
          <ProviderReplyBlock
            providerReply={existingReview.providerReply}
            repliedAt={existingReview.repliedAt}
            variant="neutral"
          />
        ) : null}

        {/* Footer */}
        <div className="flex flex-wrap justify-end gap-2 border-t-[3px] border-dashed border-indigo-950/20 pt-4">
          <Button
            type="button"
            variant="cosmateOutline"
            size="sm"
            onClick={onCancel}
            className="rounded-xl border-[3px] border-indigo-950 font-bold shadow-[4px_4px_0_0_rgba(30,27,75,0.18)]"
          >
            {isReadOnly ? VI.common.actions.close : VI.profile.orders.reviewModal.cancel}
          </Button>
          {!isReadOnly ? (
            <Button
              type="button"
              size="sm"
              disabled={rating === 0 || loading}
              onClick={() => void handleSubmit()}
              className="rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] hover:brightness-110 disabled:opacity-50"
            >
              {loading ? VI.common.status.loading : VI.profile.orders.reviewModal.submit}
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
