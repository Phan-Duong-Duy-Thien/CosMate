import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Shirt,
  BarChart3,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    key: 'users',
    label: 'Users Management',
    icon: Users,
    path: '/admin/users',
  },
  {
    key: 'bookings',
    label: 'Bookings / Orders',
    icon: ShoppingBag,
    path: '/admin/bookings',
  },
  {
    key: 'costumes',
    label: 'Costumes / Rentals',
    icon: Shirt,
    path: '/admin/costumes',
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/admin/reports',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings',
  },
];
