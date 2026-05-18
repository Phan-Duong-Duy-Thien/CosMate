import * as React from "react"
import { Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { HeroCarousel } from "../components/home/HeroCarousel"
import { HomeAiPromoCards } from "../components/home/HomeAiPromoCards"
import { ProductSection } from "../components/home/ProductSection"
import { QuizModal } from "../components/home/QuizModal"
import { ShopCarousel } from "../components/home/ShopCarousel"
import { TagChips } from "../components/home/TagChips"
import { bannerSlides, shops as mockShops, tagList } from "../mocks/home.mock"
import type { BannerSlide, TagKey, UIState } from "./home.types"
import { useFeaturedCostumes } from "@/features/costume-rental/hooks/useFeaturedCostumes"
import { useTrustedShops } from "../hooks/useTrustedShops"
import { useWishlist } from "@/features/wishlist/hooks/useWishlist"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

const HomePage = () => {
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = React.useState<TagKey>("anime")
  const [wishlistTogglingId, setWishlistTogglingId] = React.useState<number | null>(null)
  const [isQuizOpen, setIsQuizOpen] = React.useState(false)
  const productSectionRef = React.useRef<HTMLDivElement>(null)

  const { items, isLoading, error } = useFeaturedCostumes()
  const { shops: trustedShops, loading: shopsLoading, error: shopsError } = useTrustedShops()
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useWishlist()

  const displayShops = React.useMemo(
    () => (trustedShops.length > 0 ? trustedShops : mockShops),
    [trustedShops]
  )

  React.useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal=true]")
    )

    elements.forEach((element) => element.setAttribute("data-visible", "true"))
  }, [error, items.length, isLoading])

  const displayState: UIState =
    isLoading
      ? "loading"
      : error
        ? "error"
        : items.length === 0
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

  const handleToggleWishlist = async (costumeId: number) => {
    if (wishlistTogglingId === costumeId) return

    setWishlistTogglingId(costumeId)
    try {
      if (isInWishlist(costumeId)) {
        const item = wishlistItems.find((w) => w.costumeId === costumeId)
        if (item) await removeFromWishlist(item.id)
      } else {
        await addToWishlist(costumeId)
      }
    } finally {
      setWishlistTogglingId(null)
    }
  }

  return (
    <div className="home-anime relative min-h-[60vh] w-full min-w-0 bg-[#fff7fb]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="home-anime-blob home-anime-blob-a absolute -left-28 top-16 h-80 w-80 rounded-full bg-fuchsia-400/40 blur-3xl" />
        <div className="home-anime-blob home-anime-blob-b absolute -right-24 top-48 h-96 w-96 rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="home-anime-blob home-anime-blob-c absolute bottom-32 left-1/3 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
      </div>

      <main
        className="relative z-[1] pb-16 [&_[data-reveal=true]]:translate-y-3 [&_[data-reveal=true]]:opacity-0 [&_[data-reveal=true]]:transition-all [&_[data-reveal=true]]:duration-500 [&_[data-reveal=true][data-visible=true]]:translate-y-0 [&_[data-reveal=true][data-visible=true]]:opacity-100 motion-reduce:[&_[data-reveal=true]]:translate-y-0 motion-reduce:[&_[data-reveal=true]]:opacity-100"
      >
        <HeroCarousel slides={bannerSlides} onCtaClick={handleCtaClick} />
        <HomeAiPromoCards
          className="mt-5 md:mt-6"
          onStyleQuiz={() => navigate("/style-quiz")}
          onCostumeImageSearch={() => navigate("/costumes")}
        />
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
        <section className="relative mt-3 py-6 md:mt-5 md:py-10">
          <div className="w-full">
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
                costumes={items}
                isWishlisted={isInWishlist}
                onToggleWishlist={handleToggleWishlist}
                wishlistLoadingId={wishlistTogglingId}
                sectionRef={productSectionRef}
                onViewDetail={(costumeId) => navigate(`/costumes/${costumeId}`)}
                onViewAll={() => navigate("/costumes")}
              />
            )}

            <ShopCarousel
              shops={displayShops}
              loading={shopsLoading}
              error={shopsError}
            />
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
  <section className="w-full pt-10" data-reveal="true">
    <div className="rounded-[1.35rem] border-[5px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-[#fce7f3] to-[#e0f2fe] p-8 text-center shadow-[14px_14px_0_0_rgba(30,27,75,0.75)] md:p-10">
      <div className="mx-auto mb-4 inline-flex rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-pink-400 to-violet-500 p-3 text-white shadow-[5px_5px_0_0_#1e1b4b]">
        <Sparkles className="h-8 w-8" aria-hidden />
      </div>
      <h3 className="text-xl font-extrabold tracking-tight text-indigo-950 md:text-2xl">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-relaxed text-indigo-900/85">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          className="mt-8 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[8px_8px_0_0_#1e1b4b]"
          variant="soft"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  </section>
)

const HomeSkeleton = () => (
  <section className="w-full pt-10" data-reveal="true">
    <div className="rounded-[1.35rem] border-[5px] border-indigo-950 bg-[#fffbeb]/90 p-6 shadow-[12px_12px_0_0_rgba(30,27,75,0.45)] md:p-8">
      <div className="animate-pulse space-y-8">
        <div className="flex flex-col gap-3">
          <div className="h-7 w-52 rounded-xl border-2 border-indigo-950/20 bg-pink-200/80" />
          <div className="h-4 max-w-lg rounded-lg bg-indigo-950/10" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-72 rounded-2xl border-[4px] border-indigo-950/25 bg-gradient-to-br from-pink-100/80 to-violet-100/80"
            />
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default HomePage
