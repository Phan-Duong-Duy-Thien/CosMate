import type { JwtPayload, LoginResult } from '../types';

const TOKEN_KEY = 'cosmate_access_token';
const TOKEN_TYPE_KEY = 'cosmate_token_type';
const ROLES_KEY = 'cosmate_roles';

/**
 * Save authentication data to localStorage
 */
export function saveAuth(authData: LoginResult): void {
  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(TOKEN_TYPE_KEY, authData.tokenType || 'Bearer');

  // Decode JWT and save roles
  const payload = decodeJwtPayload(authData.token);
  
  // Support both "roles" (array) and "role" (string) from JWT
  let roles: string[] = [];
  if (payload?.roles && Array.isArray(payload.roles)) {
    roles = payload.roles;
  } else if (payload?.role && typeof payload.role === 'string') {
    roles = [payload.role];
  }
  
  console.log('💾 Decoded JWT roles:', roles);
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));

  // Dispatch event for UI to update without reload
  window.dispatchEvent(new Event('auth:changed'));
}

/**
 * Get authentication data from localStorage
 */
export function getAuth(): { token: string; tokenType: string; roles: string[] } | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);
  const rolesJson = localStorage.getItem(ROLES_KEY);

  if (!token) {
    return null;
  }

  const roles = rolesJson ? JSON.parse(rolesJson) : [];

  return {
    token,
    tokenType: tokenType || 'Bearer',
    roles,
  };
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(ROLES_KEY);
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
 * Get user roles from localStorage
 */
export function getRoles(): string[] {
  const rolesJson = localStorage.getItem(ROLES_KEY);
  return rolesJson ? JSON.parse(rolesJson) : [];
}

/**
 * Get current user ID from JWT token
 * Returns null if token is missing or invalid
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
