import * as React from "react"

import type { TagKey } from "../../pages/home.types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { cn } from "@/lib/utils"

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
      <DialogContent
        onClose={() => onOpenChange(false)}
        className={cn(
          "home-anime max-h-[90vh] overflow-y-auto border-[5px] border-indigo-950 bg-gradient-to-b from-[#fef9c3] via-[#fce7f3] to-[#dbeafe] p-0 shadow-[16px_16px_0_0_rgba(30,27,75,0.8)] md:max-w-xl"
        )}
      >
        <div className="relative p-6 md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,#1e1b4b_1.5px,transparent_1.5px)] [background-size:10px_10px]"
          />

          <div className="relative space-y-6">
            <div>
              <Badge className="border-[3px] border-indigo-950 bg-gradient-to-r from-pink-400 to-orange-400 font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b]">
                Quiz nhanh
              </Badge>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-indigo-950 md:text-[1.65rem]">
                「 Bạn hợp cosplay nhân vật nào nhất? 」
              </h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-indigo-900/85">
                Trả lời 5 câu để nhận vibe + tag trang phục phù hợp — phong cách manga cho CosMate!
              </p>
            </div>

            {!isCompleted && currentQuestion && (
              <div className="space-y-5">
                <div className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] px-4 py-4 text-base font-extrabold leading-snug text-indigo-950 shadow-[8px_8px_0_0_rgba(30,27,75,0.55)]">
                  {currentQuestion.title}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className="rounded-2xl border-[4px] border-indigo-950 bg-white px-4 py-4 text-left text-sm font-bold leading-snug text-indigo-950 shadow-[7px_7px_0_0_rgba(30,27,75,0.45)] transition hover:-translate-y-0.5 hover:bg-[#fffbeb] hover:shadow-[9px_9px_0_0_rgba(30,27,75,0.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t-[3px] border-dashed border-indigo-950/25 pt-4 text-xs font-extrabold text-indigo-800/70">
                  <span>
                    Câu {step + 1}/{quizQuestions.length}
                  </span>
                  <span>⏱ ~1 phút</span>
                </div>
              </div>
            )}

            {isCompleted && (
              <Card className="rounded-[1.25rem] border-[5px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] to-[#fbcfe8] p-6 shadow-[10px_10px_0_0_rgba(30,27,75,0.65)]">
                <div className="text-sm font-extrabold uppercase tracking-wide text-pink-700">
                  Kết quả
                </div>

                <div className="mt-2 text-xl font-extrabold text-indigo-950 md:text-2xl">
                  Bạn hợp với {resultTitle}
                </div>

                <p className="mt-3 text-sm font-semibold leading-relaxed text-indigo-900/90">
                  {resultCopy}
                </p>

                <Button
                  className="mt-6 w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-violet-600 font-extrabold text-white shadow-[8px_8px_0_0_#1e1b4b] hover:brightness-110"
                  variant="soft"
                  onClick={() => {
                    onApplyResult(resultTag)
                    onOpenChange(false)
                  }}
                >
                  Xem trang phục phù hợp
                </Button>

                <div className="mt-3 text-center text-xs font-bold text-indigo-800/60">
                  Tip: làm lại quiz để đổi vibe ✨
                </div>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
