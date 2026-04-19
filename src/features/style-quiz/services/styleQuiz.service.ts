import axios from "axios"

import axiosInstance from "@/services/axiosInstance"
import type {
  ApiResponse,
  CustomAnswerRequest,
  RecommendationRequestPayload,
  SearchResponseItem,
  Stage1Question,
  Stage2Question,
  SubmitQuizPayload,
} from "../types"

export async function getStage1Survey(): Promise<Stage1Question[]> {
  const response = await axiosInstance.get<ApiResponse<Stage1Question[]>>("/api/search/stage-1")
  return response.data?.result ?? []
}

export async function getStage2Survey(): Promise<Stage2Question[]> {
  const response = await axiosInstance.get<ApiResponse<Stage2Question[]>>("/api/search/stage-2")
  return response.data?.result ?? []
}

export async function getSurveyEnd(): Promise<Stage1Question[]> {
  const response = await axiosInstance.get<ApiResponse<Stage1Question[]>>("/api/search/survey-end")
  return response.data?.result ?? []
}

export async function analyzeCustomAnswers(payload: CustomAnswerRequest[]): Promise<Array<{ E: number; A: number; O: number }>> {
  const response = await axiosInstance.post<ApiResponse<Array<{ E: number; A: number; O: number }>>>(
    "/api/search/analyze-custom-answers",
    payload
  )
  return response.data?.result ?? []
}

export async function submitStyleQuiz(payload: SubmitQuizPayload): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>("/api/search/submit-quiz", payload)
  return response.data?.result ?? ""
}

export async function recommendByStyle(payload: RecommendationRequestPayload): Promise<SearchResponseItem[]> {
  const response = await axiosInstance.post<ApiResponse<SearchResponseItem[]>>("/api/search/recommend", payload)
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
