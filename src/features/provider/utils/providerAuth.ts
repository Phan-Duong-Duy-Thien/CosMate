import { getAuth } from '@/features/auth/services/tokenStorage';

/**
 * Resolve numeric provider id from JWT payload (providerId or provider_id).
 */
export function getProviderIdFromAuth(): number | null {
  const auth = getAuth();
  if (!auth?.token) return null;

  try {
    const parts = auth.token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    const decoded = JSON.parse(jsonPayload) as Record<string, unknown>;
    const id = decoded?.providerId ?? decoded?.provider_id ?? null;
    return typeof id === 'number' ? id : null;
  } catch {
    return null;
  }
}
