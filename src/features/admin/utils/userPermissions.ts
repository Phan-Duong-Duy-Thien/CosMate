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

export function canManageUser(params: CanManageUserParams): PermissionResult {
  const { currentUserRoles, currentUserId, targetUserId, targetUserRoles } = params;

  // 1. Không thể tự thao tác với chính mình
  if (currentUserId && currentUserId === targetUserId) {
    return { allowed: false, reason: 'Bạn không thể thao tác với chính mình.' };
  }

  const isCurrentSuperadmin = (currentUserRoles || []).some(r => String(r) === '1' || String(r).toUpperCase() === 'SUPERADMIN');
  const isCurrentAdmin = (currentUserRoles || []).some(r => String(r) === '2' || String(r).toUpperCase() === 'ADMIN');
  
  const isTargetSuperadmin = (targetUserRoles || []).some(r => String(r) === '1' || String(r).toUpperCase() === 'SUPERADMIN');
  const isTargetAdmin = (targetUserRoles || []).some(r => String(r) === '2' || String(r).toUpperCase() === 'ADMIN');

  // 2. Logic: SUPER ADMIN (1) chỉ quản lý ADMIN (2)
  if (isCurrentSuperadmin) {
    if (isTargetAdmin) return { allowed: true };
    return { allowed: false, reason: 'Super Admin chỉ quản lý các tài khoản Admin.' };
  }

  // 3. Logic: ADMIN (2) quản lý mọi người trừ SUPER ADMIN (1)
  if (isCurrentAdmin) {
    if (isTargetSuperadmin) return { allowed: false, reason: 'Admin không thể thao tác với tài khoản Super Admin.' };
    return { allowed: true };
  }

  return { allowed: false, reason: 'Bạn không có quyền thực hiện hành động này.' };
}