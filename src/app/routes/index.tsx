import { Route, Routes } from "react-router-dom"

import CosplayerSiteLayout from "@/app/layouts/CosplayerSiteLayout"
import LoginPage from "@/features/auth/pages/LoginPage"
import CosplayerRegPage from "@/features/auth/pages/CosplayerRegPage"
import ProviderRegPage from "@/features/auth/pages/ProviderRegPage"
import StaffRegPage from "@/features/auth/pages/StaffRegPage"
import PhotographerRegPage from "@/features/auth/pages/PhotographerRegPage"
import RegisterRoleSelectPage from "@/features/auth/pages/RegisterRoleSelectPage"
import HomePage from "@/features/general/pages/HomePage"
import CostumeListPage from "@/features/costume-rental/pages/CostumeListPage"
import CostumeDetailPage from "@/features/costume-rental/pages/CostumeDetailPage"
import CosplayerProfilePage from "@/features/profile/pages/CosplayerProfilePage"
import PhotographerProfilePage from "@/features/photographer-booking/pages/PhotographerProfilePage"
import PhotographersListingPage from "@/features/photographer-booking/pages/PhotographersListingPage"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CosplayerSiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="costumes" element={<CostumeListPage />} />
        <Route path="costumes/:costumeId" element={<CostumeDetailPage />} />
        <Route path="profile" element={<CosplayerProfilePage />} />
        <Route path="photographers" element={<PhotographersListingPage />} />
        <Route path="photographer/:photographerId" element={<PhotographerProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterRoleSelectPage />} />
        <Route path="register/cosplayer" element={<CosplayerRegPage />} />
        <Route path="register/provider" element={<ProviderRegPage />} />
        <Route path="register/staff" element={<StaffRegPage />} />
        <Route path="register/photographer" element={<PhotographerRegPage />} />
      </Route>
    </Routes>
  )
}
