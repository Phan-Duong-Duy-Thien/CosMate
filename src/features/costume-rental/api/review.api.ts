import { isAxiosError } from "axios"
import axiosInstance from "@/services/axiosInstance"

export interface CreateReviewParams {
  cosplayerId: number
  orderId: number
  rating: number
  comment: string
  images?: File[]
}

type ApiResponse<T> = {
  code: number
  message: string
  result: T
}

export interface CreateReviewResponse {
  id: string
  rating: number
  comment: string
  createdAt: string
}

export async function createReview(params: CreateReviewParams): Promise<CreateReviewResponse> {
  const { cosplayerId, orderId, rating, comment, images } = params

  const formData = new FormData()
  formData.append("cosplayerId", String(cosplayerId))
  formData.append("orderId", String(orderId))
  formData.append("rating", String(rating))
  formData.append("comment", comment)

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append("images", file)
    })
  }

  const res = await axiosInstance.post<ApiResponse<CreateReviewResponse>>(
    "/api/reviews",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return res.data.result
}

export interface ReviewImage {
  id?: number
  url: string
}

export interface ReviewItem {
  id: number
  orderId: number
  username?: string
  userName?: string
  avatarUrl?: string
  rating: number
  comment: string
  createdAt: string
  images: Array<ReviewImage | string>
  providerReply?: string | null
  repliedAt?: string | null
  repliedByProviderId?: number | null
}

export interface ReplyToReviewPayload {
  replyContent: string
}

/**
 * PUT /api/reviews/{reviewId}/reply
 * Provider replies to or updates a reply on a customer review.
 */
export async function replyToReview(
  reviewId: number,
  payload: ReplyToReviewPayload
): Promise<ReviewItem> {
  const res = await axiosInstance.put<ApiResponse<ReviewItem>>(
    `/api/reviews/${reviewId}/reply`,
    payload
  )
  if (res.data.code !== 0) {
    throw new Error(res.data.message || "Không thể gửi phản hồi")
  }
  return res.data.result
}

export async function getReviewsByCostumeId(costumeId: number): Promise<ReviewItem[]> {
  const res = await axiosInstance.get<ApiResponse<ReviewItem[]>>(
    `/api/reviews/costume/${costumeId}`
  )
  return res.data.result
}

/**
 * GET /api/reviews/order/{orderId}
 * Check if a review exists for a given order.
 * Returns null if no review found (user can review), or the review if it exists.
 */
function normalizeReviewResult(
  payload: ReviewItem | ReviewItem[] | null | undefined,
): ReviewItem | null {
  if (!payload) return null
  if (Array.isArray(payload)) {
    return payload[0] ?? null
  }
  return payload
}

export async function getReviewByOrderId(orderId: number): Promise<ReviewItem | null> {
  try {
    const res = await axiosInstance.get<ApiResponse<ReviewItem | ReviewItem[] | null>>(
      `/api/reviews/order/${orderId}`
    )
    if (res.data.code !== 0) {
      return null
    }
    return normalizeReviewResult(res.data.result)
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return null
    }
    if (import.meta.env.DEV) {
      console.warn("[getReviewByOrderId] unexpected error:", orderId, err)
    }
    return null
  }
}
