import { isProviderDashboardPath } from '@/features/profile/utils/tokenRoutes';

/** Routes using DashboardLayout / AdminLayout / StaffLayout (inner scroll, no window scroll). */
export function isDashboardShellPath(pathname: string): boolean {
  return (
    isProviderDashboardPath(pathname) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/staff')
  );
}
