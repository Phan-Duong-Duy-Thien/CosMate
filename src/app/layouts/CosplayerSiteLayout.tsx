import * as React from "react"
import { Outlet, useNavigate, useSearchParams } from "react-router-dom"
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
import { cn } from "@/lib/utils"
import { isAuthenticated, clearAuth } from "@/features/auth/utils/authStorage"

export default function CosplayerSiteLayout() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const searchValue = searchParams.get("q") ?? ""

  const loggedIn = isAuthenticated()

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
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] text-[#111827]">
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
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
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
        <Outlet />
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
