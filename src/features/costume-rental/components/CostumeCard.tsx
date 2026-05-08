import { Heart, Image as ImageIcon } from "lucide-react"

import type { CostumeItem } from "../types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/features/wishlist/hooks/useWishlist"

interface CostumeCardProps {
  costume: CostumeItem
  onViewDetail: (costumeId: string) => void
}

export const CostumeCard = ({
  costume,
  onViewDetail,
}: CostumeCardProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useWishlist()
  const costumeId = Number(costume.id)
  const liked = isInWishlist(costumeId)
  const displayName = costume.name?.trim() || "-"
  const displayShopName = costume.shopName?.trim() || "-"
  const hasPrice = Number.isFinite(costume.priceMin) && Number.isFinite(costume.priceMax)

  const handleToggleWishlist = () => {
    if (liked) {
      const item = wishlistItems.find((w) => w.costumeId === costumeId)
      if (item) {
        removeFromWishlist(item.id)
      }
    } else {
      addToWishlist(costumeId)
    }
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onViewDetail(costume.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onViewDetail(costume.id)
        }
      }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(236,72,153,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-950/30"
    >
      <div className="relative">
        <img
          src={costume.images[0] || "https://placehold.co/400x500/e2e8f0/94a3b8?text=No+Image"}
          alt={costume.name}
          loading="lazy"
          className="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-indigo-950/55 to-transparent"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            className={cn(
              "rounded-full border-[3px] border-indigo-950 bg-white/90 px-3 py-1 text-xs font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]",
              costume.isAvailable ? "bg-white/90" : "bg-indigo-950 text-white"
            )}
          >
            {costume.isAvailable ? "Có sẵn" : "Đã thuê"}
          </Badge>
          {costume.isAdult18 && (
            <Badge className="rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-3 py-1 text-xs font-extrabold text-white shadow-[3px_3px_0_0_#1e1b4b]">
              18+
            </Badge>
          )}
        </div>
        {typeof costume.aiSimilarityScore === "number" && (
          <div className="absolute right-3 top-3">
            <Badge className="rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-amber-300 to-yellow-300 px-3 py-1 font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
              ✨ Khớp {costume.aiSimilarityScore.toFixed(1)}%
            </Badge>
          </div>
        )}
        <button
          type="button"
          aria-label={liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          className={cn(
            "absolute right-3 rounded-full border-[3px] border-indigo-950 bg-white/90 p-2 text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] transition hover:-translate-y-0.5",
            typeof costume.aiSimilarityScore === "number" ? "top-12" : "top-3",
            liked && "text-pink-500"
          )}
          onClick={(event) => {
            event.stopPropagation()
            handleToggleWishlist()
          }}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-pink-500")} />
        </button>
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border-[3px] border-indigo-950 bg-white/85 px-2 py-1 text-xs font-bold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
          <ImageIcon className="h-3 w-3" />
          {costume.images.length} ảnh
        </div>
      </div>
      <div className="flex min-h-[196px] flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-1 text-xs font-semibold text-indigo-950/70">{displayShopName}</p>
        <h3
          className="overflow-hidden text-sm font-extrabold text-indigo-950"
          title={displayName}
        >
          <span className="block truncate group-hover:hidden">{displayName}</span>
          <span className="hidden group-hover:block">
            <span className="inline-flex min-w-max items-center gap-8 whitespace-nowrap group-hover:animate-[home-title-marquee_8s_linear_infinite]">
              <span>{displayName}</span>
              <span aria-hidden="true">{displayName}</span>
            </span>
          </span>
        </h3>
        <p className="line-clamp-1 min-h-4 text-xs font-semibold text-indigo-950/65">
          Shop: {displayShopName}
        </p>
        <p className="line-clamp-1 min-h-4 text-xs font-semibold text-indigo-950/65">
          Nhân vật: {costume.characterName?.trim() || "-"}
        </p>
        <div className="min-h-7 text-sm font-extrabold leading-tight text-fuchsia-700">
          {hasPrice ? (
            <>
              <span className="whitespace-nowrap">
                {costume.priceMin.toLocaleString("vi-VN")} VND
              </span>
              <span className="ml-1 text-[11px] font-semibold text-indigo-950/60">/ngày</span>
            </>
          ) : (
            "-"
          )}
        </div>
        <Button
          variant="soft"
          size="sm"
          className="mt-auto w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-110"
          onClick={(event) => {
            event.stopPropagation()
            onViewDetail(costume.id)
          }}
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  )
}
