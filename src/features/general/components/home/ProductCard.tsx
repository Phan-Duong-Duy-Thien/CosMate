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
  wishlistLoading?: boolean
  onToggleWishlist: (productId: string) => void
  onViewDetail: (productId: number) => void
}

const statusLabelVi: Record<string, string> = {
  AVAILABLE: "Sẵn sàng cho thuê",
  RENTED: "Đang được thuê",
  MAINTENANCE: "Đang bảo trì",
  UNAVAILABLE: "Tạm ngưng",
}

export const ProductCard = ({
  product,
  isWishlisted,
  wishlistLoading,
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
    className="group cursor-pointer overflow-hidden rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(236,72,153,0.45)]"
  >
    <div className="relative border-b-[4px] border-indigo-950">
      <img
        src={
          product.imageUrls[0] ||
          "https://placehold.co/400x500/e9d5ff/4c1d95?text=CosMate"
        }
        alt={product.name}
        loading="lazy"
        className="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-950/25 to-transparent opacity-70"
      />
      {product.status === "RENTED" && (
        <Badge className="absolute left-3 top-3 border-[3px] border-indigo-950 bg-slate-800 font-extrabold text-white shadow-[4px_4px_0_0_#1e1b4b]">
          Đã thuê
        </Badge>
      )}
      <button
        type="button"
        aria-label={VI.general.home.featured.wishlist}
        className={cn(
          "absolute right-3 top-3 rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] p-2 text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:scale-105 hover:bg-pink-100",
          isWishlisted && "border-pink-600 bg-pink-500 text-white hover:bg-pink-600",
          wishlistLoading && "pointer-events-none opacity-70"
        )}
        onClick={(event) => {
          event.stopPropagation()
          onToggleWishlist(String(product.id))
        }}
      >
        <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
      </button>
      {product.imageUrls.length > 1 && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg border-2 border-indigo-950 bg-[#fffbeb] px-2 py-0.5 text-xs font-bold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
          <ImageIcon className="h-3 w-3" aria-hidden />
          {product.imageUrls.length}
        </div>
      )}
    </div>
    <div className="space-y-3 p-4">
      <div className="inline-flex rounded-lg border-2 border-indigo-950/80 bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-indigo-800">
        {statusLabelVi[product.status] ?? product.status}
      </div>
      <h3
        className="overflow-hidden text-sm font-extrabold leading-snug text-indigo-950"
        title={product.name}
      >
        <span className="block truncate group-hover:hidden">{product.name}</span>
        <span className="hidden w-full overflow-hidden group-hover:flex">
          <span className="flex shrink-0 whitespace-nowrap group-hover:animate-[home-title-marquee_10s_linear_infinite]">
            <span className="pr-8">{product.name}</span>
            <span className="pr-8" aria-hidden="true">{product.name}</span>
          </span>
        </span>
      </h3>
      <div className="flex items-baseline gap-1 text-base font-extrabold leading-tight">
        <span className="bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text text-transparent">
          {product.pricePerDay.toLocaleString("vi-VN")} VNĐ
        </span>
        <span className="text-xs font-semibold text-indigo-900/60">/ngày</span>
      </div>
      <Button
        variant="soft"
        size="sm"
        className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-400 to-teal-400 font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-105"
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
