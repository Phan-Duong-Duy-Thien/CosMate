import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { LogOut, User } from 'lucide-react';
import { clearAuth } from '@/features/auth/utils/authStorage';
import { VI } from '@/shared/i18n/vi';

const { Header, Sider, Content } = Layout;

/**
 * Dashboard sidebar item structure
 */
export type DashboardSidebarItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
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

  // TODO: Read user info from auth context when implemented
  const userName = 'User';

  // Convert sidebar items to Ant Design Menu format
  const menuItems: MenuProps['items'] = sidebarItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => {
      if (item.path) {
        navigate(item.path);
      }
    },
  }));

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
      onClick: () => console.log('TODO: Navigate to profile'),
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
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
