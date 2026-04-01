import { useMemo, useRef, useState } from "react"
import { Alert, Button } from "antd"
import html2canvas from "html2canvas"
import { useNavigate } from "react-router-dom"

import AILoadingMascot from "@/shared/components/AILoadingMascot"
import QuizHero from "../components/QuizHero"
import QuizBoard from "../components/QuizBoard"
import StyleResultCard from "../components/StyleResultCard"
import ResultCostumeGrid from "../components/ResultCostumeGrid"
import { useStyleQuiz } from "../hooks/useStyleQuiz"

export default function StyleQuizPage() {
  const [started, setStarted] = useState(false)
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement | null>(null)

  const quiz = useStyleQuiz()

  const selectedValue = useMemo(
    () => quiz.answers[quiz.currentQuestion.key],
    [quiz.answers, quiz.currentQuestion.key]
  )

  const handleSaveCard = async () => {
    if (!cardRef.current) return

    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    })

    const url = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = url
    link.download = "cosmate-style-card.png"
    link.click()
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 py-8">
      {!started && <QuizHero onStart={() => setStarted(true)} />}

      {started && quiz.results.length === 0 && !quiz.loading && (
        <QuizBoard
          question={quiz.currentQuestion}
          progressPercent={quiz.progressPercent}
          currentStep={quiz.step}
          totalSteps={quiz.totalSteps}
          selectedValue={selectedValue}
          canGoNext={quiz.canGoNext}
          isLastStep={quiz.isLastStep}
          onSelect={quiz.selectOption}
          onBack={quiz.goBack}
          onNext={quiz.goNext}
          onSubmit={quiz.submitQuiz}
        />
      )}

      {quiz.loading && (
        <div className="rounded-3xl border border-purple-100 bg-white/90 p-8 text-center shadow-sm">
          <AILoadingMascot text="Bé Mèo AI đang bói bài Tarot định hình phong cách cho bạn... 🐾" />
        </div>
      )}

      {quiz.error && !quiz.loading && <Alert type="error" message={quiz.error} showIcon />}

      {!quiz.loading && quiz.results.length > 0 && (
        <div className="space-y-6">
          <StyleResultCard text={quiz.styleCardText} onSaveImage={handleSaveCard} ref={cardRef} />

          <ResultCostumeGrid items={quiz.results} onView={(id) => navigate(`/costumes/${id}`)} />

          <Button onClick={quiz.restart} className="rounded-full">
            Làm lại quiz
          </Button>
        </div>
      )}
    </section>
  )
}
