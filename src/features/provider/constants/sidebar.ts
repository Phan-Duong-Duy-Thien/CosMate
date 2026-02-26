import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Calendar,
  Star,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';

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
    label: VI.provider.sidebar.dashboard,
    icon: LayoutDashboard,
    path: '/provider-rental',
  },
  {
    key: 'costumeList',
    label: VI.provider.sidebar.costumeList,
    icon: Package,
    path: '/provider-rental/costumes',
  },
  {
    key: 'costumeCreate',
    label: VI.provider.sidebar.costumeCreate,
    icon: Package,
    path: '/provider-rental/costumes/create',
  },
  {
    key: 'bookings',
    label: VI.provider.sidebar.bookings,
    icon: ShoppingBag,
    path: '/provider/bookings',
  },
  {
    key: 'schedule',
    label: VI.provider.sidebar.schedule,
    icon: Calendar,
    path: '/provider/schedule',
  },
  {
    key: 'reviews',
    label: VI.provider.sidebar.reviews,
    icon: Star,
    path: '/provider/reviews',
  },
  {
    key: 'settings',
    label: VI.provider.sidebar.settings,
    icon: Settings,
    path: '/provider/settings',
  },
];
