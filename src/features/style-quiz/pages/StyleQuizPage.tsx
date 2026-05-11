import { Alert, Input, Modal, Progress, Select, Spin, Tooltip } from "antd"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import AILoadingMascot from "@/shared/components/AILoadingMascot"
import ResultCostumeGrid from "../components/ResultCostumeGrid"
import { useStyleQuiz } from "../hooks/useStyleQuiz"

const { Search } = Input

type SortValue = "similarity" | "price_asc" | "price_desc"

const SWATCH_CLASS_BY_HEX: Record<string, string> = {
  "#E11D48": "bg-rose-600",
  "#F59E0B": "bg-amber-500",
  "#111827": "bg-gray-900",
  "#000000": "bg-black",
  "#7F1D1D": "bg-red-900",
  "#4B5563": "bg-gray-600",
  "#1E3A8A": "bg-blue-900",
  "#D97706": "bg-amber-600",
  "#F3F4F6": "bg-gray-100",
  "#FBCFE8": "bg-pink-200",
  "#BAE6FD": "bg-sky-200",
  "#FEF08A": "bg-yellow-200",
  "#9333EA": "bg-purple-600",
  "#10B981": "bg-emerald-500",
  "#6EE7B7": "bg-emerald-300",
  "#F87171": "bg-red-400",
  "#FFFFFF": "bg-white",
  "#047857": "bg-emerald-700",
  "#B45309": "bg-amber-700",
  "#78716C": "bg-stone-500",
  "#BE185D": "bg-pink-700",
  "#F472B6": "bg-pink-400",
  "#4C1D95": "bg-violet-900",
  "#0284C7": "bg-sky-600",
  "#EA580C": "bg-orange-600",
  "#A3E635": "bg-lime-400",
  "#B91C1C": "bg-red-700",
  "#FBBF24": "bg-amber-400",
  "#1F2937": "bg-slate-800",
  "#581C87": "bg-purple-900",
  "#064E3B": "bg-emerald-900",
  "#64748B": "bg-slate-500",
  "#9CA3AF": "bg-gray-400",
  "#E5E7EB": "bg-gray-200",
} as const

const QUIZ_PRIMARY_CTA_CLASSNAME =
  "group relative rounded-2xl border border-cosmate-pink/30 bg-gradient-to-br from-background via-cosmate-soft-pink/35 to-cosmate-soft-pink/70 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cosmate-pink/45 hover:from-cosmate-soft-pink/45 hover:to-cosmate-soft-pink hover:shadow-md"

