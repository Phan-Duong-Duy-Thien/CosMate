import { Star, MessageCircle, Calendar, ShieldCheck, Instagram, Twitter, Globe, Loader2 } from "lucide-react"

import { ImageWithFallback } from "../mocks/ImageWithFallback"
import { cn } from "@/lib/utils"

interface ProfileSidebarProps {
  name: string
  title: string
  avatar: string
  rating: number | null
  reviewsCount: number
  jobs: number
  responseRate: string
  bio: string
  skills: string[]
  verified?: boolean
  chatLoading?: boolean
  onChat?: () => void
}

export function ProfileSidebar({
  name,
  title,
  avatar,
  rating,
  reviewsCount,
  jobs,
  responseRate,
  bio,
  skills,
  verified,
  chatLoading,
  onChat,
}: ProfileSidebarProps) {
  const bioText = bio?.trim() || ""
  const hasBio = bioText.length > 0

  return (
    <div className="w-full shrink-0 lg:w-[min(100%,380px)] xl:w-[400px]">
      <div className="sticky top-[88px] rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-6 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)] md:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="h-[128px] w-[128px] overflow-hidden rounded-full border-[4px] border-indigo-950 bg-white shadow-[6px_6px_0_0_#1e1b4b]">
              <ImageWithFallback src={avatar} alt={name} className="h-full w-full object-cover" />
            </div>
            {verified ? (
              <div
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-indigo-950 bg-sky-500 text-white shadow-[3px_3px_0_0_#1e1b4b]"
                title="Đã xác minh"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden />
              </div>
            ) : null}
          </div>

          <p className="mb-2 inline-flex rounded-full border-[2px] border-indigo-950 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-indigo-900">
            {title}
          </p>
          <h1 className="mb-4 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-violet-700 bg-clip-text text-2xl font-extrabold text-transparent md:text-[1.65rem]">
            「 {name} 」
          </h1>

          {reviewsCount > 0 && rating != null ? (
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-indigo-950">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden />
              <span>{rating.toFixed(1)}</span>
              <span className="font-semibold text-indigo-900/70">
                ({reviewsCount} đánh giá)
              </span>
            </div>
          ) : (
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-900/55">
              Chưa có đánh giá
            </p>
          )}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl border-[3px] border-indigo-950 bg-white p-3 text-center shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]">
            <div className="text-xl font-extrabold text-indigo-950 tabular-nums">{jobs}+</div>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wide text-indigo-800/70">
              Khách hàng
            </p>
          </div>
          <div className="rounded-xl border-[3px] border-indigo-950 bg-gradient-to-br from-violet-100 to-pink-100 p-3 text-center shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]">
            <div className="text-xl font-extrabold text-indigo-950">{responseRate}</div>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wide text-indigo-800/75">
              Phản hồi
            </p>
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 py-3.5 text-sm font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-400"
          >
            <Calendar className="h-5 w-5 shrink-0" aria-hidden />
            Đặt lịch ngay
          </button>
          <button
            type="button"
            onClick={onChat}
            disabled={chatLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-white py-3.5 text-sm font-extrabold text-indigo-950 shadow-[5px_5px_0_0_rgba(30,27,75,0.25)] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-400"
          >
            {chatLoading ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
            ) : (
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            )}
            Nhắn tin
          </button>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 inline-flex rounded-lg border-[2px] border-indigo-950/80 bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-950">
            Giới thiệu
          </h3>
          <p
            className={cn(
              "mt-3 rounded-xl border-[2px] border-dashed border-indigo-950/25 bg-white/80 p-3 text-sm font-semibold leading-relaxed text-indigo-950/90 shadow-[3px_3px_0_0_rgba(30,27,75,0.08)]",
              !hasBio && "italic text-indigo-900/50"
            )}
          >
            {hasBio ? bioText : "Chưa có phần giới thiệu. Hãy nhắn tin để được tư vấn thêm nhé!"}
          </p>
          {skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-lg border-[2px] border-indigo-950/40 bg-pink-50 px-2.5 py-1 text-xs font-extrabold text-pink-950"
                >
                  #{skill}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-center gap-3 border-t-[3px] border-dashed border-indigo-950/20 pt-6">
          <span
            className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border-[3px] border-indigo-950/30 bg-white/60 text-indigo-950/40 opacity-70"
            aria-label="Instagram (sắp có)"
            title="Sắp có"
          >
            <Instagram className="h-5 w-5" />
          </span>
          <span
            className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border-[3px] border-indigo-950/30 bg-white/60 text-indigo-950/40 opacity-70"
            aria-label="Twitter (sắp có)"
            title="Sắp có"
          >
            <Twitter className="h-5 w-5" />
          </span>
          <span
            className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border-[3px] border-indigo-950/30 bg-white/60 text-indigo-950/40 opacity-70"
            aria-label="Website (sắp có)"
            title="Sắp có"
          >
            <Globe className="h-5 w-5" />
          </span>
        </div>
      </div>
    </div>
  )
}
