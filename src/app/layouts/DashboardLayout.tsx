import { useState, useEffect, createElement, type ReactNode, useCallback } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Dropdown, Avatar, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { LogOut, User, ChevronRight, ChevronLeft, MessageCircle, type LucideIcon } from 'lucide-react';
import { clearAuth } from '@/features/auth/utils/authStorage';
import { VI } from '@/shared/i18n/vi';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import { useUserProfile } from '@/app/providers/UserProfileProvider';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getUserProfile } from '@/features/admin/services/adminUsers.service';
import {
  getProviderNotificationsPath,
  isProviderDashboardPath,
} from '@/features/profile/utils/tokenRoutes';
import { ProviderNotificationHeaderBell } from '@/features/provider/components/ProviderNotificationHeaderBell';
import {
  resolveDashboardContentMode,
  type DashboardContentMode,
} from '@/app/layouts/dashboardContentMode';
import { cn } from '@/lib/utils';
import { ProviderGateBoundary } from '@/features/provider/components/ProviderGateBoundary';
import { useChatPopup } from '@/features/chat/components/ChatPopupContext';
import { useUnreadCount } from '@/features/chat/hooks/useUnreadCount';
import { AdminSidebarMenu } from '@/features/admin/components/AdminSidebarMenu';
import { ProviderSubscriptionBadge } from '@/features/provider/components/ProviderSubscriptionBadge';

const { Header, Sider, Content } = Layout;

/**
 * Ant Design theme uses @ant-design/fast-color, which does not parse `oklch(...)`/`var(...)`.
 * That breaks `colorPrimary` and primary buttons can render black. Resolve `--cosmate-pink` to
 * `#rrggbb` via the browser (same visual as CSS everywhere else).
 */
const FALLBACK_COSMATE_PINK_HEX = '#e84a90';

