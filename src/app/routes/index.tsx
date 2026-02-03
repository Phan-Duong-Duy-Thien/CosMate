import { Route, Routes } from "react-router-dom"

import CosplayerSiteLayout from "@/app/layouts/CosplayerSiteLayout"
import LoginPage from "@/features/auth/pages/LoginPage"
import CosplayerRegPage from "@/features/auth/pages/CosplayerRegPage"
import HomePage from "@/features/general/pages/HomePage"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CosplayerSiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<CosplayerRegPage />} />
      </Route>
    </Routes>
  )
}
