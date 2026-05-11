import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'

import { useWishlist } from '../hooks/useWishlist'
import { Card } from '@/shared/components/Card'
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
    } | null
  }
  onViewDetail: (costumeId: number) => void
  onRemove: (wishlistId: number) => void
  isRemoving: boolean
}) {
  const costume = item.costume
  const firstImage = resolveImageUrl(costume?.imageUrls?.[0] || '')
  const rawPrice =
    costume?.pricePerDay != null ? Number(costume.pricePerDay) : NaN
  const hasPrice = Number.isFinite(rawPrice)
  const costumeName = costume?.name || `Trang phục #${item.costumeId}`

  const removeBtnClass =
    'absolute right-3 top-3 z-10 rounded-xl border-[3px] border-indigo-950 bg-[#fffbe8] p-1.5 text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] transition hover:scale-105 hover:bg-pink-100 disabled:opacity-50'

  // Backend can return wishlist item with deleted/missing costume.
  if (!costume) {
    return (
      <Card
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-[1.05rem] border-[4px] border-indigo-950 bg-[#fffbe8] shadow-[6px_6px_0_0_rgba(30,27,75,0.45)]',
        )}
      >
        <button
          type="button"
          aria-label="Xóa khỏi danh sách yêu thích"
          disabled={isRemoving}
          className={cn(removeBtnClass, isRemoving && 'opacity-50')}
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
        <div className="flex h-48 w-full items-center justify-center border-b-[4px] border-indigo-950 bg-gradient-to-b from-slate-100 to-slate-200/80">
          <ImageIcon className="h-12 w-12 text-slate-400" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="line-clamp-2 text-sm font-extrabold text-indigo-950">{costumeName}</h3>
          <p className="rounded-lg border-2 border-dashed border-indigo-950/30 bg-white/80 px-2 py-1.5 text-xs font-semibold text-slate-600">
            Trang phục không còn khả dụng.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-[1.05rem] border-[4px] border-indigo-950 bg-[#fffbe8] shadow-[6px_6px_0_0_rgba(30,27,75,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_rgba(30,27,75,0.35)]">
      <button
        type="button"
        aria-label="Xóa khỏi danh sách yêu thích"
        disabled={isRemoving}
        className={cn(removeBtnClass, isRemoving && 'opacity-50')}
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

      <div className="relative border-b-[4px] border-indigo-950">
        {firstImage ? (
          <img
            src={firstImage}
            alt={costumeName}
            className="h-48 w-full cursor-pointer object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onClick={() => onViewDetail(costume.id)}
          />
        ) : (
          <div
            className="flex h-48 w-full cursor-pointer items-center justify-center bg-slate-100"
            onClick={() => onViewDetail(costume.id)}
          >
            <ImageIcon className="h-12 w-12 text-slate-300" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg border-2 border-indigo-950 bg-[#fffbe8]/95 px-2 py-0.5 text-[11px] font-semibold text-indigo-900">
          <ImageIcon className="h-3 w-3" />
          {costume.imageUrls?.length || 0} ảnh
        </div>
      </div>

      <div className="flex min-h-[120px] flex-1 flex-col gap-2 p-3">
        <h3
          className="line-clamp-2 cursor-pointer overflow-hidden text-sm font-semibold text-slate-800 transition-colors hover:text-pink-600"
          onClick={() => onViewDetail(costume.id)}
        >
          {costumeName}
        </h3>
        <div className="min-h-7 text-base font-semibold leading-tight text-[#d61f91]">
          {hasPrice ? (
            <>
              <span className="whitespace-nowrap">{rawPrice.toLocaleString('vi-VN')} VNĐ</span>
              <span className="ml-1 text-xs font-normal text-slate-400">/ngày</span>
            </>
          ) : (
            '-'
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </span>
          <Button
            variant="soft"
            size="sm"
            className="rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-400 text-sm font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] hover:brightness-105"
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

  const itemCountLabel =
    wishlistItems.length === 1
      ? VI.common.toast.wishlist.itemCount
      : VI.common.toast.wishlist.itemsCount

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] px-4 pb-20">
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
      <div className="mx-auto w-full max-w-[min(1680px,100%)] min-w-0 px-4 pt-6 md:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.2rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.35)] md:p-5">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-600 text-white shadow-[4px_4px_0_0_#1e1b4b]">
              <Heart className="h-5 w-5 fill-current" aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="text-[1.35rem] font-extrabold leading-tight tracking-tight text-indigo-950 md:text-[1.75rem]">
                <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  「 {VI.common.toast.wishlist.wishlist} 」
                </span>
              </h1>
              <p className="mt-1 text-sm font-semibold text-indigo-900/75">
                {wishlistItems.length} {itemCountLabel}
              </p>
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-gradient-to-b from-[#fffbeb] via-white to-pink-50/40 p-10 text-center shadow-[10px_10px_0_0_rgba(30,27,75,0.3)] md:p-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-pink-100 shadow-[5px_5px_0_0_#1e1b4b]">
              <Heart className="h-8 w-8 text-pink-500" aria-hidden />
            </span>
            <h2 className="mt-6 text-xl font-extrabold text-indigo-950">
              {VI.common.toast.wishlist.emptyTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-600">
              {VI.common.toast.wishlist.emptyDescription}
            </p>
            <Button
              variant="soft"
              className="mt-8 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-8 font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] hover:brightness-110"
              onClick={() => navigate('/costumes')}
            >
              {VI.common.toast.wishlist.browseButton}
            </Button>
          </div>
        ) : (
          <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
