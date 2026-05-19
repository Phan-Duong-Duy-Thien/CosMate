import * as React from "react"
import { ArrowRight, Shirt } from "lucide-react"

import { AnimeSectionHeading } from "./AnimeSectionHeading"
import { CostumeCard } from "@/features/costume-rental/components/CostumeCard"
import type { CostumeItem } from "@/features/costume-rental/types"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

interface ProductSectionProps {
  costumes: CostumeItem[]
  isWishlisted: (costumeId: number) => boolean
  onToggleWishlist: (costumeId: number) => void
  wishlistLoadingId?: number | null
  sectionRef: React.RefObject<HTMLDivElement | null>
  onViewDetail: (costumeId: string) => void
  onViewAll: () => void
}

export const ProductSection = ({
  costumes,
  isWishlisted,
  onToggleWishlist,
  wishlistLoadingId,
  sectionRef,
  onViewDetail,
  onViewAll,
}: ProductSectionProps) => (
  <section
    ref={sectionRef}
    className="w-full pt-8 md:pt-10"
    data-reveal="true"
  >
    <AnimeSectionHeading
      title={VI.general.home.featured.title}
      description={VI.general.home.featured.featuredHint}
      icon={<Shirt className="h-5 w-5" aria-hidden />}
      action={
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] hover:bg-amber-100"
          onClick={onViewAll}
        >
          {VI.general.home.featured.viewAll}{" "}
          <ArrowRight className="ml-1 inline h-4 w-4" />
        </Button>
      }
    />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
      {costumes.map((costume) => (
        <CostumeCard
          key={costume.id}
          costume={costume}
          onViewDetail={onViewDetail}
          isWishlisted={isWishlisted(Number(costume.id))}
          wishlistLoading={wishlistLoadingId === Number(costume.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  </section>
)
