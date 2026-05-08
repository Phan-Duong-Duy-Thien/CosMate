import { useState, useEffect, createElement, type ReactNode } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
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
import { AITokenBadge } from '@/shared/components/AITokenBadge';
const { Header, Sider, Content } = Layout;

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
    } else if (path.startsWith('/provider-photograph/')) {
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
    } else if (path === '/provider-event-staff') {
      setItems([{ label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' }]);
    } else if (path.startsWith('/provider-event-staff/')) {
      setItems([{ label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' }]);
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

  // Fetch user profile for header avatar
  useEffect(() => {
    if (userProfile.avatarUrl || userProfile.fullName) return;

    const userId = getUserId();
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(userId);
        if (profile?.avatarUrl || profile?.fullName || profile?.numberOfToken !== undefined) {
          setUserProfile({
            avatarUrl: profile.avatarUrl ?? null,
            fullName: profile.fullName ?? null,
            numberOfToken: profile.numberOfToken,
          });
        }
      } catch {
        // Silently fail
      }
    };

    fetchProfile();
  }, [userProfile.avatarUrl, userProfile.fullName, setUserProfile]);

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

  return (
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
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingLeft: collapsed ? 0 : 24,
            borderBottom: '1px solid #f0f0f0',
            fontWeight: 700,
            fontSize: 18,
            color: '#7C3AED',
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
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{displayTitle}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                <MessageCircle size={22} style={{ color: '#64748b' }} />
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
                      backgroundColor: '#ef4444',
                      color: '#fff',
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
            <AITokenBadge />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 8,
                }}
              >
                {userProfile.avatarUrl ? (
                  <Avatar src={userProfile.avatarUrl} />
                ) : (
                  <Avatar style={{ backgroundColor: '#7C3AED' }}>{userName.charAt(0)}</Avatar>
                )}
                <span style={{ fontWeight: 500 }}>{userName}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: 16,
            padding: 20,
            background: '#fff',
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
                      style={{ color: '#64748b', textDecoration: 'none', fontSize: 14 }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span style={{ color: '#1e293b', fontWeight: 500, fontSize: 14 }}>{item.label}</span>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <ChevronRight size={14} style={{ margin: '0 8px', color: '#94a3b8' }} />
                  )}
                </span>
              ))}
            </div>
          )}
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
}
