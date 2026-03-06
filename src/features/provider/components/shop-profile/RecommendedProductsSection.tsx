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
      <div className="inline-flex items-center rounded-2xl border-2 border-[#FDCCD7] bg-white px-4 py-2">
        <h3 className="text-lg font-semibold tracking-wide text-slate-800">
          {VI.provider.shop.recommended.title}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
