import { useState, useEffect, createElement, type ReactNode } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { LogOut, User, ChevronRight, MessageCircle, type LucideIcon } from 'lucide-react';
import { clearAuth } from '@/features/auth/utils/authStorage';
import { VI } from '@/shared/i18n/vi';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import { useUserProfile } from '@/app/providers/UserProfileProvider';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getUserProfile } from '@/features/admin/services/adminUsers.service';
import { useChatPopup } from '@/features/chat/components/ChatPopupContext';
import { useUnreadCount } from '@/features/chat/hooks/useUnreadCount';

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
};

type DashboardLayoutProps = {
  title?: string;
  sidebarItems: DashboardSidebarItem[];
  brandName?: string;
  brandShort?: string;
  children?: ReactNode;
  /** Hide the chat button in the header (used for provider dashboards) */
  showChatButton?: boolean;
};

export function DashboardLayout({
  title = 'Dashboard',
  sidebarItems,
  brandName = 'CosMate',
  brandShort = 'CM',
  children,
  showChatButton = true,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { items: breadcrumbItems, setItems } = useBreadcrumb();
  const { userProfile, setUserProfile } = useUserProfile();
  useChatPopup(); // ensure popup context is initialized

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
    }
  }, [location.pathname, setItems]);

  // Fetch account profile for header: need avatar even when fullName was cached without photo
  useEffect(() => {
    if (userProfile.avatarUrl) return;

    const userId = getUserId();
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(userId);
        if (profile?.avatarUrl || profile?.fullName) {
          setUserProfile({
            avatarUrl: profile.avatarUrl ?? null,
            fullName: profile.fullName ?? null,
          });
        }
      } catch {
        // Silently fail
      }
    };

    fetchProfile();
  }, [userProfile.avatarUrl, setUserProfile]);

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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: antdColorPrimary,
          colorLink: antdColorPrimary,
        },
      }}
    >
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingLeft: collapsed ? 0 : 24,
            borderBottom: "1px solid var(--border)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--cosmate-pink)",
          }}
        >
          {collapsed ? brandShort : brandName}
        </div>

        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[activeKey]}
          defaultOpenKeys={defaultOpenKeys}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: "var(--card)",
            borderBottom: "1px solid var(--border)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <h1 className="m-0 text-xl font-semibold text-foreground">{displayTitle}</h1>

          <div className="flex items-center gap-3">
            {showChatButton && (
              <button
                type="button"
                onClick={() => openChat(0, 0)}
                title="Messages"
                style={{
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={22} style={{ color: "var(--muted-foreground)" }} />
                {chatUnreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      minWidth: 16,
                      height: 16,
                      padding: '0 3px',
                      borderRadius: 8,
                      backgroundColor: "var(--destructive)",
                      color: "var(--primary-foreground)",
                      fontSize: 9,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                  >
                    {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                  </span>
                )}
              </button>
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 text-foreground hover:bg-accent/60">
                {userProfile.avatarUrl ? (
                  <Avatar src={userProfile.avatarUrl} />
                ) : (
                  <Avatar className="bg-primary! text-primary-foreground!">{userName.charAt(0)}</Avatar>
                )}
                <span className="font-medium">{userName}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: 16,
            padding: 20,
            background: "var(--card)",
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          {breadcrumbItems.length > 0 && (
            <div style={{ marginBottom: 12 }}>
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
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
    </ConfigProvider>
  );
}
