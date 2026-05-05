import * as React from "react"

import type { TagKey } from "../../pages/home.types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { Dialog, DialogContent } from "@/shared/components/Dialog"

interface QuizOption {
  label: string
  tag: TagKey
}

interface QuizQuestion {
  title: string
  options: QuizOption[]
}

interface QuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyResult: (tag: TagKey) => void
}

const quizQuestions: QuizQuestion[] = [
  {
    title: "Khi bước vào một sự kiện đông người, bạn thường là kiểu người nào?",
    options: [
      { label: "🌸 Luôn cười, dễ bắt chuyện, ai cũng chú ý", tag: "anime" },
      { label: "😎 Ít nói nhưng rất có khí chất", tag: "game" },
    ],
  },
  {
    title: "Phong cách trang phục bạn thích nhất là?",
    options: [
      { label: "🎀 Pastel, dễ thương, nhiều chi tiết nhỏ", tag: "anime" },
      { label: "⚔️ Ngầu, sắc nét, có phụ kiện mạnh", tag: "game" },
    ],
  },
  {
    title: "Bạn thường cosplay trong hoàn cảnh nào?",
    options: [
      { label: "🎉 Đi fes, gặp gỡ bạn bè, chụp ảnh vui", tag: "anime" },
      { label: "🎤 Event lớn / sân khấu / gaming show", tag: "game" },
    ],
  },
  {
    title: "Bạn thích nhân vật có tính cách ra sao?",
    options: [
      { label: "💖 Ấm áp, dễ mến, quan tâm người khác", tag: "anime" },
      { label: "💪 Mạnh mẽ, quyết đoán, bảo vệ đồng đội", tag: "game" },
    ],
  },
  {
    title: "Nếu được chọn sức mạnh, bạn sẽ chọn gì?",
    options: [
      { label: "✨ Phép thuật, hồi phục, hỗ trợ", tag: "anime" },
      { label: "🔥 Sức mạnh, chiến đấu, công nghệ", tag: "game" },
    ],
  },
]

export const QuizModal = ({
  open,
  onOpenChange,
  onApplyResult,
}: QuizModalProps) => {
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<TagKey[]>([])

  React.useEffect(() => {
    if (!open) {
      setStep(0)
      setAnswers([])
    }
  }, [open])

  const currentQuestion = quizQuestions[step]
  const isCompleted = step >= quizQuestions.length

  const handleSelect = (option: QuizOption) => {
    setAnswers((prev) => [...prev, option.tag])
    setStep((prev) => prev + 1)
  }

  const resultTag = React.useMemo<TagKey>(() => {
    const score = answers.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1
        return acc
      },
      {} as Record<TagKey, number>
    )

    // fallback safe
    const animeScore = score.anime ?? 0
    const gameScore = score.game ?? 0

    return gameScore > animeScore ? "game" : "anime"
  }, [answers])

  const resultTitle =
    resultTag === "game" ? "vibe Game ngầu & cá tính" : "vibe Anime pastel & cuốn hút"

  const resultCopy =
    resultTag === "game"
      ? "Bạn mang năng lượng mạnh mẽ, cool ngầu và rất hợp với những nhân vật game nổi bật — càng thêm phụ kiện càng chất!"
      : "Bạn mang năng lượng dễ thương, mơ mộng nhưng vẫn nổi bật — cực hợp các nhân vật anime với tone pastel và chi tiết tinh tế."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="select-none">
        <div className="space-y-6">
          <div>
            <Badge className="bg-pink-100 text-pink-600">Quiz nhanh</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Bạn hợp cosplay nhân vật nào nhất?
            </h2>
            <p className="text-sm text-slate-500">
              Trả lời 5 câu hỏi để tụi mình gợi ý vibe + tag trang phục phù hợp.
            </p>
          </div>

          {!isCompleted && currentQuestion && (
            <div className="space-y-4">
              <div className="text-base font-medium text-slate-800">
                {currentQuestion.title}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Câu {step + 1}/{quizQuestions.length}
                </span>
                <span className="text-slate-300">⏱ ~1 phút</span>
              </div>
            </div>
          )}

          {isCompleted && (
            <Card className="border-pink-100 bg-pink-50/60 p-5">
              <div className="text-sm font-semibold text-pink-600">Kết quả</div>

              <div className="mt-1 text-xl font-semibold text-slate-900">
                Bạn hợp với {resultTitle}
              </div>

              <p className="mt-2 text-sm text-slate-600">{resultCopy}</p>

              <Button
                className="mt-4 w-full"
                variant="soft"
                onClick={() => {
                  onApplyResult(resultTag)
                  onOpenChange(false)
                }}
              >
                Xem trang phục phù hợp
              </Button>

              <div className="mt-2 text-center text-xs text-slate-400">
                Tip: Bạn có thể làm lại quiz để đổi vibe ✨
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
