import { Alert, Button, Progress, Spin } from "antd"
import { useNavigate } from "react-router-dom"

import quizMascotVideo from "@/assets/video-mascot-quiz.mov"
import ResultCostumeGrid from "../components/ResultCostumeGrid"
import { useStyleQuiz } from "../hooks/useStyleQuiz"

export default function StyleQuizPage() {
  const navigate = useNavigate()
  const quiz = useStyleQuiz()

  return (
    <section className="mx-auto max-w-6xl space-y-4 py-4">
      {quiz.error && <Alert type="error" description={quiz.error} showIcon />}

      {quiz.surveyLoading && (
        <div className="rounded-3xl border border-pink-200 bg-white p-10 text-center shadow-sm">
          <Spin />
          <p className="mt-3 text-sm text-pink-600">Đang tải dữ liệu câu hỏi...</p>
        </div>
      )}

      {!quiz.surveyLoading && quiz.screen === "welcome" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-500">AI Style Quiz</p>
            <h1 className="mt-2 text-2xl font-extrabold text-pink-700 md:text-3xl">Khám phá bản ngã cosplay của bạn chỉ trong vài phút</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-700 md:text-base">
              Trả lời bộ câu hỏi thông minh để nhận gợi ý nhân vật và trang phục phù hợp nhất với tính cách, gu thẩm mỹ và ngân sách của bạn.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => quiz.start("quick")}
              className="rounded-3xl border border-pink-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-400 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">Chế độ 1</p>
              <h2 className="mt-2 text-xl font-bold text-pink-600">Khám phá nhanh</h2>
              <p className="mt-2 text-sm text-slate-600">
                Làm <span className="font-extrabold text-pink-700">{quiz.quickModeTotal}</span> câu hỏi để nhận kết quả nhanh trong vài bước.
              </p>
            </button>

            <button
              type="button"
              onClick={() => quiz.start("deep")}
              className="rounded-3xl border border-pink-300 bg-pink-50 p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-500 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">Chế độ 2</p>
              <h2 className="mt-2 text-xl font-bold text-pink-600">Khám phá chuyên sâu</h2>
              <p className="mt-2 text-sm text-slate-600">
                Làm <span className="font-extrabold text-pink-700">{quiz.deepModeTotal}</span> câu hỏi để AI phân tích chi tiết hơn.
              </p>
            </button>
          </div>
        </div>
      )}

      {!quiz.surveyLoading && quiz.screen === "quiz" && quiz.currentQuestion && (
        <div className="space-y-5 rounded-3xl border border-pink-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between text-sm font-semibold text-pink-600">
            <span>Câu {quiz.globalQuestionIndex}</span>
            <span>
              {quiz.globalQuestionIndex} / {quiz.totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Progress
                percent={quiz.progressPercent}
                showInfo={false}
                strokeColor="#ec4899"
                railColor="#fce7f3"
              />
            </div>
            <span className="w-12 text-right text-sm font-semibold text-pink-600">{quiz.progressPercent}%</span>
          </div>

          <h2 className="text-xl font-semibold text-slate-800">{quiz.currentQuestion.question}</h2>

          <div className="grid gap-3">
            {quiz.currentQuestion.options.map((option, index) => {
              const active = quiz.selectedOptionIndex === index
              return (
                <button
                  key={`${quiz.currentIndex}-${index}`}
                  type="button"
                  onClick={() => quiz.selectAnswer(index)}
                  className={[
                    "rounded-2xl border p-4 text-left transition-all",
                    active
                      ? "border-pink-500 bg-pink-50 shadow-[0_0_0_2px_rgba(236,72,153,0.16)]"
                      : "border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50/50",
                  ].join(" ")}
                >
                  <p className="font-medium text-slate-800">{option.text}</p>
                </button>
              )
            })}
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              className="border-pink-500 bg-pink-500 text-white hover:!border-pink-600 hover:!bg-pink-600"
              onClick={quiz.next}
              disabled={quiz.selectedOptionIndex === undefined}
            >
              {quiz.globalQuestionIndex === quiz.totalQuestions ? "Hoàn thành" : "Tiếp theo"}
            </Button>
          </div>
        </div>
      )}

      {quiz.screen === "loading" && (
        <div className="rounded-3xl border border-pink-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-56 w-full max-w-md items-center justify-center rounded-[2rem] bg-white p-4">
            <video
              src={quizMascotVideo}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
          <p className="mt-4 text-sm font-medium text-pink-600">
            Đang tìm nhân vật phù hợp với tính cách của bạn... 🐾
          </p>
        </div>
      )}

      {quiz.screen === "result" && quiz.results.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="h-full rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-50 to-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">Thẻ Bản Ngã (Archetype Card)</p>
            <h3 className="mt-3 text-2xl font-bold text-pink-600">{quiz.archetypeDetail.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{quiz.archetypeDetail.coreDesire}</p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-pink-600">Nhân vật nổi tiếng cùng nhóm:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {quiz.archetypeDetail.famousCharacters.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-pink-600">Trang phục gợi ý cho bạn</h3>
                <span className="text-xs text-slate-500">{quiz.results.length} gợi ý</span>
              </div>
              <Button
                type="primary"
                onClick={quiz.restart}
                className="border-pink-500 bg-pink-500 text-white hover:!border-pink-600 hover:!bg-pink-600"
              >
                Làm lại quiz
              </Button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <ResultCostumeGrid items={quiz.results} onView={(id) => navigate(`/costumes/${id}`)} />
            </div>
          </section>
        </div>
      )}
    </section>
  )
}