import * as React from "react"
import { Sparkles } from "lucide-react"

import type { BannerSlide } from "../../pages/home.types"
import { Badge } from "@/shared/components/Badge"
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
  const [paused, setPaused] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const dragState = React.useRef({
    startX: 0,
    dragging: false,
    pointerId: -1,
  })

  React.useEffect(() => {
    if (prefersReducedMotion || paused) return
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => window.clearInterval(interval)
  }, [paused, prefersReducedMotion, slides.length])

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
    }
    setPaused(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return
    const delta = event.clientX - dragState.current.startX
    const threshold = 35
    if (Math.abs(delta) < threshold) return
    if (delta > 0) {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
    } else {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }
    dragState.current.startX = event.clientX
  }

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.dragging = false
    setPaused(false)
    if (dragState.current.pointerId !== -1) {
      event.currentTarget.releasePointerCapture(dragState.current.pointerId)
    }
    dragState.current.pointerId = -1
  }

  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pt-8"
      data-reveal="true"
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner CosMate"
        className="relative select-none overflow-hidden rounded-3xl shadow-xl transition-transform duration-500 ease-out hover:-translate-y-1 touch-pan-y"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
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
                "absolute inset-0",
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              style={{ transition: "opacity 600ms ease" }}
              aria-hidden={!isActive}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
              <div className="relative grid h-full items-center gap-6 px-8 py-10 md:w-2/3">
                <Badge className="inline-flex items-center gap-2 bg-white/80 text-pink-600">
                  <Sparkles className="h-4 w-4" />
                  {slide.pill}
                </Badge>
                <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                  {slide.title}
                </h1>
                <p className="text-base text-slate-600 md:text-lg">
                  {slide.subtitle}
                </p>
                {slide.hint && (
                  <p className="text-sm font-medium text-pink-500">
                    {slide.hint}
                  </p>
                )}
                <Button
                  size="pill"
                  className={cn(
                    "w-full shadow-md sm:w-auto",
                    slide.actionType === "quiz"
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  )}
                  onClick={() => onCtaClick(slide)}
                >
                  {slide.ctaLabel}
                </Button>
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
        <div className="aspect-[16/7] w-full md:h-[360px]" />
      </div>
    </section>
  )
}
