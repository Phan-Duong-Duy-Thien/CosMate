import type { SearchResponseItem } from "../types"

interface ResultCostumeGridProps {
  items: SearchResponseItem[]
  onView: (id: number) => void
}

const FALLBACK_IMAGE = "https://placehold.co/600x800/e5e7eb/9ca3af?text=No+Image"

export default function ResultCostumeGrid({ items, onView }: ResultCostumeGridProps) {
  if (items.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.costumeId}-${item.imageUrl}`}
          role="button"
          tabIndex={0}
          onClick={() => onView(item.costumeId)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              onView(item.costumeId)
            }
          }}
          className="group min-w-0 cursor-pointer rounded-2xl border border-pink-100 bg-pink-50/40 p-3 transition hover:-translate-y-0.5 hover:border-pink-400 hover:shadow-md"
        >
          <div className="overflow-hidden rounded-xl">
            <img
              src={item.imageUrl || FALLBACK_IMAGE}
              alt={item.costumeName}
              className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(event) => {
                const target = event.currentTarget
                target.onerror = null
                target.src = FALLBACK_IMAGE
              }}
            />
          </div>
          <div className="mt-3 space-y-1">
            <h3
              className="overflow-hidden text-base font-semibold leading-snug text-slate-800"
              title={item.costumeName}
            >
              <span className="block truncate group-hover:hidden">{item.costumeName}</span>
              <span className="hidden w-full overflow-hidden group-hover:flex">
                <span className="flex shrink-0 whitespace-nowrap group-hover:animate-[home-title-marquee_10s_linear_infinite]">
                  <span className="pr-8">{item.costumeName}</span>
                  <span className="pr-8" aria-hidden="true">
                    {item.costumeName}
                  </span>
                </span>
              </span>
            </h3>
            <p className="text-sm text-pink-600">Độ tương đồng: {(item.similarityScore * 100).toFixed(1)}%</p>
            <p className="text-sm text-slate-500">Giá tham khảo: {Number(item.price).toLocaleString("vi-VN")}đ</p>
          </div>
        </div>
      ))}
    </div>
  )
}
