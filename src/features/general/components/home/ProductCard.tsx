import { Heart, Image as ImageIcon, Star } from "lucide-react"

import type { Product } from "../../pages/home.types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  isWishlisted: boolean
  onToggleWishlist: (productId: string) => void
}

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) => (
  <Card className="group overflow-hidden border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="relative">
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {product.isAdult && (
        <Badge className="absolute left-3 top-3 bg-pink-500 text-white">
          18+
        </Badge>
      )}
      <button
        type="button"
        aria-label="Yêu thích"
        className={cn(
          "absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition",
          isWishlisted && "text-pink-500"
        )}
        onClick={() => onToggleWishlist(product.id)}
      >
        <Heart className={cn("h-4 w-4", isWishlisted && "fill-pink-500")} />
      </button>
      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 text-xs text-slate-600">
        <ImageIcon className="h-3 w-3" />
        4 ảnh
      </div>
    </div>
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Star className="h-4 w-4 text-yellow-400" />
        {product.rating.toFixed(1)}
      </div>
      <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
        {product.name}
      </h3>
      <p className="text-sm text-slate-500">Shop: {product.shopName}</p>
      <div className="text-xs uppercase tracking-wide text-slate-400">
        Giá thuê
      </div>
      <div className="text-lg font-semibold text-pink-600">
        {product.priceMin}k – {product.priceMax}k
      </div>
      <Button variant="soft" size="sm" className="w-full">
        Xem chi tiết
      </Button>
    </div>
  </Card>
)
