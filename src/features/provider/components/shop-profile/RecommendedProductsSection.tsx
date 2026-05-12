import { ShopProductCard } from './ShopProductCard'
import type { ShopProduct } from '../../mocks/shopProducts.mock'
import { VI } from '@/shared/i18n/vi'

interface RecommendedProductsSectionProps {
  products: ShopProduct[]
  onProductClick?: (productId: string) => void
  onWishlist?: (productId: string) => void
}

export function RecommendedProductsSection({
  products,
  onProductClick,
  onWishlist,
}: RecommendedProductsSectionProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#c4b5fd] px-4 py-1.5 shadow-[4px_4px_0_0_#1e1b4b]">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-indigo-950">
          {VI.provider.shop.recommended.title}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map(product => (
          <ShopProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick?.(product.id)}
            onWishlist={() => onWishlist?.(product.id)}
          />
        ))}
      </div>
    </div>
  )
}
