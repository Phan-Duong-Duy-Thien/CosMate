import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "antd"
import {
  Bell,
  ArrowLeft,
  Loader2,
  Trash2,
  Mail,
  MailOpen,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Shirt,
  BookOpen,
} from "lucide-react"
import { useNotifications } from "@/features/notification/hooks/useNotifications"
import { useChatPopup } from "@/features/chat/components/ChatPopupContext"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"
import { isAuthenticated } from "@/features/auth/utils/authStorage"
import { cn } from "@/lib/utils"
import type { NotificationItem } from "@/features/notification/types"
import mascotQuiz from "@/assets/mascot-quiz.png"
import mascotSearch from "@/assets/mascot-search.png"

const railPanel =
  "rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] shadow-[6px_6px_0_0_rgba(30,27,75,0.32)] outline-none transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_rgba(30,27,75,0.22)] focus-visible:ring-4 focus-visible:ring-pink-400"

function NotificationsRailLeft() {
  const navigate = useNavigate()
  return (
    <aside className="flex flex-col gap-4" aria-label="Gợi ý và khuyến mãi">
      <button
        type="button"
        onClick={() => navigate("/style-quiz")}
        className={cn(railPanel, "group w-full overflow-hidden text-left")}
      >
        <div className="relative h-36 w-full shrink-0 border-b-[3px] border-indigo-950 bg-indigo-950 md:h-40">
          <img
            src={mascotQuiz}
            alt=""
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/35 to-transparent" />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md border-2 border-white/90 bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur-sm">
            <Sparkles className="h-3 w-3" aria-hidden />
            {VI.notification.railQuizBadge}
          </span>
        </div>
        <div className="space-y-2 p-3">
          <p className="text-sm font-extrabold leading-snug text-indigo-950">
            {VI.notification.railQuizTitle}
          </p>
          <span className="inline-flex rounded-lg border-[2px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-[3px_3px_0_0_#1e1b4b]">
            {VI.notification.railQuizCta}
          </span>
        </div>
      </button>

      <div className={cn(railPanel, "p-3.5")}>
        <p className="inline-flex items-center gap-1 rounded-md border-2 border-amber-600 bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-950">
          <Sparkles className="h-3 w-3" aria-hidden />
          {VI.notification.railTipsBadge}
        </p>
        <p className="mt-2 text-sm font-extrabold text-indigo-950">{VI.notification.railTipsTitle}</p>
        <p className="mt-1.5 text-xs font-semibold leading-relaxed text-indigo-900/85">
          {VI.notification.railTipsBody}
        </p>
      </div>
    </aside>
  )
}

