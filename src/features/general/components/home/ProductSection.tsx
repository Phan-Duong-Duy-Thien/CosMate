import * as React from "react"
import { ArrowRight, Shirt } from "lucide-react"

import type { Product } from "../../pages/home.types"
import { AnimeSectionHeading } from "./AnimeSectionHeading"
import { ProductCard } from "./ProductCard"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

interface ProductSectionProps {
  products: Product[]
  wishlistIds: string[]
  onToggleWishlist: (productId: string) => void
  wishlistLoadingId?: string | null
  sectionRef: React.RefObject<HTMLDivElement | null>
  onViewDetail: (productId: number) => void
  onViewAll: () => void
}

export const ProductSection = ({
  products,
  wishlistIds,
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
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistIds.includes(String(product.id))}
          wishlistLoading={wishlistLoadingId === String(product.id)}
          onToggleWishlist={onToggleWishlist}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  </section>
)
