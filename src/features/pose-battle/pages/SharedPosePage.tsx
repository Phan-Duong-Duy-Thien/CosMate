import { useEffect, useMemo, useState } from "react"
import { Alert, Input, Spin, notification } from "antd"
import { DislikeOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons"
import { useParams } from "react-router-dom"

import axiosInstance from "@/services/axiosInstance"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { submitPoseFeedback } from "../services/poseBattleFeedback.service"
import type { PoseBattleApiResponse, PoseHistoryItem } from "../types"

function cleanAiComment(raw: string) {
  return raw
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/`/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function formatDateTime(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export default function SharedPosePage() {
  const { id } = useParams()
  const poseScoreId = Number(id)

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<PoseHistoryItem | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [thumbState, setThumbState] = useState<"up" | "down" | "">("")
  const [submitting, setSubmitting] = useState(false)
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false)

  useEffect(() => {
    const loadDetail = async () => {
      if (!Number.isFinite(poseScoreId)) return
      setLoading(true)
      try {
        const response = await axiosInstance.get<PoseBattleApiResponse<PoseHistoryItem>>(
          `/api/search/pose-history/${poseScoreId}`
        )
        const historyItem = response.data?.result
        if (!historyItem) {
          setDetail(null)
          return
        }

        setDetail(historyItem)
      } catch (error) {
        console.error(error)
        notification.error({ message: "Không thể tải kết quả Pose này." })
      } finally {
        setLoading(false)
      }
    }

    void loadDetail()
  }, [poseScoreId])

  useEffect(() => {
    const previousTitle = document.title
    document.title = detail?.characterName?.trim()
      ? `Chia sẻ Pose ${detail.characterName.trim()} | CosMate`
      : "Pose Sharing | CosMate"

    return () => {
      document.title = previousTitle
    }
  }, [detail?.characterName])

  const cleanedComment = useMemo(() => cleanAiComment(detail?.comment ?? ""), [detail?.comment])
  const shareUrl = useMemo(() => (Number.isFinite(poseScoreId) ? `${window.location.origin}/pose-battle/${poseScoreId}` : ""), [poseScoreId])

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      notification.success({ message: "Đã copy link chia sẻ!" })
    } catch {
      notification.error({ message: "Không thể copy link chia sẻ." })
    }
  }

  const handleSubmitFeedback = async () => {
    if (!detail || hasSubmittedFeedback) return
    const finalText = feedbackText.trim()
    if (!thumbState && !finalText) {
      notification.warning({ message: "Vui lòng chọn thích/không thích hoặc nhập góp ý." })
      return
    }

    setSubmitting(true)
    try {
      await submitPoseFeedback({ poseScoreId: detail.id, feedbackText: finalText, thumbState })
      notification.success({ message: "Đã gửi góp ý thành công!" })
      setFeedbackText("")
      setThumbState("")
      setHasSubmittedFeedback(true)
    } catch (error) {
      const response = (error as { response?: { data?: { message?: string }; status?: number } })?.response
      const message = response?.data?.message ?? (error as { message?: string })?.message ?? "Không thể gửi góp ý lúc này."
      if (message.includes("Bạn đã gửi phản hồi")) {
        notification.info({ message })
        setHasSubmittedFeedback(true)
        setFeedbackText("")
        setThumbState("")
        return
      }
      if (response?.status === 401) {
        notification.error({ message: "Vui lòng đăng nhập để gửi góp ý!" })
      } else {
        notification.error({ message })
      }
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
    <section className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-7">
      <div className="pointer-events-none absolute left-4 top-4 h-24 w-24 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-10 h-28 w-28 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-[3px] border-indigo-950 bg-[linear-gradient(180deg,#fffbeb_0%,#fff7ed_100%)] p-4 shadow-[10px_10px_0px_#312e81]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-fuchsia-700">Pose Battle</p>
              <h1 className="text-2xl font-extrabold text-indigo-950">Chia sẻ kết quả Pose</h1>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {detail.characterName?.trim() ? detail.characterName : "Nhân vật ẩn danh"} · {formatDateTime(detail.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border-[3px] border-indigo-950 bg-fuchsia-200 px-4 py-1 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0px_#1e1b4b]">
                Điểm: {detail.score}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl border-[3px] border-indigo-950 bg-cyan-200 shadow-[4px_4px_0px_#312e81] hover:bg-cyan-300"
                onClick={handleCopyShareLink}
              >
                <ShareAltOutlined />
                Copy link
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-indigo-950 bg-white shadow-[6px_6px_0px_#1e1b4b]">
            <img src={detail.imageUrl} alt="Pose cosplay" className="h-auto w-full object-cover" />
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[2rem] border-[3px] border-indigo-950 bg-surfaceWarm p-4 shadow-[10px_10px_0px_#1e1b4b]">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-700">AI Comment</p>
            <div className="rounded-[1.25rem] border-[3px] border-indigo-950 bg-white p-4 text-sm leading-6 text-slate-700 shadow-[4px_4px_0px_#1e1b4b] whitespace-pre-wrap">
              {cleanedComment || "AI chưa có nhận xét."}
            </div>
          </Card>

          <Card className="rounded-[2rem] border-[3px] border-indigo-950 bg-surfacePink p-4 shadow-[10px_10px_0px_#1e1b4b]">
            <h2 className="mb-3 text-lg font-extrabold text-indigo-950">Gửi góp ý cho AI</h2>

            {hasSubmittedFeedback ? (
              <div className="rounded-[1.25rem] border-[3px] border-indigo-950 bg-emerald-200 px-4 py-5 text-center text-base font-extrabold text-indigo-950 shadow-[4px_4px_0px_#1e1b4b]">
                Cảm ơn bạn! Bạn đã gửi phản hồi cho kết quả này. 💖
              </div>
            ) : (
              <>
                <div className="mb-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setThumbState("up")}
                    disabled={submitting}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-[3px] border-indigo-950 px-4 py-3 font-extrabold shadow-[4px_4px_0px_#1e1b4b] transition ${submitting ? "cursor-not-allowed opacity-70" : ""} ${thumbState === "up" ? "bg-emerald-300" : "bg-white hover:bg-emerald-50"}`}
                  >
                    <LikeOutlined />
                    Hợp lý
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbState("down")}
                    disabled={submitting}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-[3px] border-indigo-950 px-4 py-3 font-extrabold shadow-[4px_4px_0px_#1e1b4b] transition ${submitting ? "cursor-not-allowed opacity-70" : ""} ${thumbState === "down" ? "bg-rose-300" : "bg-white hover:bg-rose-50"}`}
                  >
                    <DislikeOutlined />
                    Chưa chuẩn
                  </button>
                </div>

                <Input.TextArea
                  value={feedbackText}
                  onChange={(event) => setFeedbackText(event.target.value)}
                  disabled={submitting}
                  placeholder="Bạn thấy AI chấm có chuẩn không? Góp ý thêm tại đây..."
                  rows={5}
                  className="!rounded-2xl !border-[3px] !border-indigo-950 !bg-white !shadow-[4px_4px_0px_#1e1b4b]"
                />

                <div className="mt-3 flex justify-end">
                  <Button
                    type="primary"
                    loading={submitting}
                    disabled={submitting}
                    onClick={handleSubmitFeedback}
                    className="!h-11 !rounded-2xl !border-[3px] !border-indigo-950 !bg-cyan-200 !px-5 !font-extrabold !text-indigo-950 shadow-[4px_4px_0px_#1e1b4b] hover:!bg-cyan-300 disabled:!bg-cyan-100"
                  >
                    Gửi
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
