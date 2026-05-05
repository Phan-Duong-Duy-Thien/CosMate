import * as React from "react"
import { Play, Heart } from "lucide-react"

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
  rentalsCount?: number
  hasAccessories: boolean
  accessoryCount?: number
  /** Wishlist toggle */
  isWishlisted?: boolean
  onToggleWishlist?: () => void
  wishlistLoading?: boolean
}

export const MediaGallery = ({
  images,
  videoUrl,
  isAdult18,
  bestSeller,
  rentalsCount,
  hasAccessories,
  accessoryCount,
  isWishlisted = false,
  onToggleWishlist,
  wishlistLoading = false,
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
      <div className="relative overflow-hidden rounded-[1.45rem] border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.45)]">
        <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-110px)] flex-wrap gap-2">
          {isAdult18 && (
            <Badge className="border-2 border-indigo-950 bg-pink-500 font-bold text-white">
              18+
            </Badge>
          )}
          {bestSeller && (
            <Badge className="border-2 border-indigo-950 bg-amber-300 font-bold text-indigo-950">
              Bán chạy
            </Badge>
          )}
          {rentalsCount && rentalsCount > 0 && (
            <Badge className="inline-flex items-center rounded-full border-2 border-indigo-950 bg-orange-200 px-3 py-1 text-xs font-bold text-indigo-950">
              {rentalsCount} lượt thuê
            </Badge>
          )}
          {hasAccessories && (
            <Badge className="border-2 border-indigo-950 bg-violet-200 font-bold text-indigo-950">
              Có phụ kiện{accessoryCount ? ` (${accessoryCount})` : ""}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleWishlist()
            }}
            disabled={wishlistLoading}
            className={cn(
              "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition",
              isWishlisted
                ? "bg-pink-500 text-white hover:bg-pink-600"
                : "bg-[#fffbeb] text-pink-500 hover:bg-pink-100"
            )}
          >
            <Heart
              className={cn("h-5 w-5", isWishlisted ? "fill-current" : "fill-none")}
            />
          </button>
        )}

        <div className="aspect-[4/5] w-full bg-gradient-to-b from-white to-slate-100/70">
          {activeItem?.type === "video" ? (
            <video
              controls
              className="h-full w-full object-contain"
              src={activeItem.url}
            />
          ) : (
            <img
              src={activeItem?.url}
              alt="Costume preview"
              className="h-full w-full object-contain transition-transform duration-500 hover:scale-[1.01]"
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
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-[3px] bg-white transition",
                isActive
                  ? "border-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.45)]"
                  : "border-slate-200"
              )}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-indigo-950/85 text-white">
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
