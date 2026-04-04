import { Button } from "antd"

interface QuizHeroProps {
  onStart: () => void
}

export default function QuizHero({ onStart }: QuizHeroProps) {
  return (
    <section className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-100 via-fuchsia-50 to-pink-100 p-6 text-center shadow-sm md:p-10">
      <h1 className="text-2xl font-bold text-purple-700 md:text-4xl">
        Khám phá bản ngã Cosplay của bạn!
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-purple-700/80 md:text-base">
        Trả lời vài câu hỏi nhanh để bé Mèo AI gợi ý phong cách và set đồ hợp aura của bạn.
      </p>
      <div className="mt-6">
        <Button
          type="primary"
          size="large"
          onClick={onStart}
          className="h-12 rounded-full border-0 bg-purple-600 px-8 font-semibold shadow-lg transition hover:scale-[1.02] hover:!bg-purple-700"
        >
          Bắt đầu
        </Button>
      </div>
    </section>
  )
}