function cssColorToHexForAntd(cssColor: string): string {
  const trimmed = cssColor.trim();
  if (typeof document === 'undefined') return FALLBACK_COSMATE_PINK_HEX;
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed;
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.position = 'absolute';
  probe.style.left = '-9999px';
  probe.style.visibility = 'hidden';
  probe.style.color = trimmed;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  probe.remove();
  const rgbaMatch = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(rgb);
  if (!rgbaMatch) return FALLBACK_COSMATE_PINK_HEX;
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(Number(rgbaMatch[1]))}${toHex(Number(rgbaMatch[2]))}${toHex(Number(rgbaMatch[3]))}`;
}

function useSyncedCosmatePrimaryForAntd(): string {
  const readToken = (): string => {
    if (typeof document === 'undefined') return FALLBACK_COSMATE_PINK_HEX;
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--cosmate-pink').trim();
    if (!raw) return FALLBACK_COSMATE_PINK_HEX;
    return cssColorToHexForAntd(raw);
  };

  const [colorPrimary, setColorPrimary] = useState(() =>
    typeof document !== 'undefined' ? readToken() : FALLBACK_COSMATE_PINK_HEX
  );

  useEffect(() => {
    setColorPrimary(readToken());
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setColorPrimary(readToken());
    });
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return colorPrimary;
}

type LucideComponentLike = LucideIcon & {
  displayName?: string;
  name?: string;
};

export type DashboardSidebarItem = {
  key: string;
  label: string;
  /** LucideIcon reference (preferred) or ReactNode JSX element */
  icon?: LucideIcon | ReactNode;
  path?: string;
  children?: DashboardSidebarItem[];
  id?: string;
  type?: 'core' | 'group' | 'item';
  displayOrder?: number;
  menuId?: string;
  iconName?: string;
};

type DashboardLayoutProps = {
  title?: string;
  sidebarItems: DashboardSidebarItem[];
  brandName?: string;
  brandShort?: string;
  children?: ReactNode;
  /** Hide the chat button in the header (used for provider dashboards) */
  showChatButton?: boolean;
  /** scroll = form/list (default); fill = full-height panel e.g. messages */
  contentMode?: DashboardContentMode;
  /** Enable drag-to-resize sidebar width. Only used by Admin layout. */
  enableSidebarResize?: boolean;
  onSidebarItemsChange?: (items: DashboardSidebarItem[]) => void;
};

export function DashboardLayout({
  title = 'Dashboard',
  sidebarItems,
  brandName = 'CosMate',
  brandShort = 'CM',
  children,
  showChatButton = true,
  contentMode: contentModeProp,
  enableSidebarResize = false,
  onSidebarItemsChange,
}: DashboardLayoutProps) {
  const SIDEBAR_STORAGE_KEY = 'cosmate-admin-sidebar-width';
  const DEFAULT_SIDEBAR_WIDTH = 240;
  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 400;

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (!enableSidebarResize) return DEFAULT_SIDEBAR_WIDTH;
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) return parsed;
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { items: breadcrumbItems, setItems } = useBreadcrumb();
  const { userProfile, setUserProfile } = useUserProfile();
  useChatPopup(); // ensure popup context is initialized
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const userId = getUserId();
  const { unreadCount: chatUnreadCount } = useUnreadCount(userId ?? null);
  const { openChat } = useChatPopup();

  const resolveIcon = (icon?: DashboardSidebarItem['icon']): React.ReactNode => {
    if (!icon) return undefined;

    if (typeof icon === 'function') {
      const IconComponent = icon as LucideComponentLike;
      return createElement(IconComponent, { size: 16 });
    }

    if (typeof icon === 'object' && icon !== null && 'render' in icon) {
      // Lucide forwardRef object (ESM bundle)
      return createElement(icon as never, { size: 16 });
    }

    return icon;
  };

  const mapToAntdMenuItems = (items: DashboardSidebarItem[]): MenuProps['items'] => {
    return items.map((item) => {
      const iconNode = resolveIcon(item.icon);

      if (item.children && item.children.length > 0) {
        return {
          key: item.key,
          icon: iconNode,
          label: item.label,
          children: mapToAntdMenuItems(item.children),
        };
      }

      return {
        key: item.key,
        icon: iconNode,
        label: item.label,
        onClick: () => {
          if (item.path) {
            navigate(item.path);
          }
        },
      };
    });
  };

  const menuItems: MenuProps['items'] = mapToAntdMenuItems(sidebarItems);

  // Set default breadcrumbs based on route
  useEffect(() => {
    const path = location.pathname;

    if (path === '/admin') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: 'Trang chủ' },
      ]);
    } else if (path === '/admin/menus') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: 'Quản lý menu' },
      ]);
    } else if (path === '/admin/audit-logs') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: 'Nhật ký hệ thống' },
      ]);
    } else if (path === '/admin/reports') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: 'Báo cáo' },
      ]);
    } else if (path === '/admin/users') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: VI.common.breadcrumb.users || 'Quản lý người dùng' },
      ]);
    } else if (path === '/admin/ai-token-plans') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: VI.admin.aiTokenPlans.title },
      ]);
    } else if (path === '/admin/ai-token-purchases') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: VI.admin.aiTokenPurchases.title },
      ]);
    } else if (path === '/admin/profile') {
      setItems([
        { label: VI.common.breadcrumb.admin || 'Quản trị', to: '/admin' },
        { label: VI.common.user.profile },
      ]);
    } else if (path === '/provider-rental') {
      setItems([{ label: VI.common.breadcrumb.provider, to: '/provider-rental' }]);
    } else if (path === '/provider-rental/costumes') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.common.breadcrumb.providerCostumes },
      ]);
    } else if (path === '/provider-rental/costumes/create') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.common.breadcrumb.providerCostumes, to: '/provider-rental/costumes' },
        { label: VI.common.breadcrumb.create },
      ]);
    } else if (path === '/provider-rental/orders') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.provider.orders.title },
      ]);
    } else if (path === '/provider-rental/subscription') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.provider.subscription.pageTitle },
      ]);
    } else if (path === '/provider/reviews') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.provider.sidebar.reviews },
      ]);
    } else if (path === '/provider/settings') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.provider.sidebar.settings },
      ]);
    } else if (path === '/provider/settings/edit') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.provider.sidebar.settings, to: '/provider/settings' },
        { label: VI.common.breadcrumb.edit },
      ]);
    } else if (path === '/provider/settings/completion') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.provider.sidebar.settings, to: '/provider/settings' },
        { label: VI.provider.profileCompletion.pageTitle },
      ]);
    } else if (path === '/provider/messages') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.provider.sidebar.messages },
      ]);
    } else if (path === '/provider-rental/wallet') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.wallet.title },
      ]);
    } else if (path === '/provider-rental/wallet/withdraw') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.wallet.title, to: '/provider-rental/wallet' },
        { label: VI.wallet.withdraw },
      ]);
    } else if (path === '/provider-rental/wallet/topup') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.wallet.title, to: '/provider-rental/wallet' },
        { label: VI.wallet.topup },
      ]);
    } else if (path === '/provider-rental/token') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.profile.token.hubTitle },
      ]);
    } else if (path === '/provider-rental/notifications') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
        { label: VI.notification.title },
      ]);
    } else if (path === '/provider-photograph') {
      setItems([{ label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' }]);
    } else if (path === '/provider-photograph/wallet') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.wallet.title },
      ]);
    } else if (path === '/provider-photograph/wallet/withdraw') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.wallet.title, to: '/provider-photograph/wallet' },
        { label: VI.wallet.withdraw },
      ]);
    } else if (path === '/provider-photograph/wallet/topup') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.wallet.title, to: '/provider-photograph/wallet' },
        { label: VI.wallet.topup },
      ]);
    } else if (path === '/provider-photograph/token') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.profile.token.hubTitle },
      ]);
    } else if (path === '/provider-photograph/notifications') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.notification.title },
      ]);
    } else if (path === '/provider-photograph/services') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.service.sidebar.serviceList },
      ]);
    } else if (path === '/provider-photograph/serviceCreate') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.service.sidebar.createService },
      ]);
    } else if (path === '/provider-photograph/service-orders') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.provider.serviceOrders.sidebar },
      ]);
    } else if (path === '/provider-photograph/subscription') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.provider.subscription.pageTitle },
      ]);
    } else if (path === '/provider-photograph/reviews') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.provider.sidebar.photographReviews },
      ]);
    } else if (path === '/provider-photograph/settings') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.provider.sidebar.photographSettings },
      ]);
    } else if (path === '/provider-photograph/settings/edit') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.provider.sidebar.photographSettings, to: '/provider-photograph/settings' },
        { label: VI.common.breadcrumb.edit },
      ]);
    } else if (path === '/provider-photograph/settings/completion') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.provider.sidebar.photographSettings, to: '/provider-photograph/settings' },
        { label: VI.provider.profileCompletion.pageTitle },
      ]);
    } else if (path === '/provider-photograph/messages') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.provider.sidebar.messages },
      ]);
    } else if (path.startsWith('/provider-photograph/')) {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
        { label: VI.common.breadcrumb.serviceDetail },
      ]);
    } else if (path === '/provider-event-staff') {
      setItems([{ label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' }]);
    } else if (path === '/provider-event-staff/wallet') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.wallet.title },
      ]);
    } else if (path === '/provider-event-staff/wallet/withdraw') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.wallet.title, to: '/provider-event-staff/wallet' },
        { label: VI.wallet.withdraw },
      ]);
    } else if (path === '/provider-event-staff/wallet/topup') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.wallet.title, to: '/provider-event-staff/wallet' },
        { label: VI.wallet.topup },
      ]);
    } else if (path === '/provider-event-staff/token') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.profile.token.hubTitle },
      ]);
    } else if (path === '/provider-event-staff/notifications') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.notification.title },
      ]);
    } else if (path === '/provider-event-staff/services') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.service.sidebar.serviceList },
      ]);
    } else if (path === '/provider-event-staff/serviceCreate') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.service.sidebar.createService },
      ]);
    } else if (path === '/provider-event-staff/service-orders') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.provider.serviceOrders.sidebar },
      ]);
    } else if (path === '/provider-event-staff/subscription') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.provider.subscription.pageTitle },
      ]);
    } else if (path === '/provider-event-staff/reviews') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.provider.sidebar.eventStaffReviews },
      ]);
    } else if (path === '/provider-event-staff/settings') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.provider.sidebar.eventStaffSettings },
      ]);
    } else if (path === '/provider-event-staff/settings/edit') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.provider.sidebar.eventStaffSettings, to: '/provider-event-staff/settings' },
        { label: VI.common.breadcrumb.edit },
      ]);
    } else if (path === '/provider-event-staff/settings/completion') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.provider.sidebar.eventStaffSettings, to: '/provider-event-staff/settings' },
        { label: VI.provider.profileCompletion.pageTitle },
      ]);
    } else if (path === '/provider-event-staff/messages') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.provider.sidebar.messages },
      ]);
    } else if (path.startsWith('/provider-event-staff/')) {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
        { label: VI.common.breadcrumb.serviceDetail },
      ]);
    } else if (path === '/staff') {
      setItems([{ label: VI.staff.layout.title, to: '/staff' }]);
    } else if (path === '/staff/withdraw') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.withdraw.title },
      ]);
    } else if (path === '/staff/disputes') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.disputes.title },
      ]);
    } else if (path === '/staff/ai-token-plans') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.tokenPlans.title },
      ]);
    } else if (path === '/staff/ai-token-purchases') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.tokenPurchases.title },
      ]);
    } else if (path === '/staff/orders' || path === '/staff/bookings') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.orders.title },
      ]);
    } else if (path === '/staff/customers') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.sidebar.customers },
      ]);
    } else if (path === '/staff/reports') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.sidebar.reports },
      ]);
    } else if (path === '/staff/messages') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.staff.sidebar.messages },
      ]);
    } else if (path === '/staff/settings') {
      setItems([
        { label: VI.staff.layout.title, to: '/staff' },
        { label: VI.common.user.profile },
      ]);
    }
  }, [location.pathname, setItems]);

  const refreshHeaderProfile = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    setTokenLoading(true);
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        setTokenBalance(profile.numberOfToken ?? 0);
        if (profile.avatarUrl || profile.fullName) {
          setUserProfile({
            avatarUrl: profile.avatarUrl ?? null,
            fullName: profile.fullName ?? null,
          });
        }
      }
    } catch {
      // Silently fail
    } finally {
      setTokenLoading(false);
    }
  }, [setUserProfile]);

  const showTokenBadge = isProviderDashboardPath(location.pathname);

  // Fetch account profile for header: avatar for all; token balance for provider dashboards
  useEffect(() => {
    const needsAvatar = !userProfile.avatarUrl;
    const needsToken = showTokenBadge && tokenBalance === null;
    if (!needsAvatar && !needsToken) return;
    void refreshHeaderProfile();
  }, [userProfile.avatarUrl, tokenBalance, refreshHeaderProfile, showTokenBadge]);

  useEffect(() => {
    const handleProfileRefresh = () => {
      void refreshHeaderProfile();
    };

    window.addEventListener('profile:refresh', handleProfileRefresh);
    return () => window.removeEventListener('profile:refresh', handleProfileRefresh);
  }, [refreshHeaderProfile]);

  const userName = userProfile.fullName || 'Admin';
  const currentPath = location.pathname;

  // Recursively find the active key and parent folder key
  const getMenuKeys = (
    items: DashboardSidebarItem[],
    path: string,
  ): { selected: string; open: string } => {
    for (const item of items) {
      if (item.path === path) return { selected: item.key, open: '' };
      if (item.children) {
        const childFound = getMenuKeys(item.children, path);
        if (childFound.selected) return { selected: childFound.selected, open: item.key };
      }
    }
    return { selected: '', open: '' };
  };

  const { selected: foundSelectedKey, open: foundOpenKey } = getMenuKeys(sidebarItems, currentPath);
  const activeKey = foundSelectedKey || sidebarItems[0]?.key || '';
  const defaultOpenKeys = foundOpenKey ? [foundOpenKey] : [];

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    window.location.reload();
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: VI.common.user.profile,
      onClick: () => {
        if (location.pathname.startsWith('/provider-photograph')) {
          navigate('/provider-photograph/settings');
        } else if (location.pathname.startsWith('/provider-event-staff')) {
          navigate('/provider-event-staff/settings');
        } else if (location.pathname.startsWith('/staff')) {
          navigate('/staff/settings');
        } else if (location.pathname.startsWith('/admin')) {
          navigate('/admin/profile');
        } else {
          navigate('/provider/settings');
        }
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: VI.common.actions.logout,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const displayTitle = breadcrumbItems.length > 0 ? breadcrumbItems[breadcrumbItems.length - 1].label : title;
  const antdColorPrimary = useSyncedCosmatePrimaryForAntd();
  const applyProviderGate = isProviderDashboardPath(location.pathname);
  const contentMode = resolveDashboardContentMode(location.pathname, contentModeProp);
  const isFillContent = contentMode === 'fill';

  // Sidebar resize handlers (admin only)
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (ev: MouseEvent) => {
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, startWidth + (ev.clientX - startX)));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Persist after release
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarWidth));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  // Persist sidebar width on change
  useEffect(() => {
    if (enableSidebarResize && !isResizing) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarWidth));
    }
  }, [sidebarWidth, enableSidebarResize, isResizing]);

  useEffect(() => {
    document.documentElement.classList.add('cosmate-dashboard-active');
    return () => document.documentElement.classList.remove('cosmate-dashboard-active');
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: antdColorPrimary,
          colorLink: antdColorPrimary,
        },
      }}
    >
    <Layout className="cosmate-dashboard-root h-full max-h-full overflow-hidden">
      <Sider
        className="cosmate-dashboard-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        theme="light"
        width={sidebarWidth}
        collapsedWidth={80}
        style={{
          overflow: 'auto',
          flex: '0 0 auto',
          alignSelf: 'stretch',
          borderRight: "1px solid var(--border)",
          userSelect: isResizing ? 'none' : undefined,
        }}
      >
        <div
          className={cn(
            'flex h-16 shrink-0 items-center border-b border-border',
            collapsed ? 'justify-center px-2' : 'justify-between gap-2 px-4',
          )}
        >
          {!collapsed && (
            <span className="min-w-0 truncate text-lg font-bold text-cosmate-pink">{brandName}</span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors',
              'hover:border-cosmate-pink/30 hover:bg-cosmate-soft-pink/40 hover:text-cosmate-pink',
            )}
            aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            title={collapsed ? brandName : undefined}
          >
            {collapsed ? <ChevronRight size={18} aria-hidden /> : <ChevronLeft size={18} aria-hidden />}
          </button>
        </div>

        {enableSidebarResize ? (
          <AdminSidebarMenu
            sidebarItems={sidebarItems}
            onSidebarItemsChange={onSidebarItemsChange}
            collapsed={collapsed}
            activeKey={activeKey}
            navigate={navigate}
          />
        ) : (
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[activeKey]}
            defaultOpenKeys={defaultOpenKeys}
            items={menuItems}
            style={{ borderRight: 0, marginTop: 16 }}
          />
        )}

        {/* Drag handle for sidebar resize — admin only */}
        {enableSidebarResize && !collapsed && (
          <div
            onMouseDown={handleResizeMouseDown}
            style={{
              position: 'absolute',
              top: 0,
              right: -3,
              bottom: 0,
              width: 6,
              cursor: 'col-resize',
              zIndex: 100,
              background: isResizing ? 'var(--cosmate-pink)' : 'transparent',
              opacity: isResizing ? 0.3 : 1,
              transition: 'background 0.15s',
            }}
            title="Kéo để thay đổi kích thước sidebar"
            onMouseEnter={(e) => { (e.currentTarget.style.background) = 'color-mix(in oklch, var(--cosmate-pink) 25%, transparent)'; }}
            onMouseLeave={(e) => { if (!isResizing) e.currentTarget.style.background = 'transparent'; }}
          />
        )}
      </Sider>

      <Layout
        className="cosmate-dashboard-main flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 pb-4"
        style={{
          transition: isResizing ? 'none' : 'width 0.2s',
          background: 'var(--background)',
        }}
      >
        <Header
          className="sticky top-0 z-10 flex h-16 min-h-16 shrink-0 items-center justify-between overflow-hidden border-b border-border px-6 shadow-[0_1px_0_0_color-mix(in_oklch,var(--cosmate-pink)_22%,transparent)]"
          style={{
            height: 64,
            // Ant Design Layout.Header applies its own background; inline wins so admin/provider headers stay on-token (not default dark).
            background:
              'linear-gradient(180deg, color-mix(in oklch, var(--cosmate-soft-pink) 15%, transparent) 0%, var(--card) 45%, var(--card) 100%)',
            color: 'var(--foreground)',
          }}
        >
          <div className="flex min-h-0 min-w-0 flex-1 items-center gap-3">
            <span
              className="hidden h-8 w-1 shrink-0 rounded-full bg-cosmate-pink/85 sm:block"
              aria-hidden
            />
            <h1 className="m-0 truncate text-xl font-semibold tracking-tight text-foreground">
              {displayTitle}
            </h1>
          </div>

          <div className="flex h-16 shrink-0 items-center gap-2 sm:gap-3">
            {showTokenBadge && <ProviderSubscriptionBadge />}
            {showTokenBadge && (
              <div
                className="hidden min-w-[110px] cursor-default items-center justify-end rounded-full border border-pink-100 bg-pink-50/60 px-3 py-1.5 text-sm font-semibold text-pink-700 shadow-sm sm:flex"
                title={VI.profile.token.headerHint}
              >
                {tokenLoading ? (
                  <Spin size="small" />
                ) : (
                  <span>
                    🪙 {(tokenBalance ?? 0).toLocaleString('vi-VN')} {VI.profile.token.unit}
                  </span>
                )}
              </div>
            )}
            {showChatButton && (
              <button
                type="button"
                onClick={() => openChat(0, 0)}
                title="Messages"
                className="relative flex h-9 cursor-pointer items-center justify-center rounded-lg border border-transparent p-1.5 text-cosmate-pink transition-colors hover:border-cosmate-pink/25 hover:bg-cosmate-soft-pink/50 hover:text-cosmate-mauve"
              >
                <MessageCircle size={22} className="shrink-0" aria-hidden />
                {chatUnreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-md bg-destructive px-0.5 text-[9px] font-bold leading-none text-primary-foreground">
                    {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                  </span>
                )}
              </button>
            )}
            {showTokenBadge && (
              <ProviderNotificationHeaderBell
                viewAllPath={getProviderNotificationsPath(location.pathname)}
              />
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex h-9 max-h-9 cursor-pointer items-center gap-2 rounded-xl border border-transparent px-2 text-foreground transition-colors hover:border-cosmate-pink/20 hover:bg-cosmate-soft-pink/40 sm:gap-3">
                {userProfile.avatarUrl ? (
                  <Avatar src={userProfile.avatarUrl} size={32} />
                ) : (
                  <Avatar size={32} className="bg-primary! text-primary-foreground!">{userName.charAt(0)}</Avatar>
                )}
                <span className="hidden max-w-[140px] truncate font-medium sm:inline">{userName}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          className="mt-4! flex min-h-0 flex-1 flex-col overflow-hidden"
          style={{
            padding: 20,
            background: 'var(--card)',
            borderRadius: 8,
          }}
        >
          {breadcrumbItems.length > 0 && (
            <div style={{ marginBottom: 12, flexShrink: 0 }}>
              {breadcrumbItems.map((item, index) => (
                <span key={index} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {item.to ? (
                    <a
                      href={item.to}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.to!);
                      }}
                      style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: 14 }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span style={{ color: "var(--foreground)", fontWeight: 500, fontSize: 14 }}>{item.label}</span>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <ChevronRight size={14} style={{ margin: "0 8px", color: "var(--muted-foreground)" }} />
                  )}
                </span>
              ))}
            </div>
          )}
          <div
            data-cosmate-dashboard-scroll
            className={cn(
              'flex min-h-0 min-w-0 flex-1 flex-col',
              isFillContent ? 'overflow-hidden' : 'overflow-y-auto',
            )}
          >
            {applyProviderGate ? (
              <ProviderGateBoundary contentMode={contentMode}>
                {children ?? <Outlet />}
              </ProviderGateBoundary>
            ) : (
              <div
                className={cn(
                  'min-h-0 w-full',
                  isFillContent ? 'flex min-h-0 flex-1 flex-col' : undefined,
                )}
              >
                {children || <Outlet />}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
    </ConfigProvider>
  );
}
