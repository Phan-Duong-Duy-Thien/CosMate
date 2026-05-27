import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell,
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
import { useNotificationInteractions } from "@/features/notification/hooks/useNotificationInteractions"
import { useChatPopup } from "@/features/chat/components/ChatPopupContext"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"
import { isAuthenticated } from "@/features/auth/utils/authStorage"
import { cn } from "@/lib/utils"
import type { NotificationItem } from "@/features/notification/types"
import { NotificationContentPreview } from "@/features/notification/components/NotificationContentPreview"
import {
  type CosplayerNotificationTab,
  cosplayerTabCounts,
  cosplayerTypeBadgeClasses,
  filterCosplayerNotificationsByTab,
  formatSendAt,
  getTypeLabel,
  pickInitialCosplayerTab,
  unreadCountLabel,
} from "@/features/notification/utils/notificationList"

const quickLinkCard =
  "flex flex-col gap-1 rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] p-3 text-left shadow-[4px_4px_0_0_rgba(30,27,75,0.28)] outline-none transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(30,27,75,0.22)] focus-visible:ring-4 focus-visible:ring-pink-400 sm:p-3.5"

function NotificationsQuickLinks() {
  const navigate = useNavigate()
  const { openChat } = useChatPopup()
  return (
    <div className="mt-8 border-t-[3px] border-dashed border-indigo-950/25 pt-8">
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-indigo-800/75">
        {VI.notification.quickLinksTitle}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/style-quiz")}
          className={quickLinkCard}
        >
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-pink-700">
            <Sparkles className="h-3 w-3" aria-hidden />
            {VI.notification.railQuizBadge}
          </span>
          <span className="text-sm font-extrabold text-indigo-950">{VI.notification.railQuizTitle}</span>
          <span className="text-[11px] font-bold text-cosmate-pink">{VI.notification.railQuizCta} →</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/costumes")}
          className={quickLinkCard}
        >
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-violet-800">
            <Shirt className="h-3 w-3" aria-hidden />
            {VI.notification.railShopBadge}
          </span>
          <span className="text-sm font-extrabold text-indigo-950">{VI.notification.railShopTitle}</span>
          <span className="text-[11px] font-bold text-indigo-900">{VI.notification.railShopCta} →</span>
        </button>
        <button type="button" onClick={() => openChat(0, 0)} className={quickLinkCard}>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-sky-800">
            <MessageCircle className="h-3 w-3" aria-hidden />
            {VI.notification.railChatBadge}
          </span>
          <span className="text-sm font-extrabold text-indigo-950">{VI.notification.railChatTitle}</span>
          <span className="text-[11px] font-semibold text-indigo-900/85 line-clamp-2">
            {VI.notification.railChatBody}
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/guidelines-rules")}
          className={quickLinkCard}
        >
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-violet-800">
            <BookOpen className="h-3 w-3" aria-hidden />
            {VI.notification.railHelpBadge}
          </span>
          <span className="text-sm font-extrabold text-indigo-950">{VI.notification.railHelpTitle}</span>
          <span className="text-[11px] font-semibold text-indigo-900/85 line-clamp-2">
            {VI.notification.railHelpBody}
          </span>
        </button>
      </div>
      <p className="mt-4 rounded-xl border-[2px] border-indigo-950/30 bg-amber-50/80 px-3 py-2 text-xs font-semibold text-indigo-900/90">
        <Sparkles className="mb-0.5 mr-1 inline h-3.5 w-3.5 text-amber-700" aria-hidden />
        {VI.notification.railTipsTitle}: {VI.notification.railTipsBody}
      </p>
    </div>
  )
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
            <NotificationContentPreview content={n.content} variant="cosplayer" />
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t-2 border-indigo-950/10 pt-3">
              <span
                className={cn(
                  "rounded-lg border-[2px] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                  cosplayerTypeBadgeClasses(n.type)
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
  const { handleOpenNotification, requestDelete, markAllWithToast } =
    useNotificationInteractions({
      markNotificationRead,
      markAllRead,
      deleteNotification,
    })
  const loggedIn = isAuthenticated()

  const [listTab, setListTab] = React.useState<CosplayerNotificationTab>("unread")

  const counts = React.useMemo(() => cosplayerTabCounts(notifications), [notifications])
  const filtered = React.useMemo(
    () => filterCosplayerNotificationsByTab(notifications, listTab),
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
    setListTab(pickInitialCosplayerTab(counts))
  }, [counts, loading, notifications.length])

  if (!loggedIn) {
    return (
      <section className="home-anime min-h-screen bg-transparent pb-20">
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

  const unread = unreadCountLabel(notifications)

  return (
    <section className="relative min-h-screen overflow-x-clip pb-24 home-anime bg-transparent">
      <div className="relative z-[1] mx-auto w-full max-w-5xl min-w-0 px-4 pt-2 md:px-5 md:pt-4">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="max-w-4xl text-balance text-[1.35rem] font-extrabold leading-tight tracking-tight text-indigo-950 md:text-2xl lg:text-3xl">
              <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {VI.notification.pageDecorTitle}
              </span>
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-800/70">
              {notifications.length} mục
              {!loading && unread > 0 && (
                <>
                  {" "}
                  · <span className="text-pink-600">{unread} chưa đọc</span>
                </>
              )}
            </p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              type="button"
              onClick={() => void markAllWithToast()}
              className="shrink-0 rounded-xl border-[3px] border-indigo-950 bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:bg-teal-200"
            >
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb]/95 p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.32)] md:p-5">
          <div className="lg:grid lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)] xl:gap-8">
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
                          : "border-indigo-950/60 bg-white/90 text-indigo-900 hover:border-indigo-950 hover:bg-white",
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

              <div className="mt-5 rounded-xl border-[3px] border-indigo-950/80 bg-white/80 p-4 text-xs font-semibold leading-relaxed text-indigo-900/85 shadow-[3px_3px_0_0_rgba(30,27,75,0.18)]">
                {VI.notification.filterHintSidebar}
              </div>
            </aside>

            <div className="min-w-0 rounded-xl border-[3px] border-indigo-950/40 bg-white/60 p-3 backdrop-blur-sm md:p-4">
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

          <NotificationsQuickLinks />
        </div>
      </div>
    </section>
  )
}
