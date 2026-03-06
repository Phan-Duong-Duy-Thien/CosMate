# CosMate_FE — Cấu trúc thư mục (Directory Structure)

> Xuất ngày: 2025-02-09

```
CosMate_FE/
│
├── .cursor/
│   └── skills/
│       └── cosmate-fe-workflow-driver/
│           └── SKILL.md
│
├── docs/
│   ├── admin-user-management-implementation.md
│   └── i18n-vietnamese-standardization.md
│
├── public/
│   └── vite.svg
│
├── scripts/
│   └── i18n-check.mjs
│
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   │   ├── CosplayerSiteLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── pages/
│   │   │   └── NoPermissionPage.tsx
│   │   ├── providers/
│   │   │   └── .gitkeep
│   │   ├── routes/
│   │   │   ├── index.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── App.tsx
│   │
│   ├── assets/
│   │   └── react.svg
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── separator.tsx
│   │
│   ├── features/
│   │   ├── admin/
│   │   │   ├── api/
│   │   │   │   └── adminUsers.api.ts
│   │   │   ├── components/
│   │   │   │   └── users/
│   │   │   │       └── UserDetailDrawer.tsx
│   │   │   ├── constants/
│   │   │   │   └── sidebar.ts
│   │   │   ├── hooks/
│   │   │   │   └── useAdminUsers.ts
│   │   │   ├── pages/
│   │   │   │   ├── AdminHomePage.tsx
│   │   │   │   └── AdminUsersPage.tsx
│   │   │   ├── services/
│   │   │   │   └── adminUsers.service.ts
│   │   │   ├── utils/
│   │   │   │   ├── userPermissions.ts
│   │   │   │   ├── userRole.ts
│   │   │   │   └── userStatus.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── auth.api.ts
│   │   │   ├── components/
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   ├── ConfirmButton.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   └── useRegister.ts
│   │   │   ├── layout/
│   │   │   │   └── AuthLayout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── CosplayerRegPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── PhotographerRegPage.tsx
│   │   │   │   ├── ProviderRegPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── RegisterRoleSelectPage.tsx
│   │   │   │   └── StaffRegPage.tsx
│   │   │   ├── services/
│   │   │   │   └── tokenStorage.ts
│   │   │   ├── utils/
│   │   │   │   ├── authStorage.ts
│   │   │   │   └── roleRedirect.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── costume-rental/
│   │   │   ├── components/
│   │   │   │   ├── detail/
│   │   │   │   │   ├── DetailTabs.tsx
│   │   │   │   │   ├── MediaGallery.tsx
│   │   │   │   │   ├── PriceBreakdownCard.tsx
│   │   │   │   │   ├── PurchasePanel.tsx
│   │   │   │   │   ├── RelatedCostumeList.tsx
│   │   │   │   │   ├── ReviewsSection.tsx
│   │   │   │   │   └── ShopInfoCard.tsx
│   │   │   │   ├── filters/
│   │   │   │   │   └── FilterSidebar.tsx
│   │   │   │   ├── CostumeCard.tsx
│   │   │   │   ├── CostumeGrid.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── ShopResultCard.tsx
│   │   │   │   └── SortBar.tsx
│   │   │   ├── mocks/
│   │   │   │   ├── costumes.mock.ts
│   │   │   │   └── shops.mock.ts
│   │   │   ├── pages/
│   │   │   │   ├── CostumeDetailPage.tsx
│   │   │   │   └── CostumeListPage.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── general/
│   │   │   ├── components/
│   │   │   │   └── home/
│   │   │   │       ├── HeroCarousel.tsx
│   │   │   │       ├── ProductCard.tsx
│   │   │   │       ├── ProductSection.tsx
│   │   │   │       ├── QuizModal.tsx
│   │   │   │       ├── ShopCarousel.tsx
│   │   │   │       └── TagChips.tsx
│   │   │   ├── mocks/
│   │   │   │   └── home.mock.ts
│   │   │   └── pages/
│   │   │       ├── HomePage.tsx
│   │   │       └── home.types.ts
│   │   │
│   │   ├── photographer-booking/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── button-variants.ts
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   └── input.tsx
│   │   │   │   ├── ListingFilterBar.tsx
│   │   │   │   ├── PhotographerCard.tsx
│   │   │   │   ├── ProfileMainContent.tsx
│   │   │   │   └── ProfileSidebar.tsx
│   │   │   ├── mocks/
│   │   │   │   ├── ImageWithFallback.tsx
│   │   │   │   └── PortfolioGrid.tsx
│   │   │   ├── pages/
│   │   │   │   ├── PhotographerProfilePage.tsx
│   │   │   │   └── PhotographersListingPage.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── EditProfileModal.tsx
│   │   │   │   ├── GalleryGrid.tsx
│   │   │   │   ├── LogoutConfirmDialog.tsx
│   │   │   │   ├── ProfileActions.tsx
│   │   │   │   ├── ProfileSidebarCard.tsx
│   │   │   │   ├── ProfileTabs.tsx
│   │   │   │   ├── SortDropdown.tsx
│   │   │   │   └── TagChips.tsx
│   │   │   ├── pages/
│   │   │   │   └── CosplayerProfilePage.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── provider/
│   │   │   ├── constants/
│   │   │   │   └── sidebar.ts
│   │   │   └── pages/
│   │   │       └── ProviderHomePage.tsx
│   │   │
│   │   └── staff-booking/
│   │       ├── components/
│   │       │   ├── ui/
│   │       │   │   ├── badge.tsx
│   │       │   │   ├── button-variants.ts
│   │       │   │   ├── button.tsx
│   │       │   │   ├── dropdown-menu.tsx
│   │       │   │   └── input.tsx
│   │       │   ├── ListingFilterBar.tsx
│   │       │   ├── ProfileMainContent.tsx
│   │       │   ├── ProfileSidebar.tsx
│   │       │   └── StaffCard.tsx
│   │       ├── mocks/
│   │       │   ├── ImageWithFallback.tsx
│   │       │   └── PortfolioGrid.tsx
│   │       ├── pages/
│   │       │   ├── StaffProfilePage.tsx
│   │       │   └── StaffsListingPage.tsx
│   │       └── types.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   └── axiosInstance.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── SectionHeader.tsx
│   │   └── i18n/
│   │       └── vi.ts
│   │
│   ├── types/
│   │   └── auth.ts
│   │
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Tóm tắt

| Mục | Số lượng |
|-----|----------|
| **Features** | 8 (admin, auth, costume-rental, general, photographer-booking, profile, provider, staff-booking) |
| **App layouts** | 2 (CosplayerSiteLayout, DashboardLayout) |
| **Shared components** | 8 |
| **UI components (shadcn)** | 3 |
| **Services** | 2 (authService, axiosInstance) |
| **Docs** | 2 |

*Bỏ qua: `.git/`, `node_modules/`*
