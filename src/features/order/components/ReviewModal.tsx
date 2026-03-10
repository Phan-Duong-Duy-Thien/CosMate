/**
 * ReviewModal
 *
 * Modal for submitting a review for a completed order
 */

import { useState, useEffect } from "react"
import { Modal, Upload, Button, message } from "antd"
import { UploadOutlined, InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Star, X } from "lucide-react"
import { VI } from "@/shared/i18n/vi"

interface ReviewModalProps {
  open: boolean
  orderId: number
  cosplayerId: number
  loading: boolean
  onCancel: () => void
  onSubmit: (data: { rating: number; comment: string; images: File[] }) => Promise<void>
}

export function ReviewModal({
  open,
  orderId,
  cosplayerId,
  loading,
  onCancel,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setRating(0)
      setHoverRating(0)
      setComment("")
      setFileList([])
    }
  }, [open])

  // Handle file change
  const handleFileChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  // Handle submit
  const handleSubmit = async () => {
    if (rating === 0) {
      message.error(VI.profile.orders.validationReview.ratingRequired)
      return
    }

    // Build images array
    const images: File[] = []
    for (const file of fileList) {
      if (file.originFileObj) {
        images.push(file.originFileObj)
      }
    }

    await onSubmit({ rating, comment, images })
  }

  // Custom upload props
  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    onChange: handleFileChange,
    beforeUpload: () => {
      return false
    },
    listType: "picture-card",
    accept: "image/*",
  }

  return (
    <Modal
      title={VI.profile.orders.reviewModal.title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {VI.profile.orders.reviewModal.cancel}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          {VI.profile.orders.reviewModal.submit}
        </Button>,
      ]}
      width={500}
      destroyOnClose
    >
      <div className="space-y-4">
        {/* Rating Selection */}
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            {VI.profile.orders.reviewModal.ratingLabel}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            {VI.profile.orders.reviewModal.commentLabel}
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={VI.profile.orders.reviewModal.commentPlaceholder}
            className="w-full min-h-[100px] rounded-lg border border-slate-300 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>

        {/* Image Upload */}
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            {VI.profile.orders.reviewModal.imagesLabel}
          </p>
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to upload</p>
            <p className="ant-upload-hint">Support for multiple images</p>
          </Upload.Dragger>
        </div>
      </div>
    </Modal>
  )
}
