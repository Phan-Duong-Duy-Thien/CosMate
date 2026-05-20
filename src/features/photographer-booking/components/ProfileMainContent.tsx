import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Loader2,
  Star,
  Clock,
  CheckCircle2,
  ChevronRight,
  Camera,
  ShieldCheck,
  MapPin,
  ImageIcon,
  Sparkles,
} from "lucide-react"

import type { PortfolioImage } from "../types"
import { usePublicProviderServices } from "@/features/service/hooks/usePublicProviderServices"
import type { ServiceItem } from "@/features/service/types"
import { usePhotographerPublicReviews } from "../hooks/usePhotographerPublicReviews"
import { ProviderReplyBlock } from "@/shared/components/ProviderReplyBlock"
import {
  getReviewReviewerInitial,
  getReviewReviewerName,
  resolveReviewAvatarUrl,
} from "@/shared/utils/reviewDisplay"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.cosmate.site"

function resolveMediaUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${API_BASE}${url}`
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })
}

interface ProfileMainContentProps {
  portfolioItems: PortfolioImage[]
  providerId: number | undefined
}

const tabs = ["Gói dịch vụ", "Đánh giá", "Điều khoản"] as const

export const ProfileMainContent: React.FC<ProfileMainContentProps> = ({
  portfolioItems,
  providerId,
}) => {
  const showPortfolioStrip = portfolioItems.length > 0
  const navigate = useNavigate()
  const { services: apiServices, loading: servicesLoading, error: servicesError } =
    usePublicProviderServices(providerId)
  const { reviews: providerReviews, loading: reviewsLoading, error: reviewsError } =
    usePhotographerPublicReviews(providerId)

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Gói dịch vụ")

  const reviewStats = useMemo(() => {
    const n = providerReviews.length
    if (n === 0) {
      return { avg: 0, total: 0, dist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number> }
    }
    const sum = providerReviews.reduce((s, r) => s + (r.rating ?? 0), 0)
    const avg = Math.round((sum / n) * 10) / 10
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    for (const r of providerReviews) {
      const k = Math.min(5, Math.max(1, Math.round(Number(r.rating))))
      dist[k] = (dist[k] ?? 0) + 1
    }
    return { avg, total: n, dist }
  }, [providerReviews])

  const formatPrice = (item: ServiceItem): string => {
    if (item.minPrice != null && item.maxPrice != null && item.minPrice > 0 && item.maxPrice > 0) {
      return `${item.minPrice.toLocaleString("vi-VN")} – ${item.maxPrice.toLocaleString("vi-VN")}đ`
    }
    if (item.pricePerSlot > 0) {
      return `${item.pricePerSlot.toLocaleString("vi-VN")}đ`
    }
    return "Liên hệ"
  }

  const formatDuration = (hours: number): string => {
    if (hours >= 8) return "Cả ngày"
    return `${hours} giờ`
  }

  const handleViewDetail = (serviceId: number) => {
    navigate(`/service/${serviceId}`, {
      state: { providerType: "photographer", providerId },
    })
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="sticky top-[84px] z-20 mb-8 rounded-[1.1rem] border-[4px] border-indigo-950 bg-[#fffbeb]/95 px-2 py-2 shadow-[6px_6px_0_0_rgba(30,27,75,0.28)] backdrop-blur-sm md:px-4">
        <div
          role="tablist"
          aria-label="Nội dung hồ sơ"
          className="flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "shrink-0 rounded-xl border-[3px] px-4 py-2.5 text-xs font-extrabold transition sm:text-sm",
                  selected
                    ? "border-indigo-950 bg-gradient-to-br from-pink-200 to-amber-100 text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] ring-2 ring-pink-400/70"
                    : "border-indigo-950/40 bg-white/90 text-indigo-900/75 hover:border-indigo-950 hover:bg-white"
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative min-h-[280px]">
        {activeTab === "Gói dịch vụ" && (
          <div id="photographer-services">
            {servicesLoading && (
              <div className="flex flex-col items-center justify-center rounded-[1.2rem] border-[4px] border-indigo-950 bg-[#fffbeb] py-16 shadow-[8px_8px_0_0_rgba(30,27,75,0.25)]">
                <Loader2 className="h-10 w-10 animate-spin text-pink-600" aria-hidden />
                <p className="mt-3 text-sm font-extrabold text-indigo-950">Đang tải gói dịch vụ…</p>
              </div>
            )}
            {!servicesLoading && servicesError && (
              <div className="rounded-[1.2rem] border-[4px] border-red-700/35 bg-red-50 px-6 py-10 text-center text-sm font-semibold text-red-800 shadow-[6px_6px_0_0_rgba(127,29,29,0.2)]">
                {servicesError}
              </div>
            )}
            {!servicesLoading && !servicesError && apiServices.length === 0 && (
              <div className="flex flex-col items-center rounded-[1.25rem] border-[4px] border-dashed border-indigo-950/35 bg-gradient-to-b from-white to-pink-50/50 px-8 py-14 text-center shadow-[8px_8px_0_0_rgba(30,27,75,0.15)]">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-violet-100 shadow-[5px_5px_0_0_#1e1b4b]">
                  <ImageIcon className="h-8 w-8 text-violet-700" aria-hidden />
                </span>
                <p className="mt-5 text-base font-extrabold text-indigo-950">
                  Nhà cung cấp này chưa có dịch vụ nào
                </p>
                <p className="mt-2 max-w-md text-sm font-semibold text-indigo-900/70">
                  Quay lại sau hoặc nhắn tin trực tiếp để hỏi lịch và báo giá.
                </p>
              </div>
            )}
            {!servicesLoading && !servicesError && apiServices.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {apiServices.map((service) => {
                  const img = service.imageUrls?.[0]
                    ? resolveMediaUrl(service.imageUrls[0])
                    : ""
                  return (
                    <article
                      key={service.id}
                      className="group flex flex-col overflow-hidden rounded-[1.05rem] border-[4px] border-indigo-950 bg-[#fffbe8] shadow-[6px_6px_0_0_rgba(30,27,75,0.4)] transition hover:-translate-y-1 hover:shadow-[9px_9px_0_0_rgba(236,72,153,0.35)]"
                    >
                      {img ? (
                        <div className="h-44 w-full shrink-0 overflow-hidden border-b-[4px] border-indigo-950 bg-slate-100">
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center border-b-[4px] border-indigo-950 bg-gradient-to-br from-violet-100 to-pink-100">
                          <ImageIcon className="h-14 w-14 text-indigo-900/25" aria-hidden />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div>
                          <h3 className="font-extrabold text-indigo-950">
                            {service.serviceName || service.serviceType}
                          </h3>
                          <div className="mt-1 text-lg font-extrabold text-[#d61f91]">
                            {formatPrice(service)}
                          </div>
                        </div>
                        <div className="flex-1 space-y-2 text-xs font-semibold text-indigo-900/85">
                          {service.description ? (
                            <p className="line-clamp-2">{service.description}</p>
                          ) : null}
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-violet-700" />
                            <span>
                              Thời lượng:{" "}
                              <span className="font-extrabold text-indigo-950">
                                {formatDuration(service.slotDurationHours)}
                              </span>
                            </span>
                          </div>
                          {service.depositAmount != null && service.depositAmount > 0 ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span>
                                Đặt cọc:{" "}
                                <span className="font-extrabold text-indigo-950">
                                  {service.depositAmount.toLocaleString("vi-VN")}đ
                                </span>
                              </span>
                            </div>
                          ) : null}
                          {service.areas && service.areas.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-pink-600" />
                              <span className="line-clamp-1">{service.areas[0]}</span>
                            </div>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleViewDetail(service.id)}
                          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-400 py-2.5 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:brightness-105"
                        >
                          Xem chi tiết dịch vụ
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
            {showPortfolioStrip ? (
              <div className="mt-10 rounded-[1.15rem] border-[3px] border-indigo-950/35 bg-[#fffbeb]/90 p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.18)] md:p-5">
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wide text-indigo-900">
                  Tham khảo phong cách (ảnh mẫu)
                </p>
                <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
                  {portfolioItems.map((p) => (
                    <figure
                      key={p.id}
                      className="w-[min(200px,70vw)] shrink-0 overflow-hidden rounded-xl border-[3px] border-indigo-950 bg-white shadow-[4px_4px_0_0_#1e1b4b]"
                    >
                      <img
                        src={p.url}
                        alt={p.title}
                        className="aspect-[4/3] h-32 w-full object-cover sm:h-36"
                      />
                      <figcaption className="truncate border-t-[2px] border-indigo-950/15 bg-[#fffbeb] px-2 py-1.5 text-[10px] font-extrabold text-indigo-950">
                        {p.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === "Điều khoản" && (
          <div className="space-y-6 rounded-[1.2rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-6 shadow-[8px_8px_0_0_rgba(30,27,75,0.3)] md:p-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-white shadow-[3px_3px_0_0_#1e1b4b]">
                <ShieldCheck className="h-5 w-5 text-violet-700" aria-hidden />
              </span>
              <h2 className="text-xl font-extrabold text-indigo-950">Điều khoản &amp; chính sách</h2>
            </div>
            <section className="rounded-xl border-[3px] border-indigo-950/15 bg-white/80 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-extrabold text-indigo-950">
                <Sparkles className="h-4 w-4 text-pink-500" aria-hidden />
                Đặt cọc &amp; hủy lịch
              </h3>
              <p className="text-sm font-semibold leading-relaxed text-indigo-900/85">
                Yêu cầu đặt cọc để xác nhận lịch chụp. Nếu hủy lịch trước 48 giờ, bạn có thể được hỗ trợ
                dời lịch một lần theo thỏa thuận với photographer.
              </p>
            </section>
            <section className="rounded-xl border-[3px] border-indigo-950/15 bg-white/80 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-extrabold text-indigo-950">
                <Camera className="h-4 w-4 text-sky-600" aria-hidden />
                Quyền sử dụng hình ảnh
              </h3>
              <p className="text-sm font-semibold leading-relaxed text-indigo-900/85">
                Ảnh thường dùng cho mục đích cá nhân và đăng mạng xã hội. Thuê thương mại cần thỏa
                thuận riêng.
              </p>
            </section>
          </div>
        )}

        {activeTab === "Đánh giá" && (
          <div className="space-y-6">
            {reviewsLoading && (
              <div className="flex flex-col items-center justify-center rounded-[1.2rem] border-[4px] border-indigo-950 bg-[#fffbeb] py-16 shadow-[8px_8px_0_0_rgba(30,27,75,0.25)]">
                <Loader2 className="h-10 w-10 animate-spin text-pink-600" aria-hidden />
                <p className="mt-3 text-sm font-extrabold text-indigo-950">Đang tải đánh giá…</p>
              </div>
            )}
            {!reviewsLoading && reviewsError && (
              <div className="rounded-[1.2rem] border-[4px] border-red-700/35 bg-red-50 px-6 py-8 text-center text-sm font-semibold text-red-800 shadow-[6px_6px_0_0_rgba(127,29,29,0.2)]">
                {reviewsError}
              </div>
            )}
            {!reviewsLoading && !reviewsError && providerReviews.length === 0 && (
              <div className="rounded-[1.2rem] border-[4px] border-dashed border-indigo-950/35 bg-white/90 px-8 py-12 text-center shadow-[6px_6px_0_0_rgba(30,27,75,0.12)]">
                <Star className="mx-auto h-10 w-10 text-amber-300" aria-hidden />
                <p className="mt-4 text-base font-extrabold text-indigo-950">Chưa có đánh giá nào</p>
                <p className="mt-2 text-sm font-semibold text-indigo-900/65">
                  Hãy là người đầu tiên chia sẻ trải nghiệm sau buổi chụp.
                </p>
              </div>
            )}
            {!reviewsLoading && !reviewsError && providerReviews.length > 0 && (
              <>
                <div className="flex flex-col gap-6 rounded-[1.15rem] border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-white to-violet-50 p-6 shadow-[8px_8px_0_0_rgba(30,27,75,0.28)] md:flex-row md:items-center md:gap-10 md:p-8">
                  <div className="text-center md:min-w-[140px]">
                    <div className="text-5xl font-extrabold text-indigo-950">
                      {reviewStats.avg.toFixed(1)}
                    </div>
                    <div className="mt-2 flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "h-4 w-4",
                            s <= Math.round(reviewStats.avg)
                              ? "fill-amber-400 text-amber-500"
                              : "text-slate-300"
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wide text-indigo-800/60">
                      {reviewStats.total} đánh giá
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewStats.dist[rating] ?? 0
                      const pct =
                        reviewStats.total > 0 ? Math.round((count / reviewStats.total) * 100) : 0
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="w-4 text-xs font-extrabold text-indigo-950">{rating}</span>
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full border-2 border-indigo-950/20 bg-white">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {providerReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-[1.05rem] border-[3px] border-indigo-950 bg-white p-5 shadow-[5px_5px_0_0_rgba(30,27,75,0.22)] md:p-6"
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-indigo-950 bg-[#fffbeb] text-sm font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
                          {getReviewReviewerInitial(
                            getReviewReviewerName(review, VI.provider.reviews.detailReviewerFallback)
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-indigo-950">
                            {getReviewReviewerName(review, VI.provider.reviews.detailReviewerFallback)}
                          </h4>
                          <div className="mt-0.5 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  "h-3 w-3",
                                  s <= review.rating
                                    ? "fill-amber-400 text-amber-500"
                                    : "text-slate-300"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-indigo-950/90 whitespace-pre-wrap">
                      {review.comment}
                    </p>
                    {review.images && review.images.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {review.images.map((img) => (
                          <img
                            key={img.id}
                            src={resolveMediaUrl(img.url)}
                            alt=""
                            className="h-20 w-20 rounded-xl border-[3px] border-indigo-950 object-cover shadow-[3px_3px_0_0_rgba(30,27,75,0.2)]"
                          />
                        ))}
                      </div>
                    ) : null}
                    <ProviderReplyBlock
                      providerReply={review.providerReply}
                      repliedAt={review.repliedAt}
                      variant="indigo"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

