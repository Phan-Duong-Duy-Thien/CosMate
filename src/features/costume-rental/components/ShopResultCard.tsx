import { MapPin, MessageCircle } from "lucide-react"

import type { Shop } from "../types"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { RatingStars } from "@/shared/components/RatingStars"

interface ShopResultCardProps {
  shop: Shop
}

export const ShopResultCard = ({ shop }: ShopResultCardProps) => (
  <Card className="flex flex-col gap-4 border-pink-100 bg-white/90 p-5 shadow-sm sm:flex-row sm:items-center">
    <div className="flex items-center gap-4">
      <img
        src={shop.avatarUrl}
        alt={shop.name}
        className="h-16 w-16 rounded-full object-cover"
      />
      <div>
        <p className="text-xs uppercase tracking-wide text-pink-500">
          Shop liên quan
        </p>
        <h3 className="text-lg font-semibold text-slate-900">{shop.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <RatingStars rating={shop.rating} />
          <span>{shop.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-1 flex-wrap gap-4 text-xs text-slate-600">
      <div>
        <p className="text-slate-400">Lượt thuê</p>
        <p className="font-semibold">{shop.totalRentals.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-slate-400">Người theo dõi</p>
        <p className="font-semibold">{shop.followers.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-slate-400">Tỉ lệ phản hồi</p>
        <p className="font-semibold">{shop.responseRate}%</p>
      </div>
      <div>
        <p className="text-slate-400">Phản hồi</p>
        <p className="font-semibold">{shop.responseTimeText}</p>
      </div>
      <div className="flex items-center gap-1 text-slate-500">
        <MapPin className="h-3.5 w-3.5 text-pink-400" />
        {shop.region.toUpperCase()}
      </div>
    </div>
    <Button
      type="button"
      variant="soft"
      size="sm"
      className="ml-auto gap-2 rounded-full"
      disabled
    >
      <MessageCircle className="h-4 w-4" />
      Xem shop
    </Button>
  </Card>
)
