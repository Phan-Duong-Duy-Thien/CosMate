import { MessageCircle, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ProviderShop } from '../../types'
import { VI } from '@/shared/i18n/vi'

interface ShopProfileHeroProps {
  shop: ProviderShop
  onChat?: () => void
}

export function ShopProfileHero({ shop, onChat }: ShopProfileHeroProps) {
  const avatarUrl = shop.avatarUrl || 'https://via.placeholder.com/150'
  const coverUrl = shop.coverImageUrl || 'https://via.placeholder.com/1200x300'

  return (
    <Card className="overflow-hidden border-pink-100">
      {/* Cover Image */}
      <div className="relative h-40 w-full bg-gradient-to-r from-pink-200 to-purple-200 sm:h-48">
        <img
          src={coverUrl}
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Shop Info */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative -mt-12 sm:-mt-14">
            <img
              src={avatarUrl}
              alt={shop.shopName}
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
            />
            {shop.verified && (
              <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Shop Name & Badges */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{shop.shopName}</h1>
              {shop.verified && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  {VI.provider.shop.verified}
                </span>
              )}
              {shop.isFeatured && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                  {VI.provider.shop.featured}
                </span>
              )}
            </div>
            {shop.bio && (
              <p className="mt-1 max-w-xl text-sm text-slate-600">{shop.bio}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onChat}
              className="rounded-full bg-pink-500 hover:bg-pink-600"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {VI.provider.shop.chat}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="font-semibold">{shop.rating?.toFixed(1) || '0'}/10</span>
            <span className="text-slate-400">({shop.totalReviews || 0} {VI.provider.shop.stats.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{(shop.totalRentals || 0).toLocaleString()}</span>
            <span className="text-slate-400">{VI.provider.shop.stats.rentals}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
