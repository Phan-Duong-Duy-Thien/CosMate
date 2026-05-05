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
    }, 5500)
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
    <section className="w-full pt-6 md:pt-8" data-reveal="true">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner CosMate"
        className="relative touch-pan-y select-none overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-12px_rgba(236,72,153,0.22)] ring-1 ring-pink-100/80 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-14px_rgba(236,72,153,0.28)] motion-reduce:transform-none motion-reduce:hover:shadow-[0_24px_60px_-12px_rgba(236,72,153,0.22)]"
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
                className="absolute inset-0 scale-105 bg-cover bg-center motion-reduce:scale-100"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="relative flex h-full min-h-[280px] flex-col justify-end gap-5 px-5 pb-8 pt-14 sm:min-h-[320px] md:min-h-[380px] md:px-10 md:pb-10 md:pt-16">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center md:mx-0 md:max-w-xl md:items-start md:text-left">
                  <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {slide.pill}
                  </span>
                  <div className="space-y-2">
                    <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-sm md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                      {slide.title}
                    </h2>
                    <p className="text-pretty text-sm leading-relaxed text-white/85 md:text-base md:leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                  <Button
                    size="pill"
                    className="mt-1 h-auto w-fit rounded-full bg-white px-8 py-3 text-base font-semibold text-pink-600 shadow-lg shadow-black/15 transition hover:bg-pink-50 hover:text-pink-700"
                    onClick={() => onCtaClick(slide)}
                  >
                    {slide.ctaLabel}
                  </Button>
                </div>
                <div className="flex justify-center md:justify-start">
                  <div
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-2 backdrop-blur-md"
                    role="tablist"
                    aria-label="Chọn slide banner"
                  >
                    {slides.map((_, dotIndex) => (
                      <button
                        key={`dot-${dotIndex}`}
                        type="button"
                        role="tab"
                        aria-selected={dotIndex === activeIndex}
                        aria-label={`Slide ${dotIndex + 1}`}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300 ease-out",
                          dotIndex === activeIndex
                            ? "w-8 bg-white"
                            : "w-2 bg-white/40 hover:bg-white/70"
                        )}
                        onClick={() => setActiveIndex(dotIndex)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <button
          type="button"
          aria-label="Slide trước"
          className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/90 p-2.5 text-slate-800 shadow-lg backdrop-blur-sm transition hover:bg-white md:flex"
          onClick={goToPrevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Slide tiếp theo"
          className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/90 p-2.5 text-slate-800 shadow-lg backdrop-blur-sm transition hover:bg-white md:flex"
          onClick={goToNextSlide}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="aspect-[16/9] w-full md:aspect-auto md:h-[400px] lg:h-[420px]" />
      </div>
    </section>
  )
}
