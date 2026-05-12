import type { CostumeItem } from "../types"
import { CostumeCard } from "./CostumeCard"

interface CostumeGridProps {
  costumes: CostumeItem[]
  onViewDetail: (costumeId: string) => void
  isWishlisted: (costumeId: number) => boolean
  wishlistLoadingId?: number | null
  onToggleWishlist: (costumeId: number) => void
}

export const CostumeGrid = ({
  costumes,
  onViewDetail,
  isWishlisted,
  wishlistLoadingId,
  onToggleWishlist,
}: CostumeGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    {costumes.map((costume) => (
      <CostumeCard
        key={costume.id}
        costume={costume}
        onViewDetail={onViewDetail}
        isWishlisted={isWishlisted(Number(costume.id))}
        wishlistLoading={wishlistLoadingId === Number(costume.id)}
        onToggleWishlist={onToggleWishlist}
      />
    ))}
  </div>
)
