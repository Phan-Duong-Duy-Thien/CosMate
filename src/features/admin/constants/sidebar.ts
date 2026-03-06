import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Shirt,
  BarChart3,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';

/**
 * Admin sidebar menu item structure
 */
export type AdminSidebarItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

/**
 * Admin sidebar menu configuration
 * Add new menu items here to extend admin navigation
 */
export const adminSidebarItems: AdminSidebarItem[] = [
  {
    key: 'dashboard',
    label: VI.admin.sidebar.dashboard,
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    key: 'users',
    label: VI.admin.sidebar.users,
    icon: Users,
    path: '/admin/users',
  },
  {
    key: 'bookings',
    label: VI.admin.sidebar.bookings,
    icon: ShoppingBag,
    path: '/admin/bookings',
  },
  {
    key: 'costumes',
    label: VI.admin.sidebar.costumes,
    icon: Shirt,
    path: '/admin/costumes',
  },
  {
    key: 'reports',
    label: VI.admin.sidebar.reports,
    icon: BarChart3,
    path: '/admin/reports',
  },
  {
    key: 'settings',
    label: VI.admin.sidebar.settings,
    icon: Settings,
    path: '/admin/settings',
  },
];
