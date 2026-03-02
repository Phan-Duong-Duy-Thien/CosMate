import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import AppRoutes from "@/app/routes"
import ScrollToTop from "@/shared/components/ScrollToTop"
import "./index.css"
import "antd/dist/reset.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
)
