import axios from "axios"

import axiosInstance from "@/services/axiosInstance"
import type { PoseBattleApiResponse, PoseHistoryItem, PoseScoringResult } from "../types"

export async function scorePose(payload: { image: File; characterName: string }): Promise<PoseScoringResult> {
  const formData = new FormData()
  formData.append("image", payload.image)
  formData.append("characterName", payload.characterName)

  const response = await axiosInstance.post<PoseBattleApiResponse<PoseScoringResult>>(
    "/api/search/pose-score",
    formData
  )

  return response.data.result
}

export async function getPoseHistory(): Promise<PoseHistoryItem[]> {
  const response = await axiosInstance.get<PoseBattleApiResponse<PoseHistoryItem[]>>(
    "/api/search/pose-history"
  )

  return response.data.result ?? []
}

export function mapPoseError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Vui lòng đăng nhập để dùng Pose Battle và xem lịch sử chấm điểm."
    }
    if (error.response?.status === 429) {
      return "AI đang quá tải, bạn chờ một chút rồi thử lại nhé!"
    }
    if (error.response?.status === 500) {
      return "Server đang bận xử lý pose scoring. Vui lòng thử lại sau."
    }
  }
  return "Không thể chấm điểm pose lúc này. Vui lòng thử lại."
}
