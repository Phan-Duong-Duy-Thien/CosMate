import { Heart, Image as ImageIcon } from "lucide-react"
import { Tag } from "antd"

import type { CostumeItem } from "../types"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { cn } from "@/lib/utils"

interface CostumeCardProps {
  costume: CostumeItem
  onViewDetail: (costumeId: string) => void
  isWishlisted: boolean
  wishlistLoading?: boolean
  onToggleWishlist: (costumeId: number) => void
}

export const CostumeCard = ({
  costume,
  onViewDetail,
  isWishlisted,
  wishlistLoading,
  onToggleWishlist,
}: CostumeCardProps) => {
  const costumeId = Number(costume.id)
  const liked = isWishlisted
  const displayName = costume.name?.trim() || "-"
  const hasPrice = Number.isFinite(costume.priceMin) && Number.isFinite(costume.priceMax)
  const statusLabel = costume.isAvailable ? "Sẵn sàng cho thuê" : "Đang được thuê"

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
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.05rem] border-[4px] border-indigo-950 bg-[#fffbe8] shadow-[6px_6px_0_0_rgba(30,27,75,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_rgba(30,27,75,0.35)]"
    >
      <div className="relative">
        <img
          src={costume.images[0] || "https://placehold.co/400x500/e2e8f0/94a3b8?text=No+Image"}
          alt={costume.name}
          loading="lazy"
          className="h-48 w-full border-b-[4px] border-indigo-950 object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            className={cn(
              "rounded-full border-2 border-indigo-950 px-3 py-1 text-xs font-bold text-white shadow-sm",
              costume.isAvailable ? "bg-emerald-600" : "bg-slate-700"
            )}
          >
            {costume.isAvailable ? "Có sẵn" : "Đã thuê"}
          </Badge>
          {costume.isAdult18 && (
            <Badge className="rounded-full border-2 border-indigo-950 bg-pink-500 px-3 py-1 text-xs font-bold text-white">
              18+
            </Badge>
          )}
        </div>
        {typeof costume.aiSimilarityScore === "number" && (
          <div className="absolute right-3 top-3">
            <Tag
              className="m-0 rounded-full border-0 bg-primary px-3 py-1 font-semibold !text-primary-foreground shadow-sm"
            >
              ✨ Khớp {costume.aiSimilarityScore.toFixed(1)}%
            </Tag>
          </div>
        )}
        <button
          type="button"
          aria-label={liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          className={cn(
            "absolute right-3 rounded-xl border-[3px] border-indigo-950 bg-[#fffbe8] p-1.5 text-slate-600 shadow-sm transition hover:scale-105",
            typeof costume.aiSimilarityScore === "number" ? "top-12" : "top-3",
            liked && "text-pink-500",
            wishlistLoading && "pointer-events-none opacity-70"
          )}
          onClick={(event) => {
            event.stopPropagation()
            onToggleWishlist(costumeId)
          }}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-pink-500")} />
        </button>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg border-2 border-indigo-950 bg-[#fffbe8]/95 px-2 py-0.5 text-[11px] font-semibold text-indigo-900">
          <ImageIcon className="h-3 w-3" />
          {costume.images.length} ảnh
        </div>
      </div>

      <div className="flex min-h-[124px] flex-1 flex-col gap-2 p-3">
        <p className="inline-flex w-fit rounded-full border-2 border-indigo-950 bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-indigo-900">
          {statusLabel}
        </p>
        <h3
          className="overflow-hidden text-sm font-extrabold leading-snug text-indigo-950"
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
        <div className="flex min-h-7 items-baseline gap-1 text-base font-extrabold leading-tight">
          {hasPrice ? (
            <>
              <span className="bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text text-transparent">
                {costume.priceMin.toLocaleString("vi-VN")} VNĐ
              </span>
              <span className="text-xs font-semibold text-indigo-900/60">/ngày</span>
            </>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
        <Button
          variant="soft"
          size="sm"
          className="mt-auto h-9 w-full rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-400 text-[18px] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] hover:brightness-105"
          onClick={(event) => {
            event.stopPropagation()
            onViewDetail(costume.id)
          }}
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  )
}
