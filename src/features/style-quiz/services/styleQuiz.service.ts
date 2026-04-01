import axios from "axios"

import axiosInstance from "@/services/axiosInstance"
import type { ApiResponse, RecommendResponseItem, StyleQuizAnswers } from "../types"

export async function recommendByStyle(payload: StyleQuizAnswers): Promise<RecommendResponseItem[]> {
  const response = await axiosInstance.post<ApiResponse<RecommendResponseItem[]>>(
    "/api/search/recommend",
    payload
  )
  return response.data?.result ?? []
}

export function mapQuizError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 429 || status === 503) {
      return "Bé Mèo AI đang quá tải, vui lòng thử lại sau vài giây nhé!"
    }
  }
  return "Không thể lấy gợi ý AI lúc này. Vui lòng thử lại."
}
