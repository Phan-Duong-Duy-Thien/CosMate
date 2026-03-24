import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import AppRoutes from "@/app/routes"
import ScrollToTop from "@/shared/components/ScrollToTop"
import "./index.css"
import "antd/dist/reset.css"

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RequiredAsteriskFix />
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
)
