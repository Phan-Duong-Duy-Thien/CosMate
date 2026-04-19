import { Alert, Input, Modal, Progress, Select, Spin, Tooltip } from "antd"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import quizMascotVideo from "@/assets/video-mascot-quiz.mov"
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
        <div className="rounded-3xl border border-pink-200 bg-white p-10 text-center shadow-sm">
          <Spin />
          <p className="mt-3 text-sm text-pink-600">Đang tải dữ liệu câu hỏi...</p>
        </div>
      )}

      {!quiz.surveyLoading && quiz.screen === "quiz" && quiz.currentQuestion && (
        <div className="space-y-5 rounded-3xl border border-pink-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between text-lg font-semibold text-pink-600">
            <span>Câu {quiz.globalQuestionIndex}</span>
            <span>{quiz.globalQuestionIndex} / {quiz.totalQuestions}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Progress percent={quiz.progressPercent} showInfo={false} strokeColor="#ec4899" railColor="#fce7f3" />
            </div>
            <span className="w-12 text-right text-base font-semibold text-pink-600">{quiz.progressPercent}%</span>
          </div>

          <h2 className="text-xl font-semibold text-slate-800">{quiz.currentQuestion.question}</h2>

          <div className="grid gap-3 md:grid-cols-2">
            {quiz.currentQuestion.options.map((option, index) => {
              const active = quiz.selectedOptionIndex === index
              return (
                <button key={`${quiz.currentIndex}-${index}`} type="button" onClick={() => quiz.selectAnswer(index)} className={[
                  "rounded-2xl border p-4 text-left transition-all",
                  active ? "border-pink-500 bg-pink-50 shadow-[0_0_0_2px_rgba(236,72,153,0.16)]" : "border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50/50",
                ].join(" ")}>
                  <p className="font-medium text-slate-800">{option.text}</p>
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 p-4">
            <p className="mb-2 text-sm font-semibold text-pink-700">Câu trả lời khác</p>
            <Input.TextArea value={quiz.currentCustomAnswer} onChange={(event) => quiz.setCustomAnswer(event.target.value)} placeholder="Nhập suy nghĩ riêng của bạn nếu không thấy option phù hợp..." autoSize={{ minRows: 2, maxRows: 4 }} className="!rounded-2xl border-pink-200" />
          </div>

          <div className="flex justify-center">
            <button type="button" onClick={quiz.next} disabled={quiz.selectedOptionIndex === undefined && !quiz.currentCustomAnswer.trim()} className="group relative h-11 rounded-2xl border border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 px-6 text-sm font-normal text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 hover:shadow-[0_12px_24px_rgba(236,72,153,0.14)] disabled:cursor-not-allowed disabled:opacity-50">
              <span aria-hidden="true" className="pointer-events-none absolute right-2 top-1 text-xs text-pink-500/80 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-600">✦</span>
              Tiếp theo
            </button>
          </div>
        </div>
      )}

      {!quiz.surveyLoading && quiz.screen === "checkpoint" && (
        <div className="space-y-6 rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-500">Checkpoint 70%</p>
          <h2 className="text-2xl font-semibold leading-snug text-slate-700 md:text-3xl">Hệ thống đã quét được <span className="font-extrabold text-pink-600">70%</span> bản ngã của bạn và xếp bạn vào nhóm <span className="font-extrabold text-pink-600">{quiz.archetypeProfile.name}</span>. Bạn muốn xem kết quả ngay hay test thêm 7 câu để phân tích chi tiết <span className="font-extrabold text-pink-600">100%</span>?</h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={quiz.viewResultNow} className="h-11 rounded-2xl border border-pink-200 bg-white px-6 text-sm font-normal text-slate-600 shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50">Xem kết quả ngay</button>
            <button type="button" onClick={quiz.continueDeepAnalysis} className="group relative h-11 rounded-2xl border border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 px-6 text-sm font-normal text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 hover:shadow-[0_12px_24px_rgba(236,72,153,0.14)]">
              <span aria-hidden="true" className="pointer-events-none absolute right-2 top-1 text-xs text-pink-500/80 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-600">✦</span>
              Tiếp tục phân tích sâu
            </button>
          </div>
        </div>
      )}

      {quiz.screen === "loading" && (
        <div className="rounded-3xl border border-pink-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-56 w-full max-w-md items-center justify-center rounded-[2rem] bg-white p-4">
            <video src={quizMascotVideo} autoPlay loop muted playsInline className="h-full w-full object-contain mix-blend-multiply" />
          </div>
          <p className="mt-4 text-sm font-medium text-pink-600">Đang tìm nhân vật phù hợp với phong cách của bạn...</p>
        </div>
      )}

      {quiz.screen === "result" && quiz.results.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="h-full rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-50 to-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">Thẻ Bản Ngã (Archetype Card)</p>
            <h3 className="mt-3 text-2xl font-bold text-pink-600">{quiz.archetypeProfile.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{quiz.archetypeProfile.coreDesire}</p>
            <p className="mt-3 text-sm font-medium text-slate-700">Gu trang phục: {quiz.archetypeProfile.clothing_style}</p>
            <div className="mt-5"><p className="text-sm font-semibold text-pink-600">Bảng màu phù hợp:</p><div className="mt-2 flex flex-wrap items-center gap-2">{quiz.archetypeProfile.color_palette.map((hex) => (<span key={hex} title={hex} className={["h-7 w-7 rounded-full border border-white shadow ring-1 ring-pink-100", SWATCH_CLASS_BY_HEX[hex.toUpperCase()] ?? "bg-pink-200"].join(" ")} />))}</div></div>
            <div className="mt-5"><p className="text-sm font-semibold text-pink-600">Nhân vật nổi bật:</p><div className="mt-2 flex flex-wrap gap-2">{quiz.archetypeProfile.famousCharacters.map((name) => { const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${name} anime character`)}`; return (<Tooltip key={name} title="Mở Google Images để xem nhân vật"><a href={searchUrl} target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 bg-white px-3 py-1 text-xs font-semibold text-pink-600 transition hover:border-pink-400 hover:bg-pink-50">{name}</a></Tooltip>) })}</div></div>
          </section>
          <section className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-pink-600">Trang phục gợi ý cho bạn</h3><span className="text-xs text-slate-500">{filteredResults.length} gợi ý phù hợp</span></div><button type="button" onClick={quiz.restart} className="group relative rounded-2xl border border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 px-4 py-2 text-sm font-normal text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 hover:shadow-[0_12px_24px_rgba(236,72,153,0.14)]">Làm lại quiz</button></div>
              <div className="grid gap-3 md:grid-cols-2"><Select value={sortBy} onChange={(value) => setSortBy(value)} options={[{ value: "similarity", label: "Khớp nhất (Similarity)" }, { value: "price_asc", label: "Giá thấp → cao" }, { value: "price_desc", label: "Giá cao → thấp" }]} className="w-full" /><Search allowClear value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} placeholder="Filter: tìm tên nhân vật" /></div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-1"><ResultCostumeGrid items={filteredResults} onView={(id) => navigate(`/costumes/${id}`)} /></div>
          </section>
        </div>
      )}
    </section>
  )
}
