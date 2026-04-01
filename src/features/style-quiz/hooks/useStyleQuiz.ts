import { useMemo, useState } from "react"
import { notification } from "antd"

import { STYLE_QUIZ_QUESTIONS } from "../constants/quizQuestions"
import { mapQuizError, recommendByStyle } from "../services/styleQuiz.service"
import type { RecommendResponseItem, StyleQuizAnswers } from "../types"

function createEmptyAnswers(): Partial<StyleQuizAnswers> {
  return {
    favoriteColor: "",
    style: "",
    hobby: "",
    budgetRange: "",
    gender: "",
  }
}

function buildStyleCardText(answers: StyleQuizAnswers): string {
  return `Aura của bạn mang sắc ${answers.favoriteColor.toLowerCase()}, chiến đấu bằng ${answers.style.toLowerCase()} và linh hồn tự do ${answers.hobby.toLowerCase()}. Bạn sinh ra để trở thành biểu tượng cosplay khiến mọi ánh nhìn phải quay lại!`
}

export function useStyleQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<StyleQuizAnswers>>(createEmptyAnswers())
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RecommendResponseItem[]>([])
  const [styleCardText, setStyleCardText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const questions = STYLE_QUIZ_QUESTIONS
  const totalSteps = questions.length
  const currentQuestion = questions[step]

  const progressPercent = useMemo(() => Math.round(((step + 1) / totalSteps) * 100), [step, totalSteps])

  const canGoNext = Boolean(answers[currentQuestion.key])
  const isLastStep = step === totalSteps - 1

  const selectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: value }))
  }

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0))

  const goNext = () => {
    if (!canGoNext) return
    setStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  const submitQuiz = async () => {
    const payload = answers as StyleQuizAnswers
    setLoading(true)
    setError(null)

    try {
      const recommendItems = await recommendByStyle(payload)
      setResults(recommendItems)
      setStyleCardText(buildStyleCardText(payload))
      notification.success({
        message: "AI đã luận ra phong cách dành riêng cho bạn!",
      })
    } catch (err) {
      const msg = mapQuizError(err)
      setError(msg)
      notification.error({ message: msg })
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const restart = () => {
    setStep(0)
    setAnswers(createEmptyAnswers())
    setResults([])
    setStyleCardText("")
    setError(null)
  }

  return {
    step,
    totalSteps,
    currentQuestion,
    progressPercent,
    answers,
    canGoNext,
    isLastStep,
    loading,
    results,
    styleCardText,
    error,
    selectOption,
    goBack,
    goNext,
    submitQuiz,
    restart,
  }
}
