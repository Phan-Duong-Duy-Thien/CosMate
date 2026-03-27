import { Route, Routes } from "react-router-dom"

import CosplayerSiteLayout from "@/app/layouts/CosplayerSiteLayout"
import { ProtectedRoute }from "@/app/routes/ProtectedRoute"
import NoPermissionPage from "@/app/pages/NoPermissionPage"
import { BreadcrumbProvider } from "@/app/providers/BreadcrumbProvider"
import { UserProfileProvider } from "@/app/providers/UserProfileProvider"
import { ROLE } from "@/types/auth"

import LoginPage from "@/features/auth/pages/LoginPage"
import CosplayerRegPage from "@/features/auth/pages/CosplayerRegPage"
import ProviderRegPage from "@/features/auth/pages/ProviderRegPage"
import StaffRegPage from "@/features/auth/pages/StaffRegPage"
import PhotographerRegPage from "@/features/auth/pages/PhotographerRegPage"
import RegisterRoleSelectPage from "@/features/auth/pages/RegisterRoleSelectPage"
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage"
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage"

import HomePage from "@/features/general/pages/HomePage"
import PaymentResultPage from "@/features/general/pages/PaymentResultPage"
import NotificationsPage from "@/features/general/pages/NotificationsPage"
import GuidelinesRulesPage from "@/features/general/pages/GuidelinesRulesPage"
import CostumeListPage from "@/features/costume-rental/pages/CostumeListPage"
import CostumeDetailPage from "@/features/costume-rental/pages/CostumeDetailPage"
import CosplayerProfilePage from "@/features/profile/pages/CosplayerProfilePage"
import AddressCreatePage from "@/features/profile/pages/AddressCreatePage"
import PurchaseHistoryPage from "@/features/profile/pages/PurchaseHistoryPage"
import WalletPage from "@/features/profile/pages/WalletPage"
import WalletTopUpPage from "@/features/profile/pages/WalletTopUpPage"
import PhotographerProfilePage from "@/features/photographer-booking/pages/PhotographerProfilePage"
import PhotographersListingPage from "@/features/photographer-booking/pages/PhotographersListingPage"
import StaffsListingPage from "@/features/staff-booking/pages/StaffsListingPage"
import StaffProfilePage from "@/features/staff-booking/pages/StaffProfilePage"

import AdminHomePage from "@/features/admin/pages/AdminHomePage"
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage"
import AdminMenusPage from "@/features/admin/pages/AdminMenusPage"
import AdminLayout from "@/app/layouts/AdminLayout"
import ProviderHomePage from "@/features/provider/pages/ProviderHomePage"
import ShopProfilePage from "@/features/provider/pages/ShopProfilePage"
import ProviderCostumeListPage from "@/features/costume-rental/pages/ProviderCostumeListPage"
import ProviderCreateCostumePage from "@/features/costume-rental/pages/ProviderCreateCostumePage"
import CheckoutReviewPage from "@/features/order/pages/CheckoutReviewPage"
import ProviderOrdersPage from "@/features/order/pages/ProviderOrdersPage"
import ProviderReviewsPage from "@/features/provider/pages/ProviderReviewsPage"
import EventStaffHomePage from "@/features/provider/pages/EventStaffHomePage"
import PhotographHomePage from "@/features/provider/pages/PhotographHomePage"
import ProviderCreateServicePage from "@/features/service/pages/ProviderCreateServicePage"
import ProviderServiceListPage from "@/features/service/pages/ProviderServiceListPage"
import ProviderProfileCompletionPage from "@/features/provider/pages/ProviderProfileCompletionPage"
import ProviderProfileViewPage from "@/features/provider/pages/ProviderProfileViewPage"
import ProviderProfileEditPage from "@/features/provider/pages/ProviderProfileEditPage"

