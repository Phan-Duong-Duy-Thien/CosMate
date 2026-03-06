/**
 * AdminUsersPage
 * 
 * Main page for user management
 * Orchestrates: toolbar, table, drawer
 * No axios calls - uses hook for data/actions
 */

import { useState } from 'react';
import { Table, Input, Select, Button, Space, Tag, Dropdown, Modal, message } from 'antd';
import type { TableProps, MenuProps } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  MoreOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { adminSidebarItems } from '../constants/sidebar';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { UserDetailDrawer } from '../components/users/UserDetailDrawer';
import type { AdminUser } from '../types';
import { VI } from '@/shared/i18n/vi';
import { getStatusTagProps, normalizeStatus } from '../utils/userStatus';
import { getRoleTagProps } from '../utils/userRole';
import { canManageUser } from '../utils/userPermissions';
import { getRoles, getUserId } from '@/features/auth/services/tokenStorage';

// No local helpers needed - using centralized status utils

export default function AdminUsersPage() {
  const {
    filteredUsers,
    isLoading,
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    runAction,
    actionLoadingId,
    refetch,
    selectedUserId,
    profile,
    profileLoading,
    openProfile,
    closeProfile,
  } = useAdminUsers();

  // Detail modal state (selectedUser from list: roles + permission lookup)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Get current user info for permission checks
  const currentUserRoles = getRoles();
  const currentUserId = getUserId();

  /**
   * Extract unique roles from all users (for filter dropdown)
   */
  const allRoles = Array.from(
    new Set(filteredUsers.flatMap((user) => user.roles))
  ).sort();

  /**
   * Extract unique statuses from all users (for filter dropdown)
   */
  const allStatuses = Array.from(
    new Set(filteredUsers.map((user) => user.status))
  ).sort();

  /**
   * Handle view detail: open modal and fetch profile from GET /api/users/{id}/profile
   */
  const handleViewDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setDrawerOpen(true);
    openProfile(user.id);
  };

  /**
   * Handle lock/unlock action with confirmation
   * Auto-close modal after success
   */
  const handleLockToggle = async (user: AdminUser) => {
    // Permission check
    const permission = canManageUser({
      currentUserRoles,
      currentUserId,
      targetUserId: user.id,
      targetUserRoles: user.roles,
    });

    if (!permission.allowed) {
      message.warning(permission.reason || 'Không có quyền thực hiện hành động này');
      return;
    }

    const statusNorm = normalizeStatus(user.status);
    const userIsLocked = statusNorm === 'INACTIVE' || statusNorm.includes('LOCK');
    const actionType = userIsLocked ? 'unlock' : 'lock';
    
    Modal.confirm({
      title: userIsLocked ? VI.admin.users.confirm.unlockTitle : VI.admin.users.confirm.lockTitle,
      content: userIsLocked ? VI.admin.users.confirm.unlockMessage : VI.admin.users.confirm.lockMessage,
      okText: VI.admin.users.confirm.ok,
      cancelText: VI.admin.users.confirm.cancel,
      onOk: async () => {
        await runAction(actionType, user.id);
        setDrawerOpen(false);
        setSelectedUser(null);
        closeProfile();
      },
    });
  };

  /**
   * Handle ban/unban action with confirmation
   * Auto-close modal after success
   */
  const handleBanToggle = async (user: AdminUser) => {
    // Permission check
    const permission = canManageUser({
      currentUserRoles,
      currentUserId,
      targetUserId: user.id,
      targetUserRoles: user.roles,
    });

    if (!permission.allowed) {
      message.warning(permission.reason || 'Không có quyền thực hiện hành động này');
      return;
    }

    const statusNorm = normalizeStatus(user.status);
    const userIsBanned = statusNorm === 'BANNED' || statusNorm.includes('BAN');
    const actionType = userIsBanned ? 'unban' : 'ban';
    
    Modal.confirm({
      title: userIsBanned ? VI.admin.users.confirm.unbanTitle : VI.admin.users.confirm.banTitle,
      content: userIsBanned ? VI.admin.users.confirm.unbanMessage : VI.admin.users.confirm.banMessage,
      okText: VI.admin.users.confirm.ok,
      cancelText: VI.admin.users.confirm.cancel,
      okType: userIsBanned ? 'default' : 'danger',
      onOk: async () => {
        await runAction(actionType, user.id);
        setDrawerOpen(false);
        setSelectedUser(null);
        closeProfile();
      },
    });
  };

  const handleCloseDetail = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
    closeProfile();
  };

  /**
   * Build action menu items for each user row
   */
  const buildActionMenu = (user: AdminUser): MenuProps['items'] => {
    const statusNorm = normalizeStatus(user.status);
    const userIsLocked = statusNorm === 'INACTIVE' || statusNorm.includes('LOCK');
    const userIsBanned = statusNorm === 'BANNED' || statusNorm.includes('BAN');

    // Check permissions
    const permission = canManageUser({
      currentUserRoles,
      currentUserId,
      targetUserId: user.id,
      targetUserRoles: user.roles,
    });

    return [
      {
        key: 'view',
        label: VI.admin.users.actions.viewDetail,
        icon: <EyeOutlined />,
        onClick: () => handleViewDetail(user),
      },
      { type: 'divider' },
      {
        key: 'lock',
        label: userIsLocked ? VI.admin.users.actions.unlock : VI.admin.users.actions.lock,
        icon: userIsLocked ? <UnlockOutlined /> : <LockOutlined />,
        onClick: () => handleLockToggle(user),
        disabled: !permission.allowed || actionLoadingId === user.id,
        title: !permission.allowed ? permission.reason : undefined,
      },
      {
        key: 'ban',
        label: userIsBanned ? VI.admin.users.actions.unban : VI.admin.users.actions.ban,
        icon: userIsBanned ? <CheckCircleOutlined /> : <StopOutlined />,
        onClick: () => handleBanToggle(user),
        disabled: !permission.allowed || actionLoadingId === user.id,
        danger: !userIsBanned,
        title: !permission.allowed ? permission.reason : undefined,
      },
    ];
  };

  /**
   * Table columns definition (compact: removed fullName, phone, createdAt)
   */
  const columns: TableProps<AdminUser>['columns'] = [
    {
      title: VI.admin.users.columns.id,
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: VI.admin.users.columns.username,
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: VI.admin.users.columns.email,
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: VI.admin.users.columns.roles,
      dataIndex: 'roles',
      key: 'roles',
      width: 240,
      render: (roles: string[]) => (
        <Space size={4} wrap>
          {roles.map((role) => {
            const { color, label } = getRoleTagProps(role);
            return (
              <Tag key={role} color={color}>
                {label}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: VI.admin.users.columns.status,
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => {
        const { color, label } = getStatusTagProps(status);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: VI.admin.users.columns.actions,
      key: 'actions',
      width: 100,
      render: (_, user) => (
        <Dropdown
          menu={{ items: buildActionMenu(user) }}
          trigger={['click']}
          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            loading={actionLoadingId === user.id}
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking button
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-user-row:hover {
          background-color: #f5f5f5 !important;
        }
      `}</style>
      <DashboardLayout
        title={VI.admin.users.pageTitle}
        sidebarItems={adminSidebarItems.map((item) => ({
          key: item.key,
          label: item.label,
          icon: <item.icon size={18} />,
          path: item.path,
        }))}
        brandName={VI.common.appNameAdmin}
      >
      {/* Toolbar */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder={VI.admin.users.toolbar.search}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            mode="multiple"
            placeholder={VI.admin.users.toolbar.filterRole}
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ minWidth: 200 }}
            options={allRoles.map((role) => ({ label: role, value: role }))}
            allowClear
          />
          <Select
            placeholder={VI.admin.users.toolbar.filterStatus}
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ minWidth: 180 }}
            options={allStatuses.map((status) => ({ label: status, value: status }))}
            allowClear
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={refetch}
            loading={isLoading}
          >
            {VI.admin.users.toolbar.refresh}
          </Button>
        </Space>
      </div>

      {/* Table (clickable rows open detail drawer) */}
      <Table<AdminUser>
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 20,
          showTotal: (total) => `Tổng ${total} người dùng`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onRow={(user) => ({
          onClick: () => handleViewDetail(user),
          style: { cursor: 'pointer' },
        })}
        rowClassName="admin-user-row"
      />

      {/* Detail Modal: profile from GET /api/users/{id}/profile, roles from list */}
      <UserDetailDrawer
        open={drawerOpen}
        selectedUserId={selectedUserId ?? null}
        profile={profile}
        profileLoading={profileLoading}
        rolesFromList={selectedUser?.roles}
        onClose={handleCloseDetail}
        onBanToggle={(userId) => {
          const user = selectedUser?.id === userId ? selectedUser : filteredUsers.find((u) => u.id === userId);
          if (user) handleBanToggle(user);
        }}
        onLockToggle={(userId) => {
          const user = selectedUser?.id === userId ? selectedUser : filteredUsers.find((u) => u.id === userId);
          if (user) handleLockToggle(user);
        }}
        actionLoading={actionLoadingId !== null}
        canManage={
          selectedUser
            ? canManageUser({
                currentUserRoles,
                currentUserId,
                targetUserId: selectedUser.id,
                targetUserRoles: selectedUser.roles,
              }).allowed
            : true
        }
        manageDisabledReason={
          selectedUser
            ? canManageUser({
                currentUserRoles,
                currentUserId,
                targetUserId: selectedUser.id,
                targetUserRoles: selectedUser.roles,
              }).reason
            : undefined
        }
      />
      </DashboardLayout>
    </>
  );
}
