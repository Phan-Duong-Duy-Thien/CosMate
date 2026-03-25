import * as React from "react"
import { ArrowRight } from "lucide-react"

import type { Product } from "../../pages/home.types"
import { ProductCard } from "./ProductCard"
import { Button } from "@/shared/components/Button"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { VI } from "@/shared/i18n/vi"

interface ProductSectionProps {
  products: Product[]
  wishlistIds: string[]
  onToggleWishlist: (productId: string) => void
  sectionRef: React.RefObject<HTMLDivElement | null>
  onViewDetail: (productId: number) => void
  onViewAll: () => void
}

export const ProductSection = ({
  products,
  wishlistIds,
  onToggleWishlist,
  sectionRef,
  onViewDetail,
  onViewAll,
}: ProductSectionProps) => (
  <section
    ref={sectionRef}
    className="w-full pt-6"
    data-reveal="true"
  >
    <SectionHeader
      title={VI.general.home.featured.title}
      accent
      action={
        <Button
          variant="link"
          size="sm"
          className="text-slate-600"
          onClick={onViewAll}
        >
          {VI.general.home.featured.viewAll} <ArrowRight className="h-4 w-4" />
        </Button>
      }
    />
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistIds.includes(String(product.id))}
          onToggleWishlist={onToggleWishlist}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  </section>
)
