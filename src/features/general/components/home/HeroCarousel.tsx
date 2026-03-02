import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { BannerSlide } from "../../pages/home.types"
import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"

interface HeroCarouselProps {
  slides: BannerSlide[]
  onCtaClick: (slide: BannerSlide) => void
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mediaQuery.matches)
    const handleChange = () => setReduced(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])
  return reduced
}

export const HeroCarousel = ({ slides, onCtaClick }: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const dragState = React.useRef({
    startX: 0,
    dragging: false,
    pointerId: -1,
    hasSwiped: false,
  })

  React.useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion || isDragging) return
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 2000)
    return () => window.clearInterval(interval)
  }, [isDragging, prefersReducedMotion, slides.length])

  const goToPrevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const target = event.target as HTMLElement
    if (target.closest("button, a, input, textarea, select")) {
      return
    }
    dragState.current = {
      startX: event.clientX,
      dragging: true,
      pointerId: event.pointerId,
      hasSwiped: false,
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return
    if (dragState.current.hasSwiped) return
    const delta = event.clientX - dragState.current.startX
    const threshold = 60
    if (Math.abs(delta) < threshold) return
    if (delta > 0) {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
    } else {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }
    dragState.current.hasSwiped = true
  }

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.dragging = false
    dragState.current.hasSwiped = false
    setIsDragging(false)
    if (dragState.current.pointerId !== -1) {
      event.currentTarget.releasePointerCapture(dragState.current.pointerId)
    }
    dragState.current.pointerId = -1
  }

  return (
    <section
      className="w-full pt-8"
      data-reveal="true"
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner CosMate"
        className="relative select-none overflow-hidden rounded-3xl shadow-xl transition-transform duration-500 ease-out hover:-translate-y-1 touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 will-change-transform",
                isActive
                  ? "translate-x-0 scale-100 opacity-100 blur-0"
                  : "pointer-events-none translate-x-1 scale-[1.02] opacity-0 blur-[1px]"
              )}
              style={{
                transition:
                  "opacity 700ms ease, transform 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 700ms ease",
              }}
              aria-hidden={!isActive}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
              <div className="relative flex h-full flex-col items-center justify-end gap-3 px-5 py-4 md:px-8 md:py-6">
                <div>
                  <Button
                    size="pill"
                    className="h-auto w-fit rounded-full bg-pink-500 px-8 py-2.5 text-lg font-medium text-white shadow-md hover:bg-pink-600"
                    onClick={() => onCtaClick(slide)}
                  >
                    {slide.ctaLabel}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={`dot-${dotIndex}`}
                      type="button"
                      aria-label={`Slide ${dotIndex + 1}`}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        dotIndex === activeIndex
                          ? "w-6 bg-pink-400"
                          : "bg-pink-200"
                      )}
                      onClick={() => setActiveIndex(dotIndex)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
        <button
          type="button"
          aria-label="Slide trước"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md transition hover:bg-white"
          onClick={goToPrevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Slide tiếp theo"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md transition hover:bg-white"
          onClick={goToNextSlide}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="aspect-[16/7] w-full md:h-[360px]" />
      </div>
    </section>
  )
}
