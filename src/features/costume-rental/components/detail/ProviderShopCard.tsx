import { MessageCircle, Eye, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMockRentalCount } from "../../mocks/rentalCount.mock"
import { VI } from "@/shared/i18n/vi"
import { useStartChat } from "@/features/chat/hooks/useStartChat"

interface ProviderShopCardProps {
  provider: {
    id: number
    userId: number
    shopName: string
    avatarUrl: string | null
    verified: boolean
    bio?: string | null
  }
}

export function ProviderShopCard({ provider }: ProviderShopCardProps) {
  const { startChat, loading: chatLoading } = useStartChat()
  const stats = getMockRentalCount(String(provider.id))
  const rating = stats.rating
  const totalReviews = stats.totalReviews
  const totalRentals = stats.totalRentals

  return (
    <Card className="flex flex-col gap-4 border-pink-100 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center">
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
            {rating.toFixed(1)}/10 <span className="font-normal text-slate-500">({totalReviews} {VI.costumeRental.detail.totalReviews})</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-pink-100 text-slate-600 hover:border-pink-300 hover:bg-pink-50"
          disabled
        >
          <Eye className="mr-1 h-4 w-4" />
          {VI.costumeRental.detail.viewShop}
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="rounded-full gap-1 bg-pink-100 text-pink-700 hover:bg-pink-200"
          onClick={() => startChat(provider.userId, provider.shopName)}
          loading={chatLoading}
        >
          <MessageCircle className="h-4 w-4" />
          {VI.costumeRental.detail.chatNow}
        </Button>
      </div>
    </Card>
  )
}
