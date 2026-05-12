import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'

import { useWishlist } from '../hooks/useWishlist'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'
import { VI } from '@/shared/i18n/vi'
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
        aria-label="Xóa khỏi danh sách yêu thích"
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
            alt={costume.name || VI.common.toast.error}
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
          {costume.name || VI.common.status.error}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-pink-600">
            {displayPrice.toLocaleString('vi-VN')}đ
          </span>
          <span className="text-xs text-slate-400">/ngày</span>
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
            {VI.common.toast.wishlist.viewDetails}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function WishlistPage() {
  const navigate = useNavigate()
  const [heroVisible, setHeroVisible] = useState(false)
  const {
    wishlistItems,
    loading,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlist()

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHeroVisible(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const handleViewDetail = (costumeId: number) => {
    navigate(`/costumes/${costumeId}`)
  }

  const handleRemove = (wishlistId: number) => {
    removeFromWishlist(wishlistId)
  }

  const itemCountLabel =
    wishlistItems.length === 1
      ? VI.common.toast.wishlist.itemCount
      : VI.common.toast.wishlist.itemsCount

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
        <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] px-10 py-12 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" aria-hidden />
          <p className="mt-4 text-center text-sm font-extrabold text-indigo-950">
            {VI.common.status.loading}
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="home-anime min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
      <style>{`
        @keyframes softSparkle {
          0% { opacity: 0.6; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-1px); }
          100% { opacity: 0.6; transform: translateY(0px); }
        }
      `}</style>
      <div className="w-full min-w-0 pt-6">
        <div
          className={
            'rounded-[1.4rem] border-[4px] border-indigo-950 bg-gradient-to-r from-pink-200 via-rose-100 to-violet-200 px-5 py-5 text-center shadow-[12px_12px_0_0_rgba(30,27,75,0.33)] backdrop-blur transition-all duration-300 ease-out ' +
            (heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')
          }
        >
          <h1 className="mt-1 flex flex-wrap items-center justify-center gap-2 text-3xl font-extrabold tracking-tight text-indigo-950 md:mt-2 md:text-5xl">
            <span className="sr-only">{VI.common.toast.wishlist.pageTitle}</span>
            <span
              aria-hidden="true"
              className="text-[20px] tracking-[0.5px] text-indigo-900 motion-reduce:animate-none md:text-[40px]"
            >
              ･:*🌸࿔   ⋆. 𐙚˚࿔  {VI.common.toast.wishlist.pageTitle}  𝜗𝜚˚⋆   ࿔🌸*:･
            </span>
          </h1>
          <p className="mt-3 text-sm font-semibold text-indigo-900/90 md:text-base">
            <Heart
              className="mr-1.5 inline-block h-4 w-4 fill-cosmate-pink text-cosmate-pink align-[-2px] md:h-5 md:w-5"
              aria-hidden
            />
            {wishlistItems.length} {itemCountLabel}
          </p>
        </div>

        {/* Grid */}
        {wishlistItems.length === 0 ? (
          <div className="mt-5 rounded-[1.25rem] border-[4px] border-indigo-950 bg-gradient-to-b from-[#fffbeb] via-white to-pink-50/40 p-10 text-center shadow-[10px_10px_0_0_rgba(30,27,75,0.3)] md:p-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-pink-100 shadow-[5px_5px_0_0_#1e1b4b]">
              <Heart className="h-8 w-8 text-pink-500" aria-hidden />
            </span>
            <h2 className="mt-6 text-xl font-extrabold text-indigo-950">
              {VI.common.toast.wishlist.emptyTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {VI.common.toast.wishlist.emptyDescription}
            </p>
            <Button
              variant="soft"
              className="mt-8 rounded-full px-6"
              onClick={() => navigate('/costumes')}
            >
              {VI.common.toast.wishlist.browseButton}
            </Button>
          </div>
        ) : (
          <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
