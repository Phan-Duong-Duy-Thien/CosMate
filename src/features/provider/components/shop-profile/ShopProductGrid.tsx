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
      <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center text-slate-500">
        {VI.provider.shop.products.noProducts}
      </div>
    )
  }

  return (
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
  )
}
