import { useEffect, useMemo, useState } from "react"
import { notification } from "antd"

import {
  getStage1Survey,
  getStage2Survey,
  getSurveyEnd,
  mapQuizError,
  recommendByStyle,
} from "../services/styleQuiz.service"
import type { SearchResponseItem, Stage1Question, Stage2Question } from "../types"

type ExploreMode = "quick" | "deep"
type QuizPhase = "stage1" | "stage2" | "surveyEnd"
type QuizScreen = "welcome" | "quiz" | "loading" | "result"

interface ArchetypeDetail {
  name: string
  coreDesire: string
  famousCharacters: string[]
}

const ARCHETYPE_DETAILS: Record<string, ArchetypeDetail> = {
  ARCH_01: { name: "The Hero (Người Hùng)", coreDesire: "Chứng minh giá trị thông qua hành động dũng cảm.", famousCharacters: ["Tanjiro", "Midoriya", "Eren", "Goku"] },
  ARCH_02: { name: "The Rebel (Kẻ Nổi Loạn)", coreDesire: "Phá vỡ các quy tắc và phá hủy những thứ không hiệu quả.", famousCharacters: ["Sasuke", "Lelouch", "Sukuna"] },
  ARCH_03: { name: "The Sage (Nhà Thông Thái)", coreDesire: "Tìm kiếm chân lý và thấu hiểu thế giới.", famousCharacters: ["Jiraiya", "Gojo", "Aizen"] },
  ARCH_04: { name: "The Innocent (Người Ngây Thơ)", coreDesire: "Trải nghiệm thiên đường, mong muốn hạnh phúc bình dị.", famousCharacters: ["Anya Forger", "Nahida"] },
  ARCH_05: { name: "The Jester (Kẻ Pha Trò)", coreDesire: "Sống trọn vẹn từng khoảnh khắc, tận hưởng niềm vui.", famousCharacters: ["Gintoki", "Hisoka", "Buggy"] },
  ARCH_06: { name: "The Caregiver (Người Chăm Sóc)", coreDesire: "Bảo vệ và quan tâm đến những người xung quanh.", famousCharacters: ["Bucciarati", "Itachi"] },
  ARCH_07: { name: "The Explorer (Người Khám Phá)", coreDesire: "Tự do tìm hiểu thế giới và trải nghiệm cuộc sống.", famousCharacters: ["Luffy", "Gon", "Kenshin"] },
  ARCH_08: { name: "The Lover (Người Tình)", coreDesire: "Đạt được sự gắn kết, thân mật và tình yêu.", famousCharacters: ["Sanji", "Mikasa", "Yuno Gasai"] },
  ARCH_09: { name: "The Creator (Người Sáng Tạo)", coreDesire: "Tạo ra những thứ có giá trị trường tồn.", famousCharacters: ["Senku", "Bulma", "Deidara"] },
  ARCH_10: { name: "The Ruler (Người Trị Vì)", coreDesire: "Kiểm soát và tạo ra trật tự cho thế giới.", famousCharacters: ["Rimuru", "Gilgamesh", "Frieza"] },
  ARCH_11: { name: "The Magician (Nhà Phép Thuật)", coreDesire: "Hiểu biết quy luật vận hành của vũ trụ để biến đổi nó.", famousCharacters: ["Edward Elric", "Geto Suguru"] },
  ARCH_12: { name: "The Everyman (Người Thường)", coreDesire: "Thuộc về một nơi nào đó, hòa nhập với mọi người.", famousCharacters: ["Rock Lee", "Shinpachi"] },
}

function buildStyleCardText(archetypeName: string, budgetMetadata: string): string {
  return `Linh hồn của bạn đồng điệu với ${archetypeName}. Budget mode: ${budgetMetadata}. Aura cosplay này sinh ra để bạn tỏa sáng giữa đám đông!`
}

function countArchetypeFrequency(
  questions: Stage1Question[],
  selectedOptionByQuestion: Record<string, number>
): Map<string, number> {
  const frequency = new Map<string, number>()

  questions.forEach((question) => {
    const selectedIndex = selectedOptionByQuestion[question.question_id]
    const option = question.options[selectedIndex]
    if (!option?.points_to?.length) return

    option.points_to.forEach((arch) => {
      frequency.set(arch, (frequency.get(arch) ?? 0) + 1)
    })
  })

  return frequency
}

function pickWinningArchetype(frequency: Map<string, number>): string {
  let winner = ""
  let max = -1

  frequency.forEach((value, key) => {
    if (value > max) {
      max = value
      winner = key
    }
  })

  return winner
}

