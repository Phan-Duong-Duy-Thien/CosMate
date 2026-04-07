import * as React from "react"
import { Link, Outlet, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import {
  Bell,
  Camera,
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShoppingCart,
  Youtube,
  Smartphone,
} from "lucide-react"
import { Button as AntButton, Dropdown, Avatar, Popover, Spin } from "antd"

import { Breadcrumbs } from "@shared/components/Breadcrumbs"
import { Button } from "@shared/components/Button"
import { DropdownMenu } from "@shared/components/DropdownMenu"
import { Input } from "@shared/components/Input"
import { useBreadcrumb } from "@/app/providers/BreadcrumbProvider"
import { useUserProfile } from "@/app/providers/UserProfileProvider"
import { getUserId, getRoles } from "@/features/auth/services/tokenStorage"
import { getRedirectPath } from "@/features/auth/utils/roleRedirect"
import { getUserProfile } from "@/features/admin/services/adminUsers.service"
import { useNotifications } from "@/features/notification/hooks/useNotifications"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"
import { isAuthenticated, clearAuth } from "@/features/auth/utils/authStorage"
import bgImage from "@/assets/background.jpg"
import sideBannerImage1 from "@/assets/anh1.jpg"
import sideBannerImage2 from "@/assets/quiz1.jpg"
import sideBannerImage3 from "@/assets/quiz2.jpg"
import sideBannerImage4 from "@/assets/quiz3.jpg"
import ghnLogo from "@/assets/ghn.jpg"

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [bannerIndex, setBannerIndex] = React.useState(0)

  const bannerImages = [sideBannerImage1, sideBannerImage2, sideBannerImage3, sideBannerImage4]

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [bannerImages.length])

  const searchValue = searchParams.get("q") ?? ""

  const { items, setItems } = useBreadcrumb()
  const { userProfile, setUserProfile } = useUserProfile()

  const isHomePage = location.pathname === "/" || location.pathname === "/home"
  const isWideContentPage =
    location.pathname === "/costumes" || location.pathname === "/guidelines-rules"

  const loggedIn = isAuthenticated()
  const { notifications, loading: notifLoading, unreadCount, markNotificationRead } = useNotifications()

  React.useEffect(() => {
    if (loggedIn) {
      const roles = getRoles() as import("@/types/auth").UserRole[]
      if (roles.length > 0) {
        const correctPath = getRedirectPath(roles)
        if (correctPath !== "/") {
          console.log("[CosplayerSiteLayout] User role is not COSPLAYER, redirecting to:", correctPath)
          navigate(correctPath, { replace: true })
        }
      }
    }
  }, [loggedIn, navigate])

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!loggedIn) return

      const userId = getUserId()
      if (!userId) return

      // Skip if already loaded
      if (userProfile.avatarUrl || userProfile.fullName) return

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
  }, [loggedIn, userProfile.avatarUrl, userProfile.fullName, setUserProfile])

  React.useEffect(() => {
    const path = location.pathname

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
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.costumes, to: "/costumes" },
        { label: VI.common.breadcrumb.checkout },
      ])
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
    } else if (path.startsWith("/staff/")) {
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
          { label: VI.common.breadcrumb.staffProfile, to: `/staff/${state.providerId}` },
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
    }
  }, [location.pathname, setItems])

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

  const handleSearchChange = (value: string) => {
    const next = new URLSearchParams(searchParams)

    if (value.trim()) {
      next.set("q", value)
    } else {
      next.delete("q")
    }

    setSearchParams(next, { replace: true })
  }

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: "Trang cá nhân", onClick: () => navigate("/profile") },
    { key: "logout", label: "Đăng xuất", danger: true, onClick: handleLogout },
  ]

  const [notifOpen, setNotifOpen] = React.useState(false)

  const notifPopoverContent = (
    <div style={{ width: 320, background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
      <div style={{ borderBottom: "1px solid #f1f5f9", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{VI.notification.title}</p>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            style={{ fontSize: 12, color: "#ec4899", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {notifLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <Spin size="small" />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#64748b", fontSize: 14 }}>{VI.notification.empty}</div>
        ) : (
          <>
            {notifications.slice(0, 10).map((n) => (
              <div
                key={n.id}
                onClick={async () => {
                  if (!n.isRead) {
                    await markNotificationRead(n.id)
                  }
                  if (n.link) navigate(n.link)
                  setNotifOpen(false)
                }}
                style={{ padding: "10px 16px", borderBottom: "1px solid #f8fafc", cursor: "pointer", background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf2f8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <p style={{ fontSize: 14, fontWeight: n.isRead ? 400 : 600, color: n.isRead ? "#475569" : "#0f172a", margin: 0 }}>
                  {n.header}
                </p>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {n.content}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
      {notifications.length > 0 && (
        <div
          style={{ padding: "10px 16px", textAlign: "center", fontSize: 13, fontWeight: 500, color: "#ec4899", cursor: "pointer", borderTop: "1px solid #f1f5f9" }}
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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-[#111827]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <header
        className={cn(
          "fixed left-0 top-0 z-[9999] w-full border-b border-pink-200 bg-pink-100/90 backdrop-blur-md transition-shadow",
          isScrolled && "border-pink-300/80 shadow-md"
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4">
          <Link
            to="/"
            className="shrink-0 whitespace-nowrap text-lg font-bold text-pink-500 hover:text-pink-600"
          >
            CosMate
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1.5 whitespace-nowrap text-sm md:flex lg:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-pink-50 hover:text-pink-600",
                isHomePage ? "bg-pink-50 font-semibold text-pink-600" : "text-slate-700"
              )}
              onClick={() => navigate("/")}
            >
              Trang chủ
            </Button>

            <DropdownMenu
              triggerLabel={
                <span className="inline-flex items-center gap-1 font-medium">
                  Thuê đồ Cosplay
                  <ChevronDown className="h-4 w-4" />
                </span>
              }
              triggerClassName={cn(
                "hover:bg-pink-50 hover:text-pink-600",
                location.pathname.startsWith("/costumes")
                  ? "rounded-lg bg-pink-50 px-2 py-1 font-semibold text-pink-600"
                  : "text-slate-700"
              )}
              items={[
                { label: "Anime", onSelect: () => navigate("/costumes?category=anime") },
                { label: "Game", onSelect: () => navigate("/costumes?category=game") },
              ]}
            />

            <Button
              variant="ghost"
              size="sm"
              title="Quiz phong cách: trả lời câu hỏi để tìm style cosplay phù hợp với bạn"
              className={cn(
                "hover:bg-pink-50 hover:text-pink-600",
                location.pathname === "/style-quiz" ? "bg-pink-50 font-semibold text-pink-600" : "text-slate-700"
              )}
              onClick={() => navigate("/style-quiz")}
            >
              Quiz
            </Button>

            <Button
              variant="ghost"
              size="sm"
              title="Pose Battle: so sánh ảnh pose của bạn với ảnh mẫu để chấm điểm độ giống"
              className={cn(
                "hidden whitespace-nowrap hover:bg-pink-50 hover:text-pink-600 lg:inline-flex",
                location.pathname === "/pose-battle"
                  ? "bg-pink-50 font-semibold text-pink-600"
                  : "text-slate-700"
              )}
              onClick={() => navigate("/pose-battle")}
            >
              Pose Battle
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden whitespace-nowrap hover:bg-pink-50 hover:text-pink-600 lg:inline-flex",
                location.pathname === "/guidelines-rules"
                  ? "bg-pink-50 font-semibold text-pink-600"
                  : "text-slate-700"
              )}
              onClick={() => navigate("/guidelines-rules")}
            >
              Hướng dẫn &amp; Quy định
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden whitespace-nowrap hover:bg-pink-50 hover:text-pink-600 xl:inline-flex",
                location.pathname === "/photographers"
                  ? "bg-pink-50 font-semibold text-pink-600"
                  : "text-slate-700"
              )}
              onClick={() => navigate("/photographers")}
            >
              Thuê Photographer
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden whitespace-nowrap hover:bg-pink-50 hover:text-pink-600 2xl:inline-flex",
                location.pathname === "/staffs"
                  ? "bg-pink-50 font-semibold text-pink-600"
                  : "text-slate-700"
              )}
              onClick={() => navigate("/staffs")}
            >
              Thuê Staff
            </Button>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="relative hidden w-44 lg:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Tìm kiếm"
                placeholder="Tìm kiếm"
                className="pl-9 pr-10 text-sm"
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
              />
              <button
                type="button"
                aria-label="Tìm kiếm bằng hình ảnh"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-500"
              >
                <Camera className="h-4 w-4 opacity-60" />
              </button>
            </div>

            <button
              type="button"
              aria-label="Tin nhắn"
              className="rounded-full p-2 text-slate-600 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              onClick={() => navigate("/chat")}
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Giỏ hàng"
              className="relative rounded-full p-2 text-slate-600 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              onClick={() => navigate('/profile/purchase-history')}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-400" />
            </button>

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
                className="relative rounded-full p-2 text-slate-600 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </Popover>

            {loggedIn ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                <div className="cursor-pointer" style={{ display: "inline-flex" }}>
                  {userProfile.avatarUrl ? (
                    <Avatar size={36} src={userProfile.avatarUrl} />
                  ) : (
                    <Avatar size={36} style={{ backgroundColor: "#ec4899" }}>
                      {computeInitials(userProfile.fullName)}
                    </Avatar>
                  )}
                </div>
              </Dropdown>
            ) : (
              <>
                <AntButton onClick={() => navigate("/login")}>Đăng nhập</AntButton>
                <AntButton type="primary" onClick={() => navigate("/register")}>
                  Đăng ký
                </AntButton>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Tìm kiếm"
              placeholder="Tìm kiếm"
              className="pl-9 pr-10"
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchChange(e.target.value)
              }
            />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
              <Camera className="h-4 w-4 opacity-60" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-[56px]">
        {!isHomePage && items.length > 0 && (
          <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-2">
            <Breadcrumbs items={items} />
          </div>
        )}
        {isHomePage ? (
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-white/12 backdrop-blur-[1px]"
            />

            <div className="relative z-10 mx-auto w-full max-w-[1800px] px-2 py-2 lg:px-3 xl:px-4">
              <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[160px_minmax(0,1fr)_160px] xl:gap-5 xl:grid-cols-[200px_minmax(0,1fr)_200px] 2xl:grid-cols-[220px_minmax(0,1fr)_220px]">
                <aside className="hidden pt-8 lg:block">
                  <div className="sticky top-[72px]">
                    <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <img
                        src={bannerImages[bannerIndex]}
                        alt="Trang tri ben trai"
                        className="h-[320px] w-full rounded-2xl object-cover transition-opacity duration-500 ease-in-out xl:h-[340px] 2xl:h-[360px]"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white drop-shadow backdrop-blur-sm">
                          Bạn là nhân vật nào?
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate("/style-quiz")}
                          className="pointer-events-auto mt-2 rounded-full bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-pink-600"
                        >
                          Làm quiz ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="min-w-0">
                  <Outlet />
                </div>

                <aside className="hidden pt-8 lg:block">
                  <div className="sticky top-[72px]">
                    <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <img
                        src={bannerImages[bannerIndex]}
                        alt="Trang tri ben phai"
                        className="h-[320px] w-full rounded-2xl object-cover transition-opacity duration-500 ease-in-out xl:h-[340px] 2xl:h-[360px]"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white drop-shadow backdrop-blur-sm">
                          Tìm trang phục qua ảnh
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate("/costumes")}
                          className="pointer-events-auto mt-2 rounded-full bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-pink-600"
                        >
                          Tìm bằng hình ảnh
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "mx-auto w-full",
              isWideContentPage
                ? "max-w-screen-2xl px-4 md:px-6 xl:px-8"
                : "max-w-7xl px-4 lg:px-6"
            )}
          >
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
    </div>
  )
}