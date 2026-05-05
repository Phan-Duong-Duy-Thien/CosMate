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
    }, 6000)
    return () => window.clearInterval(interval)
  }, [isDragging, prefersReducedMotion, slides.length])

  const goToPrevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
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
    <section className="w-full pt-4 md:pt-6" data-reveal="true">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner CosMate"
        className={cn(
          "home-anime-halftone relative touch-pan-y select-none overflow-hidden rounded-[1.35rem] border-[5px] border-indigo-950 bg-indigo-950 shadow-[14px_14px_0_0_rgba(249,168,212,0.95)] ring-4 ring-amber-300 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[18px_18px_0_0_rgba(251,207,232,0.95)] motion-reduce:transform-none motion-reduce:hover:shadow-[14px_14px_0_0_rgba(249,168,212,0.95)] md:rounded-[1.65rem]"
        )}
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
                  : "pointer-events-none translate-x-2 scale-[1.03] opacity-0 blur-[2px]"
              )}
              style={{
                transition:
                  "opacity 650ms ease, transform 850ms cubic-bezier(0.22, 1, 0.36, 1), filter 650ms ease",
              }}
              aria-hidden={!isActive}
            >
              <div
                className="absolute inset-0 scale-[1.08] bg-cover bg-[center_20%] motion-reduce:scale-105"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/30 via-transparent to-cyan-400/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/55 to-transparent" />

              <div className="relative flex h-full min-h-[300px] flex-col justify-end sm:min-h-[340px] md:min-h-[400px] lg:min-h-[420px]">
                <div className="relative mx-3 mb-3 rounded-2xl border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-[#fce7f3] to-[#e0f2fe] p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.85)] md:mx-6 md:mb-5 md:rounded-3xl md:p-7">
                  <div className="absolute -top-3 left-6 hidden h-0 w-0 border-x-[10px] border-b-[14px] border-x-transparent border-b-indigo-950 md:block" />
                  <div className="absolute -top-[10px] left-[26px] hidden h-0 w-0 border-x-[6px] border-b-[11px] border-x-transparent border-b-[#fffbeb] md:block" />

                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
                    <div className="min-w-0 space-y-3">
                      <span className="inline-flex items-center rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
                        {slide.pill}
                      </span>
                      <div className="space-y-2">
                        <h2 className="text-balance text-2xl font-extrabold leading-[1.15] tracking-tight text-indigo-950 md:text-4xl lg:text-[2.6rem]">
                          {slide.title}
                        </h2>
                        <p className="text-pretty text-sm font-semibold leading-relaxed text-indigo-900/85 md:text-base">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="pill"
                      className="h-auto shrink-0 rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-8 py-3.5 text-base font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] transition hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0_0_#1e1b4b]"
                      onClick={() => onCtaClick(slide)}
                    >
                      {slide.ctaLabel}
                    </Button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-dashed border-indigo-950/25 pt-4">
                    <div
                      className="flex flex-wrap items-center gap-2"
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
                            "h-3 rounded-full border-[3px] border-indigo-950 transition-all duration-300 ease-out",
                            dotIndex === activeIndex
                              ? "w-10 bg-gradient-to-r from-pink-500 to-fuchsia-500"
                              : "w-3 bg-white hover:bg-pink-100"
                          )}
                          onClick={() => setActiveIndex(dotIndex)}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-indigo-800/70">
                      Vuốt ← → hoặc dùng nút · CosMate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <button
          type="button"
          aria-label="Slide trước"
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] p-2.5 text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] transition hover:bg-amber-100 md:left-4 md:flex"
          onClick={goToPrevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Slide tiếp theo"
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] p-2.5 text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] transition hover:bg-amber-100 md:right-4 md:flex"
          onClick={goToNextSlide}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="aspect-[16/10] w-full md:aspect-auto md:h-[420px] lg:h-[440px]" />
      </div>
    </section>
  )
}
