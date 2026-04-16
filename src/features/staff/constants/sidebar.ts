import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  MessageSquare,
  Banknote,
  AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';

/**
 * Staff sidebar menu item structure
 */
export type StaffSidebarItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

/**
 * Staff dashboard sidebar menu configuration
 */
export const staffSidebarItems: StaffSidebarItem[] = [
  {
    key: 'dashboard',
    label: VI.staff.sidebar.dashboard,
    icon: LayoutDashboard,
    path: '/staff',
  },
  {
    key: 'bookings',
    label: VI.staff.sidebar.bookings,
    icon: CalendarDays,
    path: '/staff/bookings',
  },
  {
    key: 'customers',
    label: VI.staff.sidebar.customers,
    icon: Users,
    path: '/staff/customers',
  },
  {
    key: 'reports',
    label: VI.staff.sidebar.reports,
    icon: BarChart3,
    path: '/staff/reports',
  },
  {
    key: 'messages',
    label: VI.staff.sidebar.messages,
    icon: MessageSquare,
    path: '/staff/messages',
  },
  {
    key: 'settings',
    label: VI.staff.sidebar.settings,
    icon: Settings,
    path: '/staff/settings',
  },
  {
    key: 'withdraw',
    label: VI.staff.sidebar.withdraw,
    icon: Banknote,
    path: '/staff/withdraw',
  },
  {
    key: 'disputes',
    label: VI.staff.sidebar.disputes,
    icon: AlertTriangle,
    path: '/staff/disputes',
  },
];
