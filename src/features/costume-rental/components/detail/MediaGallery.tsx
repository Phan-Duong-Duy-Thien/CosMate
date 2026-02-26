import * as React from "react"
import { Play } from "lucide-react"

import { Badge } from "@/shared/components/Badge"
import { cn } from "@/lib/utils"

type MediaItem = {
  id: string
  type: "image" | "video"
  url: string
}

interface MediaGalleryProps {
  images: string[]
  videoUrl?: string
  isAdult18: boolean
  bestSeller: boolean
  hasAccessories: boolean
  accessoryCount?: number
}

export const MediaGallery = ({
  images,
  videoUrl,
  isAdult18,
  bestSeller,
  hasAccessories,
  accessoryCount,
}: MediaGalleryProps) => {
  const mediaItems = React.useMemo<MediaItem[]>(() => {
    const items = images.map((url, index) => ({
      id: `image-${index}`,
      type: "image" as const,
      url,
    }))
    if (videoUrl) {
      items.unshift({ id: "video-0", type: "video", url: videoUrl })
    }
    return items
  }, [images, videoUrl])

  const [activeId, setActiveId] = React.useState(mediaItems[0]?.id ?? "")
  const activeItem = mediaItems.find((item) => item.id === activeId)

  React.useEffect(() => {
    if (mediaItems[0]?.id) setActiveId(mediaItems[0].id)
  }, [mediaItems])

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-sm">
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {isAdult18 && <Badge className="bg-pink-500 text-white">18+</Badge>}
          {bestSeller && (
            <Badge className="bg-amber-100 text-amber-700">Bán chạy</Badge>
          )}
          {hasAccessories && (
            <Badge className="bg-violet-100 text-violet-700">
              Có phụ kiện{accessoryCount ? ` (${accessoryCount})` : ""}
            </Badge>
          )}
        </div>
        <div className="aspect-[4/5] w-full bg-slate-50">
          {activeItem?.type === "video" ? (
            <video
              controls
              className="h-full w-full object-cover"
              src={activeItem.url}
            />
          ) : (
            <img
              src={activeItem?.url}
              alt="Costume preview"
              className="h-full w-full object-cover transition-transform duration-500"
            />
          )}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {mediaItems.map((item) => {
          const isActive = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.type === "video" ? "Xem video" : "Xem ảnh"}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-2xl border bg-white shadow-sm transition",
                isActive
                  ? "border-pink-300 ring-2 ring-pink-200"
                  : "border-slate-100"
              )}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-slate-900/80 text-white">
                  <Play className="h-5 w-5" />
                </div>
              ) : (
                <img
                  src={item.url}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
