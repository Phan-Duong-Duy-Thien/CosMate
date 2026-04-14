import type { CostumeItem } from "../types"
import { CostumeCard } from "./CostumeCard"

interface CostumeGridProps {
  costumes: CostumeItem[]
  onViewDetail: (costumeId: string) => void
}

export const CostumeGrid = ({
  costumes,
  onViewDetail,
}: CostumeGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {costumes.map((costume) => (
      <CostumeCard
        key={costume.id}
        costume={costume}
        onViewDetail={onViewDetail}
      />
    ))}
  </div>
)
