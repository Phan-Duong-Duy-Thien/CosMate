import { useState } from "react"
import { Star, Upload, X } from "lucide-react"
import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"
import { message } from "antd"

interface MyReviewFormProps {
  canReview: boolean
  orderId?: number
  cosplayerId: number
  onSubmit: (data: { rating: number; comment: string; images: File[] }) => void
  loading?: boolean
}

export function MyReviewForm({ canReview, orderId, cosplayerId, onSubmit, loading }: MyReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  if (!canReview) {
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages((prev) => [...prev, ...files])

      // Generate previews
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setImagePreviews((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (rating === 0) {
      message.error(VI.costumeRental.detail.validation.ratingRequired)
      return
    }
    if (!comment.trim()) {
      message.error(VI.costumeRental.detail.validation.commentRequired)
      return
    }
    onSubmit({ rating, comment, images })
  }

  return (
    <Card className="rounded-2xl border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] to-[#fce7f3] p-5 shadow-[9px_9px_0_0_rgba(30,27,75,0.6)]">
      <h4 className="mb-4 text-base font-extrabold text-indigo-950">
        {VI.costumeRental.detail.myReviewTitle}
      </h4>

      {/* Rating Selection */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-semibold text-indigo-900/85">{VI.costumeRental.detail.ratingOfYou}</p>
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
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={VI.costumeRental.detail.writeReviewPlaceholder}
          className="min-h-[100px] w-full rounded-xl border-[3px] border-indigo-950 bg-white p-3 text-sm font-semibold text-indigo-950 placeholder:text-indigo-900/50 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-300"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-indigo-900/80 hover:text-fuchsia-700">
          <Upload className="h-4 w-4" />
          {VI.costumeRental.detail.addPhotos}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {imagePreviews.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${idx + 1}`}
                  className="h-16 w-16 rounded-xl border-[3px] border-indigo-950 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-lg border-2 border-indigo-950 bg-[#DC2626] text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="button"
        variant="soft"
        onClick={handleSubmit}
        disabled={loading || rating === 0 || !comment.trim()}
        className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] hover:brightness-110"
      >
        {loading ? VI.common.status.loading : VI.costumeRental.detail.submitReview}
      </Button>
    </Card>
  )
}
