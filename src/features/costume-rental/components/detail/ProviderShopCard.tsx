import { MessageCircle, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMockRentalCount } from "../../mocks/rentalCount.mock"
import { VI } from "@/shared/i18n/vi"

interface ProviderShopCardProps {
  provider: {
    id: number
    shopName: string
    avatarUrl: string | null
    verified: boolean
    bio?: string | null
  }
  onChat?: () => void
  onViewShop?: () => void
}

export function ProviderShopCard({ provider, onChat, onViewShop }: ProviderShopCardProps) {
  const stats = getMockRentalCount(String(provider.id))
  const rating = stats.rating
  const totalReviews = stats.totalReviews
  const totalRentals = stats.totalRentals

  return (
    <Card className="flex flex-col gap-4 border-pink-100 bg-white/90 p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <img
          src={provider.avatarUrl || "https://via.placeholder.com/64"}
          alt={provider.shopName}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{provider.shopName}</h3>
            {provider.verified && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                ✓
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-amber-500">★</span>
            <span>{rating.toFixed(1)}/10</span>
            <span>({totalReviews} {VI.costumeRental.detail.totalReviews})</span>
          </div>
          {provider.bio && (
            <p className="mt-1 max-w-[200px] truncate text-xs text-slate-500">{provider.bio}</p>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-wrap gap-4 text-xs text-slate-600">
        <div>
          <p className="text-slate-400">{VI.costumeRental.detail.rentalCount}</p>
          <p className="font-semibold">{totalRentals.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-slate-400">{VI.costumeRental.detail.ratingLabel}</p>
          <p className="font-semibold">{rating.toFixed(1)}/10</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-pink-100 text-slate-600 hover:border-pink-300 hover:bg-pink-50"
          onClick={onViewShop}
        >
          <Eye className="mr-1 h-4 w-4" />
          {VI.costumeRental.detail.viewShop}
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="rounded-full gap-1 bg-pink-500 hover:bg-pink-600"
          onClick={onChat}
        >
          <MessageCircle className="h-4 w-4" />
          {VI.costumeRental.detail.chatNow}
        </Button>
      </div>
    </Card>
  )
}
