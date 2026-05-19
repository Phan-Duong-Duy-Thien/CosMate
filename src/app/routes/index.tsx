import { Route, Routes } from "react-router-dom"

import { ProtectedRoute }from "@/app/routes/ProtectedRoute"
import NoPermissionPage from "@/app/pages/NoPermissionPage"
import { BreadcrumbProvider } from "@/app/providers/BreadcrumbProvider"
import { UserProfileProvider } from "@/app/providers/UserProfileProvider"
import { ChatPopupRoot } from "@/app/providers/ChatPopupRoot"
import { ROLE } from "@/types/auth"
import { VI } from "@/shared/i18n/vi"

import LoginPage from "@/features/auth/pages/LoginPage"
import CosplayerRegPage from "@/features/auth/pages/CosplayerRegPage"
import ProviderRegPage from "@/features/auth/pages/ProviderRegPage"
import StaffRegPage from "@/features/auth/pages/StaffRegPage"
import PhotographerRegPage from "@/features/auth/pages/PhotographerRegPage"
import RegisterRoleSelectPage from "@/features/auth/pages/RegisterRoleSelectPage"
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage"
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage"
import OnboardingRolePage from "@/features/auth/pages/OnboardingRolePage"

import HomePage from "@/features/general/pages/HomePage"
import PaymentResultPage from "@/features/general/pages/PaymentResultPage"
import NotificationsPage from "@/features/general/pages/NotificationsPage"
import GuidelinesRulesPage from "@/features/general/pages/GuidelinesRulesPage"
import StyleQuizPage from "@/features/style-quiz/pages/StyleQuizPage"
import WishlistPage from "@/features/wishlist/pages/WishlistPage"
import PoseBattlePage from "@/features/pose-battle/pages/PoseBattlePage"
import SharedPosePage from "@/features/pose-battle/pages/SharedPosePage"
import CostumeListPage from "@/features/costume-rental/pages/CostumeListPage"
import CostumeDetailPage from "@/features/costume-rental/pages/CostumeDetailPage"
import CosplayerProfilePage from "@/features/profile/pages/CosplayerProfilePage"
import AddressCreatePage from "@/features/profile/pages/AddressCreatePage"
import PurchaseHistoryPage from "@/features/profile/pages/PurchaseHistoryPage"
import WalletPage from "@/features/profile/pages/WalletPage"
import WalletTopUpPage from "@/features/profile/pages/WalletTopUpPage"
import WalletWithdrawPage from "@/features/profile/pages/WalletWithdrawPage"
import TokenPage from "@/features/profile/pages/TokenPage"
import PhotographerProfilePage from "@/features/photographer-booking/pages/PhotographerProfilePage"
import PhotographersListingPage from "@/features/photographer-booking/pages/PhotographersListingPage"
import StaffsListingPage from "@/features/staff-booking/pages/StaffsListingPage"
import StaffProfilePage from "@/features/staff-booking/pages/StaffProfilePage"

import AdminHomePage from "@/features/admin/pages/AdminHomePage"
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage"
import AdminMenusPage from "@/features/admin/pages/AdminMenusPage"
import AdminProvidersPage from "@/features/admin/pages/AdminProvidersPage"
import AdminCostumesPage from "@/features/admin/pages/AdminCostumesPage"
import AdminOrdersPage from "@/features/admin/pages/AdminOrdersPage"
import AdminReportsPage from "@/features/admin/pages/AdminReportsPage"
import AdminAuditLogsPage from "@/features/admin/pages/AdminAuditLogsPage"
import AdminCharactersPage from "@/features/admin/pages/AdminCharactersPage"
import CharacterRequestManagementPage from "@/features/admin/pages/CharacterRequestManagement"
import AdminSubscriptionPlansPage from "@/features/admin/pages/AdminSubscriptionPlansPage"
import AdminLayout from "@/app/layouts/AdminLayout"
import ProviderHomePage from "@/features/provider/pages/ProviderHomePage"
import ShopProfilePage from "@/features/provider/pages/ShopProfilePage"
import ProviderCostumeListPage from "@/features/costume-rental/pages/ProviderCostumeListPage"
import ProviderCreateCostumePage from "@/features/costume-rental/pages/ProviderCreateCostumePage"
import CheckoutReviewPage from "@/features/order/pages/CheckoutReviewPage"
import ProviderOrdersPage from "@/features/order/pages/ProviderOrdersPage"
import ProviderReviewsPage from "@/features/provider/pages/ProviderReviewsPage"
import ProviderServiceOrdersPage from "@/features/service/pages/ProviderServiceOrdersPage"
import EventStaffHomePage from "@/features/provider/pages/EventStaffHomePage"
import PhotographHomePage from "@/features/provider/pages/PhotographHomePage"
import ProviderCreateServicePage from "@/features/service/pages/ProviderCreateServicePage"
import ProviderServiceListPage from "@/features/service/pages/ProviderServiceListPage"
import ServiceDetailPage from "@/features/service/pages/ServiceDetailPage"
import ProviderProfileCompletionPage from "@/features/provider/pages/ProviderProfileCompletionPage"
import ProviderProfileViewPage from "@/features/provider/pages/ProviderProfileViewPage"
import ProviderProfileEditPage from "@/features/provider/pages/ProviderProfileEditPage"
import { ProviderWalletLayout } from "@/features/provider/pages/ProviderWalletLayout"
import ProviderWalletPage from "@/features/provider/pages/ProviderWalletPage"
import ProviderMessagesPage from "@/features/chat/pages/ProviderMessagesPage"
import { ProviderEventStaffWalletLayout } from "@/features/provider/pages/ProviderEventStaffWalletLayout"
import { ProviderPhotographWalletLayout } from "@/features/provider/pages/ProviderPhotographWalletLayout"
import StaffLayout from "@/features/staff/layout/StaffLayout"
import StaffHomePage from "@/features/staff/pages/StaffHomePage"
import StaffWithdrawPage from "@/features/staff/pages/StaffWithdrawPage"
import StaffPlaceholderPage from "@/features/staff/pages/StaffPlaceholderPage"
import StaffAiTokenPlansPage from "@/features/staff-token/pages/StaffAiTokenPlansPage"
import DashboardProfilePage from "@/features/profile/pages/DashboardProfilePage"
import DisputeManagementPage from "@/features/dispute/pages/DisputeManagementPage"

