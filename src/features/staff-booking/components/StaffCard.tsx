import { Heart, Star, BadgeCheck } from "lucide-react"
import { Link } from "react-router"

import { ImageWithFallback } from "@/features/staff-booking/mocks/ImageWithFallback"
import { cn } from "@/lib/utils"

interface StaffCardProps {
  id: number
  shopName: string | null
  bio: string | null
  avatarUrl?: string | null
  coverImageUrl?: string | null
  verified?: boolean
  description?: string | null
  totalRating?: number
  totalReviews?: number
}

export function StaffCard({
  id,
  shopName,
  bio,
  avatarUrl,
  coverImageUrl,
  verified,
  description,
  totalRating = 0,
  totalReviews = 0,
}: StaffCardProps) {
  const coverImage = coverImageUrl ?? ""
  const avatar = avatarUrl ?? ""
  const name = shopName ?? "Nhân sự sự kiện"
  const tag = description?.trim() ? `#${description.slice(0, 22)}` : "#STAFF"
  const reviewCount = Math.max(0, totalReviews)
  const avgRating =
    reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "–"
  const reviewLabel = `(${reviewCount})`

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.05rem] border-[4px] border-indigo-950 bg-[#fffbe8] shadow-[6px_6px_0_0_rgba(30,27,75,0.45)] transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(236,72,153,0.35)]"
      )}
    >
      <Link
        to={`/staffs/${id}`}
        className="block text-left outline-none focus-visible:ring-4 focus-visible:ring-pink-400 rounded-[calc(1.05rem-2px)]"
      >
        <div className="relative border-b-[4px] border-indigo-950">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-100 to-pink-100">
            <ImageWithFallback
              src={coverImage}
              alt={`Portfolio ${name}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-950/35 to-transparent opacity-80 transition group-hover:opacity-60"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute right-3 top-3 rounded-xl border-[3px] border-indigo-950 bg-[#fffbe8] p-2 text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:scale-105 hover:bg-pink-100"
            aria-label="Yêu thích"
          >
            <Heart className="h-4 w-4" />
          </button>

          {verified ? (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 rounded-lg border-[3px] border-indigo-950 bg-[#dbeafe] px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b]">
                <BadgeCheck className="h-3.5 w-3.5 text-sky-600" aria-hidden />
                Đã xác minh
              </span>
            </div>
          ) : null}
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-[3px] border-indigo-950 bg-white shadow-[3px_3px_0_0_#1e1b4b]">
              <ImageWithFallback src={avatar} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-extrabold text-indigo-950 group-hover:text-pink-600">
                {name}
              </h3>
              <p className="truncate text-xs font-semibold text-slate-600">
                {bio ?? "Nhân sự hỗ trợ Cosplay"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-lg border-[3px] border-indigo-950 bg-[#fef9c3] px-2 py-1 shadow-[3px_3px_0_0_#1e1b4b]">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden />
              <span className="text-xs font-extrabold text-amber-950">{avgRating}</span>
              <span className="text-[10px] font-semibold text-amber-800/75">{reviewLabel}</span>
            </div>
          </div>

          <p className="inline-flex w-fit max-w-full truncate rounded-full border-[2px] border-indigo-950 bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-900">
            {tag}
          </p>
        </div>
      </Link>
    </article>
  )
}
