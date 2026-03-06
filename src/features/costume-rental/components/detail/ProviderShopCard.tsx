import { MessageCircle, Eye, Star } from "lucide-react"
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
          <h3 className="text-lg font-semibold text-slate-900">{provider.shopName}</h3>
          <p className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 w-fit">
            Shop nổi bật
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap gap-6 text-sm text-slate-600">
        <div>
          <p className="text-xs text-slate-400">{VI.costumeRental.detail.rentalCount}</p>
          <p className="font-semibold">{totalRentals.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{VI.costumeRental.detail.ratingLabel}</p>
          <p className="font-semibold flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            {rating.toFixed(1)}/10
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{VI.costumeRental.detail.totalReviews}</p>
          <p className="font-semibold">{totalReviews} đánh giá</p>
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
          className="rounded-full gap-1"
          style={{ backgroundColor: '#FDCCD7', color: '#BE185D' }}
          onClick={onChat}
        >
          <MessageCircle className="h-4 w-4" />
          {VI.costumeRental.detail.chatNow}
        </Button>
      </div>
    </Card>
  )
}
