import axios from "axios"

import axiosInstance from "@/services/axiosInstance"
import type {
  ApiResponse,
  RecommendationRequestPayload,
  SearchResponseItem,
  Stage1Question,
  Stage2Question,
} from "../types"

export async function getStage1Survey(): Promise<Stage1Question[]> {
  const response = await axiosInstance.get<ApiResponse<Stage1Question[]>>("/api/search/stage-1")
  return response.data?.result ?? []
}

export async function getStage2Survey(archetypeId: string): Promise<Stage2Question[]> {
  const response = await axiosInstance.get<ApiResponse<Stage2Question[]>>(`/api/search/stage-2/${archetypeId}`)
  return response.data?.result ?? []
}

export async function getSurveyEnd(): Promise<Stage1Question[]> {
  const response = await axiosInstance.get<ApiResponse<Stage1Question[]>>("/api/search/survey-end")
  return response.data?.result ?? []
}

export async function recommendByStyle(payload: RecommendationRequestPayload): Promise<SearchResponseItem[]> {
  const response = await axiosInstance.post<ApiResponse<SearchResponseItem[]>>(
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
