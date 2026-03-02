import * as React from "react"
import { Outlet, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import {
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  MapPin,
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
import { Breadcrumbs } from "@shared/components/Breadcrumbs"
import { useBreadcrumb } from "@/app/providers/BreadcrumbProvider"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"
import { isAuthenticated, clearAuth } from "@/features/auth/utils/authStorage"
import bgImage from "@/assets/background.jpg"
import sideBannerImage from "@/assets/anh1.jpg"

export default function CosplayerSiteLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const searchValue = searchParams.get("q") ?? ""
  const { items: breadcrumbItems, setItems } = useBreadcrumb()
  const isHomePage = location.pathname === "/" || location.pathname === "/home"

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
    <div
      className="flex min-h-screen flex-col overflow-x-hidden text-[#111827]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-transparent bg-white/90 backdrop-blur-md transition-shadow",
          isScrolled && "border-slate-100 shadow-md"
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="text-xl font-semibold text-pink-500">CosMate</div>
          <nav className="hidden items-center gap-2 lg:flex">
            <Button
              variant="ghost"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => navigate("/costumes")}
              >
                Thuê đồ Cosplay
              </Button>
              <DropdownMenu
                triggerLabel=""
                triggerAriaLabel="Danh mục Thuê đồ Cosplay"
                triggerIcon={<ChevronDown className="h-4 w-4" />}
                triggerClassName="px-2"
                items={[
                  { label: "Anime" },
                  { label: "Game" },
                  { label: "Manga" },
                ]}
              />
            </div>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              Quiz
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="whitespace-nowrap transition-all duration-200 hover:bg-pink-100/70 active:scale-[0.98]"
              onClick={() => navigate("/guidelines-rules")}
            >
              Hướng dẫn &amp; Quy định
            </Button>
            <DropdownMenu
              triggerLabel="Dịch vụ"
              triggerIcon={<ChevronDown className="h-4 w-4" />}
              triggerClassName="whitespace-nowrap"
              items={[
                {
                  label: "Thuê Photographer",
                  onSelect: () => navigate("/photographers"),
                },
                { label: "Thuê Staff", 
                  onSelect: () => navigate("/staffs") },
              ]}
            />
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative hidden w-64 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Tìm kiếm trang phục"
                placeholder="Tìm kiếm trang phục…"
                className="pl-9"
                value={searchValue}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(event.target.value)
                }
              />
            </div>
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
                  <Avatar size={36} style={{ backgroundColor: "#ec4899" }}>
                    {/* optional: first letter of username if available later */}
                  </Avatar>
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
        <div className="mx-auto w-full max-w-6xl px-4 pb-4 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Tìm kiếm trang phục"
              placeholder="Tìm kiếm trang phục…"
              className="pl-9"
              value={searchValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchChange(event.target.value)
              }
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {breadcrumbItems.length > 0 && (
          <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}
        {isHomePage ? (
          <div className="mx-auto w-full max-w-[1800px] px-2 py-4 lg:px-3 xl:px-4">
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
        ) : (
          <div className="mx-auto w-full max-w-7xl px-4 py-4 lg:px-6">
            <div className="min-w-0">
              <Outlet />
            </div>
          </div>
        )}
      </main>

      <footer className=" bg-slate-900 text-slate-200">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="text-xl font-semibold text-pink-300">CosMate</div>
            <p className="text-sm text-slate-300">
              Nền tảng thuê đồ cosplay pastel, cute và tiện lợi cho mọi lễ hội.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Instagram"
                className="rounded-full bg-slate-800 p-2 hover:bg-pink-400"
              >
                <Instagram className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Facebook"
                className="rounded-full bg-slate-800 p-2 hover:bg-pink-400"
              >
                <Facebook className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Youtube"
                className="rounded-full bg-slate-800 p-2 hover:bg-pink-400"
              >
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">Cosplay</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Thuê trang phục</li>
            
              <li>Combo Photoshoot</li>
              <li>Shop nổi bật</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">
              Hướng dẫn &amp; Quy định
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Quy trình thuê</li>
              <li>Chính sách hủy</li>
              <li>Điều khoản sử dụng</li>
              <li>Hỗ trợ khách hàng</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">Liên hệ</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-pink-300" />
                22 Lê Duẩn, Quận 1, TP.HCM
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-pink-300" />
                0902 888 222
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-pink-300" />
                hello@cosmate.vn
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
          © 2024 CosMate. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
