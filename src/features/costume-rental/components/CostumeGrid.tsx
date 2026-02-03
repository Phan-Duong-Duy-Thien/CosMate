import type { CostumeItem } from "../types"
import { CostumeCard } from "./CostumeCard"

interface CostumeGridProps {
  costumes: CostumeItem[]
  wishlistIds: string[]
  onToggleWishlist: (costumeId: string) => void
}

export const CostumeGrid = ({
  costumes,
  wishlistIds,
  onToggleWishlist,
}: CostumeGridProps) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {costumes.map((costume) => (
      <CostumeCard
        key={costume.id}
        costume={costume}
        isWishlisted={wishlistIds.includes(costume.id)}
        onToggleWishlist={onToggleWishlist}
      />
    ))}
  </div>
)
