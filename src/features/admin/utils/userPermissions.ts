/**
 * User Permission Guards
 * 
 * UI-level permission checks for admin user management actions
 * Backend MUST also enforce these rules for security
 */

const PROTECTED_ROLES = ['ADMIN', 'SUPERADMIN'];

export interface CanManageUserParams {
  currentUserRoles: string[];
  currentUserId?: number | null;
  targetUserId: number;
  targetUserRoles: string[];
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if current user can perform management actions on target user
 * 
 * Rules:
 * 1. Users cannot manage themselves
 * 2. Only SUPERADMIN can manage ADMIN/SUPERADMIN accounts
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

  // Check if current user is SUPERADMIN
  const isCurrentSuperadmin = currentUserRoles.some(
    (role) => role.toUpperCase() === 'SUPERADMIN'
  );

  // Check if target user has protected roles (ADMIN or SUPERADMIN)
  const isTargetProtected = targetUserRoles.some((role) => {
    const normalized = role.toUpperCase();
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
