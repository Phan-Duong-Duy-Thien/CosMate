import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { LogOut, User, ChevronRight } from 'lucide-react';
import { clearAuth } from '@/features/auth/utils/authStorage';
import { VI } from '@/shared/i18n/vi';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';

const { Header, Sider, Content } = Layout;

/**
 * Dashboard sidebar item structure
 */
export type DashboardSidebarItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: DashboardSidebarItem[];
};

type DashboardLayoutProps = {
  /**
   * Page title displayed in header
   */
  title?: string;

  /**
   * Sidebar menu items (role-specific, injected from feature)
   */
  sidebarItems: DashboardSidebarItem[];

  /**
   * Brand name displayed in sidebar (default: "CosMate")
   */
  brandName?: string;

  /**
   * Brand abbreviation when collapsed (default: "CM")
   */
  brandShort?: string;

  /**
   * Page content
   */
  children: ReactNode;
};

/**
 * Reusable Dashboard Shell Layout
 * 
 * Used by: Admin, Provider, Photographer dashboards
 * 
 * RESPONSIBILITIES:
 * - Ant Design Layout structure (Sider, Header, Content)
 * - Collapsible sidebar
 * - Shared header with user dropdown
 * - Logout placeholder (TODO: implement)
 * 
 * DOES NOT:
 * - Know about roles or permissions
 * - Define sidebar items (injected via props)
 * - Handle domain-specific logic
 */
export function DashboardLayout({
  title = 'Dashboard',
  sidebarItems,
  brandName = 'CosMate',
  brandShort = 'CM',
  children,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { items: breadcrumbItems, setItems } = useBreadcrumb();

  const mapToAntdMenuItems = (items: DashboardSidebarItem[]): MenuProps['items'] => {
    return items.map((item) => {
      // Nếu có menu con thì gọi đệ quy
      if (item.children && item.children.length > 0) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: mapToAntdMenuItems(item.children), // Đệ quy ở đây
        };
      }
      // Nếu là menu cấp cuối thì gắn sự kiện chuyển trang
      return {
        key: item.key,
        icon: item.icon,
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
        { label: VI.common.breadcrumb.admin, to: '/admin' },
      ]);
    } else if (path === '/admin/users') {
      setItems([
        { label: VI.common.breadcrumb.admin, to: '/admin' },
        { label: VI.common.breadcrumb.users },
      ]);
    } else if (path === '/provider-rental') {
      setItems([
        { label: VI.common.breadcrumb.provider, to: '/provider-rental' },
      ]);
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
    } else if (path === '/provider-photograph') {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
      ]);
    } else if (path.startsWith('/provider-photograph/')) {
      setItems([
        { label: VI.common.breadcrumb.providerPhotograph, to: '/provider-photograph' },
      ]);
    } else if (path === '/provider-event-staff') {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
      ]);
    } else if (path.startsWith('/provider-event-staff/')) {
      setItems([
        { label: VI.common.breadcrumb.providerEventStaff, to: '/provider-event-staff' },
      ]);
    }
  }, [location.pathname, setItems]);

  // TODO: Read user info from auth context when implemented
  const userName = 'User';

  // Get current active menu key from pathname
  const currentPath = location.pathname;
  const activeKey =
    sidebarItems.find((item) => item.path === currentPath)?.key ||
    sidebarItems[0]?.key ||
    '';

  /**
   * Handle user logout
   * - Clears all auth data from localStorage
   * - Redirects to login page
   */
  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    window.location.reload();
  };

  // User dropdown menu items
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
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
        {/* Brand / Logo */}
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

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        {/* Header */}
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
          {/* Left: Page Title */}
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h1>

          {/* Right: User Dropdown */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 8,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Avatar style={{ backgroundColor: '#7C3AED' }}>{userName.charAt(0)}</Avatar>
              <span style={{ fontWeight: 500 }}>{userName}</span>
            </div>
          </Dropdown>
        </Header>

        {/* Content Area */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          {breadcrumbItems.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {breadcrumbItems.map((item, index) => (
                <span key={index} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {item.to ? (
                    <a
                      href={item.to}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.to!);
                      }}
                      style={{
                        color: '#64748b',
                        textDecoration: 'none',
                        fontSize: 14,
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span style={{ color: '#1e293b', fontWeight: 500, fontSize: 14 }}>
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <ChevronRight size={14} style={{ margin: '0 8px', color: '#94a3b8' }} />
                  )}
                </span>
              ))}
            </div>
          )}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