export default function AppRoutes() {
  return (
    <BreadcrumbProvider>
      <UserProfileProvider>
        <Routes>
      {/* Public + Cosplayer Site Routes */}
      <Route path="/" element={<CosplayerSiteLayout />}>
        <Route index element={<HomePage />}/>
        <Route path="costumes" element={<CostumeListPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="guidelines-rules" element={<GuidelinesRulesPage />} />
        <Route path="costumes/:costumeId" element={<CostumeDetailPage />} />
        <Route path="rent/checkout" element={<CheckoutReviewPage />} />
        <Route path="profile" element={<CosplayerProfilePage />} />
        <Route path="profile/addresses/new" element={<AddressCreatePage />} />
        <Route path="profile/purchase-history" element={<PurchaseHistoryPage />} />
        <Route path="profile/wallet" element={<WalletPage />} />
        <Route path="profile/wallet/topup" element={<WalletTopUpPage />} />
        <Route path="photographers" element={<PhotographersListingPage />} />
        <Route path="photographer/:photographerId" element={<PhotographerProfilePage />} />
        <Route path="staffs" element={<StaffsListingPage />} />
        <Route path="staff/:staffId" element={<StaffProfilePage />} />
        <Route path="shop/:providerId" element={<ShopProfilePage />} />
        <Route path="login" element={<LoginPage />}/>
        <Route path="register" element={<RegisterRoleSelectPage />}/>
        <Route path="register/cosplayer" element={<CosplayerRegPage />} />
        <Route path="register/provider" element={<ProviderRegPage />} />
        <Route path="register/staff" element={<StaffRegPage />} />
        <Route path="register/photographer" element={<PhotographerRegPage />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.ADMIN, 'ADMIN', 'SUPERADMIN', '1', '2', 1, 2] as any} />}>
        <Route element={<AdminLayout />}> 
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/users" element={<AdminUsersPage />}/>
          <Route path="/admin/menus" element={<AdminMenusPage />}/>
        </Route>
      </Route>

      {/* Provider Rental Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.PROVIDER_RENTAL]} />}>
        <Route path="/provider-rental" element={<ProviderHomePage />} />
        <Route path="/provider-rental/costumes" element={<ProviderCostumeListPage />}/>
        <Route path="/provider-rental/costumes/create" element={<ProviderCreateCostumePage />} />
        <Route path="/provider-rental/orders" element={<ProviderOrdersPage />} />
        <Route path="/provider/reviews" element={<ProviderReviewsPage />} />
        <Route path="/provider/settings" element={<ProviderProfileViewPage />} />
        <Route path="/provider/settings/edit" element={<ProviderProfileEditPage />} />
        <Route path="/provider/settings/completion" element={<ProviderProfileCompletionPage />} />
      </Route>

      {/* Provider Photograph Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.PROVIDER_PHOTOGRAPH]} />}>
        <Route path="/provider-photograph" element={<PhotographHomePage />} />
        <Route path="/provider-photograph/services" element={<ProviderServiceListPage />} />
        <Route path="/provider-photograph/serviceCreate" element={<ProviderCreateServicePage />} />
        <Route path="/provider-photograph/settings" element={<ProviderProfileViewPage />} />
        <Route path="/provider-photograph/settings/edit" element={<ProviderProfileEditPage />} />
        <Route path="/provider-photograph/settings/completion" element={<ProviderProfileCompletionPage />} />
      </Route>

      {/* Provider Event Staff Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.PROVIDER_EVENT_STAFF]} />}>
        <Route path="/provider-event-staff" element={<EventStaffHomePage />} />
        <Route path="/provider-event-staff/services" element={<ProviderServiceListPage />} />
        <Route path="/provider-event-staff/serviceCreate" element={<ProviderCreateServicePage />} />
        <Route path="/provider-event-staff/settings" element={<ProviderProfileViewPage />} />
        <Route path="/provider-event-staff/settings/edit" element={<ProviderProfileEditPage />} />
        <Route path="/provider-event-staff/settings/completion" element={<ProviderProfileCompletionPage />} />
      </Route>

      {/* Global Error Pages */}
      <Route path="/no-permission" element={<NoPermissionPage />} />

      {/* Auth Pages (public) */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Payment Result Page (standalone) */}
      <Route path="/payment/result" element={<PaymentResultPage />} />
    </Routes>     
    </UserProfileProvider>
    </BreadcrumbProvider>
  )
}
