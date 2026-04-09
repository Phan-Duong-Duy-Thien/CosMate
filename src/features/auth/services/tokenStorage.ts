import type { JwtPayload, LoginResult } from '../types';

const TOKEN_KEY = 'cosmate_access_token';
const TOKEN_TYPE_KEY = 'cosmate_token_type';
const ROLES_KEY = 'cosmate_roles';

/**
 * Sync sessionStorage from localStorage on app boot.
 * Called once at module load to restore auth from localStorage (Remember Me case).
 * Only syncs if sessionStorage is empty — to avoid overwriting a recently
 * logged-in account (e.g., Staff tab) with a remembered account (e.g., Cosplayer).
 */
export function syncSessionFromLocal(): void {
  if (sessionStorage.getItem(TOKEN_KEY)) return;

  const lsToken = localStorage.getItem(TOKEN_KEY);
  if (lsToken) {
    sessionStorage.setItem(TOKEN_KEY, lsToken);
    sessionStorage.setItem(TOKEN_TYPE_KEY, localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer');
    const lsRoles = localStorage.getItem(ROLES_KEY);
    if (lsRoles) sessionStorage.setItem(ROLES_KEY, lsRoles);
  }
}

/**
 * Save authentication data.
 * Always saves to localStorage so auth persists across refreshes and new tabs.
 * @param authData - The auth result from login
 * @param persistent - Unused; kept for backward compatibility.
 *                     Auth always persists regardless of this flag.
 */
export function saveAuth(authData: LoginResult, persistent?: boolean): void {
  // Always save to localStorage (persists across refresh and new tabs)
  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(TOKEN_TYPE_KEY, authData.tokenType || 'Bearer');

  // Decode JWT and build roles
  const payload = decodeJwtPayload(authData.token);
  let roles: string[] = [];
  if (payload?.roles && Array.isArray(payload.roles)) {
    roles = payload.roles;
  } else if (payload?.role && typeof payload.role === 'string') {
    roles = [payload.role];
  }

  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));

  // Also save to sessionStorage so getAuth() reads from there (avoids
  // localStorage round-trip on every auth check)
  sessionStorage.setItem(TOKEN_KEY, authData.token);
  sessionStorage.setItem(TOKEN_TYPE_KEY, authData.tokenType || 'Bearer');
  sessionStorage.setItem(ROLES_KEY, JSON.stringify(roles));

  console.log('💾 Auth saved');
  window.dispatchEvent(new Event('auth:changed'));
}

/**
 * Get authentication data from localStorage (always persisted on login).
 */
export function getAuth(): { token: string; tokenType: string; roles: string[] } | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const tokenType = localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';
  const rolesJson = localStorage.getItem(ROLES_KEY);
  const roles = rolesJson ? JSON.parse(rolesJson) : [];

  return { token, tokenType, roles };
}

/**
 * Clear all authentication data from localStorage and sessionStorage
 */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(ROLES_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_TYPE_KEY);
  sessionStorage.removeItem(ROLES_KEY);
  window.dispatchEvent(new Event('auth:changed'));
}

/**
 * Decode JWT token payload without verification (client-side only)
 * This is NOT for security validation - only for reading payload data
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode base64url payload (second part)
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
 * Get user roles from localStorage (always persisted on login).
 */
export function getRoles(): string[] {
  const rolesJson = localStorage.getItem(ROLES_KEY);
  return rolesJson ? JSON.parse(rolesJson) : [];
}

/**
 * Get current user ID from JWT token stored in localStorage.
 */
export function getUserId(): number | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  // JWT typically stores user ID in "sub" field
  if (payload.sub && typeof payload.sub === 'string') {
    const id = parseInt(payload.sub, 10);
    return isNaN(id) ? null : id;
  }

  // Some backends might use "userId" or "id" field
  if (payload.userId && typeof payload.userId === 'number') {
    return payload.userId;
  }

  if (payload.id && typeof payload.id === 'number') {
    return payload.id;
  }

  return null;
}
