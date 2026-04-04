import { useState, useRef } from 'react';
import { Table, Input, Select, Button, Space, Tag, Modal, message, Tooltip, Dropdown, Form } from 'antd';
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
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { register } from '@/features/auth/api/auth.api';
import type { RegisterRequest } from '@/features/auth/types';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { UserDetailDrawer } from '../components/users/UserDetailDrawer';
import type { AdminUser } from '../types';
import { VI } from '@/shared/i18n/vi';
import { getStatusTagProps, normalizeStatus } from '../utils/userStatus';
import { getRoleTagProps } from '../utils/userRole';
import { canManageUser } from '../utils/userPermissions';
import { getRoles, getUserId } from '@/features/auth/services/tokenStorage';
import { ROLE } from '@/types/auth';

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

  // Modal Tạo Người dùng state
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [createUserForm] = Form.useForm();
  const [createUserSubmitting, setCreateUserSubmitting] = useState(false);

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

  // Xử lý tạo người dùng mới
  const handleCreateUser = async (values: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: string;
  }) => {
    setCreateUserSubmitting(true);
    try {
      const payload: RegisterRequest = {
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        role: values.role as any,
      };
      await register(payload);
      message.success('Tạo người dùng thành công');
      setCreateUserModalOpen(false);
      createUserForm.resetFields();
      refetch();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Tạo người dùng thất bại');
    } finally {
      setCreateUserSubmitting(false);
    }
  };

  const columns: TableProps<AdminUser>['columns'] = [
    { 
      title: VI.admin.users.columns.id, 
      dataIndex: 'id', 
      key: 'id', 
      width: 70,
      align: 'center'
    },
    { 
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
      align: 'center',
      render: (status: string) => {
        const { color, label } = getStatusTagProps(status);
        return <Tag color={color} style={{ margin: 0 }}>{label}</Tag>;
      },
    },
    {
      title: VI.admin.users.columns.actions,
      key: 'actions',
      width: 140,
      align: 'center',
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
                title="Tải file Excel"
                placeholder="Tải file Excel"
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

              <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateUserModalOpen(true)}>
                {VI.admin.users.toolbar.createUser || 'Tạo người dùng'}
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
          rolesFromList={selectedUser ? getUserRolesArray(selectedUser) : undefined} 
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
                  targetUserRoles: getUserRolesArray(selectedUser), 
                }).allowed
              : true
          }
          manageDisabledReason={
            selectedUser
              ? canManageUser({
                  currentUserRoles,
                  currentUserId,
                  targetUserId: selectedUser.id,
                  targetUserRoles: getUserRolesArray(selectedUser), 
                }).reason
              : undefined
          }
        />

        {/* Create User Modal */}
        <Modal
          title={VI.admin.users.toolbar.createUser || 'Tạo người dùng'}
          open={createUserModalOpen}
          onCancel={() => {
            setCreateUserModalOpen(false);
            createUserForm.resetFields();
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            form={createUserForm}
            layout="vertical"
            onFinish={handleCreateUser}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              label={VI.auth.register.username || 'Tên đăng nhập'}
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={VI.auth.register.usernamePlaceholder || 'Nhập tên đăng nhập...'} />
            </Form.Item>
            <Form.Item
              label={VI.auth.register.fullName || 'Họ và tên'}
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder={VI.auth.register.fullNamePlaceholder || 'Nhập họ và tên...'} />
            </Form.Item>
            <Form.Item
              label={VI.auth.register.email || 'Email'}
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={VI.auth.register.emailPlaceholder || 'Nhập email...'} />
            </Form.Item>
            <Form.Item
              label={VI.auth.register.phone || 'Số điện thoại'}
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^0\d{9}$/, message: 'Số điện thoại phải có 10 số, bắt đầu bằng 0' },
              ]}
            >
              <Input placeholder={VI.auth.register.phonePlaceholder || 'Nhập số điện thoại...'} />
            </Form.Item>
            <Form.Item
              label={VI.auth.register.password || 'Mật khẩu'}
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ]}
            >
              <Input.Password placeholder={VI.auth.register.passwordPlaceholder || 'Nhập mật khẩu...'} />
            </Form.Item>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select placeholder="Chọn vai trò">
                <Select.Option value="COSPLAYER">Cosplayer</Select.Option>
                <Select.Option value="PROVIDER_RENTAL">Provider (Thuê trang phục)</Select.Option>
                <Select.Option value="PROVIDER_PHOTOGRAPH">Photographer (Thợ ảnh)</Select.Option>
                <Select.Option value="PROVIDER_EVENT_STAFF">Event Staff (Nhân sự sự kiện)</Select.Option>
                <Select.Option value="STAFF">Staff (Nhân viên hệ thống)</Select.Option>
                <Select.Option value="ADMIN">Admin (Quản trị viên)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setCreateUserModalOpen(false);
                  createUserForm.resetFields();
                }}>
                  {VI.common.actions.cancel || 'Hủy'}
                </Button>
                <Button type="primary" htmlType="submit" loading={createUserSubmitting}>
                  {VI.admin.users.toolbar.createUser || 'Tạo người dùng'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}