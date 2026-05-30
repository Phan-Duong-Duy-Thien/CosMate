# Data sync audit — CosMate FE

> Audit date: 2026-05-21  
> Context: Stale UI across pages when data changes on one screen (e.g. provider updates order status but table/buttons do not update until F5).

## Root cause

- No global cache (TanStack Query / SWR).
- Each `useXxx` hook keeps **isolated `useState`**; `refetch()` only updates **that hook instance**.
- Cross-page sync was **ad-hoc** (`profile:refresh`, `auth:changed`, `menuUpdated`, module-level `useUnreadCount`).

## Solution introduced (wave 1)

| Piece | Path | Role |
|-------|------|------|
| Event bus | `src/shared/sync/dataSync.ts` | `notify*` + `subscribeDataSync` |
| Order patch helpers | `src/shared/sync/patchOrderList.ts` | Optimistic list updates |
| Listener hook | `src/shared/hooks/useDataSyncRefetch.ts` | Auto-refetch all instances on event |

### Events

| Event | When to dispatch | Listeners wired |
|-------|------------------|-----------------|
| `cosmate:orders-changed` | Costume order mutation (provider/cosplayer) | `useProviderOrders`, `usePurchaseOrders`, `OrderDetailDrawer` |
| `cosmate:service-orders-changed` | Service order mutation / payment success | `useProviderServiceOrders`, `useServiceOrders` |
| `cosmate:wallet-changed` | Wallet top-up / payment `context=wallet` | `useWallet` |
| `cosmate:costumes-changed` | Provider edit/delete costume | `useProviderCostumes`, `usePublicCostumes`, `usePublicCostumeDetail` |
| `cosmate:notifications-changed` | Mark read / delete notification | `useNotifications` (layout + page) |
| `profile:refresh` (legacy) | Login, token purchase, pose battle, profile/avatar edit | `UserProfileProvider`, `useUserProfile` |
| `cosmate:addresses-changed` | Create/edit/delete address | `useUserAddresses` (profile + modals) |

### Provider costume orders (your example)

**Before:** `prepareOrder` → `refetch()` only; if GET list lags behind POST, UI stays on old status.

**After:** `useProviderOrders` → optimistic patch from POST response (or known next status for ship) → `notifyOrdersChanged` → silent background refetch.

## Domain matrix

### P0 — Implemented in wave 1

| Domain | Pages / hooks | Cross-page risk | Status |
|--------|---------------|-----------------|--------|
| Costume orders (provider) | `ProviderOrdersPage`, `useProviderOrders` | Cosplayer purchase history, profile counts | Optimistic + events |
| Costume orders (cosplayer) | `PurchaseHistoryPage`, `usePurchaseOrders`, `CosplayerProfilePage` counts | Provider orders | Events + optimistic on confirm/return |
| Order detail modal | `OrderDetailDrawer` | List vs modal | Listens `orders-changed` |
| Service orders (provider) | `useProviderServiceOrders` | Tab filter bug after mutation | Optimistic + `refreshAfterMutation` |
| Service orders (cosplayer) | `useServiceOrders`, `CosplayerProfilePage` | Purchase history service tab, profile service badge | Event listener + `useCreateServiceBooking` notify |
| Wallet | `WalletPage`, `CosplayerProfilePage`, `BuyTokenPlansSection` | Payment return | `wallet-changed` + PaymentResultPage |
| Costumes catalog | Public list, provider list, detail | Edit on provider → public list | `costumes-changed` |
| Notifications | `CosplayerSiteLayout`, `NotificationsPage` | Duplicate hook instances | `notifications-changed` |
| Payment result | `PaymentResultPage` | Orders / wallet / service after gateway | Dispatches on success |

### P1 — Still manual / partial (follow-up)

| Domain | Hooks | Gap |
|--------|-------|-----|
| Admin orders/users | `useAdminOrders`, `useAdminUsers`, … | No cross-role sync with provider/cosplayer |
| Staff orders/disputes | `useStaffOrders`, `useDisputes` | Reload buttons only |
| Provider statistics | `useProviderStatistics` | Home dashboard stale after order/costume change |
| Chat | `useChatRooms`, `useUnreadCount` | OK for unread (module ref); rooms need socket/refetch |
| Wishlist | `useWishlist` | Only `auth:changed` |
| Featured / search costumes | `useFeaturedCostumes`, `useSearchCostumes` | No `costumes-changed` listener |
| Dispute (staff) | `useDisputes` (staff + dispute feature) | Separate instances |
| Extend order | `useExtendOrder`, drawer | Partial refetch inside drawer only |
| Reviews | `useCreateReview` | Detail page only |

### P2 — Recommended long-term

- Adopt **TanStack Query** with `queryKeys` in `src/shared/sync/queryKeys.ts` (to be added).
- `staleTime` + `invalidateQueries` replaces most custom events.
- `refetchOnWindowFocus` for tab return.

## Hook checklist (for new features)

1. Define **query key** / event name for the resource.
2. On mutation: **optimistic patch** if POST returns entity; else patch known next state.
3. Call **`notify*`** (or `invalidateQueries` later).
4. **`useDataSyncRefetch`** on every hook instance that reads the same resource.
5. Do not rely on “user will navigate away and remount”.

## Files changed (wave 1)

- `src/shared/sync/dataSync.ts`
- `src/shared/sync/patchOrderList.ts`
- `src/shared/hooks/useDataSyncRefetch.ts`
- `src/features/order/hooks/useProviderOrders.ts`
- `src/features/profile/hooks/usePurchaseOrders.ts`
- `src/features/service/hooks/useProviderServiceOrders.ts`
- `src/features/profile/hooks/useServiceOrders.ts`
- `src/features/profile/hooks/useWallet.ts`
- `src/features/notification/hooks/useNotifications.ts`
- `src/features/order/components/OrderDetailDrawer.tsx`
- `src/features/order/hooks/useCreateDispute.ts`
- `src/features/general/pages/PaymentResultPage.tsx`
- `src/features/profile/pages/PurchaseHistoryPage.tsx`
- `src/features/costume-rental/*` (provider list, public list, detail, edit success)

## How to verify

1. Provider `/provider-rental/orders`: Prepare order → status tag + action icons update **without F5**.
2. Open order detail modal → perform action on table → modal status updates.
3. Cosplayer profile order badge: change order on purchase history → return to profile → counts update.
4. Provider edit costume → public `/costumes` list reflects after navigation (or if already open, refetch via event).
5. Mark notification read in header → notifications page list syncs.
