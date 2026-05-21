import {
  LayoutDashboard,
  Package,
  Star,
  Settings,
  ClipboardList,
  PlusCircle,
  MessageCircle,
  Wallet,
  Coins,
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
    icon: PlusCircle,
    path: '/provider-rental/costumes/create',
  },
  {
    key: 'orders',
    label: VI.provider.orders.title,
    icon: ClipboardList,
    path: '/provider-rental/orders',
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
  {
    key: 'messages',
    label: VI.provider.sidebar.messages,
    icon: MessageCircle,
    path: '/provider/messages',
  },
  {
    key: 'wallet',
    label: VI.provider.sidebar.wallet,
    icon: Wallet,
    path: '/provider-rental/wallet',
  },
  {
    key: 'aiToken',
    label: VI.provider.sidebar.aiToken,
    icon: Coins,
    path: '/provider-rental/token',
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
    key: 'serviceOrders',
    label: VI.provider.serviceOrders.sidebar,
    icon: ClipboardList,
    path: '/provider-photograph/service-orders',
  },
  {
    key: 'reviews',
    label: VI.provider.sidebar.photographReviews,
    icon: Star,
    path: '/provider-photograph/reviews',
  },
  {
    key: 'serviceCreate',
    label: VI.service.sidebar.createService,
    icon: PlusCircle,
    path: '/provider-photograph/serviceCreate',
  },
  {
    key: 'settings',
    label: VI.provider.sidebar.photographSettings,
    icon: Settings,
    path: '/provider-photograph/settings',
  },
  {
    key: 'messages',
    label: VI.provider.sidebar.messages,
    icon: MessageCircle,
    path: '/provider-photograph/messages',
  },
  {
    key: 'wallet',
    label: VI.provider.sidebar.wallet,
    icon: Wallet,
    path: '/provider-photograph/wallet',
  },
  {
    key: 'aiToken',
    label: VI.provider.sidebar.aiToken,
    icon: Coins,
    path: '/provider-photograph/token',
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
    key: 'serviceOrders',
    label: VI.provider.serviceOrders.sidebar,
    icon: ClipboardList,
    path: '/provider-event-staff/service-orders',
  },
  {
    key: 'reviews',
    label: VI.provider.sidebar.eventStaffReviews,
    icon: Star,
    path: '/provider-event-staff/reviews',
  },
  {
    key: 'serviceCreate',
    label: VI.service.sidebar.createService,
    icon: PlusCircle,
    path: '/provider-event-staff/serviceCreate',
  },
  {
    key: 'settings',
    label: VI.provider.sidebar.eventStaffSettings,
    icon: Settings,
    path: '/provider-event-staff/settings',
  },
  {
    key: 'messages',
    label: VI.provider.sidebar.messages,
    icon: MessageCircle,
    path: '/provider-event-staff/messages',
  },
  {
    key: 'wallet',
    label: VI.provider.sidebar.wallet,
    icon: Wallet,
    path: '/provider-event-staff/wallet',
  },
  {
    key: 'aiToken',
    label: VI.provider.sidebar.aiToken,
    icon: Coins,
    path: '/provider-event-staff/token',
  },
];
