import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/types/auth';
import { getRoles } from '@/features/auth/services/tokenStorage';

type ProtectedRouteProps = {
  /**
   * Roles allowed to access this route
   */
  allowedRoles: UserRole[];

  /**
   * Redirect path if not authorized (default: /no-permission)
   */
  redirectTo?: string;
};

/**
 * Route Guard Component
 * 
 * RESPONSIBILITIES:
 * - Check if user has valid access token
 * - Check if user's role matches allowed roles
 * - Redirect to /no-permission if unauthorized
 * 
 * USAGE:
 * <Route element={<ProtectedRoute allowedRoles={[ROLE.ADMIN]} />}>
 *   <Route path="/admin" element={<AdminPage />} />
 * </Route>
 * 
 * SECURITY NOTE:
 * - This is UI protection only (URL access control)
 * - Backend MUST enforce API authorization
 * - JWT decode is client-side (not for security validation)
 */
export function ProtectedRoute({
  allowedRoles,
  redirectTo = '/no-permission',
}: ProtectedRouteProps) {
  // Get user roles from decoded JWT
  const userRoles = getRoles();

  // TEMP: Debug logs to verify role matching
  console.log('[ProtectedRoute] userRoles:', userRoles);
  console.log('[ProtectedRoute] allowedRoles:', allowedRoles);

  // Check if user has no roles (not logged in or invalid token)
  if (!userRoles || userRoles.length === 0) {
    console.warn('🔒 ProtectedRoute: No roles found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const hasPermission = userRoles.some((role) => allowedRoles.includes(role as UserRole));

  console.log('[ProtectedRoute] hasPermission:', hasPermission); // TEMP debug

  if (!hasPermission) {
    console.warn(
      '🚫 ProtectedRoute: User roles',
      userRoles,
      'do not match allowed roles',
      allowedRoles
    );
    return <Navigate to={redirectTo} replace />;
  }

  // User is authorized, render child routes
  console.log('✅ ProtectedRoute: Access granted'); // TEMP debug
  return <Outlet />;
}
