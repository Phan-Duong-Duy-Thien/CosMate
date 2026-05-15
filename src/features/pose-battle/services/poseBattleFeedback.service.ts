import axiosInstance from "@/services/axiosInstance"
import type { PoseBattleApiResponse } from "../types"

export async function submitPoseFeedback(payload: {
  poseScoreId: number
  feedbackText: string
}): Promise<void> {
  const response = await axiosInstance.post<PoseBattleApiResponse<null>>(
    "/api/search/pose-score/feedback",
    payload,
  )

  if (response.data?.code !== 0) {
    throw new Error(response.data?.message || "Không thể gửi phản hồi lúc này.")
  }
}