export default function AppRoutes() {
  return (
    <BreadcrumbProvider>
      <UserProfileProvider>
        <Routes>
      {/* Public + Cosplayer Site Routes */}
      <Route path="/" element={<ChatPopupRoot />}>
        <Route index element={<HomePage />}/>
        <Route path="costumes" element={<CostumeListPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="guidelines-rules" element={<GuidelinesRulesPage />} />
        <Route path="style-quiz" element={<StyleQuizPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="pose-battle" element={<PoseBattlePage />} />
        <Route path="pose-battle/:id" element={<SharedPosePage />} />
        <Route path="costumes/:costumeId" element={<CostumeDetailPage />} />
        <Route path="rent/checkout" element={<CheckoutReviewPage />} />
        <Route path="profile" element={<CosplayerProfilePage />} />
        <Route path="profile/addresses/new" element={<AddressCreatePage />} />
        <Route path="profile/purchase-history" element={<PurchaseHistoryPage />} />
        <Route path="profile/token" element={<TokenPage />} />
        <Route path="profile/wallet" element={<WalletPage />} />
        <Route path="profile/wallet/topup" element={<WalletTopUpPage />} />
        <Route path="profile/wallet/withdraw" element={<WalletWithdrawPage />} />
        <Route path="photographers" element={<PhotographersListingPage />} />
        <Route path="photographer/:photographerId" element={<PhotographerProfilePage />} />
        <Route path="service/:serviceId" element={<ServiceDetailPage />} />
        <Route path="staffs" element={<StaffsListingPage />} />
        <Route path="staffs/:staffId" element={<StaffProfilePage />} />
        <Route path="shop/:providerId" element={<ShopProfilePage />} />
        <Route path="login" element={<LoginPage />}/>
        <Route path="register" element={<RegisterRoleSelectPage />}/>
        <Route path="register/cosplayer" element={<CosplayerRegPage />} />
        <Route path="register/provider" element={<ProviderRegPage />} />
        <Route path="register/staff" element={<StaffRegPage />} />
        <Route path="register/photographer" element={<PhotographerRegPage />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.ADMIN, 'ADMIN', 'SUPERADMIN', '1', '2', 1, 2] as any} /> }>
        <Route element={<AdminLayout />}> 
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/users" element={<AdminUsersPage />}/>
          <Route path="/admin/menus" element={<AdminMenusPage />}/>
          <Route path="/admin/providers" element={<AdminProvidersPage />} />
          <Route path="/admin/costumes" element={<AdminCostumesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/characters" element={<AdminCharactersPage />} />
          <Route path="/admin/character-requests" element={<CharacterRequestManagementPage />} />
          <Route path="/admin/subscription-plans" element={<AdminSubscriptionPlansPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="/admin/profile" element={<DashboardProfilePage />} />
        </Route>
      </Route>

      {/* Provider Rental Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.PROVIDER_RENTAL]} />}> 
        <Route path="/provider-rental" element={<ProviderHomePage />} />
        <Route element={<ProviderWalletLayout />}>
          <Route path="/provider-rental/wallet" element={<ProviderWalletPage />} />
          <Route path="/provider-rental/wallet/topup" element={<WalletTopUpPage />} />
          <Route path="/provider-rental/wallet/withdraw" element={<WalletWithdrawPage />} />
        </Route>
        <Route path="/provider-rental/costumes" element={<ProviderCostumeListPage />}/>
        <Route path="/provider-rental/costumes/create" element={<ProviderCreateCostumePage />} />
        <Route path="/provider-rental/orders" element={<ProviderOrdersPage />} />
        <Route path="/provider/reviews" element={<ProviderReviewsPage />} />
        <Route path="/provider/settings" element={<ProviderProfileViewPage />} />
        <Route path="/provider/settings/edit" element={<ProviderProfileEditPage />} />
        <Route path="/provider/settings/completion" element={<ProviderProfileCompletionPage />} />
        <Route path="/provider/messages" element={<ProviderMessagesPage />} />
      </Route>

      {/* Provider Photograph Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.PROVIDER_PHOTOGRAPH]} />}> 
        <Route path="/provider-photograph" element={<PhotographHomePage />} />
        <Route element={<ProviderPhotographWalletLayout />}>
          <Route path="/provider-photograph/wallet" element={<ProviderWalletPage />} />
          <Route path="/provider-photograph/wallet/topup" element={<WalletTopUpPage />} />
          <Route path="/provider-photograph/wallet/withdraw" element={<WalletWithdrawPage />} />
        </Route>
        <Route path="/provider-photograph/services" element={<ProviderServiceListPage />} />
        <Route path="/provider-photograph/serviceCreate" element={<ProviderCreateServicePage />} />
        <Route path="/provider-photograph/service-orders" element={<ProviderServiceOrdersPage />} />
        <Route path="/provider-photograph/settings" element={<ProviderProfileViewPage />} />
        <Route path="/provider-photograph/settings/edit" element={<ProviderProfileEditPage />} />
        <Route path="/provider-photograph/settings/completion" element={<ProviderProfileCompletionPage />} />
        <Route path="/provider-photograph/messages" element={<ProviderMessagesPage />} />
      </Route>

      {/* Provider Event Staff Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.PROVIDER_EVENT_STAFF]} />}> 
        <Route path="/provider-event-staff" element={<EventStaffHomePage />} />
        <Route element={<ProviderEventStaffWalletLayout />}>
          <Route path="/provider-event-staff/wallet" element={<ProviderWalletPage />} />
          <Route path="/provider-event-staff/wallet/topup" element={<WalletTopUpPage />} />
          <Route path="/provider-event-staff/wallet/withdraw" element={<WalletWithdrawPage />} />
        </Route>
        <Route path="/provider-event-staff/services" element={<ProviderServiceListPage />} />
        <Route path="/provider-event-staff/serviceCreate" element={<ProviderCreateServicePage />} />
        <Route path="/provider-event-staff/service-orders" element={<ProviderServiceOrdersPage />} />
        <Route path="/provider-event-staff/settings" element={<ProviderProfileViewPage />} />
        <Route path="/provider-event-staff/settings/edit" element={<ProviderProfileEditPage />} />
        <Route path="/provider-event-staff/settings/completion" element={<ProviderProfileCompletionPage />} />
        <Route path="/provider-event-staff/messages" element={<ProviderMessagesPage />} />
      </Route>

      {/* Staff Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLE.STAFF]} />}> 
        <Route element={<StaffLayout />}>
          <Route path="/staff" element={<StaffHomePage />} />
          <Route path="/staff/ai-token-plans" element={<StaffAiTokenPlansPage />} />
          <Route path="/staff/bookings" element={<StaffPlaceholderPage title={VI.staff.bookings.title} />} />
          <Route path="/staff/customers" element={<StaffPlaceholderPage title={VI.staff.sidebar.customers} />} />
          <Route path="/staff/reports" element={<StaffPlaceholderPage title={VI.staff.sidebar.reports} />} />
          <Route path="/staff/messages" element={<StaffPlaceholderPage title={VI.staff.sidebar.messages} />} />
          <Route path="/staff/settings" element={<DashboardProfilePage />} />
          <Route path="/staff/withdraw" element={<StaffWithdrawPage />} />
          <Route path="/staff/disputes" element={<DisputeManagementPage />} />
        </Route>
      </Route>

      {/* Global Error Pages */}
      <Route path="/no-permission" element={<NoPermissionPage />} />

      {/* Auth Pages (public) */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/onboarding/role" element={<OnboardingRolePage />} />

      {/* Payment Result Page (standalone) */}
      <Route path="/payment/result" element={<PaymentResultPage />} />
    </Routes>     
    </UserProfileProvider>
    </BreadcrumbProvider>
  )
}