function NotificationsRailRight() {
  const navigate = useNavigate()
  const { openChat } = useChatPopup()
  return (
    <aside className="flex flex-col gap-4" aria-label="Tiện ích nhanh">
      <button
        type="button"
        onClick={() => navigate("/costumes")}
        className={cn(railPanel, "group w-full overflow-hidden text-left")}
      >
        <div className="relative h-36 w-full border-b-[3px] border-indigo-950 bg-violet-900 md:h-40">
          <img
            src={mascotSearch}
            alt=""
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-fuchsia-900/25 to-transparent" />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md border-2 border-white/90 bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur-sm">
            <Shirt className="h-3 w-3" aria-hidden />
            {VI.notification.railShopBadge}
          </span>
        </div>
        <div className="space-y-2 p-3">
          <p className="text-sm font-extrabold leading-snug text-indigo-950">
            {VI.notification.railShopTitle}
          </p>
          <span className="inline-flex rounded-lg border-[2px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-400 px-2.5 py-1 text-[11px] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
            {VI.notification.railShopCta}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => openChat(0, 0)}
        className={cn(railPanel, "w-full p-3.5 text-left")}
      >
        <p className="inline-flex items-center gap-1 rounded-md border-2 border-sky-700 bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-sky-950">
          <MessageCircle className="h-3 w-3" aria-hidden />
          {VI.notification.railChatBadge}
        </p>
        <p className="mt-2 text-sm font-extrabold text-indigo-950">{VI.notification.railChatTitle}</p>
        <p className="mt-1.5 text-xs font-semibold text-indigo-900/85">{VI.notification.railChatBody}</p>
        <span className="mt-3 inline-flex rounded-lg border-[2px] border-indigo-950 bg-white px-2.5 py-1 text-[11px] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
          {VI.notification.railChatCta}
        </span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/guidelines-rules")}
        className={cn(railPanel, "w-full p-3.5 text-left")}
      >
        <p className="inline-flex items-center gap-1 rounded-md border-2 border-violet-700 bg-violet-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-violet-950">
          <BookOpen className="h-3 w-3" aria-hidden />
          {VI.notification.railHelpBadge}
        </p>
        <p className="mt-2 text-sm font-extrabold text-indigo-950">{VI.notification.railHelpTitle}</p>
        <p className="mt-1.5 text-xs font-semibold text-indigo-900/85">{VI.notification.railHelpBody}</p>
        <span className="mt-3 inline-flex rounded-lg border-[2px] border-indigo-950 bg-[#fce7f3] px-2.5 py-1 text-[11px] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
          {VI.notification.railHelpCta}
        </span>
      </button>
    </aside>
  )
}

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
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    WALLET_CREDIT: "Nạp tiền",
    ORDER_STATUS: "Đơn hàng",
    REMINDER: "Nhắc nhở",
    SYSTEM: "Hệ thống",
    CHAT: "Tin nhắn",
    MESSAGE: "Tin nhắn",
    NEW_MESSAGE: "Tin nhắn",
  }
  return map[type] ?? "Thông báo"
}

const MESSAGE_NOTIFICATION_TYPES = new Set(["CHAT", "MESSAGE", "NEW_MESSAGE"])

function isMessageNotification(n: { type: string; header: string }): boolean {
  if (MESSAGE_NOTIFICATION_TYPES.has(n.type)) return true
  const h = n.header.toLowerCase()
  return (
    h.includes("tin nhắn") || h.includes("gửi tin") || h.includes("tin nhắn cho bạn")
  )
}

function isOrderNotification(n: { type: string }): boolean {
  return n.type === "ORDER_STATUS"
}

type NotificationListTab = "unread" | "read" | "orders" | "messages"

function typeBadgeClasses(type: string): string {
  const map: Record<string, string> = {
    WALLET_CREDIT: "border-emerald-700 bg-emerald-100 text-emerald-950",
    ORDER_STATUS: "border-violet-700 bg-violet-100 text-violet-950",
    REMINDER: "border-amber-700 bg-amber-100 text-amber-950",
    SYSTEM: "border-slate-600 bg-slate-100 text-slate-900",
    CHAT: "border-sky-700 bg-sky-100 text-sky-950",
    MESSAGE: "border-sky-700 bg-sky-100 text-sky-950",
    NEW_MESSAGE: "border-sky-700 bg-sky-100 text-sky-950",
  }
  return map[type] ?? "border-pink-600 bg-pink-100 text-pink-950"
}

type ParsedContent =
  | { mode: "text"; text: string }
  | { mode: "image-only"; url: string }
  | { mode: "text-with-image"; text: string; imageUrl: string }

function isProbablyImageUrl(raw: string): boolean {
  const path = raw.split("?")[0].toLowerCase()
  if (/\.(jpe?g|png|gif|webp|avif|bmp)(\?|$)/.test(path)) return true
  if (path.includes("storage.googleapis.com")) return true
  if (path.includes("firebase") || path.includes("googleusercontent")) return true
  return false
}

