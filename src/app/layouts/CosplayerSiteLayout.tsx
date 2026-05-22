import * as React from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import {
  Bell,
  BookOpen,
  Camera,
  Facebook,
  Home,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shirt,
  ShoppingCart,
  Heart,
  Smartphone,
  Sparkles,
  FileText,
  UserRound,
  Youtube,
} from "lucide-react"
import { Button as AntButton, Dropdown, Avatar, Popover, Spin, Tooltip, Modal } from "antd"
import { DeleteOutlined } from "@ant-design/icons"

import { Breadcrumbs } from "@shared/components/Breadcrumbs"
import { useBreadcrumb } from "@/app/providers/BreadcrumbProvider"
import { buildCheckoutFlowBreadcrumbs, isFromCheckoutFlow } from "@/features/order/utils/checkoutNavigation"
import { useUserProfile } from "@/app/providers/UserProfileProvider"
import { getUserId, getRoles } from "@/features/auth/services/tokenStorage"
import { getRedirectPath } from "@/features/auth/utils/roleRedirect"
import { getUserProfile } from "@/features/admin/services/adminUsers.service"
import { useNotifications } from "@/features/notification/hooks/useNotifications"
import {
  showNotificationActionToast,
  showNotificationDetailToast,
} from "@/features/notification/utils/showNotificationToast"
import { useChatPopup } from "@/features/chat/components/ChatPopupContext"
import { useUnreadCount } from "@/features/chat/hooks/useUnreadCount"
import { VI } from "@/shared/i18n/vi"
import { SearchBar } from "@/features/search/components/SearchBar"
import { cn } from "@/lib/utils"
import { SITE_HEADER_UI } from "@/app/constants/homeAnimeUi"
import { isAuthenticated, clearAuth } from "@/features/auth/utils/authStorage"
import { ChangePasswordModal } from "@/features/profile/components/ChangePasswordModal"
import ghnLogo from "@/assets/ghn.jpg"
import siteLogo from "@/assets/cosmate.png"
import type { MenuProps } from 'antd'

