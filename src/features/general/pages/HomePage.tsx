import * as React from "react"
import { useSearchParams } from "react-router-dom"

import { HeroCarousel } from "../components/home/HeroCarousel"
import { ProductSection } from "../components/home/ProductSection"
import { ShopCarousel } from "../components/home/ShopCarousel"
import { TagChips } from "../components/home/TagChips"
import { bannerSlides, products, shops, tagList } from "../mocks/home.mock"
import type { TagKey, UIState } from "./home.types"
import { Button } from "@/shared/components/Button"

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [uiState, setUiState] = React.useState<UIState>("loading")
  const [activeTag, setActiveTag] = React.useState<TagKey>("anime")
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([])
  const productSectionRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setUiState("success")
    }, 500)
    return () => window.clearTimeout(timer)
  }, [])

  const searchValue = (searchParams.get("q") ?? "").trim().toLowerCase()

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesTag = product.tags.includes(activeTag)
      const matchesSearch = searchValue
        ? product.name.toLowerCase().includes(searchValue)
        : true
      return matchesTag && matchesSearch
    })
  }, [activeTag, searchValue])

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal=true]")
    )
    if (prefersReducedMotion) {
      elements.forEach((element) => element.setAttribute("data-visible", "true"))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true")
          }
        })
      },
      { threshold: 0.2 }
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [uiState, filteredProducts.length])

  const displayState: UIState =
    uiState === "success" && filteredProducts.length === 0 ? "empty" : uiState

  const handleCtaClick = (tag: TagKey) => {
    setActiveTag(tag)
    window.requestAnimationFrame(() => {
      productSectionRef.current?.scrollIntoView({ behavior: "smooth" })
    })
  }

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const handleClearFilters = () => {
    setActiveTag("anime")
    const next = new URLSearchParams(searchParams)
    next.delete("q")
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <main
        className="pb-12 [&_[data-reveal=true]]:translate-y-6 [&_[data-reveal=true]]:opacity-0 [&_[data-reveal=true]]:transition-all [&_[data-reveal=true]]:duration-700 [&_[data-reveal=true][data-visible=true]]:translate-y-0 [&_[data-reveal=true][data-visible=true]]:opacity-100 motion-reduce:[&_[data-reveal=true]]:translate-y-0 motion-reduce:[&_[data-reveal=true]]:opacity-100"
      >
        <HeroCarousel slides={bannerSlides} onCtaClick={handleCtaClick} />
        <TagChips
          tags={tagList}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />

        {displayState === "loading" && <HomeSkeleton />}

        {displayState === "error" && (
          <StatusCard
            title="Ôi không!"
            description="Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại nhé."
          />
        )}

        {displayState === "empty" && (
          <StatusCard
            title="Không tìm thấy trang phục"
            description="Thử đổi bộ lọc hoặc từ khóa khác nhé."
            actionLabel="Xóa bộ lọc"
            onAction={handleClearFilters}
          />
        )}

        {displayState === "success" && (
          <ProductSection
            products={filteredProducts}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            sectionRef={productSectionRef}
          />
        )}

        <ShopCarousel shops={shops} />
      </main>
    </div>
  )
}

const StatusCard = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) => (
  <section className="mx-auto w-full max-w-6xl px-4 pt-12" data-reveal="true">
    <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" variant="soft" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  </section>
)

const HomeSkeleton = () => (
  <section className="mx-auto w-full max-w-6xl px-4 pt-12" data-reveal="true">
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-64 rounded-full bg-pink-100" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="h-80 rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  </section>
)

export default HomePage