function parseNotificationContent(content: string): ParsedContent {
  const trimmed = content.trim()
  const tokens = trimmed.split(/\s+/).filter(Boolean)

  if (tokens.length === 1 && /^https?:\/\//i.test(trimmed)) {
    if (isProbablyImageUrl(trimmed)) {
      return { mode: "image-only", url: trimmed }
    }
    try {
      const u = new URL(trimmed)
      const short =
        `${u.hostname}${u.pathname.length > 36 ? `${u.pathname.slice(0, 34)}…` : u.pathname}` +
        (u.search ? "…" : "")
      return { mode: "text", text: short || trimmed }
    } catch {
      return { mode: "text", text: trimmed.slice(0, 120) + (trimmed.length > 120 ? "…" : "") }
    }
  }

  const urlMatch = content.match(/https?:\/\/[^\s<>]+/)
  if (urlMatch?.[0] && isProbablyImageUrl(urlMatch[0])) {
    const imageUrl = urlMatch[0]
    const rest = content.replace(imageUrl, "").trim()
    return {
      mode: "text-with-image",
      text: rest,
      imageUrl,
    }
  }

  return { mode: "text", text: content }
}

function shortenGenericUrl(content: string): string {
  const trimmed = content.trim()
  if (tokensSingleUrl(trimmed)) {
    try {
      const u = new URL(trimmed)
      const path = u.pathname.length > 40 ? `${u.pathname.slice(0, 38)}…` : u.pathname
      return `${u.hostname}${path}` || trimmed
    } catch {
      return trimmed.slice(0, 100) + (trimmed.length > 100 ? "…" : "")
    }
  }
  return content
}

function tokensSingleUrl(s: string): boolean {
  return /^https?:\/\//i.test(s) && s.split(/\s+/).filter(Boolean).length === 1
}

function NotificationContentPreview({
  content,
}: {
  content: string
}) {
  const parsed = parseNotificationContent(content)

  const imgClass =
    "max-h-36 w-full max-w-xs rounded-lg border-[3px] border-indigo-950 object-cover shadow-[4px_4px_0_0_#1e1b4b]"

  if (parsed.mode === "image-only") {
    return (
      <div className="mt-3">
        <p className="mb-2 inline-flex items-center rounded-md border-2 border-indigo-950/80 bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-indigo-900">
          Ảnh đính kèm
        </p>
        <div className="overflow-hidden rounded-xl">
          <img
            src={parsed.url}
            alt=""
            className={imgClass}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const el = e.currentTarget
              el.style.display = "none"
            }}
          />
        </div>
      </div>
    )
  }

  if (parsed.mode === "text-with-image") {
    return (
      <div className="mt-3 space-y-2">
        {parsed.text ? (
          <p className="text-xs font-semibold leading-relaxed text-indigo-950/90 line-clamp-3">
            {parsed.text}
          </p>
        ) : (
          <p className="text-xs font-semibold italic text-slate-500">Tin nhắn kèm ảnh</p>
        )}
        <img
          src={parsed.imageUrl}
          alt=""
          className={imgClass}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      </div>
    )
  }

  const body =
    parsed.text && tokensSingleUrl(parsed.text.trim())
      ? shortenGenericUrl(parsed.text)
      : parsed.text

  return (
    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600 line-clamp-3">{body}</p>
  )
}

function filterNotificationsByTab(
  list: NotificationItem[],
  tab: NotificationListTab
): NotificationItem[] {
  let out: NotificationItem[]
  switch (tab) {
    case "unread":
      out = list.filter((n) => !n.isRead)
      break
    case "read":
      out = list.filter((n) => n.isRead)
      break
    case "orders":
      out = list.filter((n) => isOrderNotification(n))
      break
    case "messages":
      out = list.filter((n) => isMessageNotification(n))
      break
  }
  return [...out].sort(
    (a, b) => new Date(b.sendAt).getTime() - new Date(a.sendAt).getTime()
  )
}

function tabCounts(list: NotificationItem[]) {
  return {
    unread: list.filter((n) => !n.isRead).length,
    read: list.filter((n) => n.isRead).length,
    orders: list.filter((n) => isOrderNotification(n)).length,
    messages: list.filter((n) => isMessageNotification(n)).length,
  }
}

