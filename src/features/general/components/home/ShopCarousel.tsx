import * as React from "react"
import { ChevronLeft, ChevronRight, Star, Trophy } from "lucide-react"

import type { Shop } from "../../pages/home.types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { SectionHeader } from "@/shared/components/SectionHeader"
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
    <section className="w-full pt-14 md:pt-16" data-reveal="true">
      <SectionHeader
        title={VI.general.home.trustedShopsTitle}
        description={VI.general.home.trustedShopsHint}
        icon={<Trophy className="h-6 w-6" />}
        accent
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 bg-white shadow-sm hover:border-pink-200 hover:bg-pink-50/50"
              aria-label="Cuộn trái"
              onClick={() => handleScrollBy(-320)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 bg-white shadow-sm hover:border-pink-200 hover:bg-pink-50/50"
              aria-label="Cuộn phải"
              onClick={() => handleScrollBy(320)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      <div className="relative mt-8">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-pink-50/95 to-transparent md:w-12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-pink-50/95 to-transparent md:w-12"
          aria-hidden
        />
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide scroll-smooth md:snap-none"
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
                  className="min-w-[260px] shrink-0 snap-start animate-pulse border-slate-100/90 p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
          {!loading && error && (
            <Card className="min-w-[min(100%,280px)] shrink-0 snap-start border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-900 shadow-sm">
              Không tải được danh sách shop từ máy chủ — đang hiển thị dữ liệu
              gợi ý.
            </Card>
          )}
          {!loading &&
            shops.map((shop) => (
              <Card
                key={shop.id}
                className="group min-w-[260px] shrink-0 snap-start cursor-default overflow-hidden border border-slate-100/90 bg-white p-5 shadow-sm ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-pink-100 hover:shadow-lg hover:shadow-pink-500/10 hover:ring-1 hover:ring-pink-100"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={shop.avatarUrl}
                      alt={shop.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-pink-100/80 transition group-hover:ring-pink-200"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-[10px] font-bold text-white shadow-md"
                      aria-hidden
                    >
                      {shop.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate text-base font-semibold text-slate-900">
                        {shop.name}
                      </div>
                      {shop.topRated ? (
                        <Badge className="shrink-0 border-0 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900">
                          Top
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Star
                        className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
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
