import * as React from "react"
import { ArrowRight } from "lucide-react"

import type { Product } from "../../pages/home.types"
import { ProductCard } from "./ProductCard"
import { Button } from "@/shared/components/Button"
import { SectionHeader } from "@/shared/components/SectionHeader"

interface ProductSectionProps {
  products: Product[]
  wishlistIds: string[]
  onToggleWishlist: (productId: string) => void
  sectionRef: React.RefObject<HTMLDivElement | null>
}

export const ProductSection = ({
  products,
  wishlistIds,
  onToggleWishlist,
  sectionRef,
}: ProductSectionProps) => (
  <section
    ref={sectionRef}
    className="w-full pt-12"
    data-reveal="true"
  >
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 xl:px-8">
      <SectionHeader
        title="Trang phục nổi bật"
        accent
        action={
          <Button variant="link" size="sm" className="text-slate-600">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </div>
  </section>
)
