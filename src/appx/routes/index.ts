import { Route, Routes } from "react-router-dom"

import CosplayerSiteLayout from "@/app/layouts/CosplayerSiteLayout"
import { ProtectedRoute }from "@/app/routes/ProtectedRoute"
import NoPermissionPage from "@/app/pages/NoPermissionPage"
import { ROLE } from "@/types/auth"

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
import AddressCreatePage from "@/features/profile/pages/AddressCreatePage"
import PhotographerProfilePage from "@/features/photographer-booking/pages/PhotographerProfilePage"
import PhotographersListingPage from "@/features/photographer-booking/pages/PhotographersListingPage"
import StaffsListingPage from "@/features/staff-booking/pages/StaffsListingPage"
import StaffProfilePage from "@/features/staff-booking/pages/StaffProfilePage"

import AdminHomePage from "@/features/admin/pages/AdminHomePage"
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage"
import ProviderHomePage from "@/features/provider/pages/ProviderHomePage"
import ProviderCostumeListPage from "@/features/costume-rental/pages/ProviderCostumeListPage"
import ProviderCreateCostumePage from "@/features/costume-rental/pages/ProviderCreateCostumePage"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public + Cosplayer Site Routes */}
      <Route path="/" element={<CosplayerSiteLayout />}>
        <Route index element={<HomePage />}/>
        <Route path="costumes" element={<CostumeListPage />} />
        <Route path="costumes/:costumeId" element={<CostumeDetailPage />} />
        <Route path="profile" element={<CosplayerProfilePage />} />
        <Route path="photographers" element={<PhotographersListingPage />} />
        <Route path="photographer/:photographerId" element={<PhotographerProfilePage />} />
        <Route path="staffs" element={<StaffsListingPage />} />
        <Route path="staff/:staffId" element={<StaffProfilePage />} />
        <Route path="login" element={<LoginPage />}/>
        <Route path="register" element={<RegisterRoleSelectPage />}/>
        <Route path="register/cosplayer" element={<CosplayerRegPage />} />
        <Route path="register/provider" element={<ProviderRegPage />} />
        <Route path="register/staff" element={<StaffRegPage />} />
        <Route path="register/photographer" element={<PhotographerRegPage />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.ADMIN]} />}>
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/users" element={<AdminUsersPage />}/>
      </Route>

      {/* Provider Rental Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.PROVIDER_RENTAL]} />}>
        <Route path="/provider-rental" element={<ProviderHomePage />} />
        <Route path="/provider-rental/costumes" element={<ProviderCostumeListPage />}/>
        <Route path="/provider-rental/costumes/create" element={<ProviderCreateCostumePage />} />
      </Route>

      {/* Global Error Pages */}
      <Route path="/no-permission" element={<NoPermissionPage />} />
    </Routes>
  )
}
