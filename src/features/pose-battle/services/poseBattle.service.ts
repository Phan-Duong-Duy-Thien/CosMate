import axios from "axios"

import axiosInstance from "@/services/axiosInstance"
import type { PoseBattleApiResponse, PoseHistoryItem, PoseScoringResult } from "../types"

export async function scorePose(payload: {
  image: File
  characterName: string
  referenceImage?: File
}): Promise<PoseScoringResult> {
  const formData = new FormData()
  formData.append("image", payload.image)
  formData.append("characterName", payload.characterName)
  if (payload.referenceImage) {
    formData.append("referenceImage", payload.referenceImage)
  }

  const response = await axiosInstance.post<PoseBattleApiResponse<PoseScoringResult>>(
    "/api/search/pose-score",
    formData,
    {
      timeout: 120000,
    }
  )

  return response.data.result
}

export async function getPoseHistory(keyword?: string): Promise<PoseHistoryItem[]> {
  const response = await axiosInstance.get<PoseBattleApiResponse<PoseHistoryItem[]>>(
    "/api/search/pose-history",
    {
      params: keyword?.trim() ? { keyword: keyword.trim() } : undefined,
    }
  )

  return response.data.result ?? []
}

export async function updatePoseHistoryName(id: number, newName: string): Promise<PoseHistoryItem> {
  const response = await axiosInstance.put<PoseBattleApiResponse<PoseHistoryItem>>(
    `/api/search/pose-history/${id}/name`,
    null,
    {
      params: { newName },
    }
  )

  return response.data.result
}

export async function deletePoseHistory(id: number): Promise<void> {
  await axiosInstance.delete(`/api/search/pose-history/${id}`)
}

export function mapPoseError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorText = [
      error.response?.data?.message,
      error.response?.data?.error,
      error.message,
    ]
      .filter(Boolean)
      .join(' ')
      .toUpperCase()

    if (errorText.includes('NOT_COSPLAY') || errorText.includes('AI_CONTENT_BLOCKED')) {
      return 'Bé Mèo không nhận diện được người/trang phục cosplay trong ảnh. Vui lòng thử lại ảnh khác nhé!'
    }

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
