import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Calendar,
  Star,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Provider sidebar menu item structure
 */
export type ProviderSidebarItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

/**
 * Provider sidebar menu configuration
 * Add new menu items here to extend provider navigation
 */
export const providerSidebarItems: ProviderSidebarItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/provider',
  },
  {
    key: 'services',
    label: 'My Services / Listings',
    icon: Package,
    path: '/provider/services',
  },
  {
    key: 'bookings',
    label: 'Bookings',
    icon: ShoppingBag,
    path: '/provider/bookings',
  },
  {
    key: 'schedule',
    label: 'Schedule / Availability',
    icon: Calendar,
    path: '/provider/schedule',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    icon: Star,
    path: '/provider/reviews',
  },
  {
    key: 'settings',
    label: 'Profile / Settings',
    icon: Settings,
    path: '/provider/settings',
  },
];
