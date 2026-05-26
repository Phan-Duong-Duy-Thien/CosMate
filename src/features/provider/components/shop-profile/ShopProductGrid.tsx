import { ShopProductCard } from './ShopProductCard'
import type { ShopProduct } from '../../mocks/shopProducts.mock'
import { VI } from '@/shared/i18n/vi'

interface ShopProductGridProps {
  products: ShopProduct[]
  onProductClick?: (productId: string) => void
  onWishlist?: (productId: string) => void
}

export function ShopProductGrid({ products, onProductClick, onWishlist }: ShopProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border-[3px] border-dashed border-indigo-950/30 bg-[#fffbeb]/80 p-8 text-center text-sm font-semibold text-indigo-900/70 shadow-[5px_5px_0_0_rgba(30,27,75,0.15)]">
        {VI.provider.shop.products.noProducts}
      </div>
    )
  }

  return (
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
  )
}
