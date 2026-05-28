/**
 * ServiceDetailPage — public chi tiết dịch vụ (/service/:serviceId)
 */
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  ImageIcon,
  MessageCircle,
  Loader2,
  Camera,
  Sparkles,
  BookOpen,
  ExternalLink,
} from "lucide-react"

import { useServiceDetail } from "../hooks/useServiceDetail"
import { useStartChat } from "@/features/chat/hooks/useStartChat"
import { cn } from "@/lib/utils"
import type { ServiceArea, ServiceItem } from "../types"
import { SERVICE_TYPE } from "../types"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.cosmate.site"

function resolveMediaUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${API_BASE}${url}`
}

function formatAreaChip(area: string | ServiceArea): string {
  if (typeof area === "string") return area
  return `${area.district}, ${area.city}`
}

function ServiceDetailSideRail({
  providerId,
  providerProfilePath,
}: {
  providerId: number
  providerProfilePath: string
}) {
  return (
    <aside
      aria-label="Gợi ý và liên kết"
      className="flex flex-col gap-4 lg:sticky lg:top-[88px]"
    >
      <div className="rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.3)]">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-indigo-900">
          Nhà cung cấp
        </p>
        <Link
          to={providerProfilePath}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-violet-300 to-fuchsia-400 py-3 text-xs font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] outline-none hover:brightness-105 focus-visible:ring-4 focus-visible:ring-pink-400"
        >
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
          Xem hồ sơ
        </Link>
      </div>

      <div className="rounded-xl border-[3px] border-dashed border-indigo-950/35 bg-white/85 p-4 text-xs font-semibold leading-relaxed text-indigo-950 shadow-[5px_5px_0_0_rgba(30,27,75,0.12)]">
        <span className="mb-2 inline-flex items-center gap-1 rounded-md border-[2px] border-amber-600 bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-950">
          <Sparkles className="h-3 w-3" aria-hidden />
          Mẹo
        </span>
        <p className="mt-2">
          Chat trực tiếp để hỏi lịch, concept và báo giá chi tiết trước khi đặt cọc.
        </p>
      </div>

      <div className="rounded-xl border-[3px] border-indigo-950 bg-white p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.25)]">
        <BookOpen className="h-5 w-5 text-violet-700" aria-hidden />
        <p className="mt-2 text-xs font-extrabold text-indigo-950">Quy định thuê dịch vụ</p>
        <Link
          to="/guidelines-rules"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg border-[2px] border-indigo-950 bg-[#fce7f3] px-3 py-2 text-[11px] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] hover:bg-pink-200"
        >
          Đọc hướng dẫn
        </Link>
      </div>

      <div className="rounded-xl border-[3px] border-indigo-950/40 bg-[#fffbeb]/80 p-3 text-[10px] font-bold uppercase tracking-wide text-indigo-800/70">
        Mã nhà cung cấp ·{" "}
        <span className="tabular-nums text-indigo-950">{providerId}</span>
      </div>
    </aside>
  )
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const id = serviceId ? Number(serviceId) : undefined

  const { service, loading, error } = useServiceDetail(id)
  const { startChat, loading: chatLoading } = useStartChat()

  if (loading) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] px-4">
        <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] px-10 py-12 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" aria-hidden />
          <p className="mt-4 text-center text-sm font-extrabold text-indigo-950">Đang tải dịch vụ…</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="home-anime flex min-h-screen flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] px-4">
        <div className="max-w-md rounded-[1.25rem] border-[4px] border-indigo-950/35 bg-[#fffbeb] px-8 py-10 text-center shadow-[8px_8px_0_0_rgba(30,27,75,0.25)]">
          <p className="font-extrabold text-indigo-950">{error ?? "Không tìm thấy dịch vụ."}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl border-[3px] border-indigo-950 bg-white px-5 py-2.5 text-sm font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] hover:bg-pink-50"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  const formatPrice = (): string => {
    const s = service as ServiceItem
    if (
      s.minPrice != null &&
      s.maxPrice != null &&
      s.minPrice > 0 &&
      s.maxPrice > 0
    ) {
      return `${s.minPrice.toLocaleString("vi-VN")} – ${s.maxPrice.toLocaleString("vi-VN")}đ`
    }
    if (s.pricePerSlot > 0) {
      return `${s.pricePerSlot.toLocaleString("vi-VN")}đ`
    }
    return "Liên hệ"
  }

  const formatDuration = (hours: number): string => {
    if (hours >= 8) return "Cả ngày"
    return `${hours} giờ`
  }

  const displayTitle =
    service.serviceName?.trim() || service.serviceType || "Chi tiết dịch vụ"

  const coverUrl =
    service.imageUrls?.[0] != null ? resolveMediaUrl(service.imageUrls[0]) : ""
  const extraImages =
    service.imageUrls && service.imageUrls.length > 1
      ? service.imageUrls.slice(1).map((u) => resolveMediaUrl(u))
      : []

  const providerProfilePath =
    service.serviceType === SERVICE_TYPE.EVENT_STAFF
      ? `/staffs/${service.providerId}`
      : `/photographer/${service.providerId}`

  const isActive = service.status === "ACTIVE"
  const chatUserId = service.userId > 0 ? service.userId : 0
  const chatDisabled = chatLoading || !chatUserId

  return (
    <div className="relative isolate min-h-screen overflow-x-clip pb-16 home-anime bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(55vh,480px)] opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(76, 29, 149, 0.09) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="relative z-[1] mx-auto w-full min-w-0 px-0 pt-4 sm:pt-6 lg:pb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] px-4 py-2 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] outline-none transition hover:bg-pink-100 focus-visible:ring-4 focus-visible:ring-pink-400"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Quay lại
        </button>

        <div className="lg:grid lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(232px,280px)] xl:items-start xl:gap-10">
          <article className="min-w-0 overflow-hidden rounded-[1.35rem] border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
            {coverUrl ? (
              <div className="relative h-[min(56vh,420px)] w-full border-b-[4px] border-indigo-950 bg-slate-200">
                <img
                  src={coverUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-950/55 via-transparent to-indigo-950/15"
                />
              </div>
            ) : (
              <div className="flex h-64 w-full items-center justify-center border-b-[4px] border-indigo-950 bg-gradient-to-br from-violet-100 to-pink-100 md:h-80">
                <ImageIcon className="h-20 w-20 text-indigo-900/20" aria-hidden />
              </div>
            )}

            <div className="space-y-6 p-5 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border-[2px] border-indigo-950/70 bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-indigo-950">
                    <Camera className="h-3 w-3 text-pink-600" aria-hidden />
                    {service.serviceType}
                  </div>
                  <h1 className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-violet-700 bg-clip-text text-xl font-extrabold text-transparent md:text-[1.85rem] md:leading-tight">
                    「 {displayTitle} 」
                  </h1>
                  <div className="mt-3 text-xl font-semibold leading-tight text-[#d61f91] md:text-2xl">
                    {formatPrice()}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                  <span
                    className={cn(
                      "rounded-lg border-[3px] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide shadow-[3px_3px_0_0_#1e1b4b]",
                      isActive
                        ? "border-emerald-800 bg-emerald-100 text-emerald-950"
                        : "border-red-800 bg-red-100 text-red-950"
                    )}
                  >
                    {isActive ? "Hoạt động" : service.status}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      chatUserId ? void startChat(chatUserId, displayTitle) : undefined
                    }
                    disabled={chatDisabled}
                    title={
                      chatDisabled && !chatLoading && !chatUserId
                        ? "Không thể nhắn tin — thiếu thông tin nhà cung cấp"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-2 text-xs font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {chatLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <MessageCircle className="h-4 w-4" aria-hidden />
                    )}
                    Nhắn tin
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="flex items-start gap-3 rounded-xl border-[3px] border-indigo-950 bg-white p-4 shadow-[5px_5px_0_0_rgba(30,27,75,0.18)]">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[2px] border-indigo-950 bg-[#fef9c3]">
                    <Clock className="h-5 w-5 text-violet-800" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-800/65">
                      Thời lượng mỗi slot
                    </p>
                    <p className="mt-1 font-extrabold text-indigo-950">
                      {formatDuration(service.slotDurationHours)}
                    </p>
                  </div>
                </div>

                {service.depositAmount != null && service.depositAmount > 0 ? (
                  <div className="flex items-start gap-3 rounded-xl border-[3px] border-indigo-950 bg-white p-4 shadow-[5px_5px_0_0_rgba(30,27,75,0.18)]">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[2px] border-indigo-950 bg-emerald-100">
                      <CheckCircle2 className="h-5 w-5 text-emerald-800" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-800/65">
                        Tiền đặt cọc
                      </p>
                      <p className="mt-1 font-extrabold text-indigo-950">
                        {service.depositAmount.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                ) : null}

                {service.equipmentDepreciationCost > 0 ? (
                  <div className="flex items-start gap-3 rounded-xl border-[3px] border-indigo-950 bg-white p-4 shadow-[5px_5px_0_0_rgba(30,27,75,0.18)] sm:col-span-2 xl:col-span-1">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[2px] border-indigo-950 bg-sky-100">
                      <CheckCircle2 className="h-5 w-5 text-sky-800" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-800/65">
                        Phí khấu hao thiết bị
                      </p>
                      <p className="mt-1 font-extrabold text-indigo-950">
                        {service.equipmentDepreciationCost.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {service.description ? (
                <section className="rounded-xl border-[3px] border-indigo-950/25 bg-white/90 p-4 shadow-[4px_4px_0_0_rgba(30,27,75,0.1)] md:p-5">
                  <h2 className="mb-2 inline-flex rounded-lg border-[2px] border-pink-500 bg-pink-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-pink-950">
                    Mô tả dịch vụ
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-indigo-950/90 whitespace-pre-wrap">
                    {service.description}
                  </p>
                </section>
              ) : null}

              {service.areas && service.areas.length > 0 ? (
                <section>
                  <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-indigo-950">
                    Khu vực hoạt động
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {service.areas.map((area, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-indigo-950 bg-[#fffbeb] px-3 py-1.5 text-xs font-bold text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.15)]"
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-pink-600" aria-hidden />
                        {formatAreaChip(area)}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              {extraImages.length > 0 ? (
                <section>
                  <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-indigo-950">
                    Thêm hình ảnh
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {extraImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-xl border-[3px] border-indigo-950 bg-slate-100 shadow-[4px_4px_0_0_#1e1b4b]"
                      >
                        <img
                          src={url}
                          alt={`Hình ${idx + 2}`}
                          className="h-full w-full object-cover transition hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </article>

          <div className="mt-8 min-w-0 xl:mt-0">
            <ServiceDetailSideRail
              providerId={service.providerId}
              providerProfilePath={providerProfilePath}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
