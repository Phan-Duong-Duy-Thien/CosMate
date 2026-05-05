import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, useLocation } from "react-router-dom"
import { message, notification } from "antd"

import App from "@/app/App"
import ScrollToTop from "@/shared/components/ScrollToTop"
import faviconImage from "@/assets/logo.png"
import "./index.css"
import "antd/dist/reset.css"

// Global default: all antd toasts auto-dismiss after 5 seconds
message.config({ duration: 5 })
notification.config({ duration: 5 })

// Move required asterisk (*) from BEFORE label to AFTER label
const requiredAsteriskStyle = `
  .ant-form-item-required > .ant-form-item-label > label::before {
    display: none !important;
  }
  .ant-form-item-required > .ant-form-item-label > label::after {
    content: " *" !important;
    color: #ff4d4f !important;
    margin-left: 4px !important;
    font-weight: 400 !important;
  }

  .ant-message,
  .ant-notification {
    z-index: 12000 !important;
  }

  .ant-message {
    top: 76px !important;
  }

  .ant-notification-notice-wrapper {
    margin-top: 72px !important;
  }
`

function RequiredAsteriskFix() {
  useEffect(() => {
    const style = document.createElement("style")
    style.id = "antd-required-asterisk-fix"
    style.textContent = requiredAsteriskStyle
    document.head.appendChild(style)
    return () => {
      const existing = document.getElementById("antd-required-asterisk-fix")
      if (existing) existing.remove()
    }
  }, [])
  return null
}

function DocumentTitleSync() {
  const location = useLocation()

  useEffect(() => {
    const existingFavicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (existingFavicon) {
      existingFavicon.href = faviconImage
      existingFavicon.type = "image/png"
    } else {
      const link = document.createElement("link")
      link.rel = "icon"
      link.type = "image/png"
      link.href = faviconImage
      document.head.appendChild(link)
    }

    const pathname = location.pathname

    let pageTitle = "Trang chủ"

    if (pathname === "/costumes") pageTitle = "Thuê đồ Cosplay"
    else if (pathname.startsWith("/costumes/")) pageTitle = "Chi tiết trang phục"
    else if (pathname === "/style-quiz") pageTitle = "Quiz"
    else if (pathname === "/pose-battle") pageTitle = "Pose Battle"
    else if (pathname === "/guidelines-rules") pageTitle = "Hướng dẫn & Quy định"
    else if (pathname === "/notifications") pageTitle = "Thông báo"
    else if (pathname === "/profile") pageTitle = "Trang cá nhân"
    else if (pathname === "/profile/purchase-history") pageTitle = "Lịch sử mua hàng"
    else if (pathname === "/profile/wallet") pageTitle = "Ví của tôi"
    else if (pathname === "/profile/wallet/topup") pageTitle = "Nạp ví"
    else if (pathname === "/profile/wallet/withdraw") pageTitle = "Rút tiền"
    else if (pathname === "/photographers") pageTitle = "Thuê Photographer"
    else if (pathname.startsWith("/photographer/")) pageTitle = "Hồ sơ Photographer"
    else if (pathname === "/staffs") pageTitle = "Thuê Staff"
    else if (pathname.startsWith("/staff/")) pageTitle = "Hồ sơ Staff"
    else if (pathname === "/login") pageTitle = "Đăng nhập"
    else if (pathname.startsWith("/register")) pageTitle = "Đăng ký"
    else if (pathname === "/forgot-password") pageTitle = "Quên mật khẩu"
    else if (pathname === "/reset-password") pageTitle = "Đặt lại mật khẩu"
    else if (pathname.startsWith("/provider-rental")) pageTitle = "Provider Rental"
    else if (pathname.startsWith("/provider-photograph")) pageTitle = "Provider Photograph"
    else if (pathname.startsWith("/provider-event-staff")) pageTitle = "Provider Event Staff"
    else if (pathname.startsWith("/provider/messages")) pageTitle = "Tin nhắn"
    else if (pathname.startsWith("/admin")) pageTitle = "Admin"
    else if (pathname === "/no-permission") pageTitle = "Không có quyền truy cập"
    else if (pathname === "/payment/result") pageTitle = "Kết quả thanh toán"

    document.title = `${pageTitle} | CosMate`
  }, [location.pathname])

  return null
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RequiredAsteriskFix />
    <BrowserRouter>
      <DocumentTitleSync />
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
