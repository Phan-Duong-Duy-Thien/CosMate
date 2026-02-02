import * as React from "react"
import { Sparkles } from "lucide-react"

import type { BannerSlide } from "../../pages/home.types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"

interface HeroCarouselProps {
  slides: BannerSlide[]
  onCtaClick: (tag: BannerSlide["tag"]) => void
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

  React.useEffect(() => {
    if (prefersReducedMotion || paused) return
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => window.clearInterval(interval)
  }, [paused, prefersReducedMotion, slides.length])

  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pt-8"
      data-reveal="true"
    >
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-white to-purple-100 shadow-xl transition-transform duration-500 ease-out hover:-translate-y-1"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 grid items-center gap-8 px-8 py-10 md:grid-cols-[1.2fr_1fr]",
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              style={{ transition: "opacity 600ms ease" }}
              aria-hidden={!isActive}
            >
              <div className="space-y-5">
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
                <Button
                  size="pill"
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md hover:from-pink-500 hover:to-purple-500 sm:w-auto"
                  onClick={() => onCtaClick(slide.tag)}
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
              <div className="hidden md:block">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="h-72 w-full rounded-3xl object-cover shadow-lg"
                />
              </div>
            </div>
          )
        })}
        <div className="aspect-[16/7] w-full md:h-[360px]" />
      </div>
    </section>
  )
}
