import { Button, Progress } from "antd"

import type { QuizQuestion } from "../types"

interface QuizBoardProps {
  question: QuizQuestion
  progressPercent: number
  currentStep: number
  totalSteps: number
  selectedValue?: string
  canGoNext: boolean
  isLastStep: boolean
  onSelect: (value: string) => void
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function QuizBoard({
  question,
  progressPercent,
  currentStep,
  totalSteps,
  selectedValue,
  canGoNext,
  isLastStep,
  onSelect,
  onBack,
  onNext,
  onSubmit,
}: QuizBoardProps) {
  return (
    <section className="rounded-3xl border border-purple-100 bg-white/90 p-5 shadow-sm md:p-8">
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-purple-500">
        <span>
          Câu {currentStep + 1}/{totalSteps}
        </span>
        <span>{progressPercent}%</span>
      </div>

      <Progress percent={progressPercent} showInfo={false} strokeColor="#7c3aed" className="mb-6" />

      <h2 className="text-lg font-semibold text-slate-800 md:text-2xl">{question.question}</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {question.options.map((option) => {
          const isActive = selectedValue === option.value
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.value)}
              className={[
                "rounded-2xl border p-4 text-left transition-all",
                isActive
                  ? "border-purple-500 bg-purple-50 shadow-[0_0_0_2px_rgba(124,58,237,0.2)]"
                  : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40",
              ].join(" ")}
            >
              <p className="text-lg">{option.emoji}</p>
              <p className="mt-2 font-medium text-slate-800">{option.label}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button onClick={onBack} disabled={currentStep === 0}>
          Back
        </Button>

        {isLastStep ? (
          <Button type="primary" onClick={onSubmit} disabled={!canGoNext} className="bg-purple-600">
            Xem kết quả AI
          </Button>
        ) : (
          <Button type="primary" onClick={onNext} disabled={!canGoNext} className="bg-purple-600">
            Next
          </Button>
        )}
      </div>
    </section>
  )
}
