import { getRoles } from '@/features/auth/services/tokenStorage';
import { ROLE } from '@/types/auth';
import type { UserRole } from '@/types/auth';

export const COSPLAYER_TOKEN_PATH = '/profile/token';

const PROVIDER_TOKEN_PATHS = {
  rental: '/provider-rental/token',
  photograph: '/provider-photograph/token',
  eventStaff: '/provider-event-staff/token',
} as const;

export function isProviderDashboardPath(pathname: string): boolean {
  return (
    pathname.startsWith('/provider-rental') ||
    pathname.startsWith('/provider-photograph') ||
    pathname.startsWith('/provider-event-staff')
  );
}

export function getTokenHubPathFromPathname(pathname: string): string | null {
  if (pathname.startsWith('/provider-rental')) return PROVIDER_TOKEN_PATHS.rental;
  if (pathname.startsWith('/provider-photograph')) return PROVIDER_TOKEN_PATHS.photograph;
  if (pathname.startsWith('/provider-event-staff')) return PROVIDER_TOKEN_PATHS.eventStaff;
  return null;
}

function normalizeRole(role: unknown): string {
  const s = String(role).toUpperCase();
  if (s === '5') return ROLE.PROVIDER_RENTAL;
  if (s === '6') return ROLE.PROVIDER_PHOTOGRAPH;
  if (s === '7') return ROLE.PROVIDER_EVENT_STAFF;
  return s;
}

/** Resolves token hub URL from JWT roles (cosplayer default). */
export function getTokenHubPathForRoles(roles?: unknown[]): string {
  const list = (roles ?? getRoles()).map(normalizeRole);
  if (list.includes(ROLE.PROVIDER_RENTAL)) return PROVIDER_TOKEN_PATHS.rental;
  if (list.includes(ROLE.PROVIDER_PHOTOGRAPH)) return PROVIDER_TOKEN_PATHS.photograph;
  if (list.includes(ROLE.PROVIDER_EVENT_STAFF)) return PROVIDER_TOKEN_PATHS.eventStaff;
  return COSPLAYER_TOKEN_PATH;
}

export function getTokenHubPathForCurrentUser(): string {
  return getTokenHubPathForRoles(getRoles() as UserRole[]);
}

export function getProviderDashboardBackPath(pathname: string): string {
  if (pathname.startsWith('/provider-photograph')) return '/provider-photograph';
  if (pathname.startsWith('/provider-event-staff')) return '/provider-event-staff';
  return '/provider-rental';
}

export function getWalletTopUpRedirectForToken(pathname: string): string {
  const tokenPath = getTokenHubPathFromPathname(pathname) ?? COSPLAYER_TOKEN_PATH;
  if (pathname.startsWith('/provider-rental')) {
    return `/provider-rental/wallet/topup?redirect=${encodeURIComponent(tokenPath)}`;
  }
  if (pathname.startsWith('/provider-photograph')) {
    return `/provider-photograph/wallet/topup?redirect=${encodeURIComponent(tokenPath)}`;
  }
  if (pathname.startsWith('/provider-event-staff')) {
    return `/provider-event-staff/wallet/topup?redirect=${encodeURIComponent(tokenPath)}`;
  }
  return `/profile/wallet/topup?redirect=${encodeURIComponent(tokenPath)}`;
}

export const DEFAULT_COSPLAYER_WALLET_TOPUP_REDIRECT =
  '/profile/wallet/topup?redirect=/profile/token';