export default function StyleQuizPage() {
  const navigate = useNavigate()
  const quiz = useStyleQuiz()

  const [sortBy, setSortBy] = useState<SortValue>("similarity")
  const [nameFilter, setNameFilter] = useState("")

  const filteredResults = useMemo(() => {
    const byName = quiz.results.filter((item) => item.costumeName.toLowerCase().includes(nameFilter.trim().toLowerCase()))
    if (sortBy === "price_asc") return [...byName].sort((a, b) => Number(a.price) - Number(b.price))
    if (sortBy === "price_desc") return [...byName].sort((a, b) => Number(b.price) - Number(a.price))
    return [...byName].sort((a, b) => Number(b.similarityScore) - Number(a.similarityScore))
  }, [quiz.results, sortBy, nameFilter])

  return (
    <section className="mx-auto max-w-6xl space-y-4 py-4">
      <Modal open={quiz.showResumeModal} title="Tiếp tục bài quiz đang làm dở?" okText="Tiếp tục" cancelText="Bắt đầu mới" onOk={quiz.restoreDraft} onCancel={quiz.discardDraftAndStartNew} closable={false} maskClosable={false}>
        <p>Bạn đang làm dở bài Quiz trước đó. Bạn có muốn tiếp tục không?</p>
      </Modal>

      {quiz.error && <Alert type="error" description={quiz.error} showIcon />}

      {quiz.surveyLoading && (
        <div className="rounded-3xl border border-cosmate-pink/25 bg-card p-10 text-center shadow-sm">
          <Spin />
          <p className="mt-3 text-sm text-cosmate-pink">Đang tải dữ liệu câu hỏi...</p>
        </div>
      )}

      {!quiz.surveyLoading && quiz.screen === "quiz" && quiz.currentQuestion && (
        <div className="space-y-5 rounded-3xl border border-cosmate-pink/25 bg-card p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between text-lg font-semibold text-cosmate-pink">
            <span>Câu {quiz.globalQuestionIndex}</span>
            <span>{quiz.globalQuestionIndex} / {quiz.totalQuestions}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Progress percent={quiz.progressPercent} showInfo={false} strokeColor="var(--cosmate-pink)" railColor="var(--cosmate-soft-pink)" />
            </div>
            <span className="w-12 text-right text-base font-semibold text-cosmate-pink">{quiz.progressPercent}%</span>
          </div>

          <h2 className="text-xl font-semibold text-slate-800">{quiz.currentQuestion.question}</h2>

          <div className="grid gap-3 md:grid-cols-2">
            {quiz.currentQuestion.options.map((option, index) => {
              const active = quiz.selectedOptionIndex === index
              return (
                <button key={`${quiz.currentIndex}-${index}`} type="button" onClick={() => quiz.selectAnswer(index)} className={[
                  "rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-cosmate-pink/60 bg-cosmate-soft-pink/45 ring-2 ring-cosmate-pink/20"
                    : "border-cosmate-pink/20 bg-card hover:border-cosmate-pink/40 hover:bg-cosmate-soft-pink/20",
                ].join(" ")}>
                  <p className="font-medium text-slate-800">{option.text}</p>
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl border border-dashed border-cosmate-pink/30 bg-cosmate-soft-pink/25 p-4">
            <p className="mb-2 text-sm font-semibold text-cosmate-mauve">Câu trả lời khác</p>
            <Input.TextArea value={quiz.currentCustomAnswer} onChange={(event) => quiz.setCustomAnswer(event.target.value)} placeholder="Nhập suy nghĩ riêng của bạn nếu không thấy option phù hợp..." autoSize={{ minRows: 2, maxRows: 4 }} className="!rounded-2xl border-cosmate-pink/30" />
          </div>

          <div className="flex justify-center">
            <Button type="button" onClick={quiz.next} disabled={quiz.selectedOptionIndex === undefined && !quiz.currentCustomAnswer.trim()} variant="cosmateOutline" className={`h-11 px-6 text-sm font-normal ${QUIZ_PRIMARY_CTA_CLASSNAME}`}>
              <span aria-hidden="true" className="pointer-events-none absolute right-2 top-1 text-xs text-cosmate-pink/80 transition-all duration-300 group-hover:scale-110 group-hover:text-cosmate-pink">✦</span>
              Tiếp theo
            </Button>
          </div>
        </div>
      )}

      {!quiz.surveyLoading && quiz.screen === "checkpoint" && (
        <div className="space-y-6 rounded-3xl border border-cosmate-pink/25 bg-gradient-to-r from-cosmate-soft-pink/65 via-cosmate-soft-pink/35 to-cosmate-soft-pink/65 p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cosmate-pink">Checkpoint 70%</p>
          <h2 className="text-2xl font-semibold leading-snug text-foreground md:text-3xl">Hệ thống đã quét được <span className="font-extrabold text-cosmate-pink">70%</span> bản ngã của bạn và xếp bạn vào nhóm <span className="font-extrabold text-cosmate-pink">{quiz.archetypeProfile.name}</span>. Bạn muốn xem kết quả ngay hay test thêm 7 câu để phân tích chi tiết <span className="font-extrabold text-cosmate-pink">100%</span>?</h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button type="button" onClick={quiz.viewResultNow} variant="cosmateOutline" className="h-11 rounded-2xl px-6 text-sm font-normal">Xem kết quả ngay</Button>
            <Button type="button" onClick={quiz.continueDeepAnalysis} variant="cosmateOutline" className={`h-11 px-6 text-sm font-normal ${QUIZ_PRIMARY_CTA_CLASSNAME}`}>
              <span aria-hidden="true" className="pointer-events-none absolute right-2 top-1 text-xs text-cosmate-pink/80 transition-all duration-300 group-hover:scale-110 group-hover:text-cosmate-pink">✦</span>
              Tiếp tục phân tích sâu
            </Button>
          </div>
        </div>
      )}

      {quiz.screen === "loading" && <AILoadingMascot type="quiz" />}

      {quiz.screen === "result" && quiz.results.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="h-full rounded-3xl border border-cosmate-pink/25 bg-gradient-to-br from-cosmate-soft-pink/35 to-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-cosmate-pink">Thẻ Bản Ngã (Archetype Card)</p>
            <h3 className="mt-3 text-2xl font-bold text-cosmate-pink">{quiz.archetypeProfile.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{quiz.archetypeProfile.coreDesire}</p>
            <p className="mt-3 text-sm font-medium text-slate-700">Gu trang phục: {quiz.archetypeProfile.clothing_style}</p>
            <div className="mt-5"><p className="text-sm font-semibold text-cosmate-pink">Bảng màu phù hợp:</p><div className="mt-2 flex flex-wrap items-center gap-2">{quiz.archetypeProfile.color_palette.map((hex) => (<span key={hex} title={hex} className={["h-7 w-7 rounded-full border border-background shadow ring-1 ring-cosmate-pink/18", SWATCH_CLASS_BY_HEX[hex.toUpperCase()] ?? "bg-cosmate-soft-pink"].join(" ")} />))}</div></div>
            <div className="mt-5"><p className="text-sm font-semibold text-cosmate-pink">Nhân vật nổi bật:</p><div className="mt-2 flex flex-wrap gap-2">{quiz.archetypeProfile.famousCharacters.map((name) => { const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${name} anime character`)}`; return (<Tooltip key={name} title="Mở Google Images để xem nhân vật"><a href={searchUrl} target="_blank" rel="noreferrer" className="rounded-full border border-cosmate-pink/30 bg-card px-3 py-1 text-xs font-semibold text-cosmate-pink transition hover:border-cosmate-pink/55 hover:bg-cosmate-soft-pink/30">{name}</a></Tooltip>) })}</div></div>
          </section>
          <section className="rounded-3xl border border-cosmate-pink/25 bg-card p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-cosmate-pink">Trang phục gợi ý cho bạn</h3><span className="text-xs text-muted-foreground">{filteredResults.length} gợi ý phù hợp</span></div><Button type="button" onClick={quiz.restart} variant="cosmateOutline" className={`px-4 py-2 text-sm font-normal ${QUIZ_PRIMARY_CTA_CLASSNAME}`}>Làm lại quiz</Button></div>
              <div className="grid gap-3 md:grid-cols-2"><Select value={sortBy} onChange={(value) => setSortBy(value)} options={[{ value: "similarity", label: "Khớp nhất (Similarity)" }, { value: "price_asc", label: "Giá thấp → cao" }, { value: "price_desc", label: "Giá cao → thấp" }]} className="w-full" /><Search allowClear value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} placeholder="Filter: tìm tên nhân vật" /></div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-1"><ResultCostumeGrid items={filteredResults} onView={(id) => navigate(`/costumes/${id}`)} /></div>
          </section>
        </div>
      )}
    </section>
  )
}
