import { Heart, Image as ImageIcon } from "lucide-react"


import type { CostumeItem } from "../types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

interface CostumeCardProps {
  costume: CostumeItem
  onViewDetail: (costumeId: string) => void
  isWishlisted: boolean
  wishlistLoading?: boolean
  onToggleWishlist: (costumeId: number) => void
  /** Thu gọn cho lưới homepage (6 cột) */
  variant?: "default" | "compact"
}

export const CostumeCard = ({
  costume,
  onViewDetail,
  isWishlisted,
  wishlistLoading,
  onToggleWishlist,
  variant = "default",
}: CostumeCardProps) => {
  const compact = variant === "compact"
  const costumeId = Number(costume.id)
  const liked = isWishlisted
  const displayName = costume.name?.trim() || "-"
  const shopDisplay = costume.shopName?.trim() || ""
  const hasPrice = Number.isFinite(costume.priceMin) && Number.isFinite(costume.priceMax)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onViewDetail(costume.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onViewDetail(costume.id)
        }
      }}
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden border-indigo-950 bg-[#fffbe8] transition-all duration-300 hover:-translate-y-1",
        compact
          ? "rounded-xl border-[3px] shadow-[4px_4px_0_0_rgba(30,27,75,0.4)] hover:shadow-[6px_6px_0_0_rgba(30,27,75,0.32)]"
          : "rounded-[1.05rem] border-[4px] shadow-[6px_6px_0_0_rgba(30,27,75,0.45)] hover:shadow-[9px_9px_0_0_rgba(30,27,75,0.35)]"
      )}
    >
      <div className="costume-card-media relative">
        <img
          src={costume.images[0] || "https://placehold.co/400x500/e2e8f0/94a3b8?text=No+Image"}
          alt={costume.name}
          loading="lazy"
          className={cn(
            "w-full border-indigo-950 object-cover object-top transition-transform duration-500 group-hover:scale-105",
            compact ? "h-52 border-b-[3px]" : "h-56 border-b-[4px]"
          )}
        />
        <div
          className={cn(
            "absolute z-[2] flex flex-wrap",
            compact ? "left-2 top-2 gap-1" : "left-3 top-3 gap-2"
          )}
        >
          <span
            role="status"
            className={cn(
              "cosmate-costume-card-status inline-flex items-center rounded-full border-2 border-indigo-950 font-bold shadow-sm",
              compact ? "px-2 py-0.5 text-[10px] leading-tight" : "px-3 py-1 text-xs",
              !costume.isAvailable && "cosmate-costume-card-status--rented"
            )}
          >
            {costume.isAvailable
              ? VI.costumeRental.costumeStatus.available
              : VI.costumeRental.costumeStatus.rented}
          </span>
          {costume.isAdult18 && (
            <Badge
              className={cn(
                "rounded-full border-2 border-indigo-950 bg-cosmate-pink font-bold text-primary-foreground",
                compact ? "px-1.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
              )}
            >
              18+
            </Badge>
          )}
        </div>
        {typeof costume.aiSimilarityScore === "number" && (
          <div
            className={cn(
              "absolute z-10 flex items-center gap-1 rounded-full bg-indigo-950/90 font-bold shadow-md backdrop-blur-sm",
              compact
                ? "right-2 top-2 px-2 py-0.5 text-[10px]"
                : "right-2 top-2 px-2.5 py-1 text-xs"
            )}
          >
            <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              ✨ {costume.aiSimilarityScore.toFixed(0)}%
            </span>
          </div>
        )}
        <button
          type="button"
          aria-label={liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          className={cn(
            "absolute rounded-lg border-[3px] border-indigo-950 bg-[#fffbe8] text-slate-600 shadow-sm transition hover:scale-105",
            compact ? "right-2 top-2 p-1" : "right-3 rounded-xl p-1.5",
            typeof costume.aiSimilarityScore === "number"
              ? compact
                ? "top-9"
                : "top-12"
              : compact
                ? "top-2"
                : "top-3",
            liked && "text-pink-500",
            wishlistLoading && "pointer-events-none opacity-70"
          )}
          onClick={(event) => {
            event.stopPropagation()
            onToggleWishlist(costumeId)
          }}
        >
          <Heart className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4", liked && "fill-pink-500")} />
        </button>
        <div
          className={cn(
            "absolute flex items-center gap-0.5 rounded-md border-2 border-indigo-950 bg-[#fffbe8]/95 font-semibold text-indigo-900",
            compact
              ? "bottom-1.5 right-1.5 px-1.5 py-0.5 text-[9px]"
              : "bottom-2 right-2 gap-1 px-2 py-0.5 text-[11px]"
          )}
        >
          <ImageIcon className={cn(compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
          {costume.images.length} ảnh
        </div>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          compact ? "min-h-[96px] gap-1 p-2" : "min-h-[124px] gap-1.5 p-3"
        )}
      >
        <h3
          className={cn(
            "overflow-hidden font-extrabold leading-snug text-indigo-950",
            compact ? "text-xs" : "text-sm"
          )}
          title={displayName}
        >
          <span className="block truncate group-hover:hidden">{displayName}</span>
          <span className="hidden w-full overflow-hidden group-hover:flex">
            <span className="flex shrink-0 whitespace-nowrap group-hover:animate-[home-title-marquee_10s_linear_infinite]">
              <span className="pr-8">{displayName}</span>
              <span className="pr-8" aria-hidden="true">{displayName}</span>
            </span>
          </span>
        </h3>
        {shopDisplay ? (
          <p
            className={cn(
              "truncate font-semibold text-indigo-900/65",
              compact ? "text-[10px] leading-tight" : "text-xs"
            )}
            title={`${VI.costumeRental.listShopLabel}: ${shopDisplay}`}
          >
            {shopDisplay}
          </p>
        ) : null}
        <div
          className={cn(
            "flex items-baseline gap-0.5 font-extrabold leading-tight",
            compact ? "min-h-5 text-xs" : "min-h-7 gap-1 text-base"
          )}
        >
          {hasPrice ? (
            <>
              <span className="bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text text-transparent">
                {costume.priceMin.toLocaleString("vi-VN")} VNĐ
              </span>
              <span
                className={cn(
                  "font-semibold text-indigo-900/60",
                  compact ? "text-[10px]" : "text-xs"
                )}
              >
                /ngày
              </span>
            </>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
        <Button
          variant="soft"
          size="sm"
          className={cn(
            "mt-auto w-full rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-400 font-extrabold text-indigo-950 hover:brightness-105",
            compact
              ? "h-7 text-xs shadow-[2px_2px_0_0_#1e1b4b]"
              : "h-9 text-[18px] shadow-[3px_3px_0_0_#1e1b4b]"
          )}
          onClick={(event) => {
            event.stopPropagation()
            onViewDetail(costume.id)
          }}
        >
          {VI.costumeRental.viewDetail}
        </Button>
      </div>
    </Card>
  )
}
