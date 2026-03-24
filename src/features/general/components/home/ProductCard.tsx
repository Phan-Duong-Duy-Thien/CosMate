import { Heart } from "lucide-react"

import type { Product } from "../../pages/home.types"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

interface ProductCardProps {
  product: Product
  isWishlisted: boolean
  onToggleWishlist: (productId: string) => void
  onViewDetail: (productId: number) => void
}

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onViewDetail,
}: ProductCardProps) => (
  <Card className="group overflow-hidden border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="relative">
      <img
        src={product.imageUrls[0] || "https://placehold.co/800x1000?text=No+Image"}
        alt={product.name}
        loading="lazy"
        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <button
        type="button"
        aria-label={VI.general.home.featured.wishlist}
        className={cn(
          "absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition",
          isWishlisted && "text-pink-500"
        )}
        onClick={() => onToggleWishlist(String(product.id))}
      >
        <Heart className={cn("h-4 w-4", isWishlisted && "fill-pink-500")} />
      </button>
    </div>
    <div className="space-y-3 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {VI.costumeRental.status}: {product.status}
      </div>

      <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
        {product.name}
      </h3>
      <p className="text-sm text-slate-500">Thương hiệu: {product.brand || "non-brand"}</p>
      <p className="text-sm text-slate-500">{product.rentalsCount} lượt thuê</p>
      <div className="text-lg font-semibold text-pink-600">
        {product.pricePerDay.toLocaleString("vi-VN")} VNĐ
      </div>
      <Button
        variant="soft"
        size="sm"
        className="w-full"
        onClick={() => onViewDetail(product.id)}
      >
        {VI.costumeRental.viewDetail}
      </Button>
    </div>
  </Card>
)
