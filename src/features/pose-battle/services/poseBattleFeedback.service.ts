import axiosInstance from "@/services/axiosInstance"
import type { PoseBattleApiResponse } from "../types"

export async function submitPoseFeedback(payload: {
  poseScoreId: number
  feedbackText: string
  thumbState?: "up" | "down" | ""
}): Promise<void> {
  const response = await axiosInstance.post<PoseBattleApiResponse<null>>(
    "/api/search/pose-score/feedback",
    {
      poseScoreId: payload.poseScoreId,
      feedbackText: JSON.stringify({
        thumbState: payload.thumbState ?? "",
        feedbackText: payload.feedbackText,
      }),
    },
  )

  if (response.data?.code !== 0) {
    throw new Error(response.data?.message || "Không thể gửi phản hồi lúc này.")
  }
}
