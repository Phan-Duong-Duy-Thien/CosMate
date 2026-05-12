import { Heart, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { ShopProduct } from '../../mocks/shopProducts.mock'
import { VI } from '@/shared/i18n/vi'

interface ShopProductCardProps {
  product: ShopProduct
  onClick?: () => void
  onWishlist?: () => void
}

export function ShopProductCard({ product, onClick, onWishlist }: ShopProductCardProps) {
  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    onWishlist?.()
    console.log('Wishlist clicked for:', product.id)
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className="group relative overflow-hidden border-pink-100 bg-white transition-shadow hover:shadow-md"
    >
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleWishlist}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-pink-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-pink-50"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Status Badge */}
      {product.status === 'RENTED' && (
        <div className="absolute left-2 top-2 z-10 rounded-full border border-cosmate-warning/40 bg-cosmate-warning/15 px-2 py-0.5 text-xs font-semibold text-cosmate-warning">
          {VI.costumeRental.costumeStatus.rented}
        </div>
      )}

      {/* Image */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-44 w-full object-cover"
      />

      {/* Content */}
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-slate-800">{product.name}</p>
        <p className="text-xs text-slate-500">{product.characterName}</p>

        {/* Price */}
        <p className="text-base font-semibold text-pink-600">
          {product.pricePerDay.toLocaleString('vi-VN')} VNĐ
          <span className="text-xs font-normal text-slate-500">/ngày</span>
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.brandType === 'brand' && product.brandName && (
              <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[10px] font-medium text-pink-600">
                {product.brandName}
              </span>
            )}
            {product.brandType === 'non_brand' && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                Non-brand
              </span>
            )}
            {product.brandType === 'design' && (
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">
                Design
              </span>
            )}
            {product.brandType === 'freestyle' && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                Freestyle
              </span>
            )}
          </div>
        </div>

        {/* Rental Count & Accessories */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{product.rentalCount} {VI.provider.shop.rental}</span>
          {product.hasAccessories ? (
            <span className="flex items-center gap-1 text-pink-500">
              <Package className="h-3 w-3" />
              {VI.provider.shop.accessory}
            </span>
          ) : (
            <span className="text-slate-300">{VI.provider.shop.noAccessory}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
