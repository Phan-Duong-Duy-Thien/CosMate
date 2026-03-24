import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Calendar,
  Star,
  Settings,
  ClipboardList,
  Camera,
  Briefcase,
  PlusCircle,
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
    key: 'orders',
    label: VI.provider.orders.title,
    icon: ClipboardList,
    path: '/provider-rental/orders',
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

/**
 * Photograph Provider sidebar menu configuration
 */
export const photographSidebarItems: ProviderSidebarItem[] = [
  {
    key: 'dashboard',
    label: VI.provider.sidebar.photographDashboard,
    icon: LayoutDashboard,
    path: '/provider-photograph',
  },
  {
    key: 'serviceList',
    label: VI.service.sidebar.serviceList,
    icon: Package,
    path: '/provider-photograph/services',
  },
  {
    key: 'serviceCreate',
    label: VI.service.sidebar.createService,
    icon: PlusCircle,
    path: '/provider-photograph/serviceCreate',
  },
  {
    key: 'schedule',
    label: VI.provider.sidebar.photographSchedule,
    icon: Calendar,
    path: '/provider-photograph/schedule',
  },
  {
    key: 'bookings',
    label: VI.provider.sidebar.photographBookings,
    icon: Camera,
    path: '/provider-photograph/bookings',
  },
  {
    key: 'reviews',
    label: VI.provider.sidebar.photographReviews,
    icon: Star,
    path: '/provider-photograph/reviews',
  },
  {
    key: 'settings',
    label: VI.provider.sidebar.photographSettings,
    icon: Settings,
    path: '/provider-photograph/settings',
  },
];

/**
 * Event Staff Provider sidebar menu configuration
 */
export const eventStaffSidebarItems: ProviderSidebarItem[] = [
  {
    key: 'dashboard',
    label: VI.provider.sidebar.eventStaffDashboard,
    icon: LayoutDashboard,
    path: '/provider-event-staff',
  },
  {
    key: 'serviceList',
    label: VI.service.sidebar.serviceList,
    icon: Package,
    path: '/provider-event-staff/services',
  },
  {
    key: 'serviceCreate',
    label: VI.service.sidebar.createService,
    icon: PlusCircle,
    path: '/provider-event-staff/serviceCreate',
  },
  {
    key: 'schedule',
    label: VI.provider.sidebar.eventStaffSchedule,
    icon: Calendar,
    path: '/provider-event-staff/schedule',
  },
  {
    key: 'bookings',
    label: VI.provider.sidebar.eventStaffBookings,
    icon: Briefcase,
    path: '/provider-event-staff/bookings',
  },
  {
    key: 'reviews',
    label: VI.provider.sidebar.eventStaffReviews,
    icon: Star,
    path: '/provider-event-staff/reviews',
  },
  {
    key: 'settings',
    label: VI.provider.sidebar.eventStaffSettings,
    icon: Settings,
    path: '/provider-event-staff/settings',
  },
];
