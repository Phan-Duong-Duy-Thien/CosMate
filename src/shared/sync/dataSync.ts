/**
 * Cross-page data sync (lightweight event bus).
 *
 * Use when multiple hook instances / pages share the same backend data
 * but do not share React state (no TanStack Query yet).
 *
 * Prefer: mutation → optimistic patch → notify* → listeners refetch in background.
 */

export const DATA_SYNC_EVENTS = {
  /** Costume rental orders (RENT_COSTUME) — cosplayer + provider lists */
  ORDERS_CHANGED: 'cosmate:orders-changed',
  /** Service booking orders — cosplayer + provider service lists */
  SERVICE_ORDERS_CHANGED: 'cosmate:service-orders-changed',
  /** Wallet balance / transactions */
  WALLET_CHANGED: 'cosmate:wallet-changed',
  /** Costumes catalog (public list, provider list, detail) */
  COSTUMES_CHANGED: 'cosmate:costumes-changed',
  /** In-app notifications list + header badge */
  NOTIFICATIONS_CHANGED: 'cosmate:notifications-changed',
  /** Admin users list/profile status changes */
  USERS_CHANGED: 'cosmate:users-changed',
  /** Admin providers list/profile verification changes */
  PROVIDERS_CHANGED: 'cosmate:providers-changed',
  /** Admin subscription plans list/detail changes */
  SUBSCRIPTION_PLANS_CHANGED: 'cosmate:subscription-plans-changed',
  /** Provider profile (edit/completion/verification) changes */
  PROVIDER_PROFILE_CHANGED: 'cosmate:provider-profile-changed',
  /** User profile / avatar (legacy — also profile:refresh on window) */
  PROFILE_CHANGED: 'profile:refresh',
  /** AI token balance (numberOfToken) */
  TOKEN_CHANGED: 'cosmate:token-changed',
  /** Admin users list / user status updates */
  USERS_CHANGED: 'cosmate:users-changed',
  /** Admin providers list / provider status updates */
  PROVIDERS_CHANGED: 'cosmate:providers-changed',
  /** Provider profile changed (edit/verification/completion) */
  PROVIDER_PROFILE_CHANGED: 'cosmate:provider-profile-changed',
  /** Admin subscription plans list changed */
  SUBSCRIPTION_PLANS_CHANGED: 'cosmate:subscription-plans-changed',
} as const;

export type DataSyncEventName = (typeof DATA_SYNC_EVENTS)[keyof typeof DATA_SYNC_EVENTS];

export type OrdersChangedDetail = {
  orderId?: number;
  /** RENT_COSTUME | RENT_SERVICE */
  orderType?: string;
};

export type CostumesChangedDetail = {
  costumeId?: number;
  providerId?: number;
};

function dispatch<T>(eventName: DataSyncEventName, detail?: T): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    detail !== undefined
      ? new CustomEvent(eventName, { detail })
      : new Event(eventName),
  );
}

export function notifyOrdersChanged(detail?: OrdersChangedDetail): void {
  dispatch(DATA_SYNC_EVENTS.ORDERS_CHANGED, detail);
}

export function notifyServiceOrdersChanged(detail?: { orderId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.SERVICE_ORDERS_CHANGED, detail);
}

export function notifyWalletChanged(): void {
  dispatch(DATA_SYNC_EVENTS.WALLET_CHANGED);
}

export function notifyCostumesChanged(detail?: CostumesChangedDetail): void {
  dispatch(DATA_SYNC_EVENTS.COSTUMES_CHANGED, detail);
}

export function notifyNotificationsChanged(): void {
  dispatch(DATA_SYNC_EVENTS.NOTIFICATIONS_CHANGED);
}

export function notifyUsersChanged(detail?: { userId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.USERS_CHANGED, detail);
}

export function notifyProvidersChanged(detail?: { providerId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.PROVIDERS_CHANGED, detail);
}

export function notifySubscriptionPlansChanged(detail?: { planId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.SUBSCRIPTION_PLANS_CHANGED, detail);
}

export function notifyProviderProfileChanged(detail?: { providerId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.PROVIDER_PROFILE_CHANGED, detail);
}

export function notifyTokenChanged(): void {
  dispatch(DATA_SYNC_EVENTS.TOKEN_CHANGED);
}

export function notifyUsersChanged(detail?: { userId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.USERS_CHANGED, detail);
}

export function notifyProvidersChanged(detail?: { providerId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.PROVIDERS_CHANGED, detail);
}

export function notifyProviderProfileChanged(detail?: { providerId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.PROVIDER_PROFILE_CHANGED, detail);
}

export function notifySubscriptionPlansChanged(detail?: { planId?: number }): void {
  dispatch(DATA_SYNC_EVENTS.SUBSCRIPTION_PLANS_CHANGED, detail);
}

export function subscribeDataSync<T = unknown>(
  eventName: DataSyncEventName,
  handler: (detail: T) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: Event) => {
    const custom = event as CustomEvent<T>;
    handler(custom.detail);
  };

  window.addEventListener(eventName, listener);
  return () => window.removeEventListener(eventName, listener);
}
