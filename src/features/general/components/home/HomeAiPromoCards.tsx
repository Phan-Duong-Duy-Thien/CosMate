import { ScanSearch, Sparkles } from "lucide-react"

import quizPromoImage from "@/assets/quiz1.jpg"
import imageSearchPromoImage from "@/assets/anh1.jpg"
import { TokenCostBadge } from "@/shared/components/TokenCostBadge"
import { cn } from "@/lib/utils"

export interface HomeAiPromoCardsProps {
  onStyleQuiz: () => void
  onCostumeImageSearch: () => void
  className?: string
}

export function HomeAiPromoCards({
  onStyleQuiz,
  onCostumeImageSearch,
  className,
}: HomeAiPromoCardsProps) {
  return (
    <section
      className={cn("grid gap-4 md:grid-cols-2 md:gap-5", className)}
      data-reveal="true"
      aria-label="Truy cập nhanh tính năng AI"
    >
      <button
        type="button"
        onClick={onStyleQuiz}
        className="group relative box-border flex min-h-[168px] w-full overflow-hidden rounded-[1.25rem] border-[4px] border-indigo-950 bg-indigo-950 text-left shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] outline-none transition hover:-translate-y-0.5 hover:shadow-[11px_11px_0_0_rgba(30,27,75,0.45)] focus-visible:ring-4 focus-visible:ring-pink-400 md:min-h-[188px]"
      >
        <div className="pointer-events-none absolute inset-[4px] overflow-hidden rounded-[calc(1.25rem-4px)]">
          <img
            src={quizPromoImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-950/45 to-indigo-900/25" />
        </div>
        <div className="relative z-10 mt-auto flex w-full flex-col gap-3 p-4 md:p-5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border-[3px] border-white/90 bg-white/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            AI · Quiz phong cách
          </span>
          <p className="max-w-[18rem] text-base font-extrabold leading-snug text-white drop-shadow md:text-lg">
            Bạn là nhân vật nào?
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit items-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-2 text-sm font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] transition group-hover:brightness-110">
              Làm quiz ngay
            </span>
            <TokenCostBadge cost={30} className="shadow-[3px_3px_0_0_rgba(255,255,255,0.18)]" />
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={onCostumeImageSearch}
        className="group relative box-border flex min-h-[168px] w-full overflow-hidden rounded-[1.25rem] border-[4px] border-indigo-950 bg-indigo-950 text-left shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] outline-none transition hover:-translate-y-0.5 hover:shadow-[11px_11px_0_0_rgba(30,27,75,0.45)] focus-visible:ring-4 focus-visible:ring-cyan-400 md:min-h-[188px]"
      >
        <div className="pointer-events-none absolute inset-[4px] overflow-hidden rounded-[calc(1.25rem-4px)]">
          <img
            src={imageSearchPromoImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-fuchsia-950/35 to-cyan-900/20" />
        </div>
        <div className="relative z-10 mt-auto flex w-full flex-col gap-3 p-4 md:p-5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border-[3px] border-white/90 bg-white/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur-sm">
            <ScanSearch className="h-3.5 w-3.5" aria-hidden />
            AI · Tìm theo ảnh
          </span>
          <p className="max-w-[18rem] text-base font-extrabold leading-snug text-white drop-shadow md:text-lg">
            Tìm trang phục qua ảnh
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit items-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-400 to-teal-500 px-4 py-2 text-sm font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] transition group-hover:brightness-105">
              Tìm bằng hình ảnh
            </span>
            <TokenCostBadge cost={15} className="shadow-[3px_3px_0_0_rgba(255,255,255,0.18)]" />
          </div>
        </div>
      </button>
    </section>
  )
}
