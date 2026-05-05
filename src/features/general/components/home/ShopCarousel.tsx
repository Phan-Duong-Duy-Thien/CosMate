import * as React from "react"
import { ChevronLeft, ChevronRight, Star, Trophy } from "lucide-react"

import type { Shop } from "../../pages/home.types"
import { AnimeSectionHeading } from "./AnimeSectionHeading"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { VI } from "@/shared/i18n/vi"

interface ShopCarouselProps {
  shops: Shop[]
  loading?: boolean
  error?: string | null
}

export const ShopCarousel = ({ shops, loading = false, error = null }: ShopCarouselProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleScrollBy = (amount: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section className="w-full pt-12 md:pt-16" data-reveal="true">
      <AnimeSectionHeading
        title={VI.general.home.trustedShopsTitle}
        description={VI.general.home.trustedShopsHint}
        icon={<Trophy className="h-5 w-5" aria-hidden />}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] hover:bg-amber-100"
              aria-label="Cuộn trái"
              onClick={() => handleScrollBy(-320)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] hover:bg-amber-100"
              aria-label="Cuộn phải"
              onClick={() => handleScrollBy(320)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="relative mt-10">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[#fff7fb] to-transparent md:w-14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-[#fff7fb] to-transparent md:w-14"
          aria-hidden
        />
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1 scrollbar-hide scroll-smooth md:snap-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <Card
                  key={`shop-sk-${i}`}
                  className="min-w-[272px] shrink-0 snap-start animate-pulse rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb]/80 p-5 shadow-[8px_8px_0_0_rgba(30,27,75,0.35)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-2xl border-[3px] border-indigo-950/30 bg-slate-200" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 w-36 rounded-lg bg-slate-200" />
                      <div className="h-3 w-28 rounded-lg bg-slate-100" />
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
          {!loading && error && (
            <Card className="min-w-[min(100%,300px)] shrink-0 snap-start rounded-2xl border-[4px] border-amber-700 bg-[#fffbeb] p-5 text-sm font-bold text-amber-950 shadow-[8px_8px_0_0_rgba(120,53,15,0.35)]">
              Không tải được danh sách shop từ máy chủ — đang hiển thị dữ liệu gợi ý.
            </Card>
          )}
          {!loading &&
            shops.map((shop) => (
              <Card
                key={shop.id}
                className="group min-w-[272px] shrink-0 snap-start cursor-default overflow-hidden rounded-2xl border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] to-[#fce7f3] p-5 shadow-[9px_9px_0_0_rgba(30,27,75,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(217,70,239,0.35)]"
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={shop.avatarUrl}
                      alt={shop.name}
                      className="h-16 w-16 rounded-2xl border-[3px] border-indigo-950 object-cover shadow-[4px_4px_0_0_#1e1b4b] transition group-hover:rotate-[-2deg]"
                    />
                    <span
                      className="absolute -bottom-2 -right-2 flex min-h-[26px] min-w-[26px] items-center justify-center rounded-lg border-[3px] border-indigo-950 bg-gradient-to-br from-amber-300 to-orange-400 px-1 text-[11px] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]"
                      aria-label={`Đánh giá ${shop.rating.toFixed(1)}`}
                    >
                      {shop.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate text-base font-extrabold text-indigo-950">
                        {shop.name}
                      </div>
                      {shop.topRated ? (
                        <Badge className="shrink-0 border-[3px] border-indigo-950 bg-gradient-to-r from-amber-300 to-yellow-300 font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
                          TOP
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-900/80">
                      <Star
                        className="h-4 w-4 shrink-0 fill-amber-400 text-amber-500"
                        aria-hidden
                      />
                      <span>{formatCount(shop.rentalsCount)} lượt thuê</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}

const formatCount = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`
  return `${value}+`
}
