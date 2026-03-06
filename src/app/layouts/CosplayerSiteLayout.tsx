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
import { Breadcrumbs } from "@shared/components/Breadcrumbs"

import { useBreadcrumb } from "@/app/providers/BreadcrumbProvider"
import { useUserProfile } from "@/app/providers/UserProfileProvider"

import { getUserId } from "@/features/auth/services/tokenStorage"
import { getUserProfile } from "@/features/admin/services/adminUsers.service"

import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"

import { isAuthenticated, clearAuth } from "@/features/auth/utils/authStorage"

import bgImage from "@/assets/background.jpg"
import ghnLogo from "@/assets/ghn.jpg"
import appIcon from "@/assets/react.svg"

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

  const { items, setItems } = useBreadcrumb()
  const { userProfile, setUserProfile } = useUserProfile()

  const loggedIn = isAuthenticated()

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (loggedIn && !userProfile.avatarUrl && !userProfile.fullName) {
        const userId = getUserId()
        if (userId) {
          try {
            const profile = await getUserProfile(userId)
            setUserProfile({
              avatarUrl: profile.avatarUrl,
              fullName: profile.fullName,
            })
          } catch (error) {
            console.error(error)
          }
        }
      }
    }

    fetchProfile()
  }, [loggedIn, userProfile, setUserProfile])

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
    window.location.reload()
  }

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: "Trang cá nhân", onClick: () => navigate("/profile") },
    { key: "logout", label: "Đăng xuất", danger: true, onClick: handleLogout },
  ]

  const handleSearchChange = (value: string) => {
    const next = new URLSearchParams(searchParams)

    if (value.trim()) next.set("q", value)
    else next.delete("q")

    setSearchParams(next, { replace: true })
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-[#111827]">

      {/* background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* HEADER */}
      <header className="fixed left-0 top-0 z-[9999] w-full border-b border-pink-200 bg-pink-100/90 backdrop-blur-md">

        <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center gap-4 px-6">

          <Link
            to="/"
            className="text-xl font-semibold text-pink-500 hover:text-pink-600"
          >
            CosMate
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-3 md:flex">

            <DropdownMenu
              triggerLabel={
                <span className="inline-flex items-center gap-1">
                  Thuê đồ Cosplay
                  <ChevronDown className="h-4 w-4" />
                </span>
              }
              items={[
                { label: "Anime", onSelect: () => navigate("/costumes?category=anime") },
                { label: "Game", onSelect: () => navigate("/costumes?category=game") },
              ]}
            />

            <Button variant="ghost" size="sm">
              Quiz
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/guidelines-rules")}
            >
              Hướng dẫn & Quy định
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/photographers")}
            >
              Thuê Photographer
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/staffs")}
            >
              Thuê Staff
            </Button>

          </nav>

          {/* SEARCH */}
          <div className="relative hidden w-52 lg:block">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Tìm kiếm"
              className="pl-9 pr-10 text-sm"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            <Camera className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          </div>

          {/* ACTIONS */}

          <button className="rounded-full p-2 text-slate-600 hover:bg-pink-50">
            <MessageCircle className="h-5 w-5" />
          </button>

          <button className="relative rounded-full p-2 text-slate-600 hover:bg-pink-50">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-400" />
          </button>

          {loggedIn ? (
            <Dropdown menu={{ items: userMenuItems }}>
              <Avatar size={36} src={userProfile.avatarUrl}>
                {computeInitials(userProfile.fullName)}
              </Avatar>
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

      </header>

      {/* BREADCRUMB */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-4">
        <Breadcrumbs items={items} />
      </div>

      {/* MAIN */}
      <main className="flex-1 pt-[64px]">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-pink-100/90 text-slate-700">

      <div className="mx-auto w-full max-w-7xl px-6 py-10">

        <div className="grid gap-10 md:grid-cols-12 items-start">

          <div className="md:col-span-4 space-y-4">

            <div className="text-5xl font-extrabold text-pink-600 tracking-wide">
              CosMate
            </div>

            <p className="max-w-md text-sm leading-8 text-slate-600">
              Nền tảng thuê đồ cosplay uy tín.
            </p>

            <div className="flex gap-3">

              <a href="https://www.instagram.com/tnhideyansu/" target="_blank">
                <Instagram className="h-4 w-4 text-pink-700" />
              </a>

              <a href="https://www.facebook.com/konanachan13" target="_blank">
                <Facebook className="h-4 w-4 text-pink-700" />
              </a>

              <a href="https://www.youtube.com/" target="_blank">
                <Youtube className="h-4 w-4 text-pink-700" />
              </a>

            </div>

          </div>

          <div className="md:col-span-8 grid grid-cols-4 gap-6">

            <div>
              <h3 className="font-semibold">Dịch vụ</h3>
              <ul className="text-sm space-y-2">
                <li>Thuê trang phục</li>
                <li>Combo Photoshoot</li>
                <li>Thuê Staff</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Hướng dẫn</h3>
              <ul className="text-sm space-y-2">
                <li>Quy trình thuê cosplay</li>
                <li>Quy trình thuê Photographer</li>
                <li>Quy trình thuê Staff</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Liên hệ</h3>

              <div className="space-y-2 text-sm">

                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-pink-600" />
                  Vinhomes Grand Park
                </div>

                <div className="flex gap-2">
                  <Phone className="h-4 w-4 text-pink-600" />
                  0902 888 222
                </div>

                <div className="flex gap-2">
                  <Mail className="h-4 w-4 text-pink-600" />
                  cosplaystore@cosmate.vn
                </div>

              </div>

            </div>

            <div>
              <h3 className="font-semibold">Ứng dụng</h3>

              <div className="flex items-center gap-3">

                <img
                  src={appIcon}
                  alt="app"
                  className="h-10 w-10 rounded border bg-white p-1"
                />

                <span className="text-sm">
                  Sắp ra mắt
                </span>

              </div>

              <div className="mt-3">

                <h4 className="font-semibold">Giao hàng</h4>

                <img
                  src={ghnLogo}
                  className="h-6 mt-1"
                />

                <h4 className="font-semibold mt-2">Thanh toán</h4>

                <p className="text-sm">Ví • MoMo • VNPay</p>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-pink-300/60"></div>

      <div className="py-4 text-center text-xs text-slate-500">
        © 2026 CosMate. All rights reserved.
      </div>

    </footer>
  )
}