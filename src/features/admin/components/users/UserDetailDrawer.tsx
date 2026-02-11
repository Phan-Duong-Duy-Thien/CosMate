/**
 * UserDetailModal Component
 * 
 * UI-only component to display user details in a centered modal
 * No API calls - receives data and callbacks via props
 */

import { Modal, Descriptions, Tag, Button, Space, Divider, Typography } from 'antd';
import { LockOutlined, UnlockOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import type { AdminUser } from '../../types';
import { VI } from '@/shared/i18n/vi';
import { getStatusTagProps, normalizeStatus } from '../../utils/userStatus';
import { getRoleTagProps } from '../../utils/userRole';

const { Text } = Typography;

interface UserDetailModalProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onBanToggle: (userId: number, isBanned: boolean) => void;
  onLockToggle: (userId: number, isLocked: boolean) => void;
  actionLoading: boolean;
  onActionSuccess?: () => void; // Callback after successful action
  canManage?: boolean; // Permission to manage this user
  manageDisabledReason?: string; // Reason why management is disabled
}

/**
 * Format date string to dd/MM/yyyy HH:mm
 */
function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  } catch {
    return dateString;
  }
}

export function UserDetailModal({
  open,
  user,
  onClose,
  onBanToggle,
  onLockToggle,
  actionLoading,
  canManage = true,
  manageDisabledReason,
}: UserDetailModalProps) {
  if (!user) return null;

  const statusNormalized = normalizeStatus(user.status);
  const statusTagProps = getStatusTagProps(user.status);

  // Determine which buttons to show based on status
  const renderActionButtons = () => {
    const buttons: JSX.Element[] = [];

    if (statusNormalized === 'ACTIVE') {
      // Show Lock + Ban buttons
      buttons.push(
        <Button
          key="lock"
          type="default"
          icon={<LockOutlined />}
          onClick={() => onLockToggle(user.id, false)}
          loading={actionLoading}
          disabled={!canManage}
          title={!canManage ? manageDisabledReason : undefined}
          style={{ borderColor: '#faad14', color: '#faad14' }}
        >
          {VI.admin.users.actions.lock}
        </Button>
      );
      buttons.push(
        <Button
          key="ban"
          type="primary"
          danger
          icon={<StopOutlined />}
          onClick={() => onBanToggle(user.id, false)}
          loading={actionLoading}
          disabled={!canManage}
          title={!canManage ? manageDisabledReason : undefined}
        >
          {VI.admin.users.actions.ban}
        </Button>
      );
    } else if (statusNormalized === 'INACTIVE' || statusNormalized.includes('LOCK')) {
      // Show Unlock button
      buttons.push(
        <Button
          key="unlock"
          type="primary"
          icon={<UnlockOutlined />}
          onClick={() => onLockToggle(user.id, true)}
          loading={actionLoading}
          disabled={!canManage}
          title={!canManage ? manageDisabledReason : undefined}
        >
          {VI.admin.users.actions.unlock}
        </Button>
      );
    } else if (statusNormalized === 'BANNED' || statusNormalized.includes('BAN')) {
      // Show Unban button
      buttons.push(
        <Button
          key="unban"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => onBanToggle(user.id, true)}
          loading={actionLoading}
          disabled={!canManage}
          title={!canManage ? manageDisabledReason : undefined}
        >
          {VI.admin.users.actions.unban}
        </Button>
      );
    }

    return buttons;
  };

  // Get helper text based on status
  const getHintText = () => {
    if (statusNormalized === 'ACTIVE') {
      return VI.admin.users.detail.statusHint.active;
    } else if (statusNormalized === 'INACTIVE' || statusNormalized.includes('LOCK')) {
      return VI.admin.users.detail.statusHint.inactive;
    } else if (statusNormalized === 'BANNED' || statusNormalized.includes('BAN')) {
      return VI.admin.users.detail.statusHint.banned;
    }
    return '';
  };

  // Footer with action buttons
  const modalFooter = (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
        {getHintText()}
      </Text>
      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        {renderActionButtons()}
        <Button onClick={onClose}>{VI.common.actions.close}</Button>
      </Space>
    </div>
  );

  return (
    <Modal
      title={VI.admin.users.detail.title}
      open={open}
      onCancel={onClose}
      centered
      width={640}
      footer={modalFooter}
    >
      {/* User ID Header */}
      <div style={{ marginBottom: 24 }}>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
          {VI.admin.users.detail.userId}
        </Text>
        <Text strong style={{ fontSize: 20 }}>
          #{user.id}
        </Text>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Basic Info Section */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>
          {VI.admin.users.detail.basicInfo}
        </Text>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={VI.admin.users.columns.username}>
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label={VI.admin.users.columns.email}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label={VI.admin.users.columns.fullName}>
            {user.fullName || VI.admin.users.detail.noData}
          </Descriptions.Item>
          <Descriptions.Item label={VI.admin.users.columns.phone}>
            {user.phone || VI.admin.users.detail.noData}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Account Info Section */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>
          {VI.admin.users.detail.accountInfo}
        </Text>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={VI.admin.users.columns.roles}>
            <Space size={4} wrap>
              {user.roles.map((role) => {
                const { color, label } = getRoleTagProps(role);
                return (
                  <Tag key={role} color={color}>
                    {label}
                  </Tag>
                );
              })}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={VI.admin.users.columns.status}>
            <Tag color={statusTagProps.color}>{statusTagProps.label}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={VI.admin.users.columns.createdAt}>
            {formatDate(user.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
}

// Keep old export name for backward compatibility
export const UserDetailDrawer = UserDetailModal;
