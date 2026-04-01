import { Button } from "antd"
import type { RecommendResponseItem } from "../types"

interface ResultCostumeGridProps {
  items: RecommendResponseItem[]
  onView: (id: number) => void
}

export default function ResultCostumeGrid({ items, onView }: ResultCostumeGridProps) {
  if (items.length === 0) return null

  return (
    <section className="rounded-3xl border border-purple-100 bg-white/90 p-5 shadow-sm md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Trang phục gợi ý từ AI</h3>
        <span className="text-xs text-slate-500">{items.length} gợi ý</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <button
            key={`${item.costumeId}-${item.imageUrl}`}
            type="button"
            onClick={() => onView(item.costumeId)}
            className="group flex items-center gap-3 rounded-2xl border border-purple-100 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-purple-400 hover:shadow-md"
          >
            <img
              src={item.imageUrl}
              alt={item.costumeName}
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{item.costumeName}</p>
              <p className="text-xs text-slate-500">Độ tương đồng: {(item.similarityScore * 100).toFixed(1)}%</p>
            </div>
            <Button size="small" type="link" className="ml-auto">
              Xem
            </Button>
          </button>
        ))}
      </div>
    </section>
  )
}
