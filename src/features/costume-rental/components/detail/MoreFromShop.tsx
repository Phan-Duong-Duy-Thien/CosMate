import { Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useProviderCostumesForShop, type MoreFromShopItem } from "../../hooks/useProviderCostumesForShop"
import { VI } from "@/shared/i18n/vi"
import { Spin } from "antd"

interface MoreFromShopProps {
  providerId: number
  onSelectCostume: (costumeId: string) => void
  currentCostumeId?: string
}

export function MoreFromShop({ providerId, onSelectCostume, currentCostumeId }: MoreFromShopProps) {
  const { items, loading, error } = useProviderCostumesForShop(providerId, currentCostumeId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin size="small" />
      </div>
    )
  }

  if (error || items.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-200 to-violet-200 px-4 py-1.5 shadow-[4px_4px_0_0_rgba(30,27,75,0.35)]">
        <h3 className="text-center text-sm font-extrabold text-indigo-950">
          {VI.costumeRental.detail.moreFromShop}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} onClick={() => onSelectCostume(item.id)} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ item, onClick }: { item: MoreFromShopItem; onClick: () => void }) {
  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Wishlist clicked for:", item.id)
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className="group relative overflow-hidden rounded-[1.05rem] border-[3px] border-indigo-950/20 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-950/40 hover:shadow-[8px_8px_0_0_rgba(30,27,75,0.28)]"
    >
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleWishlist}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-950 bg-white/90 text-pink-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-pink-50"
      >
        <Heart className="h-4 w-4" />
      </button>

      <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover object-top" />
      <div className="space-y-1 p-3">
        <p className="overflow-hidden text-sm font-semibold text-slate-800" title={item.name}>
          <span className="block truncate group-hover:hidden">{item.name}</span>
          <span className="hidden group-hover:block">
            <span className="inline-flex min-w-max items-center gap-8 whitespace-nowrap group-hover:animate-[home-title-marquee_8s_linear_infinite]">
              <span>{item.name}</span>
              <span aria-hidden="true">{item.name}</span>
            </span>
          </span>
        </p>
        <p className="text-xs text-slate-500">{item.characterName}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold leading-tight text-pink-600">
            <span className="whitespace-nowrap">{item.pricePerDay.toLocaleString("vi-VN")} VND</span>
            <span className="ml-1 text-[11px] font-normal text-slate-500">/ngày</span>
          </p>
          {item.brandName && (
            <span className="rounded border border-indigo-950/20 bg-pink-100 px-1.5 py-0.5 text-[10px] font-semibold text-pink-600">
              {item.brandName}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          {item.rentalCount} {VI.costumeRental.detail.rentalCount.toLowerCase()}
        </p>
      </div>
    </Card>
  )
}
