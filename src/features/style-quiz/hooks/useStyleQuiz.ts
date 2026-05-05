import { useEffect, useMemo, useState } from "react"
import { notification } from "antd"

import { ARCHETYPE_PROFILES } from "../constants/archetypes"
import { FALLBACK_STAGE1_QUESTIONS, FALLBACK_STAGE2_QUESTIONS } from "../constants/stageQuestions"
import { getStage1Survey, getStage2Survey, mapQuizError, recommendByStyle, submitStyleQuiz } from "../services/styleQuiz.service"
import type { SearchResponseItem, Stage1Question, Stage2Question, SubmitQuizCustomAnswer, SubmitQuizPayload, SubmitQuizStaticAnswer } from "../types"

type QuizScreen = "quiz" | "checkpoint" | "loading" | "result"
type QuizPhase = "stage1" | "stage2"

// Thêm hàm helper này ở phía trên hoặc bên trong hook useStyleQuiz
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const QUIZ_DRAFT_KEY = "cosmate_quiz_draft"

interface QuizDraft {
  phase: QuizPhase
  screen: Exclude<QuizScreen, "loading" | "result">
  currentIndex: number
  globalQuestionIndex: number
  E: number
  A: number
  O: number
  archetypeId: string
  stage1Answers: Record<string, number>
  stage2Answers: Record<string, number>
  stage1CustomAnswers: Record<string, string>
  stage2CustomAnswers: Record<string, string>
}

function resolveBudgetMetadata(metadata?: string): string {
  if (metadata === "high_budget") return "high_budget"
  if (metadata === "low_budget") return "low_budget"
  return "mid_budget"
}

