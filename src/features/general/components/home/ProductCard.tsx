import { Heart, Image as ImageIcon } from "lucide-react"

import type { Product } from "../../pages/home.types"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { Badge } from "@/shared/components/Badge"
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
  <Card
    role="button"
    tabIndex={0}
    onClick={() => onViewDetail(product.id)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onViewDetail(product.id)
      }
    }}
    className="group cursor-pointer overflow-hidden border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div className="relative">
      <img
        src={product.imageUrls[0] || "https://placehold.co/400x500/e2e8f0/94a3b8?text=No+Image"}
        alt={product.name}
        loading="lazy"
        className="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      {product.status === "RENTED" && (
        <Badge className="absolute left-3 top-3 bg-slate-700 text-white">Đã thuê</Badge>
      )}
      <button
        type="button"
        aria-label={VI.general.home.featured.wishlist}
        className={cn(
          "absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition",
          isWishlisted && "text-pink-500"
        )}
        onClick={(event) => {
          event.stopPropagation()
          onToggleWishlist(String(product.id))
        }}
      >
        <Heart className={cn("h-4 w-4", isWishlisted && "fill-pink-500")} />
      </button>
      {product.imageUrls.length > 1 && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-xs text-slate-600">
          <ImageIcon className="h-3 w-3" />
          {product.imageUrls.length}
        </div>
      )}
    </div>
    <div className="space-y-2 p-3">
      <div className="text-xs text-slate-400">
        {VI.costumeRental.status}: {product.status}
      </div>
      <h3 className="overflow-hidden text-sm font-semibold text-slate-800" title={product.name}>
        <span className="block truncate group-hover:hidden">{product.name}</span>
        <span className="hidden group-hover:block">
          <span className="inline-flex min-w-max items-center gap-8 whitespace-nowrap group-hover:animate-[home-title-marquee_8s_linear_infinite]">
            <span>{product.name}</span>
            <span aria-hidden="true">{product.name}</span>
          </span>
        </span>
      </h3>
      <div className="text-base font-semibold text-pink-600">
        {product.pricePerDay.toLocaleString("vi-VN")} VNĐ
        <span className="text-xs font-normal text-slate-400">/ngày</span>
      </div>
      <Button
        variant="soft"
        size="sm"
        className="w-full"
        onClick={(event) => {
          event.stopPropagation()
          onViewDetail(product.id)
        }}
      >
        {VI.costumeRental.viewDetail}
      </Button>
    </div>
  </Card>
)