function NotificationRow({
  item: n,
  onOpen,
  onDeleteRequest,
}: {
  item: NotificationItem
  onOpen: (n: NotificationItem) => void
  onDeleteRequest: (id: number) => void
}) {
  return (
    <li>
      <article
        role="button"
        tabIndex={0}
        onClick={() => void onOpen(n)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            void onOpen(n)
          }
        }}
        className={cn(
          "relative cursor-pointer rounded-xl border-[3px] border-indigo-950 bg-white p-4 text-left shadow-[5px_5px_0_0_rgba(30,27,75,0.28)] outline-none transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_rgba(236,72,153,0.35)] focus-visible:ring-4 focus-visible:ring-pink-400",
          !n.isRead && "border-pink-500 bg-gradient-to-br from-pink-50/90 to-[#fffbeb]"
        )}
      >
        <div className="flex gap-3">
          <span
            className={cn(
              "mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-indigo-950 shadow-sm",
              n.isRead ? "bg-slate-300" : "bg-gradient-to-br from-pink-500 to-fuchsia-600"
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p
                className={cn(
                  "text-sm leading-snug text-indigo-950",
                  n.isRead ? "font-semibold opacity-85" : "font-extrabold"
                )}
              >
                {n.header}
              </p>
              {!n.isRead && (
                <span className="shrink-0 rounded-md border-[2px] border-pink-600 bg-pink-500 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[2px_2px_0_0_#1e1b4b]">
                  Mới
                </span>
              )}
            </div>
            <NotificationContentPreview content={n.content} />
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t-[2px] border-dashed border-indigo-950/15 pt-3">
              <span
                className={cn(
                  "rounded-lg border-[2px] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                  typeBadgeClasses(n.type)
                )}
              >
                {getTypeLabel(n.type)}
              </span>
              <time dateTime={n.sendAt} className="text-[11px] font-bold text-slate-500">
                {formatSendAt(n.sendAt)}
              </time>
              {n.link ? (
                <span className="text-[11px] font-semibold text-sky-700"> · Có liên kết</span>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteRequest(n.id)
                }}
                className="ml-auto inline-flex items-center rounded-lg border-[2px] border-indigo-950 bg-[#fffbeb] p-2 text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] outline-none transition hover:bg-red-50 hover:text-red-600 focus-visible:ring-4 focus-visible:ring-pink-400"
                aria-label="Xóa thông báo"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </article>
    </li>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, loading, markNotificationRead, markAllRead, deleteNotification } =
    useNotifications()
  const loggedIn = isAuthenticated()

  const [listTab, setListTab] = React.useState<NotificationListTab>("unread")

  const counts = React.useMemo(() => tabCounts(notifications), [notifications])
  const filtered = React.useMemo(
    () => filterNotificationsByTab(notifications, listTab),
    [notifications, listTab]
  )

  const filterTabs = React.useMemo(
    () =>
      [
        {
          id: "unread" as const,
          label: VI.notification.filterUnread,
          icon: Mail,
          count: counts.unread,
        },
        {
          id: "read" as const,
          label: VI.notification.filterRead,
          icon: MailOpen,
          count: counts.read,
        },
        {
          id: "orders" as const,
          label: VI.notification.filterOrders,
          icon: ShoppingBag,
          count: counts.orders,
        },
        {
          id: "messages" as const,
          label: VI.notification.filterMessages,
          icon: MessageCircle,
          count: counts.messages,
        },
      ],
    [counts.messages, counts.orders, counts.read, counts.unread]
  )

  const tabInitRef = React.useRef(false)
  React.useEffect(() => {
    if (loading || notifications.length === 0) return
    if (tabInitRef.current) return
    tabInitRef.current = true
    if (counts.unread > 0) setListTab("unread")
    else if (counts.messages > 0) setListTab("messages")
    else if (counts.orders > 0) setListTab("orders")
    else setListTab("read")
  }, [
    counts.unread,
    counts.messages,
    counts.orders,
    counts.read,
    loading,
    notifications.length,
  ])

  const handleOpenNotification = React.useCallback(
    async (n: { id: number; isRead: boolean; link?: string }) => {
      if (!n.isRead) {
        await markNotificationRead(n.id)
      }
      if (!n.link) return
      if (n.link.startsWith("http")) {
        window.open(n.link, "_blank", "noopener,noreferrer")
      } else {
        navigate(n.link.startsWith("/") ? n.link : `/${n.link}`)
      }
    },
    [markNotificationRead, navigate]
  )

  const requestDelete = React.useCallback(
    (id: number) => {
      Modal.confirm({
        title: "Xóa thông báo này?",
        okText: VI.common.actions.delete,
        cancelText: VI.common.actions.cancel,
        okButtonProps: { danger: true },
        onOk: () => void deleteNotification(id),
      })
    },
    [deleteNotification]
  )

  if (!loggedIn) {
    return (
      <section className="home-anime min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
        <div className="mx-auto flex max-w-lg items-center justify-center px-4 pt-16 text-center md:pt-24">
          <div className="w-full rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-8 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
            <div className="mb-5 flex justify-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-white shadow-[5px_5px_0_0_#1e1b4b]">
                <Bell className="h-8 w-8 text-indigo-800" aria-hidden />
              </span>
            </div>
            <p className="text-sm font-semibold text-indigo-950/90">
              Vui lòng đăng nhập để xem thông báo.
            </p>
            <Button
              className="mt-6 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b]"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative isolate min-h-screen overflow-x-clip pb-24 home-anime bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]">
      {/* Nền chấm + sọc full màn để hai bên layout không còn “trơn” */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -z-10 w-screen opacity-85 [margin-inline:calc(50%-50vw)] bg-[linear-gradient(90deg,#fff7fb_0%,#fce7f3_22%,#fff7fb_50%,#e0e7ff_78%,#f8fafc_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -z-10 w-screen [margin-inline:calc(50%-50vw)] opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(76, 29, 149, 0.1) 1px, transparent 1px)",
          backgroundSize: "13px 13px",
        }}
      />

      <div className="relative z-[1] w-full min-w-0 pt-2 md:pt-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)_minmax(0,240px)] lg:items-start lg:gap-4 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,280px)] xl:gap-5 2xl:grid-cols-[minmax(0,310px)_minmax(0,1fr)_minmax(0,310px)] 2xl:gap-6">
          <div className="relative hidden min-w-0 lg:block">
            {/* Trang trí — chấm / thanh pastel để hai bên bớt trơn */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-10 -left-2 w-[110%] rounded-2xl border-y-[3px] border-indigo-950/15 bg-[repeating-linear-gradient(-12deg,#fdf2f8_0,#fdf2f8_10px,#fce7f3_10px,#fce7f3_20px)] opacity-85"
            />
            <div className="sticky top-[88px] z-[1]">
              <NotificationsRailLeft />
            </div>
          </div>

          <div className="min-w-0 lg:py-1">
            <div className="relative">
              {/* Viền mềm tách nhẹ khỏi rail khi có 3 cột */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-4 -top-4 bottom-8 hidden rounded-[1.5rem] border-[3px] border-dashed border-indigo-950/12 bg-white/35 lg:block"
              />
              <div className="relative z-[1]">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] outline-none transition hover:bg-pink-100 focus-visible:ring-4 focus-visible:ring-pink-400"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="flex flex-wrap items-center gap-2 text-xl font-extrabold leading-tight text-indigo-950 md:text-[1.65rem]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-[3px] border-indigo-950 bg-gradient-to-br from-amber-300 to-pink-500 text-white shadow-[3px_3px_0_0_#1e1b4b]">
                <Bell className="h-4 w-4" aria-hidden />
              </span>
              <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                「 {VI.notification.title} 」
              </span>
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-800/70">
              {notifications.length} mục
              {!loading && unreadCountBadge(notifications)}
            </p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="shrink-0 rounded-xl border-[3px] border-indigo-950 bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:bg-teal-200"
            >
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,288px)_minmax(0,1fr)] xl:gap-8 2xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          <aside className="mb-6 min-w-0 lg:sticky lg:top-[88px] lg:mb-0">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-indigo-800/75">
              {VI.notification.filterLabel}
            </p>
            <nav
              aria-label={VI.notification.filterLabel}
              className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {filterTabs.map((t) => {
                const Icon = t.icon
                const active = listTab === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setListTab(t.id)}
                    className={cn(
                      "flex min-w-[9.75rem] shrink-0 items-center justify-between gap-2 rounded-xl border-[3px] px-3 py-2.5 text-left shadow-[4px_4px_0_0_rgba(30,27,75,0.28)] outline-none transition lg:min-w-0 lg:w-full",
                      active
                        ? "border-indigo-950 bg-gradient-to-br from-pink-200 to-amber-100 text-indigo-950 shadow-[6px_6px_0_0_#1e1b4b]"
                        : "border-indigo-950/60 bg-[#fffbeb]/95 text-indigo-900 hover:border-indigo-950 hover:bg-white",
                      active && "ring-2 ring-pink-400/80"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-indigo-950 bg-white shadow-[2px_2px_0_0_#1e1b4b]",
                          active && "bg-pink-100"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      </span>
                      <span className="min-w-0 truncate text-xs font-extrabold">{t.label}</span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex min-w-[1.5rem] justify-center rounded-md border-[2px] border-indigo-950 px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums",
                        active ? "bg-white" : "bg-white/70"
                      )}
                    >
                      {t.count}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-5 hidden rounded-xl border-[3px] border-dashed border-indigo-950/25 bg-white/60 p-4 text-xs font-semibold leading-relaxed text-indigo-900/80 shadow-[4px_4px_0_0_rgba(30,27,75,0.12)] lg:block">
              {VI.notification.filterHintSidebar}
            </div>
          </aside>

          <div className="min-w-0 rounded-[1.2rem] border-[4px] border-indigo-950 bg-[#fffbeb]/90 p-3 shadow-[8px_8px_0_0_rgba(30,27,75,0.32)] backdrop-blur-sm md:p-4">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-16">
                <Loader2 className="h-10 w-10 animate-spin text-pink-600" aria-hidden />
                <span className="text-sm font-extrabold text-indigo-950">
                  {VI.common.status.loading}
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-pink-100 shadow-[5px_5px_0_0_#1e1b4b]">
                  <Bell className="h-8 w-8 text-pink-500" aria-hidden />
                </span>
                <p className="mt-5 text-base font-extrabold text-indigo-950">{VI.notification.empty}</p>
                <Button
                  variant="soft"
                  className="mt-6 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-400 font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b]"
                  onClick={() => navigate("/")}
                >
                  Về trang chủ
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-14 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-violet-100 shadow-[5px_5px_0_0_#1e1b4b]">
                  <Mail className="h-7 w-7 text-violet-700" aria-hidden />
                </span>
                <p className="mt-4 text-base font-extrabold text-indigo-950">
                  {VI.notification.emptyInFilter}
                </p>
                <p className="mt-2 max-w-sm text-sm font-semibold text-slate-600">
                  {VI.notification.filterEmptyHintMobile}
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {filtered.map((n) => (
                  <NotificationRow
                    key={n.id}
                    item={n}
                    onOpen={handleOpenNotification}
                    onDeleteRequest={requestDelete}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
              </div>
            </div>
          </div>

          <div className="relative hidden min-w-0 lg:block">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-10 -right-2 w-[110%] rounded-2xl border-y-[3px] border-indigo-950/15 bg-[repeating-linear-gradient(12deg,#eff6ff_0,#eff6ff_10px,#e0e7ff_10px,#e0e7ff_20px)] opacity-90"
            />
            <div className="sticky top-[88px] z-[1]">
              <NotificationsRailRight />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function unreadCountBadge(list: { isRead: boolean }[]): React.ReactNode {
  const unread = list.filter((n) => !n.isRead).length
  if (unread === 0) return null
  return (
    <>
      {" "}
      · <span className="text-pink-600">{unread} chưa đọc</span>
    </>
  )
}