function safeGetDraft(): QuizDraft | null {
  try {
    const raw = localStorage.getItem(QUIZ_DRAFT_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<QuizDraft>
    if (!parsed || typeof parsed !== "object") return null
    if (typeof parsed.currentIndex !== "number") return null
    if (typeof parsed.E !== "number" || typeof parsed.A !== "number" || typeof parsed.O !== "number") return null

    return {
      phase: parsed.phase === "stage2" ? "stage2" : "stage1",
      screen: parsed.screen === "checkpoint" ? "checkpoint" : "quiz",
      currentIndex: Math.max(0, parsed.currentIndex),
      globalQuestionIndex: typeof parsed.globalQuestionIndex === "number" ? parsed.globalQuestionIndex : 1,
      E: parsed.E,
      A: parsed.A,
      O: parsed.O,
      archetypeId: typeof parsed.archetypeId === "string" ? parsed.archetypeId : "",
      stage1Answers: parsed.stage1Answers && typeof parsed.stage1Answers === "object" ? parsed.stage1Answers : {},
      stage2Answers: parsed.stage2Answers && typeof parsed.stage2Answers === "object" ? parsed.stage2Answers : {},
      stage1CustomAnswers: (parsed as any).stage1CustomAnswers && typeof (parsed as any).stage1CustomAnswers === "object" ? (parsed as any).stage1CustomAnswers : {},
      stage2CustomAnswers: (parsed as any).stage2CustomAnswers && typeof (parsed as any).stage2CustomAnswers === "object" ? (parsed as any).stage2CustomAnswers : {},
    }
  } catch {
    return null
  }
}

function safeSetDraft(draft: QuizDraft) {
  try {
    localStorage.setItem(QUIZ_DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // ignore storage error
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(QUIZ_DRAFT_KEY)
  } catch {
    // ignore storage error
  }
}

export function useStyleQuiz() {
  const [screen, setScreen] = useState<QuizScreen>("quiz")
  const [phase, setPhase] = useState<QuizPhase>("stage1")
  const [stage1Questions, setStage1Questions] = useState<Stage1Question[]>([])
  const [stage2Questions, setStage2Questions] = useState<Stage2Question[]>([])
  const [stage1Answers, setStage1Answers] = useState<Record<string, number>>({})
  const [stage2Answers, setStage2Answers] = useState<Record<string, number>>({})
  const [stage1CustomAnswers, setStage1CustomAnswers] = useState<Record<string, string>>({})
  const [stage2CustomAnswers, setStage2CustomAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [E, setE] = useState(0)
  const [A, setA] = useState(0)
  const [O, setO] = useState(0)
  const [archetypeId, setArchetypeId] = useState("")
  const [subTypeId, setSubTypeId] = useState("")
  const [loading, setLoading] = useState(false)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [results, setResults] = useState<SearchResponseItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pendingDraft, setPendingDraft] = useState<QuizDraft | null>(null)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [draftCheckDone, setDraftCheckDone] = useState(false)

  const restart = () => {
    setScreen("quiz")
    setPhase("stage1")
    setCurrentIndex(0)
    setStage1Answers({})
    setStage2Answers({})
    setStage1CustomAnswers({})
    setStage2CustomAnswers({})
    setStage2Questions([])
    setResults([])
    setError(null)
    setE(0)
    setA(0)
    setO(0)
    setArchetypeId("")
    setSubTypeId("")
  }

  useEffect(() => {
    const foundDraft = safeGetDraft()
    if (foundDraft) {
      const isFreshStartDraft = foundDraft.phase === "stage1" && foundDraft.currentIndex === 0
      const shouldShowResumeModal = !isFreshStartDraft && (foundDraft.currentIndex > 0 || foundDraft.phase === "stage2")

      if (shouldShowResumeModal) {
        setPendingDraft(foundDraft)
        setShowResumeModal(true)
      } else {
        clearDraft()
      }
    }
    setDraftCheckDone(true)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setSurveyLoading(true)
      setError(null)
      try {
        const stage1Data = await getStage1Survey()
        setStage1Questions(stage1Data.length ? stage1Data : FALLBACK_STAGE1_QUESTIONS)
      } catch (err) {
        setStage1Questions(FALLBACK_STAGE1_QUESTIONS)
        setError(mapQuizError(err))
      } finally {
        setSurveyLoading(false)
      }
    }

    loadData()
  }, [])

  const currentQuestions = phase === "stage1" ? stage1Questions : stage2Questions
  const currentQuestion = currentQuestions[currentIndex]

  const totalQuestions = useMemo(() => {
    const stage1Total = Math.min(stage1Questions.length, 8)
    const stage2Total = stage2Questions.length
    return phase === "stage1" ? stage1Total : stage1Total + stage2Total
  }, [phase, stage1Questions.length, stage2Questions.length])

  const globalQuestionIndex = useMemo(() => {
    if (phase === "stage1") return currentIndex + 1
    return 8 + currentIndex + 1
  }, [phase, currentIndex])

  useEffect(() => {
    if (!draftCheckDone || surveyLoading || screen === "loading" || screen === "result" || showResumeModal) return

    safeSetDraft({
      phase,
      screen: screen === "checkpoint" ? "checkpoint" : "quiz",
      currentIndex,
      globalQuestionIndex,
      E,
      A,
      O,
      archetypeId,
      stage1Answers,
      stage2Answers,
      stage1CustomAnswers,
      stage2CustomAnswers,
    })
  }, [draftCheckDone, surveyLoading, screen, showResumeModal, phase, currentIndex, globalQuestionIndex, E, A, O, archetypeId, stage1Answers, stage2Answers, stage1CustomAnswers, stage2CustomAnswers])

  const selectedOptionIndex = useMemo(() => {
    if (phase === "stage1") {
      const question = stage1Questions[currentIndex]
      return question ? stage1Answers[question.question_id] : undefined
    }

    const question = stage2Questions[currentIndex]
    const qid = question?.question_id ?? `stage2-${currentIndex}`
    return question ? stage2Answers[qid] : undefined
  }, [phase, stage1Questions, currentIndex, stage1Answers, stage2Questions, stage2Answers])

  const progressPercent = useMemo(() => {
    if (!totalQuestions) return 0
    return Math.round(((globalQuestionIndex - 1) / totalQuestions) * 100)
  }, [globalQuestionIndex, totalQuestions])

  const archetypeProfile = useMemo(() => {
    return ARCHETYPE_PROFILES[archetypeId] ?? {
      id: archetypeId,
      name: archetypeId || "Archetype",
      coreDesire: "",
      clothing_style: "",
      color_palette: ["#FBCFE8", "#F9A8D4", "#F472B6"],
      famousCharacters: [],
    }
  }, [archetypeId])

  const checkpointMessage = useMemo(() => {
    if (!archetypeProfile.name) return ""
    return `Hệ thống đã quét được 70% bản ngã của bạn và xếp bạn vào nhóm ${archetypeProfile.name}. Bạn muốn xem kết quả ngay hay test thêm 7 câu để phân tích chi tiết 100%?`
  }, [archetypeProfile.name])

  const selectAnswer = (optionIndex: number) => {
    const question = currentQuestions[currentIndex]
    if (!question) return

    if (phase === "stage1") {
      const questionId = question.question_id as string
      setStage1Answers((prev) => ({ ...prev, [questionId]: optionIndex }))
      setStage1CustomAnswers((prev) => ({ ...prev, [questionId]: "" }))
      return
    }

    const questionId = question.question_id ?? `stage2-${currentIndex}`
    setStage2Answers((prev) => ({ ...prev, [questionId]: optionIndex }))
    setStage2CustomAnswers((prev) => ({ ...prev, [questionId]: "" }))
  }

  const setCustomAnswer = (value: string) => {
    const question = currentQuestions[currentIndex]
    if (!question) return
    const questionId = question.question_id ?? `${phase}-${currentIndex}`
    if (phase === "stage1") {
      setStage1CustomAnswers((prev) => ({ ...prev, [questionId]: value }))
      setStage1Answers((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    } else {
      setStage2CustomAnswers((prev) => ({ ...prev, [questionId]: value }))
      setStage2Answers((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    }
  }

  const currentCustomAnswer = useMemo(() => {
    const questionId = currentQuestion?.question_id ?? ""
    return phase === "stage1" ? stage1CustomAnswers[questionId] ?? "" : stage2CustomAnswers[questionId] ?? ""
  }, [phase, currentQuestion?.question_id, stage1CustomAnswers, stage2CustomAnswers])

  const applyCurrentAnswerToScore = (): { E: number; A: number; O: number; budgetMetadata?: string } | null => {
    const question = currentQuestions[currentIndex]
    if (!question) return null

    const selectedIdx = selectedOptionIndex
    if (selectedIdx === undefined) return null

    const selectedOption = question.options[selectedIdx]
    if (!selectedOption) return null

    return {
      E: selectedOption.scores?.E ?? 0,
      A: selectedOption.scores?.A ?? 0,
      O: selectedOption.scores?.O ?? 0,
      budgetMetadata: selectedOption.metadata,
    }
  }

  const buildSubmitQuizPayload = (): SubmitQuizPayload => {
    const staticAnswers: SubmitQuizStaticAnswer[] = []
    const customAnswers: SubmitQuizCustomAnswer[] = []

    stage1Questions.slice(0, 8).forEach((question) => {
      const selectedIdx = stage1Answers[question.question_id]
      if (selectedIdx !== undefined) {
        const option = question.options[selectedIdx]
        staticAnswers.push({
          questionId: question.question_id,
          scoreE: option?.scores?.E ?? 0,
          scoreA: option?.scores?.A ?? 0,
          scoreO: option?.scores?.O ?? 0,
        })
      }

      const customAnswer = stage1CustomAnswers[question.question_id]?.trim()
      if (customAnswer) {
        customAnswers.push({
          questionId: question.question_id,
          questionContext: question.question,
          userAnswer: customAnswer,
        })
      }
    })

    stage2Questions.slice(0, 7).forEach((question, index) => {
      const questionId = question.question_id ?? `stage2-${index}`
      const selectedIdx = stage2Answers[questionId]
      if (selectedIdx !== undefined) {
        const option = question.options[selectedIdx]
        staticAnswers.push({
          questionId,
          scoreE: option?.scores?.E ?? 0,
          scoreA: option?.scores?.A ?? 0,
          scoreO: option?.scores?.O ?? 0,
        })
      }

      const customAnswer = stage2CustomAnswers[questionId]?.trim()
      if (customAnswer) {
        customAnswers.push({
          questionId,
          questionContext: question.question,
          userAnswer: customAnswer,
        })
      }
    })

    return { staticAnswers, customAnswers }
  }

  const runRecommend = async (finalArchetypeId: string, finalSubtypeId: string, budgetMetadata: string) => {
    setScreen("loading")
    setLoading(true)
    setError(null)

    try {
      const recommendItems = await recommendByStyle({ archetypeId: finalArchetypeId, subTypeId: finalSubtypeId, budgetMetadata })
      setArchetypeId(finalArchetypeId)
      setSubTypeId(finalSubtypeId)
      setResults(recommendItems)
      clearDraft()
      setScreen("result")
      notification.success({ description: "AI đã hoàn thành phân tích và trả kết quả!" })
    } catch (err) {
      const msg = mapQuizError(err)
      setError(msg)
      notification.error({ description: msg })
      setScreen("checkpoint")
    } finally {
      setLoading(false)
    }
  }

  const next = async () => {
    const question = currentQuestions[currentIndex]
    if (!question) return

    const selectedIdx = selectedOptionIndex
    const customAnswer = currentCustomAnswer.trim()
    const hasSelectedRadio = selectedIdx !== undefined
    const hasCustomAnswer = customAnswer.length > 0

    if (!hasSelectedRadio && !hasCustomAnswer) return

    let nextE = E
    let nextA = A
    let nextO = O
    let budgetMetadata: string | undefined

    if (hasSelectedRadio) {
      const scoreDelta = applyCurrentAnswerToScore()
      if (!scoreDelta) return
      nextE += scoreDelta.E
      nextA += scoreDelta.A
      nextO += scoreDelta.O
      budgetMetadata = scoreDelta.budgetMetadata
    }

    setE(nextE)
    setA(nextA)
    setO(nextO)

    if (phase === "stage1") {
      const stage1Total = Math.min(stage1Questions.length, 8)
      if (currentIndex < stage1Total - 1) {
        setCurrentIndex((prev) => prev + 1)
        return
      }

      setScreen("loading")
      setLoading(true)
      const startTime = Date.now(); // 1. Bắt đầu bấm giờ ngay khi bật loading

      try {
        const finalArchetypeId = await submitStyleQuiz(buildSubmitQuizPayload())
        setArchetypeId(finalArchetypeId)

        // 2. CHẶN LẠI: API chạy nhanh quá thì ép nó chờ cho đủ 800ms
        const elapsed = Date.now() - startTime;
        if (elapsed < 1000) {
          await wait(1000 - elapsed); 
        }

        setScreen("checkpoint")
      } catch (err) {
        const msg = mapQuizError(err)
        setError(msg)
        notification.error({ description: msg })
      } finally {
        setLoading(false)
      }
      return
    }

    if (currentIndex < stage2Questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return
    }

    const payload = buildSubmitQuizPayload()
    setScreen("loading")
    setLoading(true)

    try {
      const finalArchetypeId = await submitStyleQuiz(payload)
      setArchetypeId(finalArchetypeId)
      const resolvedBudgetMetadata = resolveBudgetMetadata(budgetMetadata)
      await runRecommend(finalArchetypeId, "", resolvedBudgetMetadata)
    } catch (err) {
      const msg = mapQuizError(err)
      setError(msg)
      notification.error({ description: msg })
    } finally {
      setLoading(false)
    }
  }

  const viewResultNow = async () => {
    if (!archetypeId) return
    setScreen("loading")
    setLoading(true)
    setError(null)

    try {
      await runRecommend(archetypeId, "", "mid_budget")
    } catch (err) {
      const msg = mapQuizError(err)
      setError(msg)
      notification.error({ description: msg })
    } finally {
      setLoading(false)
    }
  }

  const continueDeepAnalysis = async () => {
    if (!archetypeId) return
    setSurveyLoading(true)
    setError(null)
    
    const startTime = Date.now(); // 1. Bắt đầu tính giờ ngay khi hiện màn hình tải

    try {
      const stage2Data = await getStage2Survey()
      const source = stage2Data.length ? stage2Data : FALLBACK_STAGE2_QUESTIONS
      setStage2Questions(source.slice(0, 7))
      setPhase("stage2")
      setCurrentIndex(0)
      setScreen("quiz")

      // 2. Chặn lại chờ cho đủ 800ms để bé Mèo kịp nhún nhảy
      const elapsed = Date.now() - startTime;
      if (elapsed < 800) {
        await wait(800 - elapsed); 
      }

    } catch {
      setStage2Questions(FALLBACK_STAGE2_QUESTIONS)
      setPhase("stage2")
      setCurrentIndex(0)
      setScreen("quiz")
      setError(null)
    } finally {
      setSurveyLoading(false)
    }
  }

  const restoreDraft = async () => {
    if (!pendingDraft) {
      setShowResumeModal(false)
      return
    }

    setStage1Answers(pendingDraft.stage1Answers)
    setStage2Answers(pendingDraft.stage2Answers)
    setStage1CustomAnswers(pendingDraft.stage1CustomAnswers ?? {})
    setStage2CustomAnswers(pendingDraft.stage2CustomAnswers ?? {})
    setPhase(pendingDraft.phase)
    setScreen(pendingDraft.screen)
    setCurrentIndex(pendingDraft.currentIndex)
    setE(pendingDraft.E)
    setA(pendingDraft.A)
    setO(pendingDraft.O)
    setArchetypeId(pendingDraft.archetypeId)
    
    if (pendingDraft.phase === "stage2" && pendingDraft.archetypeId) {
      setSurveyLoading(true)
      const startTime = Date.now(); // Bắt đầu tính giờ

      try {
        const stage2Data = await getStage2Survey()
        const source = stage2Data.length ? stage2Data : FALLBACK_STAGE2_QUESTIONS
        setStage2Questions(source.slice(0, 7))

        // Kiểm tra xem nãy giờ API chạy mất bao lâu
        const elapsed = Date.now() - startTime;
        if (elapsed < 800) {
          await wait(800 - elapsed); // Chạy nhanh quá thì ép nó chờ cho đủ 800ms (0.8 giây)
        }

      } catch {
        setStage2Questions(FALLBACK_STAGE2_QUESTIONS)
      } finally {
        setSurveyLoading(false)
      }
    }

    setShowResumeModal(false)
    setPendingDraft(null)
  }

  const discardDraftAndStartNew = () => {
    clearDraft()
    setShowResumeModal(false)
    setPendingDraft(null)
    restart()
  }

  return {
    screen,
    phase,
    currentIndex,
    totalQuestions,
    globalQuestionIndex,
    currentQuestion,
    selectedOptionIndex,
    currentCustomAnswer,
    progressPercent,
    surveyLoading,
    loading,
    error,
    results,
    archetypeId,
    subTypeId,
    archetypeProfile,
    checkpointMessage,
    showResumeModal,
    selectAnswer,
    setCustomAnswer,
    next,
    viewResultNow,
    continueDeepAnalysis,
    restoreDraft,
    discardDraftAndStartNew,
    restart,
  }
}
