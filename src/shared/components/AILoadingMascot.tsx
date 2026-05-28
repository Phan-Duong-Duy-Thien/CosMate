import { Button, Typography } from "antd"
import { CloseOutlined } from "@ant-design/icons"

import moderationMascot from "@/assets/mascot-moderation.png"

const { Text } = Typography

type MascotType = "moderation" | "content" | "search" | "quiz" | "pose"

interface AILoadingMascotProps {
  type: MascotType
  onClose?: () => void
  variant?: "overlay" | "inline"
}

const mediaByType: Record<Exclude<MascotType, "moderation">, string> = {
  content: new URL("../../assets/video-mascot-content.mp4", import.meta.url).href,
  search: new URL("../../assets/video-mascot-search.mp4", import.meta.url).href,
  quiz: new URL("../../assets/video-mascot-quiz.mov", import.meta.url).href,
  pose: new URL("../../assets/video-mascot-pose.mp4", import.meta.url).href,
}

const mediaWrapperClassByType: Record<Exclude<MascotType, "moderation">, string> = {
  content: "aspect-[1760/990]",
  search: "aspect-[1760/990]",
  quiz: "aspect-[1303/984]",
  pose: "aspect-[1760/990]",
}

const contentCopy: Record<MascotType, string> = {
  moderation: "Ảnh của bạn vi phạm tiêu chuẩn cộng đồng, xin hãy dùng ảnh khác",
  content: "Bé Mèo AI đang gõ nội dung cho bạn ฅ^•ﻌ•^ฅ...",
  search: "Bé Mèo AI đang tìm kiếm trang phục phù hợp ᓚ₍⑅^..^₎♡...",
  quiz: "Bé Mèo AI đang phân tích phong cách của bạn 🦋🌸ฅ^•ﻌ•^ฅ🌸🧸...",
  pose: "Bé Mèo AI đang chấm điểm pose của bạn ≽^•༚• ྀི≼...",
}

function MascotVisual({ type }: { type: MascotType }) {
  if (type === "moderation") {
    return (
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-pink-200 bg-white shadow-lg shadow-pink-200/60 aspect-[820/700]">
        <img
          src={moderationMascot}
          alt="Mascot moderation"
          className="block h-full w-full rounded-[inherit] object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`w-full max-w-lg overflow-hidden rounded-3xl border border-pink-200 bg-transparent shadow-lg shadow-pink-200/60 ${mediaWrapperClassByType[type]}`}
    >
      <video
        src={mediaByType[type]}
        autoPlay
        loop
        muted
        playsInline
        className="block h-full w-full rounded-[inherit] object-cover"
      />
    </div>
  )
}

export default function AILoadingMascot({ type, onClose, variant = "overlay" }: AILoadingMascotProps) {
  const showCloseAction = type === "moderation" && onClose

  const containerClassName =
    variant === "overlay"
      ? "fixed inset-0 z-[50000] flex items-center justify-center bg-black/50 px-4 backdrop-blur-md"
      : "flex w-full items-center justify-center px-0 py-2"

  return (
    <div className={containerClassName}>
      <div className="relative w-full max-w-4xl rounded-[2rem] border border-pink-100 bg-white/95 p-5 text-center shadow-2xl shadow-pink-200/40">
        {showCloseAction && (
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-pink-300 hover:text-pink-600"
          >
            <CloseOutlined />
          </button>
        )}

        <div className="flex flex-col items-center gap-4">
          <MascotVisual type={type} />
          <Text className={`text-base font-semibold ${type === "moderation" ? "text-red-500" : "text-pink-600"}`}>
            {contentCopy[type]}
          </Text>

          {showCloseAction && (
            <Button type="primary" danger onClick={onClose} className="mt-1 rounded-full">
              Đã hiểu / Đóng
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

