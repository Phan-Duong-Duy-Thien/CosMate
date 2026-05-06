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
      <div className="relative overflow-hidden rounded-3xl border-[5px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-[#fce7f3] to-[#dbeafe] shadow-[12px_12px_0_0_rgba(30,27,75,0.65)]">
        <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-110px)] flex-wrap gap-2">
          {isAdult18 && (
            <Badge className="border-[3px] border-indigo-950 bg-[#DC2626] font-extrabold text-white shadow-[3px_3px_0_0_#1e1b4b]">
              18+
            </Badge>
          )}
          {bestSeller && (
            <Badge className="border-[3px] border-indigo-950 bg-gradient-to-r from-pink-400 to-orange-300 font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
              Bán chạy
            </Badge>
          )}
          {rentalsCount && rentalsCount > 0 && (
            <Badge className="inline-flex items-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-1 text-xs font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
              {rentalsCount} lượt thuê
            </Badge>
          )}
          {hasAccessories && (
            <Badge className="border-[3px] border-indigo-950 bg-gradient-to-r from-violet-500 to-fuchsia-500 font-extrabold text-white shadow-[3px_3px_0_0_#1e1b4b]">
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
                ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                : "bg-[#fffbeb] text-[#DC2626] hover:bg-[#FEE2E2]"
            )}
          >
            <Heart
              className={cn("h-5 w-5", isWishlisted ? "fill-current" : "fill-none")}
            />
          </button>
        )}

        <div className="aspect-[4/5] w-full bg-gradient-to-b from-white to-[#ede9fe]">
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
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-[3px] bg-[#fffbeb] transition",
                isActive
                  ? "border-indigo-950 shadow-[4px_4px_0_0_#1e1b4b]"
                  : "border-indigo-950/30"
              )}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
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
