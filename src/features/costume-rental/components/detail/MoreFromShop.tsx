import { Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMockMoreFromShop, type MoreFromShopItem } from "../../mocks/moreFromShop.mock"
import { VI } from "@/shared/i18n/vi"

interface MoreFromShopProps {
  providerId: number
  onSelectCostume: (costumeId: string) => void
  currentCostumeId?: string
}

export function MoreFromShop({ providerId, onSelectCostume, currentCostumeId }: MoreFromShopProps) {
  const items = getMockMoreFromShop(providerId)
  // Filter out current costume
  const filteredItems = items.filter((item) => item.id !== currentCostumeId)

  if (filteredItems.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="inline-block rounded-xl border-2 border-[#FDCCD7] bg-[#FDCCD7] px-3 py-1.5">
        <h3 className="text-base font-bold tracking-wide text-slate-800 text-center">
          {VI.costumeRental.detail.moreFromShop}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {filteredItems.map((item) => (
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
    // Future: call wishlist API
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
      className="group relative overflow-hidden border-pink-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleWishlist}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-pink-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-pink-50"
      >
        <Heart className="h-4 w-4" />
      </button>

      <img
        src={item.imageUrl}
        alt={item.name}
        className="h-40 w-full object-cover"
      />
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-slate-800">{item.name}</p>
        <p className="text-xs text-slate-500">{item.characterName}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-pink-600">
            {item.pricePerDay.toLocaleString("vi-VN")} VNĐ<span className="text-xs font-normal text-slate-500">/ngày</span>
          </p>
          {item.brandName && (
            <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[10px] text-pink-600">
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