function deriveBudgetMetadata(optionText: string): string {
  const normalized = optionText.toLowerCase()
  if (normalized.includes("dưới") || normalized.includes("150")) return "low_budget"
  if (normalized.includes("trên") || normalized.includes("300")) return "high_budget"
  return "mid_budget"
}

export function useStyleQuiz() {
  const [screen, setScreen] = useState<QuizScreen>("welcome")
  const [mode, setMode] = useState<ExploreMode | null>(null)
  const [phase, setPhase] = useState<QuizPhase>("stage1")

  const [stage1Questions, setStage1Questions] = useState<Stage1Question[]>([])
  const [stage2Questions, setStage2Questions] = useState<Stage2Question[]>([])
  const [surveyEndQuestions, setSurveyEndQuestions] = useState<Stage1Question[]>([])

  const [stage1Answers, setStage1Answers] = useState<Record<string, number>>({})
  const [stage2Answers, setStage2Answers] = useState<Record<number, number>>({})
  const [surveyEndAnswers, setSurveyEndAnswers] = useState<Record<string, number>>({})

  const [currentIndex, setCurrentIndex] = useState(0)

  const [archetypeId, setArchetypeId] = useState("")
  const [subTypeId, setSubTypeId] = useState("")

  const [loading, setLoading] = useState(false)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [results, setResults] = useState<SearchResponseItem[]>([])
  const [styleCardText, setStyleCardText] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSurveyData = async () => {
      setSurveyLoading(true)
      setError(null)
      try {
        const [stage1Data, surveyEndData] = await Promise.all([getStage1Survey(), getSurveyEnd()])
        setStage1Questions(stage1Data)
        setSurveyEndQuestions(surveyEndData)
      } catch (err) {
        setError(mapQuizError(err))
      } finally {
        setSurveyLoading(false)
      }
    }

    loadSurveyData()
  }, [])

  const currentQuestions = useMemo(() => {
    if (phase === "stage2") return stage2Questions
    if (phase === "surveyEnd") return surveyEndQuestions
    return stage1Questions
  }, [phase, stage1Questions, stage2Questions, surveyEndQuestions])

  const totalQuestions = useMemo(() => {
    if (!mode) return 0
    const stage1Count = stage1Questions.length
    const surveyEndCount = surveyEndQuestions.length
    if (mode === "quick") return stage1Count + surveyEndCount
    return stage1Count + 1 + surveyEndCount
  }, [mode, stage1Questions.length, surveyEndQuestions.length])

  const currentQuestion = currentQuestions[currentIndex]

  const globalQuestionIndex = useMemo(() => {
    if (screen !== "quiz") return 0

    if (phase === "stage1") return currentIndex + 1

    if (phase === "stage2") return stage1Questions.length + currentIndex + 1

    const stage2Offset = mode === "deep" ? 1 : 0
    return stage1Questions.length + stage2Offset + currentIndex + 1
  }, [screen, phase, mode, currentIndex, stage1Questions.length])

  const selectedOptionIndex = useMemo(() => {
    if (phase === "stage1") {
      const question = stage1Questions[currentIndex]
      if (!question) return undefined
      return stage1Answers[question.question_id]
    }

    if (phase === "stage2") return stage2Answers[currentIndex]

    const question = surveyEndQuestions[currentIndex]
    if (!question) return undefined
    return surveyEndAnswers[question.question_id]
  }, [phase, stage1Questions, stage1Answers, stage2Answers, surveyEndQuestions, surveyEndAnswers, currentIndex])

  const progressPercent = useMemo(() => {
    if (!totalQuestions || !globalQuestionIndex) return 0
    return Math.round((globalQuestionIndex / totalQuestions) * 100)
  }, [globalQuestionIndex, totalQuestions])

  const archetypeDetail = useMemo(() => {
    return ARCHETYPE_DETAILS[archetypeId] ?? {
      name: archetypeId || "Unknown Archetype",
      coreDesire: "",
      famousCharacters: [],
    }
  }, [archetypeId])

  const quickModeTotal = stage1Questions.length + surveyEndQuestions.length
  const deepModeTotal = stage1Questions.length + 2 + surveyEndQuestions.length

  const selectAnswer = (optionIndex: number) => {
    if (phase === "stage1") {
      const question = stage1Questions[currentIndex]
      if (!question) return
      setStage1Answers((prev) => ({ ...prev, [question.question_id]: optionIndex }))
      return
    }

    if (phase === "stage2") {
      setStage2Answers((prev) => ({ ...prev, [currentIndex]: optionIndex }))
      return
    }

    const question = surveyEndQuestions[currentIndex]
    if (!question) return
    setSurveyEndAnswers((prev) => ({ ...prev, [question.question_id]: optionIndex }))
  }

  const runRecommend = async (finalSubTypeId: string, finalBudgetMetadata: string) => {
    setScreen("loading")
    setLoading(true)
    setError(null)

    try {
      const recommendItems = await recommendByStyle({
        archetypeId,
        subTypeId: finalSubTypeId,
        budgetMetadata: finalBudgetMetadata,
      })

      setSubTypeId(finalSubTypeId)
      setResults(recommendItems)
      setStyleCardText(buildStyleCardText(archetypeDetail.name, finalBudgetMetadata))
      setScreen("result")
      notification.success({ description: "AI đã hoàn thành phân tích và trả kết quả!" })
    } catch (err) {
      const msg = mapQuizError(err)
      setError(msg)
      notification.error({ description: msg })
      setScreen("quiz")
      setPhase("surveyEnd")
      setCurrentIndex(0)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const next = async () => {
    if (selectedOptionIndex === undefined) return

    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return
    }

    if (phase === "stage1") {
      const frequency = countArchetypeFrequency(stage1Questions, stage1Answers)
      const winnerArchetypeId = pickWinningArchetype(frequency)

      if (!winnerArchetypeId) {
        setError("Không xác định được tính cách từ câu trả lời. Vui lòng thử lại.")
        return
      }

      setArchetypeId(winnerArchetypeId)

      if (mode === "deep") {
        setSurveyLoading(true)
        setError(null)
        try {
          const data = await getStage2Survey(winnerArchetypeId)
          setStage2Questions(data)
          setPhase("stage2")
          setCurrentIndex(0)
        } catch (err) {
          const msg = mapQuizError(err)
          setError(msg)
          notification.error({ description: msg })
        } finally {
          setSurveyLoading(false)
        }
        return
      }

      setPhase("surveyEnd")
      setCurrentIndex(0)
      return
    }

    if (phase === "stage2") {
      const firstQuestion = stage2Questions[0]
      const selected = firstQuestion?.options[stage2Answers[0]]
      const finalSubTypeId = selected?.points_to_subtype ?? ""

      if (!finalSubTypeId) {
        setError("Không xác định được phong cách chi tiết từ câu trả lời.")
        return
      }

      setSubTypeId(finalSubTypeId)
      setPhase("surveyEnd")
      setCurrentIndex(0)
      return
    }

    const budgetQuestion = surveyEndQuestions[currentIndex]
    const budgetOption = budgetQuestion?.options[surveyEndAnswers[budgetQuestion.question_id]]
    const finalBudgetMetadata = budgetOption?.metadata ?? deriveBudgetMetadata(budgetOption?.text ?? "")

    let finalSubTypeId = subTypeId

    if (!finalSubTypeId) {
      try {
        const data = await getStage2Survey(archetypeId)
        finalSubTypeId = data[0]?.options[0]?.points_to_subtype ?? ""
      } catch {
        finalSubTypeId = ""
      }
    }

    if (!finalSubTypeId) {
      setError("Không lấy được subtype để trả kết quả. Vui lòng thử lại.")
      return
    }

    await runRecommend(finalSubTypeId, finalBudgetMetadata)
  }

  const start = (nextMode: ExploreMode) => {
    setMode(nextMode)
    setScreen("quiz")
    setPhase("stage1")
    setCurrentIndex(0)
    setStage1Answers({})
    setStage2Answers({})
    setSurveyEndAnswers({})
    setResults([])
    setError(null)
    setArchetypeId("")
    setSubTypeId("")
  }

  const restart = () => {
    setMode(null)
    setScreen("welcome")
    setPhase("stage1")
    setCurrentIndex(0)
    setStage1Answers({})
    setStage2Answers({})
    setSurveyEndAnswers({})
    setArchetypeId("")
    setSubTypeId("")
    setResults([])
    setStyleCardText("")
    setError(null)
  }

  return {
    screen,
    phase,
    mode,
    currentIndex,
    totalQuestions,
    globalQuestionIndex,
    currentQuestion,
    selectedOptionIndex,
    progressPercent,
    surveyLoading,
    loading,
    error,
    results,
    styleCardText,
    archetypeId,
    archetypeDetail,
    subTypeId,
    quickModeTotal,
    deepModeTotal,
    start,
    selectAnswer,
    next,
    restart,
  }
}
