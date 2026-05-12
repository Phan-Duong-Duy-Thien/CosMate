import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Spin } from "antd"
import { Bell, ArrowLeft } from "lucide-react"
import { useNotifications } from "@/features/notification/hooks/useNotifications"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"
import { isAuthenticated } from "@/features/auth/utils/authStorage"

function formatSendAt(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Vừa xong"
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    WALLET_CREDIT: "Nạp tiền",
    ORDER_STATUS: "Đơn hàng",
    REMINDER: "Nhắc nhở",
    SYSTEM: "Hệ thống",
  }
  return map[type] ?? "Thông báo"
}

function getTypeColor(type: string): string {
  const map: Record<string, string> = {
    WALLET_CREDIT: "#22c55e",
    ORDER_STATUS: "#8b5cf6",
    REMINDER: "#f59e0b",
    SYSTEM: "#64748b",
  }
  return map[type] ?? "#64748b"
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, loading, refetch, markNotificationRead, markAllRead } = useNotifications()
  const loggedIn = isAuthenticated()

  if (!loggedIn) {
    return (
      <section className="home-anime min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
        <div className="mx-auto flex max-w-lg items-center justify-center pt-16 text-center md:pt-24">
          <div className="w-full rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-8 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
            <div className="mb-5 flex justify-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-white shadow-[5px_5px_0_0_#1e1b4b]">
                <Bell className="h-8 w-8 text-indigo-800" aria-hidden />
              </span>
            </div>
            <p className="text-sm text-slate-500">Vui lòng đăng nhập để xem thông báo.</p>
            <Button className="mt-4" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm transition-colors hover:bg-pink-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
          {notifications.some((n) => !n.isRead) && (
            <button
              type="button"
              onClick={markAllRead}
              className="ml-auto rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600 transition-colors hover:bg-pink-100"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* Content */}
        <div className="rounded-3xl border border-white/80 bg-white/80 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin size="large" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Bell className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-base font-medium text-slate-500">{VI.notification.empty}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={async () => {
                    if (!n.isRead) {
                      await markNotificationRead(n.id)
                    }
                  }}
                  className={`flex cursor-pointer items-start gap-3 px-5 py-4 transition-colors hover:bg-pink-50 ${
                    !n.isRead ? "bg-pink-50/50" : ""
                  }`}
                >
                  {/* Type dot */}
                  <div
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: getTypeColor(n.type) }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-snug ${
                          n.isRead ? "font-medium text-slate-600" : "font-semibold text-slate-900"
                        }`}
                      >
                        {n.header}
                      </p>
                      {!n.isRead && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-pink-400" />
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400 line-clamp-2">
                      {n.content}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                        style={{ backgroundColor: `${getTypeColor(n.type)}15`, color: getTypeColor(n.type) }}
                      >
                        {getTypeLabel(n.type)}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatSendAt(n.sendAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
