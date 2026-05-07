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
    shopName: string | null
    avatarUrl: string | null
    verified: boolean
    bio?: string | null
  }
  onViewShop: () => void
}

export function ProviderShopCard({ provider, onViewShop }: ProviderShopCardProps) {
  const { startChat, loading: chatLoading } = useStartChat()
  const safeShopName = provider.shopName ?? "Shop"
  const stats = getMockRentalCount(String(provider.id))
  const rating = stats.rating
  const totalReviews = stats.totalReviews
  const totalRentals = stats.totalRentals

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] to-[#fce7f3] p-4 shadow-[9px_9px_0_0_rgba(30,27,75,0.6)] sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <img
          src={provider.avatarUrl || "https://via.placeholder.com/64"}
          alt={safeShopName}
          className="h-16 w-16 rounded-2xl border-[3px] border-indigo-950 object-cover shadow-[4px_4px_0_0_#1e1b4b]"
        />
        <div>
          <h3 className="text-lg font-extrabold text-indigo-950">{safeShopName}</h3>
          <p className="mt-1 w-fit rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-400 to-orange-300 px-2 py-0.5 text-xs font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
            Shop nổi bật
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap gap-6 text-sm text-indigo-900/85">
        <div>
          <p className="label-caps text-xs text-indigo-900/65">{VI.costumeRental.detail.rentalCount}</p>
          <p className="font-bold text-indigo-950">{totalRentals.toLocaleString()}</p>
        </div>
        <div>
          <p className="label-caps text-xs text-indigo-900/65">{VI.costumeRental.detail.ratingLabel}</p>
          <p className="flex items-center gap-1 font-bold text-indigo-950">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            {rating.toFixed(1)}/10 <span className="font-normal text-indigo-900/70">({totalReviews} {VI.costumeRental.detail.totalReviews})</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-amber-100"
          onClick={onViewShop}
        >
          <Eye className="mr-1 h-4 w-4" />
          {VI.costumeRental.detail.viewShop}
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="gap-1 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-110"
          onClick={() => startChat(provider.userId, safeShopName)}
          loading={chatLoading}
        >
          <MessageCircle className="h-4 w-4" />
          {VI.costumeRental.detail.chatNow}
        </Button>
      </div>
    </Card>
  )
}
