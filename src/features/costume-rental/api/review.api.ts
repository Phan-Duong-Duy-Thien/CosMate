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
  id: number
  url: string
}

export interface ReviewItem {
  id: number
  orderId: number
  rating: number
  comment: string
  createdAt: string
  images: ReviewImage[]
}

export async function getReviewsByCostumeId(costumeId: number): Promise<ReviewItem[]> {
  const res = await axiosInstance.get<ApiResponse<ReviewItem[]>>(
    `/api/reviews/costume/${costumeId}`
  )
  return res.data.result
}
