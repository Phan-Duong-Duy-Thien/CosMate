import type { MockGalleryItem, GallerySpanPreset } from "../types"
import { cn } from "@/lib/utils"

const SPAN_CLASSES: Record<GallerySpanPreset, string> = {
  small: "col-span-1 row-span-1",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  large: "col-span-2 row-span-2",
}

interface GalleryGridProps {
  items: MockGalleryItem[]
  emptyMessage?: string
}

export function GalleryGrid({
  items,
  emptyMessage = "No shoots yet.",
}: GalleryGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    )
  }
  return (
    <div
      className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
      style={{ gridAutoRows: "120px" }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg",
            SPAN_CLASSES[item.spanPreset]
          )}
        >
          <img
            src={item.imageUrl}
            alt={item.title ?? "Gallery item"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}
