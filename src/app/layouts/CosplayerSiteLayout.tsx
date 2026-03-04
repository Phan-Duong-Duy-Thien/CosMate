import * as React from "react"
import { Link, Outlet, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import {
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
} from "lucide-react"
import { Button as AntButton, Dropdown, Avatar } from "antd"
import type { MenuProps } from "antd"

import { Button } from "@shared/components/Button"
import { DropdownMenu } from "@shared/components/DropdownMenu"
import { Input } from "@shared/components/Input"
import { useBreadcrumb } from "@/app/providers/BreadcrumbProvider"
import { useUserProfile } from "@/app/providers/UserProfileProvider"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"
import { isAuthenticated, clearAuth } from "@/features/auth/utils/authStorage"
import bgImage from "@/assets/background.jpg"
import sideBannerImage from "@/assets/anh1.jpg"

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
  const searchValue = searchParams.get("q") ?? ""
  const { setItems } = useBreadcrumb()
  const { userProfile } = useUserProfile()
  const isHomePage = location.pathname === "/" || location.pathname === "/home"
  const isWideContentPage =
    location.pathname === "/costumes" || location.pathname === "/guidelines-rules"

  const loggedIn = isAuthenticated()

  // Set default breadcrumbs based on route
  React.useEffect(() => {
    const path = location.pathname
    if (path === "/") {
      setItems([])
    } else if (path === "/costumes") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.costumes },
      ])
    } else if (path.startsWith("/costumes/")) {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.costumes, to: "/costumes" },
        { label: VI.common.breadcrumb.checkout },
      ])
    } else if (path === "/profile") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.profile },
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
        { label: path.includes("new") ? VI.common.breadcrumb.addAddress : VI.common.breadcrumb.addresses },
      ])
    } else if (path === "/photographers") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.photographers },
      ])
    } else if (path === "/staffs") {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.staffs },
      ])
    }
  }, [location.pathname, setItems])

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
    window.location.reload()
  }

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: "Trang cá nhân", onClick: () => navigate("/profile") },
    { key: "logout", label: "Đăng xuất", danger: true, onClick: handleLogout },
  ]

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchChange = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) {
      next.set("q", value)
    } else {
      next.delete("q")
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-[#111827]">
  {/* Fixed background layer (does NOT break sticky) */}
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
  <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center gap-4 px-6">
    {/* LOGO */}
    <Link
      to="/"
      className="shrink-0 whitespace-nowrap text-xl font-semibold text-pink-500 hover:text-pink-600"
    >
      CosMate
    </Link>

    {/* NAV (NO overflow-hidden to avoid clipping) */}
    <nav className="hidden flex-1 items-center justify-center gap-3 whitespace-nowrap md:flex">
      <Button
        variant="ghost"
        size="sm"
        className="whitespace-nowrap text-slate-700 hover:text-pink-600 hover:bg-pink-50"
        onClick={() => navigate("/")}
      >
        Trang chủ
      </Button>

      <DropdownMenu
        triggerLabel={
          <span className="inline-flex items-center gap-1">
            Thuê đồ Cosplay
            <ChevronDown className="h-4 w-4" />
          </span>
        }
        triggerClassName="text-slate-700 hover:text-pink-600 hover:bg-pink-50"
        items={[
          { label: "Anime", onSelect: () => navigate("/costumes?category=anime") },
          { label: "Game", onSelect: () => navigate("/costumes?category=game") },
        ]}
      />

      <Button
        variant="ghost"
        size="sm"
        className="text-slate-700 hover:text-pink-600 hover:bg-pink-50"
      >
        Quiz
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="hidden lg:inline-flex whitespace-nowrap text-slate-700 hover:text-pink-600 hover:bg-pink-50"
        onClick={() => navigate("/guidelines-rules")}
      >
        Hướng dẫn &amp; Quy định
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="hidden xl:inline-flex whitespace-nowrap text-slate-700 hover:text-pink-600 hover:bg-pink-50"
        onClick={() => navigate("/photographers")}
      >
        Thuê Photographer
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="hidden 2xl:inline-flex whitespace-nowrap text-slate-700 hover:text-pink-600 hover:bg-pink-50"
        onClick={() => navigate("/staffs")}
      >
        Thuê Staff
      </Button>
    </nav>

    {/* RIGHT */}
    <div className="ml-auto flex items-center gap-3 shrink-0">
      {/* Search: smaller and only show from lg to keep space */}
      <div className="relative hidden w-52 lg:block">
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
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Giỏ hàng"
        className="relative rounded-full p-2 text-slate-600 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-400" />
      </button>

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

  {/* Mobile search */}
  <div className="mx-auto w-full max-w-7xl px-6 pb-4 md:hidden">
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

<main className="flex-1 pt-[116px] md:pt-[64px]">
        {isHomePage ? (
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-white/12 backdrop-blur-[1px]"
            />
            <div className="relative z-10 mx-auto w-full max-w-[1800px] px-2 py-4 lg:px-3 xl:px-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[160px_minmax(0,1fr)_160px] xl:gap-6 xl:grid-cols-[200px_minmax(0,1fr)_200px] 2xl:grid-cols-[220px_minmax(0,1fr)_220px]">
                <aside className="hidden lg:block lg:pt-8">
                  <div className="w-full">
                    <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <img
                        src={sideBannerImage}
                        alt="Trang tri ben trai"
                        className="h-[360px] w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white drop-shadow backdrop-blur-sm">
                          Bạn là nhân vật nào?
                        </p>
                        <button
                          type="button"
                          className="pointer-events-auto mt-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-pink-600"
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

                <aside className="hidden lg:block lg:pt-8">
                  <div className="w-full">
                    <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <img
                        src={sideBannerImage}
                        alt="Trang tri ben phai"
                        className="h-[360px] w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white drop-shadow backdrop-blur-sm">
                          Bạn là nhân vật nào?
                        </p>
                        <button
                          type="button"
                          className="pointer-events-auto mt-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-pink-600"
                        >
                          Làm quiz ngay
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
              "mx-auto w-full py-4",
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
  <div className="mx-auto w-full max-w-7xl px-6 py-10">
    <div className="grid gap-10 md:grid-cols-12 items-start">
      
      {/* CosMate block */}
      <div className="md:col-span-5 space-y-4 self-start">
        <div className="text-5xl font-extrabold text-pink-600 tracking-wide">
          CosMate
        </div>

        <p className="max-w-md text-sm leading-6 text-slate-600">
          Nền tảng thuê đồ cosplay uy tín. Kết nối cosplayer và nhà cung cấp
          đáng tin cậy. Mọi giao dịch minh bạch, an toàn và sẵn sàng cho mọi lễ hội.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            aria-label="Instagram"
            className="rounded-full bg-pink-200 p-2 hover:bg-pink-300 transition"
          >
            <Instagram className="h-4 w-4 text-pink-700" />
          </button>

          <button
            type="button"
            aria-label="Facebook"
            className="rounded-full bg-pink-200 p-2 hover:bg-pink-300 transition"
          >
            <Facebook className="h-4 w-4 text-pink-700" />
          </button>

          <button
            type="button"
            aria-label="Youtube"
            className="rounded-full bg-pink-200 p-2 hover:bg-pink-300 transition"
          >
            <Youtube className="h-4 w-4 text-pink-700" />
          </button>
        </div>
      </div>

      {/* Right columns */}
      <div className="md:col-span-7 grid grid-cols-3 gap-6 items-start">

        {/* Dịch vụ */}
        <div className="space-y-3 self-start">
          <h3 className="text-base font-semibold leading-none text-slate-800">
            Dịch vụ
          </h3>

          <ul className="space-y-2 text-sm text-slate-600">
            <li>Thuê trang phục</li>
            <li>Combo Photoshoot</li>
            <li>Thuê Staff</li>
          </ul>
        </div>

        {/* Hướng dẫn */}
        <div className="space-y-3 self-start">
          <h3 className="text-base font-semibold leading-none text-slate-800">
            Hướng dẫn & Quy định
          </h3>

          <ul className="space-y-2 text-sm text-slate-600">
            <li>Quy trình thuê đồ cosplay</li>
            <li>Quy trình thuê Photographer</li>
            <li>Quy trình thuê Staff</li>
            <li>Chính sách đổi/trả/hoàn</li>
            <li>Tranh chấp & khiếu nại</li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div className="space-y-3 self-start">
          <h3 className="text-base font-semibold leading-none text-slate-800">
            Liên hệ
          </h3>

          <div className="space-y-2 text-sm text-slate-600">

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-[2px] text-pink-600" />
              <span>Vinhomes Grand Park, Q9, Thủ Đức</span>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-[2px] text-pink-600" />
              <span>0902 888 222</span>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-[2px] text-pink-600" />
              <span>cosplaystore@cosmate.vn</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>

  {/* Full width divider */}
  <div className="border-t border-pink-300/60"></div>

  {/* Copyright */}
  <div className="py-4 text-center text-xs text-slate-500">
    © 2026 CosMate. All rights reserved.
  </div>
</footer>
    </div>
  )
}
