import { useState, useRef } from 'react';
import { Table, Input, Select, Button, Space, Tag, Modal, message, Tooltip } from 'antd';
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
  UploadOutlined, 
  DownloadOutlined, 
} from '@ant-design/icons';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { UserDetailDrawer } from '../components/users/UserDetailDrawer';
import type { AdminUser } from '../types';
import { VI } from '@/shared/i18n/vi';
import { getStatusTagProps, normalizeStatus } from '../utils/userStatus';
import { getRoleTagProps } from '../utils/userRole';
import { canManageUser } from '../utils/userPermissions';
import { getRoles, getUserId } from '@/features/auth/services/tokenStorage';

const getUserRolesArray = (user: any): string[] => {
  if (user?.role) return [user.role];
  if (user?.roles && Array.isArray(user.roles)) return user.roles;
  return [];
};

export default function AdminUsersPage() {

  const {
    users,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
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
    handleExport,
    handleImport,
    isExporting,
    isImporting,
    handleDownloadTemplate,
  } = useAdminUsers();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null); 

  const currentUserRoles = getRoles();
  const currentUserId = getUserId();

  const allRoles = Array.from(new Set(users.flatMap((user) => getUserRolesArray(user)))).sort();
  const allStatuses = Array.from(new Set(users.map((user) => user.status))).sort();

  const handleViewDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setDrawerOpen(true);
    openProfile(user.id);
  };

  const handleLockToggle = async (user: AdminUser) => {
    const permission = canManageUser({
      currentUserRoles,
      currentUserId,
      targetUserId: user.id,
      targetUserRoles: getUserRolesArray(user),
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

  const handleBanToggle = async (user: AdminUser) => {
    const permission = canManageUser({
      currentUserRoles,
      currentUserId,
      targetUserId: user.id,
      targetUserRoles: getUserRolesArray(user),
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

  const buildActionMenu = (user: AdminUser): MenuProps['items'] => {
    const statusNorm = normalizeStatus(user.status);
    const userIsLocked = statusNorm === 'INACTIVE' || statusNorm.includes('LOCK');
    const userIsBanned = statusNorm === 'BANNED' || statusNorm.includes('BAN');

    const permission = canManageUser({
      currentUserRoles,
      currentUserId,
      targetUserId: user.id,
      targetUserRoles: getUserRolesArray(user),
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

  const columns: TableProps<AdminUser>['columns'] = [
    { 
      title: VI.admin.users.columns.id, 
      dataIndex: 'id', 
      key: 'id', 
      width: 70,
      align: 'center' // Căn giữa ID
    },
    { 
      // Gộp Username và Email thành khối "Người dùng"
      title: 'Người dùng', 
      key: 'userInfo', 
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontWeight: 600, color: '#1f2937', fontSize: 14 }}>{record.username}</span>
          <span style={{ color: '#6b7280', fontSize: 13 }}>{record.email}</span>
        </div>
      )
    },
    { 
      title: 'Số điện thoại', 
      dataIndex: 'phone', 
      key: 'phone', 
      width: 140,
      render: (phone: string | null) => {
        if (!phone || phone.trim() === '') {
          return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>—</span>;
        }
        return <span style={{ color: '#4b5563' }}>{phone}</span>; 
      }
    },
    {
      title: VI.admin.users.columns.roles,
      key: 'roles',
      width: 200,
      render: (_, record) => {
        const rolesArray = getUserRolesArray(record);
        if (rolesArray.length === 0) return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>—</span>;
        return (
          <Space size={4} wrap>
            {rolesArray.map((role) => {
              const { color, label } = getRoleTagProps(role);
              return <Tag key={role} color={color} style={{ margin: 0 }}>{label}</Tag>;
            })}
          </Space>
        );
      },
    },
    {
      title: VI.admin.users.columns.status,
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center', // Căn giữa Trạng thái nhìn cho gọn
      render: (status: string) => {
        const { color, label } = getStatusTagProps(status);
        return <Tag color={color} style={{ margin: 0 }}>{label}</Tag>;
      },
    },
    {
      title: VI.admin.users.columns.actions,
      key: 'actions',
      width: 140,
      align: 'center', // Căn giữa cột Hành động
      render: (_, user) => {
        const statusNorm = normalizeStatus(user.status);
        const userIsLocked = statusNorm === 'INACTIVE' || statusNorm.includes('LOCK');
        const userIsBanned = statusNorm === 'BANNED' || statusNorm.includes('BAN');

        const permission = canManageUser({
          currentUserRoles,
          currentUserId,
          targetUserId: user.id,
          targetUserRoles: getUserRolesArray(user),
        });

        return (
          <Space size={8} onClick={(e) => e.stopPropagation()}>
            <Tooltip title={VI.admin.users.actions.viewDetail}>
              <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(user)} />
            </Tooltip>
            
            <Tooltip title={!permission.allowed ? permission.reason : (userIsLocked ? VI.admin.users.actions.unlock : VI.admin.users.actions.lock)}>
              <Button 
                type="text" 
                icon={userIsLocked ? <UnlockOutlined /> : <LockOutlined />} 
                onClick={() => handleLockToggle(user)} 
                disabled={!permission.allowed || actionLoadingId === user.id}
                style={{ color: userIsLocked ? '#52c41a' : '#faad14' }}
              />
            </Tooltip>

            <Tooltip title={!permission.allowed ? permission.reason : (userIsBanned ? VI.admin.users.actions.unban : VI.admin.users.actions.ban)}>
              <Button 
                type="text" 
                danger={!userIsBanned}
                icon={userIsBanned ? <CheckCircleOutlined /> : <StopOutlined />} 
                onClick={() => handleBanToggle(user)} 
                disabled={!permission.allowed || actionLoadingId === user.id}
                style={userIsBanned ? { color: '#52c41a' } : undefined}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <style>{`
        .admin-user-row:hover {
          background-color: #f5f5f5 !important;
        }
      `}</style>

      <div className="w-full h-full">
        {/* Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          
          {/* TẦNG 1: TÌM KIẾM VÀ NÚT BẤM */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <Input
              placeholder={VI.admin.users.toolbar.search}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320, maxWidth: '100%' }}
              allowClear
            />
            
            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={refetch} loading={isLoading}>
                {VI.admin.users.toolbar.refresh || 'Làm mới'}
              </Button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".xlsx, .xls, .csv" 
                style={{ display: 'none' }} 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImport(file);
                    e.target.value = '';
                  }
                }}
              />
              <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
                Tải file mẫu
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport} loading={isExporting}>
                Xuất Excel
              </Button>
              <Button icon={<UploadOutlined />} loading={isImporting} onClick={() => fileInputRef.current?.click()}>
                Nhập Excel
              </Button>
            </Space>
          </div>

          {/* TẦNG 2: CÁC BỘ LỌC */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Select
              mode="multiple"
              placeholder={VI.admin.users.toolbar.filterRole}
              value={roleFilter.length > 0 ? roleFilter : undefined}
              onChange={setRoleFilter}
              style={{ width: 260 }} 
              maxTagCount="responsive"
              options={allRoles.map((role) => ({ label: role, value: role }))}
              allowClear
            />
            <Select
              placeholder={VI.admin.users.toolbar.filterStatus || "Lọc theo trạng thái"}
              value={statusFilter || undefined}
              onChange={setStatusFilter}
              style={{ width: 160 }}
              options={allStatuses.map((status) => ({ label: status, value: status }))}
              allowClear
            />
          </div>
        </div>

        {/* Table */}
        <Table<AdminUser>
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          scroll={{ y: 'calc(100vh - 300px)' }} 
          
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showTotal: (t) => `Tổng ${t} người dùng`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            }
          }}
          onRow={(user) => ({
            onClick: () => handleViewDetail(user),
            style: { cursor: 'pointer' },
          })}
          rowClassName="admin-user-row"
        />

        {/* Detail Modal */}
        <UserDetailDrawer
          open={drawerOpen}
          selectedUserId={selectedUserId ?? null}
          profile={profile}
          profileLoading={profileLoading}
          rolesFromList={selectedUser ? getUserRolesArray(selectedUser) : undefined} // ĐÃ SỬA
          onClose={handleCloseDetail}
          onBanToggle={(userId) => {
            const user = selectedUser?.id === userId ? selectedUser : users.find((u) => u.id === userId);
            if (user) handleBanToggle(user);
          }}
          onLockToggle={(userId) => {
            const user = selectedUser?.id === userId ? selectedUser : users.find((u) => u.id === userId);
            if (user) handleLockToggle(user);
          }}
          actionLoading={actionLoadingId !== null}
          canManage={
            selectedUser
              ? canManageUser({
                  currentUserRoles,
                  currentUserId,
                  targetUserId: selectedUser.id,
                  targetUserRoles: getUserRolesArray(selectedUser), // ĐÃ SỬA
                }).allowed
              : true
          }
          manageDisabledReason={
            selectedUser
              ? canManageUser({
                  currentUserRoles,
                  currentUserId,
                  targetUserId: selectedUser.id,
                  targetUserRoles: getUserRolesArray(selectedUser), // ĐÃ SỬA
                }).reason
              : undefined
          }
        />
      </div>
    </>
  );
}