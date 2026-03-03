import * as React from "react"
import { ChevronLeft, ChevronRight, Star, Trophy } from "lucide-react"

import type { Shop } from "../../pages/home.types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { cn } from "@/lib/utils"

interface ShopCarouselProps {
  shops: Shop[]
}

export const ShopCarousel = ({ shops }: ShopCarouselProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [progress, setProgress] = React.useState(0)

  const updateProgress = React.useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const maxScroll = scrollWidth - clientWidth
    setProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0)
  }, [])

  React.useEffect(() => {
    updateProgress()
  }, [updateProgress])

  const handleScrollBy = (amount: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section className="w-full pt-12" data-reveal="true">
      <SectionHeader
        title="Shop cho thuê uy tín"
        icon={<Trophy className="h-6 w-6" />}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              aria-label="Cuộn trái"
              onClick={() => handleScrollBy(-320)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-label="Cuộn phải"
              onClick={() => handleScrollBy(320)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      <div
        ref={scrollRef}
        onScroll={updateProgress}
        className="mt-6 flex gap-4 overflow-x-auto pb-4"
      >
        {shops.map((shop) => (
          <Card
            key={shop.id}
            className="min-w-[240px] border-slate-100 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <img
                src={shop.avatarUrl}
                alt={shop.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              {shop.topRated && (
                <Badge className="bg-yellow-100 text-yellow-700">
                  Top Rated
                </Badge>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-base font-semibold text-slate-900">
                {shop.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Star className="h-4 w-4 text-yellow-400" />
                {shop.rating.toFixed(1)} • {formatCount(shop.rentalsCount)} lượt
                thuê
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div
          className={cn(
            "h-2 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 transition-all"
          )}
          style={{ width: `${Math.max(progress * 100, 12)}%` }}
        />
      </div>
    </section>
  )
}

const formatCount = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`
  return `${value}+`
}
