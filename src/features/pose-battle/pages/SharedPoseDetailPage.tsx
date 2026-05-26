import { useEffect, useMemo, useState } from "react"
import { Alert, Button, Card, Input, Spin, notification } from "antd"
import { useParams } from "react-router-dom"

import axiosInstance from "@/services/axiosInstance"
import type { PoseBattleApiResponse, PoseHistoryItem, PoseScoringResult } from "../types"
import { submitPoseFeedback } from "../services/poseBattleFeedback.service"

function cleanAiComment(raw: string) {
  return raw
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/`/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export default function SharedPoseDetailPage() {
  const { id } = useParams()
  const poseScoreId = Number(id)

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<PoseScoringResult | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadDetail = async () => {
      if (!Number.isFinite(poseScoreId)) return
      setLoading(true)
      try {
        const response = await axiosInstance.get<PoseBattleApiResponse<PoseHistoryItem>>(`/api/search/pose-history/${poseScoreId}`)
        const historyItem = response.data?.result
        if (!historyItem) {
          setDetail(null)
          return
        }
        setDetail({
          id: historyItem.id,
          score: historyItem.score,
          comment: historyItem.comment,
          characterName: historyItem.characterName,
          imageUrl: historyItem.imageUrl,
          breakdown: historyItem.breakdown,
        })
      } catch (error) {
        console.error(error)
        notification.error({ message: "Không thể tải chi tiết pose này." })
      } finally {
        setLoading(false)
      }
    }

    void loadDetail()
  }, [poseScoreId])

  const score = detail?.score ?? 0
  const comment = useMemo(() => cleanAiComment(detail?.comment ?? ""), [detail?.comment])

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      notification.warning({ message: "Vui lòng nhập góp ý trước khi gửi." })
      return
    }

    setSubmitting(true)
    try {
      await submitPoseFeedback({ poseScoreId, feedbackText: feedbackText.trim() })
      notification.success({ message: "Đã gửi phản hồi thành công!" })
      setFeedbackText("")
    } catch (error) {
      console.error(error)
      notification.error({ message: "Không thể gửi phản hồi lúc này." })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <Alert type="error" showIcon message="Không tìm thấy kết quả Pose này." />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-[3px] border-indigo-950 bg-[linear-gradient(180deg,#fffbeb_0%,#fff7ed_100%)] p-4 shadow-[8px_8px_0_0_#1e1b4b]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold text-indigo-950">Chia sẻ kết quả Pose</h1>
            <span className="rounded-full border-[3px] border-indigo-950 bg-fuchsia-200 px-4 py-1 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b]">
              Điểm: {score}
            </span>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-indigo-950 bg-white shadow-[6px_6px_0_0_#1e1b4b]">
            <img src={detail.imageUrl} alt="Pose cosplay" className="h-auto w-full object-cover" />
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[2rem] border-[3px] border-indigo-950 bg-surfaceWarm p-4 shadow-[8px_8px_0_0_#1e1b4b]">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-700">AI Comment</p>
            <div className="rounded-[1.25rem] border-[3px] border-indigo-950 bg-white p-4 text-sm leading-6 text-slate-700 shadow-[4px_4px_0_0_#1e1b4b] whitespace-pre-wrap">
              {comment || "AI chưa có nhận xét."}
            </div>
          </Card>

          <Card className="rounded-[2rem] border-[3px] border-indigo-950 bg-surfacePink p-4 shadow-[8px_8px_0_0_#1e1b4b]">
            <h2 className="mb-3 text-lg font-extrabold text-indigo-950">Phản hồi kết quả này</h2>
            <Input.TextArea
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              placeholder="Bạn thấy AI chấm có chuẩn không? Góp ý ngay..."
              rows={5}
              className="!rounded-2xl !border-[3px] !border-indigo-950 !bg-white !shadow-[4px_4px_0_0_#1e1b4b]"
            />
            <div className="mt-3 flex justify-end">
              <Button
                type="primary"
                loading={submitting}
                onClick={handleSubmit}
                className="!h-11 !rounded-2xl !border-[3px] !border-indigo-950 !bg-cyan-200 !px-5 !font-extrabold !text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:!bg-cyan-300"
              >
                Gửi phản hồi
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
