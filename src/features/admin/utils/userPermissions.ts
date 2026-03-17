/**
 * User Permission Guards
 * * UI-level permission checks for admin user management actions
 * Backend MUST also enforce these rules for security
 */

const PROTECTED_ROLES = ['ADMIN', 'SUPERADMIN', '1', '2'];

export interface CanManageUserParams {
  currentUserRoles: (string | number)[];
  currentUserId?: number | null;
  targetUserId: number;
  targetUserRoles: (string | number)[];
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if current user can perform management actions on target user
 * * Rules:
 * 1. Users cannot manage themselves
 * 2. Only SUPERADMIN (role_id = 1) can manage ADMIN/SUPERADMIN (role_id = 1, 2) accounts
 * 3. View detail is always allowed (handled separately)
 */
export function canManageUser(params: CanManageUserParams): PermissionResult {
  const { currentUserRoles, currentUserId, targetUserId, targetUserRoles } = params;

  // Rule 1: Cannot manage self
  if (currentUserId && currentUserId === targetUserId) {
    return {
      allowed: false,
      reason: 'Bạn không thể thao tác với chính mình.',
    };
  }

  // Check if current user is SUPERADMIN (Chữ hoặc ID = 1)
  const isCurrentSuperadmin = currentUserRoles.some(
    (role) => String(role).toUpperCase() === 'SUPERADMIN' || String(role) === '1'
  );

  // Check if target user has protected roles (ADMIN or SUPERADMIN hoặc ID = 1, 2)
  const isTargetProtected = targetUserRoles.some((role) => {
    const normalized = String(role).toUpperCase();
    return PROTECTED_ROLES.includes(normalized);
  });

  // Rule 2: Only SUPERADMIN can manage ADMIN/SUPERADMIN
  if (!isCurrentSuperadmin && isTargetProtected) {
    return {
      allowed: false,
      reason: 'Bạn không thể thao tác với tài khoản quản trị (ADMIN/SUPERADMIN).',
    };
  }

  // All checks passed
  return { allowed: true };
}