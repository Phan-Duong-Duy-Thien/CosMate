# CosMate_FE — Cấu trúc thư mục (Directory Structure)

> Xuất ngày: 2026-04-07

```
src/
├── App.css
├── index.css
├── main.tsx
│
├── assets/
│   ├── ai-mascot.png
│   ├── anh1.jpg
│   ├── background.jpg
│   ├── banner game.jpg
│   ├── banner marin.jpg
│   ├── banner2.jpg
│   ├── banner3.jpg
│   ├── cosmate.png
│   ├── ghn.jpg
│   ├── logo.png
│   ├── mascot-content.png
│   ├── mascot-moderation.png
│   ├── mascot-pose-100.png
│   ├── mascot-pose-bad.png
│   ├── mascot-pose-good.png
│   ├── mascot-pose-verygood.png
│   ├── mascot-pose.png
│   ├── mascot-quiz.png
│   ├── mascot-search.png
│   ├── quiz1.jpg
│   ├── quiz2.jpg
│   ├── quiz3.jpg
│   ├── react.svg
│   ├── saukura.jpg
│   └── video-mascot-quiz.mov
│
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── separator.tsx
│
├── lib/
│   └── utils.ts
│
├── services/
│   ├── authService.ts
│   └── axiosInstance.ts
│
├── shared/
│   ├── .gitkeep
│   ├── api/
│   │   └── vnLocation.api.ts
│   ├── components/
│   │   ├── AILoadingMascot.tsx
│   │   ├── Badge.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── Input.tsx
│   │   ├── RatingStars.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── SectionHeader.tsx
│   ├── data/
│   │   ├── vietnamLocations.ts
│   │   └── vietnamLocations.types.ts
│   ├── hooks/
│   │   ├── useAreaLocations.ts
│   │   └── useVietnamLocations.ts
│   ├── i18n/
│   │   └── vi.ts
│   └── utils/
│       └── vietnamLocation.utils.ts
│
├── types/
│   └── auth.ts
│
├── app/
│   ├── App.tsx
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   ├── CosplayerSiteLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── pages/
│   │   └── NoPermissionPage.tsx
│   ├── providers/
│   │   ├── .gitkeep
│   │   ├── BreadcrumbProvider.tsx
│   │   ├── ChatPopupRoot.tsx
│   │   └── UserProfileProvider.tsx
│   └── routes/
│       ├── .gitkeep
│       ├── ProtectedRoute.tsx
│       └── index.tsx
│
└── features/
    ├── admin/
    │   ├── api/
    │   │   ├── adminUsers.api.ts
    │   │   └── menu.api.ts
    │   ├── components/
    │   │   └── users/
    │   │       └── UserDetailDrawer.tsx
    │   ├── constants/
    │   │   └── sidebar.ts
    │   ├── hooks/
    │   │   ├── useAdminUsers.ts
    │   │   ├── useDynamicMenu.tsx
    │   │   └── useMenuManagement.ts
    │   ├── pages/
    │   │   ├── AdminHomePage.tsx
    │   │   ├── AdminMenusPage.tsx
    │   │   └── AdminUsersPage.tsx
    │   ├── services/
    │   │   └── adminUsers.service.ts
    │   ├── types.ts
    │   └── utils/
    │       ├── userPermissions.ts
    │       ├── userRole.ts
    │       └── userStatus.ts
    │
    ├── auth/
    │   ├── api/
    │   │   └── auth.api.ts
    │   ├── components/
    │   │   ├── AuthForm.tsx
    │   │   ├── ConfirmButton.tsx
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   ├── hooks/
    │   │   ├── useForgotPasswordRequest.ts
    │   │   ├── useLogin.ts
    │   │   ├── useRegister.ts
    │   │   └── useResetPassword.ts
    │   ├── layout/
    │   │   └── AuthLayout.tsx
    │   ├── pages/
    │   │   ├── CosplayerRegPage.tsx
    │   │   ├── ForgotPasswordPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── PhotographerRegPage.tsx
    │   │   ├── ProviderRegPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── RegisterRoleSelectPage.tsx
    │   │   ├── ResetPasswordPage.tsx
    │   │   └── StaffRegPage.tsx
    │   ├── services/
    │   │   └── tokenStorage.ts
    │   ├── types.ts
    │   └── utils/
    │       ├── authStorage.ts
    │       └── roleRedirect.ts
    │
    ├── chat/
    │   ├── api/
    │   │   └── chat.api.ts
    │   ├── components/
    │   │   ├── ChatFooter.tsx
    │   │   ├── ChatFooterInput.tsx
    │   │   ├── ChatHeader.tsx
    │   │   ├── ChatMessageBubble.tsx
    │   │   ├── ChatMessageList.tsx
    │   │   ├── ChatPopup.tsx
    │   │   ├── ChatPopupContext.tsx
    │   │   ├── ChatRoomList.tsx
    │   │   └── ProviderChatPanel.tsx
    │   ├── hooks/
    │   │   ├── useChatByRoomId.ts
    │   │   ├── useChatMessages.ts
    │   │   ├── useChatPartner.ts
    │   │   ├── useChatRoom.ts
    │   │   ├── useChatRooms.ts
    │   │   ├── useChatSocket.ts
    │   │   └── useStartChat.ts
    │   ├── pages/
    │   │   ├── ChatPage.tsx
    │   │   └── ProviderMessagesPage.tsx
    │   ├── services/
    │   │   ├── chat.service.ts
    │   │   └── chatSocket.service.ts
    │   └── types.ts
    │
    ├── costume-rental/
    │   ├── api/
    │   │   ├── costume.api.ts
    │   │   ├── costumeImages.api.ts
    │   │   ├── costumeRental.api.ts
    │   │   ├── provider.api.ts
    │   │   └── review.api.ts
    │   ├── components/
    │   │   ├── CostumeCard.tsx
    │   │   ├── CostumeGrid.tsx
    │   │   ├── Pagination.tsx
    │   │   ├── ShopResultCard.tsx
    │   │   ├── SortBar.tsx
    │   │   ├── create/
    │   │   │   ├── Phase1BasicInfoForm.tsx
    │   │   │   └── Phase2BuilderTabs.tsx
    │   │   ├── detail/
    │   │   │   ├── DetailTabs.tsx
    │   │   │   ├── MediaGallery.tsx
    │   │   │   ├── MoreFromShop.tsx
    │   │   │   ├── MyReviewForm.tsx
    │   │   │   ├── PriceBreakdownCard.tsx
    │   │   │   ├── ProductInfoSections.tsx
    │   │   │   ├── ProductReviewsSection.tsx
    │   │   │   ├── ProviderShopCard.tsx
    │   │   │   ├── PurchasePanel.tsx
    │   │   │   ├── RelatedCostumeList.tsx
    │   │   │   ├── ReviewsSection.tsx
    │   │   │   └── ShopInfoCard.tsx
    │   │   ├── edit/
    │   │   │   ├── EditBasicInfoForm.tsx
    │   │   │   ├── EditCostumeModal.tsx
    │   │   │   ├── FeesTab.tsx
    │   │   │   └── ImagesTab.tsx
    │   │   └── filters/
    │   │       └── FilterSidebar.tsx
    │   ├── hooks/
    │   │   ├── useCostumeImageActions.ts
    │   │   ├── useCostumeImages.ts
    │   │   ├── useCreateCostumeWizard.ts
    │   │   ├── useCreateReview.ts
    │   │   ├── useEditCostumeModal.ts
    │   │   ├── useFeaturedCostumes.ts
    │   │   ├── useProviderCostumes.ts
    │   │   ├── useProviderInfo.ts
    │   │   ├── usePublicCostumeDetail.ts
    │   │   └── usePublicCostumes.ts
    │   ├── mocks/
    │   │   ├── costumes.mock.ts
    │   │   ├── moreFromShop.mock.ts
    │   │   ├── rentalCount.mock.ts
    │   │   ├── reviewPermission.mock.ts
    │   │   ├── reviews.mock.ts
    │   │   └── shops.mock.ts
    │   ├── pages/
    │   │   ├── CostumeDetailPage.tsx
    │   │   ├── CostumeListPage.tsx
    │   │   ├── ProviderCostumeListPage.tsx
    │   │   └── ProviderCreateCostumePage.tsx
    │   ├── services/
    │   │   ├── costumeImages.service.ts
    │   │   ├── costumeRental.service.ts
    │   │   ├── normalizeCostumeInputs.ts
    │   │   └── validateCostumeConstraints.ts
    │   └── types.ts
    │
    ├── general/
    │   ├── components/
    │   │   └── home/
    │   │       ├── HeroCarousel.tsx
    │   │       ├── ProductCard.tsx
    │   │       ├── ProductSection.tsx
    │   │       ├── QuizModal.tsx
    │   │       ├── ShopCarousel.tsx
    │   │       └── TagChips.tsx
    │   ├── constants/
    │   │   └── guidelinesRulesContent.ts
    │   ├── mocks/
    │   │   └── home.mock.ts
    │   └── pages/
    │       ├── GuidelinesRulesPage.tsx
    │       ├── HomePage.tsx
    │       ├── NotificationsPage.tsx
    │       ├── PaymentResultPage.tsx
    │       └── home.types.ts
    │
    ├── notification/
    │   ├── api/
    │   │   └── notification.api.ts
    │   ├── hooks/
    │   │   └── useNotifications.ts
    │   ├── services/
    │   │   └── notification.service.ts
    │   └── types.ts
    │
    ├── order/
    │   ├── api/
    │   │   └── order.api.ts
    │   ├── components/
    │   │   ├── ConfirmDeliveryModal.tsx
    │   │   ├── CreateDisputeModal.tsx
    │   │   ├── OrderDetailDrawer.tsx
    │   │   ├── ReturnOrderModal.tsx
    │   │   ├── ReviewModal.tsx
    │   │   └── ShipOrderModal.tsx
    │   ├── hooks/
    │   │   ├── useCheckoutReview.ts
    │   │   ├── useCreateDispute.ts
    │   │   ├── useOrderDetail.ts
    │   │   ├── usePrepareOrder.ts
    │   │   └── useProviderOrders.ts
    │   ├── pages/
    │   │   ├── CheckoutReviewPage.tsx
    │   │   └── ProviderOrdersPage.tsx
    │   ├── services/
    │   │   └── order.service.ts
    │   ├── types.ts
    │   └── utils/
    │       ├── paymentReturnUrls.ts
    │       └── rentalDraftStorage.ts
    │
    ├── photographer-booking/
    │   ├── components/
    │   │   ├── ListingFilterBar.tsx
    │   │   ├── PhotographerCard.tsx
    │   │   ├── ProfileMainContent.tsx
    │   │   ├── ProfileSidebar.tsx
    │   │   └── ui/
    │   │       ├── badge.tsx
    │   │       ├── button-variants.ts
    │   │       ├── button.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       └── input.tsx
    │   ├── hooks/
    │   │   └── useProvidersByRole.ts
    │   ├── mocks/
    │   │   ├── ImageWithFallback.tsx
    │   │   └── PortfolioGrid.tsx
    │   ├── pages/
    │   │   ├── PhotographerProfilePage.tsx
    │   │   └── PhotographersListingPage.tsx
    │   └── types.ts
    │
    ├── pose-battle/
    │   ├── components/
    │   │   └── PoseResultOverlay.tsx
    │   ├── constants/
    │   │   └── poseBattle.constants.ts
    │   ├── hooks/
    │   │   └── usePoseBattle.ts
    │   ├── pages/
    │   │   └── PoseBattlePage.tsx
    │   ├── services/
    │   │   └── poseBattle.service.ts
    │   └── types.ts
    │
    ├── profile/
    │   ├── api/
    │   │   ├── userAddress.api.ts
    │   │   ├── userProfile.api.ts
    │   │   ├── vnLocation.api.ts
    │   │   └── wallet.api.ts
    │   ├── components/
    │   │   ├── AddressModal.tsx
    │   │   ├── EditProfileModal.tsx
    │   │   ├── GalleryGrid.tsx
    │   │   ├── ImageCropDialog.tsx
    │   │   ├── LogoutConfirmDialog.tsx
    │   │   ├── ProfileActions.tsx
    │   │   ├── ProfileBioCard.tsx
    │   │   ├── ProfileCover.tsx
    │   │   ├── ProfileSidebarCard.tsx
    │   │   ├── ProfileTabs.tsx
    │   │   ├── SortDropdown.tsx
    │   │   └── TagChips.tsx
    │   ├── hooks/
    │   │   ├── useCreateAddress.ts
    │   │   ├── useEditProfile.ts
    │   │   ├── usePurchaseOrders.ts
    │   │   ├── useUserAddresses.ts
    │   │   ├── useUserAddressesCrud.ts
    │   │   ├── useUserProfile.ts
    │   │   ├── useVnLocation.ts
    │   │   ├── useWallet.ts
    │   │   └── useWalletTopUp.ts
    │   ├── pages/
    │   │   ├── AddressCreatePage.tsx
    │   │   ├── CosplayerProfilePage.tsx
    │   │   ├── PurchaseHistoryPage.tsx
    │   │   ├── WalletPage.tsx
    │   │   └── WalletTopUpPage.tsx
    │   ├── services/
    │   │   ├── userAddress.service.ts
    │   │   ├── userProfile.service.ts
    │   │   └── wallet.service.ts
    │   └── types.ts
    │
    ├── provider/
    │   ├── api/
    │   │   ├── provider.api.ts
    │   │   ├── providerShop.api.ts
    │   │   └── subscription.api.ts
    │   ├── components/
    │   │   ├── ProviderActivationGate.tsx
    │   │   ├── ProviderProfileCompletionGate.tsx
    │   │   └── shop-profile/
    │   │       ├── RecommendedProductsSection.tsx
    │   │       ├── ShopContactsSection.tsx
    │   │       ├── ShopPoliciesSection.tsx
    │   │       ├── ShopProductCard.tsx
    │   │       ├── ShopProductGrid.tsx
    │   │       ├── ShopProductToolbar.tsx
    │   │       ├── ShopProfileHero.tsx
    │   │       └── ShopReviewsSection.tsx
    │   ├── constants/
    │   │   └── sidebar.ts
    │   ├── hooks/
    │   │   ├── useCurrentProviderProfile.ts
    │   │   ├── useProviderGate.ts
    │   │   ├── useProviderProfile.ts
    │   │   ├── useProviderProfileCompletion.ts
    │   │   ├── useProviderProfileEdit.ts
    │   │   ├── useProviderReviews.ts
    │   │   ├── useProviderShopProfile.ts
    │   │   ├── useProviderSubscribe.ts
    │   │   ├── useProviderVerification.ts
    │   │   ├── useShopProducts.ts
    │   │   ├── useShopReviews.ts
    │   │   └── useSubscriptionPlans.ts
    │   ├── mocks/
    │   │   ├── shopPolicies.mock.ts
    │   │   ├── shopProducts.mock.ts
    │   │   ├── shopProfile.mock.ts
    │   │   └── shopReviews.mock.ts
    │   ├── pages/
    │   │   ├── EventStaffHomePage.tsx
    │   │   ├── PhotographHomePage.tsx
    │   │   ├── ProviderHomePage.tsx
    │   │   ├── ProviderProfileCompletionPage.tsx
    │   │   ├── ProviderProfileEditPage.tsx
    │   │   ├── ProviderProfileViewPage.tsx
    │   │   ├── ProviderReviewsPage.tsx
    │   │   └── ShopProfilePage.tsx
    │   ├── services/
    │   │   └── provider.service.ts
    │   └── types.ts
    │
    ├── search/
    │   ├── components/
    │   │   └── AISearchBar.tsx
    │   └── hooks/
    │       └── useAISearch.ts
    │
    ├── service/
    │   ├── api/
    │   │   └── service.api.ts
    │   ├── components/
    │   │   └── CreateServiceForm.tsx
    │   ├── hooks/
    │   │   ├── useCreateService.ts
    │   │   ├── useProviderServices.ts
    │   │   ├── usePublicProviderServices.ts
    │   │   ├── usePublicServices.ts
    │   │   └── useServiceDetail.ts
    │   ├── pages/
    │   │   ├── ProviderCreateServicePage.tsx
    │   │   ├── ProviderServiceListPage.tsx
    │   │   └── ServiceDetailPage.tsx
    │   ├── services/
    │   │   └── service.service.ts
    │   └── types.ts
    │
    ├── staff-booking/
    │   ├── components/
    │   │   ├── ListingFilterBar.tsx
    │   │   ├── ProfileMainContent.tsx
    │   │   ├── ProfileSidebar.tsx
    │   │   ├── StaffCard.tsx
    │   │   └── ui/
    │   │       ├── badge.tsx
    │   │       ├── button-variants.ts
    │   │       ├── button.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       └── input.tsx
    │   ├── mocks/
    │   │   ├── ImageWithFallback.tsx
    │   │   └── PortfolioGrid.tsx
    │   ├── pages/
    │   │   ├── StaffProfilePage.tsx
    │   │   └── StaffsListingPage.tsx
    │   └── types.ts
    │
    └── style-quiz/
        ├── components/
        │   ├── QuizBoard.tsx
        │   ├── QuizHero.tsx
        │   ├── ResultCostumeGrid.tsx
        │   └── StyleResultCard.tsx
        ├── constants/
        │   └── quizQuestions.ts
        ├── hooks/
        │   └── useStyleQuiz.ts
        ├── pages/
        │   └── StyleQuizPage.tsx
        ├── services/
        │   └── styleQuiz.service.ts
        └── types.ts
```

---

## Tóm tắt

| Mục | Số lượng |
|-----|----------|
| **Features** | 14 (admin, auth, chat, costume-rental, general, notification, order, photographer-booking, pose-battle, profile, provider, search, service, staff-booking, style-quiz) |
| **App layouts** | 3 (AdminLayout, CosplayerSiteLayout, DashboardLayout) |
| **Shared components** | 13 |
| **UI components (shadcn)** | 3 |
| **Services (root)** | 2 (authService, axiosInstance) |
| **Total files in src/** | ~320 |