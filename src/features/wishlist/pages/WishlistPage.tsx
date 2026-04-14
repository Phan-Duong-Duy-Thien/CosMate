import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'

import { useWishlist } from '../hooks/useWishlist'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'
import { cn } from '@/lib/utils'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_BASE}${url}`
}

function WishlistItemCard({
  item,
  onViewDetail,
  onRemove,
  isRemoving,
}: {
  item: {
    id: number
    costumeId: number
    createdAt: string
    costume: {
      id: number
      name: string
      imageUrls: string[]
      pricePerDay: number
      [key: string]: unknown
    }
  }
  onViewDetail: (costumeId: number) => void
  onRemove: (wishlistId: number) => void
  isRemoving: boolean
}) {
  const costume = item.costume
  const firstImage = resolveImageUrl(costume.imageUrls?.[0] || '')
  const displayPrice = costume.pricePerDay ? Number(costume.pricePerDay) : 0

  return (
    <Card className="group relative overflow-hidden border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Remove button */}
      <button
        type="button"
        aria-label="Remove from wishlist"
        disabled={isRemoving}
        className={cn(
          'absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-400 shadow-sm transition-all duration-200 hover:bg-white hover:text-pink-500 hover:shadow-md',
          isRemoving && 'opacity-50'
        )}
        onClick={(e) => {
          e.stopPropagation()
          onRemove(item.id)
        }}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      {/* Image */}
      <div className="relative">
        {firstImage ? (
          <img
            src={firstImage}
            alt={costume.name || 'Costume'}
            className="h-56 w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
            onClick={() => onViewDetail(costume.id)}
          />
        ) : (
          <div
            className="flex h-56 w-full cursor-pointer items-center justify-center bg-slate-100"
            onClick={() => onViewDetail(costume.id)}
          >
            <ImageIcon className="h-12 w-12 text-slate-300" />
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-xs text-slate-600">
          <ImageIcon className="h-3 w-3" />
          {costume.imageUrls?.length || 0}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-4">
        <h3
          className="line-clamp-2 cursor-pointer text-sm font-semibold text-slate-800 transition-colors hover:text-pink-600"
          onClick={() => onViewDetail(costume.id)}
        >
          {costume.name || 'Untitled Costume'}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-pink-600">
            {displayPrice.toLocaleString('vi-VN')}đ
          </span>
          <span className="text-xs text-slate-400">/day</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </span>
          <Button
            variant="soft"
            size="sm"
            onClick={() => onViewDetail(costume.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function WishlistPage() {
  const navigate = useNavigate()
  const {
    wishlistItems,
    loading,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlist()

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const handleViewDetail = (costumeId: number) => {
    navigate(`/costumes/${costumeId}`)
  }

  const handleRemove = (wishlistId: number) => {
    removeFromWishlist(wishlistId)
  }

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <p className="text-sm text-slate-500">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen pb-20">
      <div className="mx-auto w-full max-w-screen-2xl px-4 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Heart className="h-7 w-7 fill-pink-500 text-pink-500" />
          <h1 className="text-2xl font-bold text-pink-700">My Wishlist</h1>
          <Badge className="bg-pink-100 text-pink-600">
            {wishlistItems.length}{' '}
            {wishlistItems.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {/* Grid */}
        {wishlistItems.length === 0 ? (
          <div className="rounded-2xl border border-pink-100 bg-white/80 p-16 text-center shadow-sm">
            <Heart className="mx-auto h-14 w-14 text-pink-200" />
            <h2 className="mt-5 text-xl font-semibold text-slate-700">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Browse costumes and click the heart icon to add them here.
            </p>
            <Button
              variant="soft"
              className="mt-8 rounded-full px-6"
              onClick={() => navigate('/costumes')}
            >
              Browse Costumes
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                onViewDetail={handleViewDetail}
                onRemove={handleRemove}
                isRemoving={loading}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}