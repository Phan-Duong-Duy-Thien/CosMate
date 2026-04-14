import { Heart, Image as ImageIcon, Star } from "lucide-react"
import { Tag } from "antd"

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
      className="group overflow-hidden border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={costume.images[0] || "https://placehold.co/400x500/e2e8f0/94a3b8?text=No+Image"}
          alt={costume.name}
          loading="lazy"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {costume.isAdult18 && (
            <Badge className="bg-pink-500 text-white">18+</Badge>
          )}
          {costume.bestSeller && (
            <Badge className="bg-amber-100 text-amber-700">Bán chạy</Badge>
          )}
          {costume.rentalsCount > 0 && (
            <Badge className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700">
              {costume.rentalsCount} lượt thuê
            </Badge>
          )}
          {costume.hasAccessories && (
            <Badge className="bg-violet-100 text-violet-700">
              Có phụ kiện
              {costume.accessoryCount ? ` (${costume.accessoryCount})` : ""}
            </Badge>
          )}
        </div>
        {typeof costume.aiSimilarityScore === "number" && (
          <div className="absolute right-3 top-3">
            <Tag color="#7c3aed" className="m-0 rounded-full border-0 px-3 py-1 font-semibold text-white shadow-sm">
              ✨ Khớp {costume.aiSimilarityScore.toFixed(1)}%
            </Tag>
          </div>
        )}
        <button
          type="button"
          aria-label={liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          className={cn(
            "absolute right-3 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition",
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
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 text-xs text-slate-600">
          <ImageIcon className="h-3 w-3" />
          {costume.images.length} ảnh
        </div>
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Star className="h-4 w-4 text-yellow-400" />
          {costume.rating.toFixed(1)}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
          {costume.name}
        </h3>
        <p className="text-xs text-slate-500">Nhân vật: {costume.characterName}</p>
        <p className="text-xs text-slate-500">Shop: {costume.shopName}</p>
        <div className="text-base font-semibold text-pink-600">
          {costume.priceMin}k – {costume.priceMax}k
          <span className="text-xs font-normal text-slate-400">/ngày</span>
        </div>
        <Button
          variant="soft"
          size="sm"
          className="w-full"
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