function computeInitials(fullName: string | null): string {
  if (!fullName) return "U"
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export default function CosplayerSiteLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { items, setItems } = useBreadcrumb()
  const { userProfile, setUserProfile } = useUserProfile()
  const { openChat } = useChatPopup()

  const isHomePage = location.pathname === "/" || location.pathname === "/home"

  /** Một cột nội dung chung (giống /costumes): max-width + lề hai bên — trừ homepage. */
  const siteContentShellClass =
    "mx-auto w-full min-w-0 max-w-screen-2xl px-4 md:px-6 xl:px-8"

  const loggedIn = isAuthenticated()
  const { notifications, loading: notifLoading, unreadCount, markNotificationRead, markAllRead, deleteNotification } = useNotifications()
  const userId = getUserId()
  const { unreadCount: chatUnreadCount } = useUnreadCount(userId ?? null)

  React.useEffect(() => {
    if (!loggedIn) return

    const roles = getRoles() as import("@/types/auth").UserRole[]
    if (roles.length === 0) return

    const correctPath = getRedirectPath(roles)
    if (correctPath === "/") return

    // Allow non-cosplayer users to browse costume/service pages without redirecting
    const publicBrowsePaths = [
      "/costumes",
      "/photographers",
      "/staffs",
      "/service",
      "/photographer/",
    ]
    const isPublicBrowsePath = publicBrowsePaths.some((p) => location.pathname.startsWith(p))
    if (isPublicBrowsePath) return

    console.log("[CosplayerSiteLayout] User role is not COSPLAYER, redirecting to:", correctPath)
    navigate(correctPath, { replace: true })
  }, [loggedIn, navigate, location.pathname])

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!loggedIn) return

      const userId = getUserId()
      if (!userId) return

      // Skip only when we already have a user photo (fullName alone is not enough)
      if (userProfile.avatarUrl) return

      try {
        const profile = await getUserProfile(userId)
        if (profile.avatarUrl || profile.fullName) {
          setUserProfile({
            avatarUrl: profile.avatarUrl ?? null,
            fullName: profile.fullName ?? null,
          })
        }
      } catch {
        // Silently fail on 403 or other errors - don't crash the layout
      }
    }

    fetchProfile()
  }, [loggedIn, userProfile.avatarUrl, setUserProfile])

  React.useEffect(() => {
    const path = location.pathname
    const fromCheckout = isFromCheckoutFlow(location.search)

    if (path === "/") {
      setItems([])
    } else if (path === "/costumes") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.costumes },
      ])
    } else if (path.startsWith("/costumes/") && !path.includes("/checkout")) {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.costumes, to: "/costumes" },
        { label: "Đang tải..." },
      ])
    } else if (path === "/rent/checkout") {
      setItems(buildCheckoutFlowBreadcrumbs())
    } else if (path === "/profile/addresses/new" && fromCheckout) {
      setItems(buildCheckoutFlowBreadcrumbs([{ label: VI.common.breadcrumb.addAddress }]))
    } else if (path.startsWith("/profile/addresses")) {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.profile, to: "/profile" },
        {
          label: path.includes("new")
            ? VI.common.breadcrumb.addAddress
            : VI.common.breadcrumb.addresses,
        },
      ])
    } else if (path === "/profile/wallet/topup" && fromCheckout) {
      setItems(buildCheckoutFlowBreadcrumbs([{ label: VI.wallet.topUpTitle }]))
    } else if (path === "/photographers") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.photographers },
      ])
    } else if (path.startsWith("/photographer/")) {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.photographers, to: "/photographers" },
        { label: VI.common.breadcrumb.photographerProfile },
      ])
    } else if (path === "/staffs") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.staffs },
      ])
    } else if (path.startsWith("/staffs/") && path !== "/staffs") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.staffs, to: "/staffs" },
        { label: VI.common.breadcrumb.staffProfile },
      ])
    } else if (path.startsWith("/service/")) {
      const state = location.state as { providerType?: string; providerId?: number } | null
      if (state?.providerType === 'staff' && state?.providerId) {
        setItems([
          { label: VI.common.breadcrumb.home, to: "/" },
          { label: VI.common.breadcrumb.staffs, to: "/staffs" },
          { label: VI.common.breadcrumb.staffProfile, to: `/staffs/${state.providerId}` },
          { label: VI.common.breadcrumb.serviceDetailFromProfile },
        ])
      } else if (state?.providerType === 'photographer' && state?.providerId) {
        setItems([
          { label: VI.common.breadcrumb.home, to: "/" },
          { label: VI.common.breadcrumb.photographers, to: "/photographers" },
          { label: VI.common.breadcrumb.photographerProfile, to: `/photographer/${state.providerId}` },
          { label: VI.common.breadcrumb.serviceDetailFromProfile },
        ])
      } else {
        setItems([
          { label: VI.common.breadcrumb.home, to: "/" },
          { label: VI.common.breadcrumb.photographers, to: "/photographers" },
          { label: VI.common.breadcrumb.serviceDetail },
        ])
      }
    } else if (path === "/style-quiz") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: "Quiz" },
      ])
    } else if (path === "/pose-battle") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: "Pose Battle" },
      ])
    } else if (path === "/notifications") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.notification.title },
      ])
    } else if (path === "/profile") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.profile },
      ])
    } else if (path === "/profile/purchase-history") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.profile, to: "/profile" },
        { label: VI.profile.orders.title },
      ])
    } else if (path === "/profile/token") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.profile, to: "/profile" },
        { label: VI.profile.token.hubTitle },
      ])
    } else if (path === "/profile/wallet") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.profile, to: "/profile" },
        { label: "Ví của tôi" },
      ])
    } else if (path === "/profile/wallet/withdraw") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.profile, to: "/profile" },
        { label: "Ví của tôi", to: "/profile/wallet" },
        { label: VI.wallet.withdrawTitle },
      ])
    } else if (path === "/wishlist") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: "Wishlist" },
      ])
    } else if (path === "/login" || path.startsWith("/register")) {
      setItems([])
    }
  }, [location.pathname, location.search, setItems])

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
    window.location.reload()
  }

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: "Trang cá nhân", onClick: () => navigate("/profile") },
    { key: "change-password", label: VI.auth.changePassword.title, onClick: () => setChangePasswordOpen(true) },
    { key: "logout", label: "Đăng xuất", danger: true, onClick: handleLogout },
  ]

  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false)
  const [notifOpen, setNotifOpen] = React.useState(false)

  const notifPopoverContent = (
    <div className="w-[320px] rounded-xl bg-card text-card-foreground shadow-lg ring-1 ring-border/80">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="m-0 text-sm font-semibold text-foreground">{VI.notification.title}</p>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() =>
              void (async () => {
                const ok = await markAllRead()
                showNotificationActionToast("readAll", ok)
              })()
            }
            className="border-0 bg-transparent p-0 text-xs font-medium text-cosmate-pink hover:underline"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>
      <div className="max-h-[360px] overflow-y-auto">
        {notifLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spin size="small" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">{VI.notification.empty}</div>
        ) : (
          <>
            {notifications.slice(0, 10).map((n) => {
              const openDetailToast = () => {
                const followLink =
                  n.link?.trim()
                    ? () => {
                        const link = n.link!.trim()
                        if (link.startsWith("http")) {
                          window.open(link, "_blank", "noopener,noreferrer")
                        } else {
                          navigate(link.startsWith("/") ? link : `/${link}`)
                        }
                      }
                    : undefined
                showNotificationDetailToast(n, { onViewLink: followLink })
              }

              const handleActivate = async () => {
                if (!n.isRead) {
                  await markNotificationRead(n.id)
                }
                openDetailToast()
              }

              return (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault()
                    void handleActivate()
                  }
                }}
                onClick={() => void handleActivate()}
                className="cursor-pointer border-b border-border/60 px-4 py-2.5 transition-colors last:border-b-0 hover:bg-accent"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p
                      className={`m-0 text-sm ${n.isRead ? "font-normal text-muted-foreground" : "font-semibold text-foreground"}`}
                    >
                      {n.header}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.content}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Xóa thông báo"
                    onClick={(e) => {
                      e.stopPropagation()
                      Modal.confirm({
                        title: "Xóa thông báo này?",
                        okText: VI.common.actions.delete,
                        cancelText: VI.common.actions.cancel,
                        okButtonProps: { danger: true },
                        onOk: async () => {
                          const ok = await deleteNotification(n.id)
                          showNotificationActionToast("delete", ok)
                        },
                      })
                    }}
                    className="cursor-pointer border-0 bg-transparent p-0.5 leading-none text-muted-foreground hover:text-foreground"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
              )
            })}
          </>
        )}
      </div>
      {notifications.length > 0 && (
        <div
          className="cursor-pointer border-t border-border px-4 py-2.5 text-center text-sm font-medium text-cosmate-pink hover:underline"
          onClick={() => {
            navigate("/notifications")
            setNotifOpen(false)
          }}
        >
          {VI.notification.viewAll}
        </div>
      )}
    </div>
  )

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-foreground">
      {/* Site-wide soft gradient + dot-grid background (replaces curtain image) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_0%,#fff7fb_0%,#fdf2f8_36%,#eef2ff_72%,#f8fafc_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(76, 29, 149, 0.085) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <header
        className={cn(
          SITE_HEADER_UI.shell,
          isScrolled && SITE_HEADER_UI.shellScrolled
        )}
      >
        <div className={SITE_HEADER_UI.inner}>
          <Link
            to="/"
            aria-label="Về trang chủ"
            className={SITE_HEADER_UI.logoLink}
          >
            <img src={siteLogo} alt="CosMate" className={SITE_HEADER_UI.logoImg} />
          </Link>

          <nav className={SITE_HEADER_UI.nav}>
            <Tooltip title="Trang chủ">
              <button
                type="button"
                aria-label="Trang chủ"
                className={cn(
                  SITE_HEADER_UI.navBtn,
                  isHomePage ? SITE_HEADER_UI.navBtnActive : SITE_HEADER_UI.navBtnIdle
                )}
                onClick={() => navigate("/")}
              >
                <Home className={SITE_HEADER_UI.navIcon} />
              </button>
            </Tooltip>

            <Tooltip title="Thuê đồ Cosplay">
              <button
                type="button"
                aria-label="Thuê đồ Cosplay"
                className={cn(
                  SITE_HEADER_UI.navBtn,
                  location.pathname.startsWith("/costumes")
                    ? SITE_HEADER_UI.navBtnActive
                    : SITE_HEADER_UI.navBtnIdle
                )}
                onClick={() => navigate("/costumes")}
              >
                <Shirt className={SITE_HEADER_UI.navIcon} />
              </button>
            </Tooltip>

            <Tooltip title="Quiz">
              <button
                type="button"
                aria-label="Quiz"
                className={cn(
                  SITE_HEADER_UI.navBtn,
                  location.pathname === "/style-quiz"
                    ? SITE_HEADER_UI.navBtnActive
                    : SITE_HEADER_UI.navBtnIdle
                )}
                onClick={() => navigate("/style-quiz")}
              >
                <FileText className={SITE_HEADER_UI.navIcon} />
              </button>
            </Tooltip>

            <Tooltip title="Pose Battle">
              <button
                type="button"
                aria-label="Pose Battle"
                className={cn(
                  SITE_HEADER_UI.navBtn,
                  location.pathname === "/pose-battle"
                    ? SITE_HEADER_UI.navBtnActive
                    : SITE_HEADER_UI.navBtnIdle
                )}
                onClick={() => navigate("/pose-battle")}
              >
                <Sparkles className={SITE_HEADER_UI.navIcon} />
              </button>
            </Tooltip>

            <Tooltip title="Hướng dẫn & Quy định">
              <button
                type="button"
                aria-label="Hướng dẫn và Quy định"
                className={cn(
                  SITE_HEADER_UI.navBtn,
                  location.pathname === "/guidelines-rules"
                    ? SITE_HEADER_UI.navBtnActive
                    : SITE_HEADER_UI.navBtnIdle
                )}
                onClick={() => navigate("/guidelines-rules")}
              >
                <BookOpen className={SITE_HEADER_UI.navIcon} />
              </button>
            </Tooltip>

            <Tooltip title="Thuê Photographer">
              <button
                type="button"
                aria-label="Thuê Photographer"
                className={cn(
                  SITE_HEADER_UI.navBtn,
                  location.pathname === "/photographers"
                    ? SITE_HEADER_UI.navBtnActive
                    : SITE_HEADER_UI.navBtnIdle
                )}
                onClick={() => navigate("/photographers")}
              >
                <Camera className={SITE_HEADER_UI.navIcon} />
              </button>
            </Tooltip>

            <Tooltip title="Thuê Staff">
              <button
                type="button"
                aria-label="Thuê Staff"
                className={cn(
                  SITE_HEADER_UI.navBtn,
                  location.pathname === "/staffs"
                    ? SITE_HEADER_UI.navBtnActive
                    : SITE_HEADER_UI.navBtnIdle
                )}
                onClick={() => navigate("/staffs")}
              >
                <UserRound className={SITE_HEADER_UI.navIcon} />
              </button>
            </Tooltip>
          </nav>

          <div className={SITE_HEADER_UI.actions}>
            <SearchBar className={SITE_HEADER_UI.searchWrap} />

            {loggedIn && (
              <>
                <button
                  type="button"
                  aria-label="Tin nhắn"
                  className={SITE_HEADER_UI.iconBtn}
                  onClick={() => openChat(0, 0)}
                >
                  <MessageCircle className={SITE_HEADER_UI.actionIcon} />
                  {chatUnreadCount > 0 && (
                    <span className={SITE_HEADER_UI.unreadBadge}>
                      {chatUnreadCount > 9 ? "9+" : chatUnreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  aria-label="Giỏ hàng"
                  className={SITE_HEADER_UI.iconBtn}
                  onClick={() => navigate('/profile/purchase-history')}
                >
                  <ShoppingCart className={SITE_HEADER_UI.actionIcon} />
                  <span className={SITE_HEADER_UI.cartDot} />
                </button>

                <Tooltip title="Wishlist">
                  <button
                    type="button"
                    aria-label="Wishlist"
                    className={SITE_HEADER_UI.iconBtn}
                    onClick={() => navigate('/wishlist')}
                  >
                    <Heart className={SITE_HEADER_UI.actionIcon} />
                  </button>
                </Tooltip>

                <Popover
                  content={notifPopoverContent}
                  trigger="click"
                  open={notifOpen}
                  onOpenChange={setNotifOpen}
                  placement="bottomRight"
                  arrow={false}
                >
                  <button
                    type="button"
                    aria-label="Thông báo"
                    className={SITE_HEADER_UI.iconBtn}
                  >
                    <Bell className={SITE_HEADER_UI.actionIcon} />
                    {unreadCount > 0 && (
                      <span className={SITE_HEADER_UI.unreadBadge}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </Popover>
              </>
            )}

            {loggedIn ? (
              <Dropdown 
                menu={{ items: userMenuItems }} 
                placement="bottomRight" 
                trigger={["click"]} 
                styles={{ root: { zIndex: 9999 } }}
              >
                <div className={SITE_HEADER_UI.avatarWrap}>
                  {userProfile.avatarUrl ? (
                    <Avatar
                      size={40}
                      src={userProfile.avatarUrl}
                      className={SITE_HEADER_UI.avatar}
                    />
                  ) : (
                    <Avatar
                      size={40}
                      className={cn(SITE_HEADER_UI.avatar, "!bg-cosmate-pink !text-white")}
                    >
                      {computeInitials(userProfile.fullName)}
                    </Avatar>
                  )}
                </div>
              </Dropdown>
            ) : (
              <>
                <AntButton className={SITE_HEADER_UI.authLogin} onClick={() => navigate("/login")}>
                  Đăng nhập
                </AntButton>
                <AntButton className={SITE_HEADER_UI.authRegister} onClick={() => navigate("/register")}>
                  Đăng ký
                </AntButton>
              </>
            )}

          </div>
        </div>
      </header>

      <main className={cn("min-w-0 flex-1", SITE_HEADER_UI.mainOffset)}>
        {!isHomePage && items.length > 0 && (
          <div className={cn(siteContentShellClass, "pt-6 pb-2")}>
            <Breadcrumbs items={items} />
          </div>
        )}
        {isHomePage ? (
          <div className="relative isolate">
            {/* Dot grid + tint across full main width (not limited by max-w column) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] bg-[#fff7fb]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(76, 29, 149, 0.085) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2] bg-white/12 backdrop-blur-[1px]"
            />

            {/* Wide column on large screens so side margins feel less empty (no side-banner grid) */}
            <div className="relative z-10 mx-auto w-full min-w-0 max-w-[min(1800px,100%)] px-3 pb-3 pt-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
              <div className="min-w-0">
                <Outlet />
              </div>
            </div>
          </div>
        ) : (
          <div className={siteContentShellClass}>
            <div className="min-w-0">
              <Outlet />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-pink-100/90 text-slate-700">
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          <div className="grid items-start gap-8 md:grid-cols-12">
            <div className="space-y-4 self-start md:col-span-5">
              <div className="text-3xl font-bold text-pink-600">CosMate</div>

              <p className="max-w-md text-sm leading-6 text-slate-600">
                Nền tảng thuê đồ cosplay uy tín. Kết nối cosplayer và nhà cung cấp
                đáng tin cậy. Mọi giao dịch minh bạch, an toàn và sẵn sàng cho mọi lễ hội.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://www.instagram.com/tnhideyansu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full bg-pink-200 p-2 transition hover:bg-pink-300"
                >
                  <Instagram className="h-4 w-4 text-pink-700" />
                </a>

                <a
                  href="https://www.facebook.com/konanachan13"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="rounded-full bg-pink-200 p-2 transition hover:bg-pink-300"
                >
                  <Facebook className="h-4 w-4 text-pink-700" />
                </a>

                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Youtube"
                  className="rounded-full bg-pink-200 p-2 transition hover:bg-pink-300"
                >
                  <Youtube className="h-4 w-4 text-pink-700" />
                </a>

                <button
                  type="button"
                  aria-label="Mobile App"
                  className="rounded-full bg-pink-200 p-2 transition hover:bg-pink-300"
                >
                  <Smartphone className="h-4 w-4 text-pink-700" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 items-start gap-5 md:col-span-7">
              <div className="space-y-3 self-start">
                <h3 className="text-base font-semibold leading-none text-slate-800">Dịch vụ</h3>

                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link to="/costumes" className="transition-colors hover:text-pink-600">
                      Thuê trang phục
                    </Link>
                  </li>
                  <li>
                    <Link to="/photographers" className="transition-colors hover:text-pink-600">
                      Combo Photoshoot
                    </Link>
                  </li>
                  <li>
                    <Link to="/staffs" className="transition-colors hover:text-pink-600">
                      Thuê Staff
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 self-start">
                <h3 className="text-base font-semibold leading-none text-slate-800">
                  Hướng dẫn &amp; Quy định
                </h3>

                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link
                      to="/guidelines-rules?type=rental&view=guide"
                      className="transition-colors hover:text-pink-600"
                    >
                      Quy trình thuê đồ cosplay
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/guidelines-rules?type=photographer&view=guide"
                      className="transition-colors hover:text-pink-600"
                    >
                      Quy trình thuê Photographer
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/guidelines-rules?type=staff&view=guide"
                      className="transition-colors hover:text-pink-600"
                    >
                      Quy trình thuê Staff
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/guidelines-rules?type=refund&view=guide"
                      className="transition-colors hover:text-pink-600"
                    >
                      Chính sách đổi/trả/hoàn
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/guidelines-rules?type=dispute&view=guide"
                      className="transition-colors hover:text-pink-600"
                    >
                      Tranh chấp &amp; khiếu nại
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 self-start">
                <h3 className="text-base font-semibold leading-none text-slate-800">Liên hệ</h3>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-[2px] h-4 w-4 text-pink-600" />
                    <span>Vinhomes Grand Park, Q9, Thủ Đức</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="mt-[2px] h-4 w-4 text-pink-600" />
                    <span>0902 888 222</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="mt-[2px] h-4 w-4 text-pink-600" />
                    <span>cosplaystore@cosmate.vn</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3">
                  <p className="text-sm font-medium text-slate-700">Đơn vị giao hàng</p>

                  <div className="flex items-center gap-2">
                    <img src={ghnLogo} alt="GiaoHangNhanh" className="h-6 w-auto rounded" />
                    <span className="text-sm text-slate-600">GiaoHangNhanh</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <p className="text-sm font-medium text-slate-700">Hình thức thanh toán</p>

                  <p className="text-sm text-slate-600">Ví • MoMo • VNPay</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-300/60" />

        <div className="py-4 text-center text-xs text-slate-500">
          © 2026 CosMate. All rights reserved.
        </div>
      </footer>
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  )
}
