import type { JwtPayload, LoginResult } from '../types';

const TOKEN_KEY = 'cosmate_access_token';
const TOKEN_TYPE_KEY = 'cosmate_token_type';
const ROLES_KEY = 'cosmate_roles';
const REMEMBER_ME_KEY = 'cosmate_remember_me';

function isRememberMeEnabled(): boolean {
  return localStorage.getItem(REMEMBER_ME_KEY) === '1';
}

function readAuthFromStorage(): { token: string; tokenType: string; roles: string[] } | null {
  let token = sessionStorage.getItem(TOKEN_KEY);
  let tokenType = sessionStorage.getItem(TOKEN_TYPE_KEY);
  let rolesJson = sessionStorage.getItem(ROLES_KEY);

  if (token) {
    const roles = rolesJson ? JSON.parse(rolesJson) : [];
    return { token, tokenType: tokenType || 'Bearer', roles };
  }

  if (!isRememberMeEnabled()) return null;

  token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  tokenType = localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';
  rolesJson = localStorage.getItem(ROLES_KEY);
  const roles = rolesJson ? JSON.parse(rolesJson) : [];

  return { token, tokenType, roles };
}

function clearLocalAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(ROLES_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
}

function clearSessionAuth(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_TYPE_KEY);
  sessionStorage.removeItem(ROLES_KEY);
}

function buildRolesFromToken(token: string): string[] {
  const payload = decodeJwtPayload(token);
  if (payload?.roles && Array.isArray(payload.roles)) {
    return payload.roles;
  }
  if (payload?.role && typeof payload.role === 'string') {
    return [payload.role];
  }
  return [];
}

/**
 * Sync sessionStorage from localStorage on app boot (Remember Me only).
 * Only syncs if sessionStorage is empty — to avoid overwriting a recently
 * logged-in account (e.g., Staff tab) with a remembered account (e.g., Cosplayer).
 */
export function syncSessionFromLocal(): void {
  if (sessionStorage.getItem(TOKEN_KEY)) return;
  if (!isRememberMeEnabled()) return;

  const lsToken = localStorage.getItem(TOKEN_KEY);
  if (!lsToken) return;

  sessionStorage.setItem(TOKEN_KEY, lsToken);
  sessionStorage.setItem(TOKEN_TYPE_KEY, localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer');
  const lsRoles = localStorage.getItem(ROLES_KEY);
  if (lsRoles) sessionStorage.setItem(ROLES_KEY, lsRoles);
}

/**
 * Save authentication data.
 * @param authData - The auth result from login
 * @param persistent - When true (Remember Me), persist across browser sessions via localStorage.
 *                     When false, session-only (cleared when tab/browser session ends).
 */
export function saveAuth(authData: LoginResult, persistent?: boolean): void {
  const remember = persistent === true;
  const roles = buildRolesFromToken(authData.token);
  const rolesJson = JSON.stringify(roles);
  const tokenType = authData.tokenType || 'Bearer';

  sessionStorage.setItem(TOKEN_KEY, authData.token);
  sessionStorage.setItem(TOKEN_TYPE_KEY, tokenType);
  sessionStorage.setItem(ROLES_KEY, rolesJson);

  if (remember) {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
    localStorage.setItem(ROLES_KEY, rolesJson);
    localStorage.setItem(REMEMBER_ME_KEY, '1');
  } else {
    clearLocalAuth();
  }

  window.dispatchEvent(new Event('auth:changed'));
}

/**
 * Get authentication data (session first, then localStorage if Remember Me).
 */
export function getAuth(): { token: string; tokenType: string; roles: string[] } | null {
  return readAuthFromStorage();
}

/**
 * Token + type for HTTP clients (same read rules as getAuth).
 */
export function getAccessTokenForRequest(): { token: string; tokenType: string } | null {
  const auth = readAuthFromStorage();
  if (!auth) return null;
  return { token: auth.token, tokenType: auth.tokenType };
}

/**
 * Whether the current session was saved with Remember Me.
 */
export function isAuthPersistent(): boolean {
  return isRememberMeEnabled();
}

/**
 * Clear all authentication data from localStorage and sessionStorage.
 */
export function clearAuth(): void {
  clearLocalAuth();
  clearSessionAuth();
  window.dispatchEvent(new Event('auth:changed'));
}

/**
 * Decode JWT token payload without verification (client-side only)
 * This is NOT for security validation - only for reading payload data
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    console.error('Failed to decode JWT payload:', error);
    return null;
  }
}

/**
 * Get user roles from storage (session first, then localStorage if Remember Me).
 */
export function getRoles(): string[] {
  const auth = readAuthFromStorage();
  return auth?.roles ?? [];
}

/**
 * Get current user ID from JWT token in storage.
 */
export function getUserId(): number | null {
  const auth = readAuthFromStorage();
  if (!auth) return null;

  const payload = decodeJwtPayload(auth.token);
  if (!payload) return null;

  if (payload.sub && typeof payload.sub === 'string') {
    const id = parseInt(payload.sub, 10);
    return isNaN(id) ? null : id;
  }

  if (payload.userId && typeof payload.userId === 'number') {
    return payload.userId;
  }

  if (payload.id && typeof payload.id === 'number') {
    return payload.id;
  }

  return null;
}
