import { Heart, Package } from 'lucide-react'
import { Card } from '@/shared/components/Card'
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
      className="group relative overflow-hidden rounded-2xl border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] to-[#fce7f3] shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[11px_11px_0_0_rgba(236,72,153,0.35)]"
    >
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleWishlist}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] text-[#DC2626] opacity-0 shadow-[3px_3px_0_0_#1e1b4b] transition-opacity group-hover:opacity-100 hover:bg-[#FEE2E2]"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Status Badge */}
      {product.status === 'RENTED' && (
        <div className="absolute left-2 top-2 z-10 rounded-lg border-[2px] border-indigo-950 bg-slate-800 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-[3px_3px_0_0_#1e1b4b]">
          Đã thuê
        </div>
      )}

      {/* Image */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-44 w-full border-b-[3px] border-indigo-950 object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* Content */}
      <div className="space-y-1.5 p-3">
        <h3
          className="overflow-hidden text-sm font-extrabold leading-snug text-indigo-950"
          title={product.name}
        >
          <span className="block truncate group-hover:hidden">{product.name}</span>
          <span className="hidden w-full overflow-hidden group-hover:flex">
            <span className="flex shrink-0 whitespace-nowrap group-hover:animate-[home-title-marquee_10s_linear_infinite]">
              <span className="pr-8">{product.name}</span>
              <span className="pr-8" aria-hidden="true">{product.name}</span>
            </span>
          </span>
        </h3>
        <p className="truncate text-xs font-semibold text-indigo-900/70">{product.characterName}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1 text-base font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text text-transparent">
            {product.pricePerDay.toLocaleString('vi-VN')} VNĐ
          </span>
          <span className="text-xs font-semibold text-indigo-900/60">/ngày</span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-2">
          {product.brandType === 'brand' && product.brandName && (
            <span className="rounded-lg border-[2px] border-indigo-950 bg-pink-100 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-950">
              {product.brandName}
            </span>
          )}
          {product.brandType === 'non_brand' && (
            <span className="rounded-lg border-[2px] border-indigo-950 bg-slate-100 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-950">
              Non-brand
            </span>
          )}
          {product.brandType === 'design' && (
            <span className="rounded-lg border-[2px] border-indigo-950 bg-violet-100 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-950">
              Design
            </span>
          )}
          {product.brandType === 'freestyle' && (
            <span className="rounded-lg border-[2px] border-indigo-950 bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-950">
              Freestyle
            </span>
          )}
        </div>

        {/* Rental Count & Accessories */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-900/65">
          <span>{product.rentalCount} {VI.provider.shop.rental}</span>
          {product.hasAccessories ? (
            <span className="flex items-center gap-1 text-fuchsia-700">
              <Package className="h-3 w-3" />
              {VI.provider.shop.accessory}
            </span>
          ) : (
            <span className="text-indigo-900/40">{VI.provider.shop.noAccessory}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
