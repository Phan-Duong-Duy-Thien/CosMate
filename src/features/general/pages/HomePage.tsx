import * as React from "react"
import { useNavigate } from "react-router-dom"

import { HeroCarousel } from "../components/home/HeroCarousel"
import { ProductSection } from "../components/home/ProductSection"
import { QuizModal } from "../components/home/QuizModal"
import { ShopCarousel } from "../components/home/ShopCarousel"
import { TagChips } from "../components/home/TagChips"
import { bannerSlides, shops, tagList } from "../mocks/home.mock"
import type { BannerSlide, Product, TagKey, UIState } from "./home.types"
import { useFeaturedCostumes } from "@/features/costume-rental/hooks/useFeaturedCostumes"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

const HomePage = () => {
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = React.useState<TagKey>("anime")
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([])
  const [isQuizOpen, setIsQuizOpen] = React.useState(false)
  const productSectionRef = React.useRef<HTMLDivElement>(null)

  const { items, isLoading, error } = useFeaturedCostumes()

  const filteredProducts = React.useMemo(() => {
    return items
      .map<Product>((costume) => ({
        id: costume.id,
        name: costume.name,
        pricePerDay: costume.pricePerDay,
        status: costume.status,
        imageUrls: costume.imageUrls ?? [],
        brand: costume.brand ?? "",
        rentalsCount: costume.rentalsCount ?? 0,
      }))
  }, [items])

  React.useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal=true]")
    )

    // Show all homepage blocks immediately without requiring scroll.
    elements.forEach((element) => element.setAttribute("data-visible", "true"))
  }, [error, filteredProducts.length, isLoading])

  const displayState: UIState =
    isLoading
      ? "loading"
      : error
        ? "error"
        : filteredProducts.length === 0
          ? "empty"
          : "success"

  const handleCtaClick = (slide: BannerSlide) => {
    if (slide.actionType === "quiz") {
      setIsQuizOpen(true)
      return
    }
    if (slide.tag) {
      setActiveTag(slide.tag)
      window.requestAnimationFrame(() => {
        productSectionRef.current?.scrollIntoView({ behavior: "smooth" })
      })
    }
  }

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="bg-transparent">
      <main
        className="pb-12 [&_[data-reveal=true]]:translate-y-2 [&_[data-reveal=true]]:opacity-0 [&_[data-reveal=true]]:transition-all [&_[data-reveal=true]]:duration-200 [&_[data-reveal=true][data-visible=true]]:translate-y-0 [&_[data-reveal=true][data-visible=true]]:opacity-100 motion-reduce:[&_[data-reveal=true]]:translate-y-0 motion-reduce:[&_[data-reveal=true]]:opacity-100"
      >
        <HeroCarousel slides={bannerSlides} onCtaClick={handleCtaClick} />
        <QuizModal
          open={isQuizOpen}
          onOpenChange={setIsQuizOpen}
          onApplyResult={(tag) => {
            setActiveTag(tag)
            window.requestAnimationFrame(() => {
              productSectionRef.current?.scrollIntoView({ behavior: "smooth" })
            })
          }}
        />
        <section className="relative left-1/2 right-1/2 mt-6 w-screen -translate-x-1/2 bg-transparent py-8 md:py-10">
          <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 xl:px-8">
            <TagChips
              tags={tagList}
              activeTag={activeTag}
              onTagChange={setActiveTag}
            />

            {displayState === "loading" && <HomeSkeleton />}

            {displayState === "error" && (
              <StatusCard
                title={VI.general.home.featured.errorTitle}
                description={error ?? VI.general.home.featured.errorDescription}
              />
            )}

            {displayState === "empty" && (
              <StatusCard
                title={VI.general.home.featured.emptyTitle}
                description={VI.general.home.featured.emptyDescription}
              />
            )}

            {displayState === "success" && (
              <ProductSection
                products={filteredProducts}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                sectionRef={productSectionRef}
                onViewDetail={(productId) => navigate(`/costumes/${productId}`)}
                onViewAll={() => navigate("/costumes")}
              />
            )}

            <ShopCarousel shops={shops} />
          </div>
        </section>
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
  <section className="mx-auto w-full max-w-screen-2xl pt-12" data-reveal="true">
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
  <section className="mx-auto w-full max-w-screen-2xl pt-12" data-reveal="true">
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-64 rounded-full bg-pink-100" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
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
