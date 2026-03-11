import { Heart, Image as ImageIcon, Star } from "lucide-react"

import type { CostumeItem } from "../types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { cn } from "@/lib/utils"

interface CostumeCardProps {
  costume: CostumeItem
  isWishlisted: boolean
  onToggleWishlist: (costumeId: string) => void
  onViewDetail: (costumeId: string) => void
}

export const CostumeCard = ({
  costume,
  isWishlisted,
  onToggleWishlist,
  onViewDetail,
}: CostumeCardProps) => (
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
        src={costume.images[0]}
        alt={costume.name}
        loading="lazy"
        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      <button
        type="button"
        aria-label="Yêu thích"
        className={cn(
          "absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition",
          isWishlisted && "text-pink-500"
        )}
        onClick={(event) => {
          event.stopPropagation()
          onToggleWishlist(costume.id)
        }}
      >
        <Heart className={cn("h-4 w-4", isWishlisted && "fill-pink-500")} />
      </button>
      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 text-xs text-slate-600">
        <ImageIcon className="h-3 w-3" />
        {costume.images.length} ảnh
      </div>
    </div>
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Star className="h-4 w-4 text-yellow-400" />
        {costume.rating.toFixed(1)}
      </div>
      <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
        {costume.name}
      </h3>
      <p className="text-sm text-slate-500">Nhân vật: {costume.characterName}</p>
      <p className="text-sm text-slate-500">Shop: {costume.shopName}</p>
      <p className="text-sm text-slate-500">Thương hiệu: {costume.brand || "non-brand"}</p>
      <div className="text-xs uppercase tracking-wide text-slate-400">
        Giá thuê
      </div>
      <div className="text-lg font-semibold text-pink-600">
        {costume.priceMin}k – {costume.priceMax}k
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
