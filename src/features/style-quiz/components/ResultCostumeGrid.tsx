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
          className="group min-w-0 cursor-pointer rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] p-3 transition hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#ec4899] shadow-[4px_4px_0_0_#1e1b4b]"
        >
          <div className="overflow-hidden rounded-xl border-[2px] border-indigo-950">
            <img
              src={item.imageUrl || FALLBACK_IMAGE}
              alt={item.costumeName}
              className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(event) => {
                const target = event.currentTarget
                target.onerror = null
                target.src = FALLBACK_IMAGE
              }}
            />
          </div>
          <div className="mt-3 space-y-2">
            <h3
              className="overflow-hidden text-sm font-extrabold leading-snug text-indigo-950"
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
            <div className="flex flex-col gap-1.5">
              {item.isCollaborative ? (
                <p className="text-[10px] font-black text-pink-600 bg-pink-100/70 border-[2px] border-indigo-950 px-2 py-0.5 rounded-lg inline-block self-start shadow-[2px_2px_0_0_#1e1b4b]">
                  ✨ Bạn cùng nhóm cũng thuê bộ này
                </p>
              ) : (
                <p className="text-[10px] font-black text-pink-600 bg-pink-50 border-[2px] border-indigo-950 px-2 py-0.5 rounded-lg inline-block self-start shadow-[2px_2px_0_0_#1e1b4b]">
                  Mức độ phù hợp: {(item.similarityScore * 100).toFixed(1)}%
                </p>
              )}
              <p className="text-[10px] font-black text-indigo-950 bg-amber-200 border-[2px] border-indigo-950 px-2 py-0.5 rounded-lg inline-block self-start shadow-[2px_2px_0_0_#1e1b4b]">
                Giá thuê: {Number(item.price).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
