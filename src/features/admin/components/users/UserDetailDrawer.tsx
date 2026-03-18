/**
 * UserDetailModal Component
 *
 * UI-only component to display user details in a centered modal.
 * Data from GET /api/users/{id}/profile (avatar + profile). Roles from list.
 * No API calls - receives data and callbacks via props.
 */

import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  Typography,
  Avatar,
  Skeleton,
  Spin,
} from 'antd';
import { LockOutlined, UnlockOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { AdminUserProfile } from '../../types';
import { VI } from '@/shared/i18n/vi';
import { getStatusTagProps, normalizeStatus } from '../../utils/userStatus';
import { getRoleTagProps } from '../../utils/userRole';

const { Text } = Typography;

interface UserDetailModalProps {
  open: boolean;
  selectedUserId: number | null;
  profile: AdminUserProfile | null;
  profileLoading: boolean;
  rolesFromList?: string[];
  onClose: () => void;
  onBanToggle: (userId: number) => void;
  onLockToggle: (userId: number) => void;
  actionLoading: boolean;
  canManage?: boolean;
  manageDisabledReason?: string;
}

export function UserDetailModal({
  open,
  selectedUserId,
  profile,
  profileLoading,
  rolesFromList = [],
  onClose,
  onBanToggle,
  onLockToggle,
  actionLoading,
  canManage = true,
  manageDisabledReason,
}: UserDetailModalProps) {
  const userId = profile?.id ?? selectedUserId;
  const statusNormalized = profile ? normalizeStatus(profile.status) : '';
  const statusTagProps = profile ? getStatusTagProps(profile.status) : { color: 'default', label: '—' };

  const renderActionButtons = () => {
    if (userId == null) return null;
    const buttons: React.ReactNode[] = [];

    if (statusNormalized === 'ACTIVE') {
      buttons.push(
        <Button
          key="lock"
          type="default"
          icon={<LockOutlined />}
          onClick={() => onLockToggle(userId)}
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
          onClick={() => onBanToggle(userId)}
          loading={actionLoading}
          disabled={!canManage}
          title={!canManage ? manageDisabledReason : undefined}
        >
          {VI.admin.users.actions.ban}
        </Button>
      );
    } else if (statusNormalized === 'INACTIVE' || statusNormalized.includes('LOCK')) {
      buttons.push(
        <Button
          key="unlock"
          type="primary"
          icon={<UnlockOutlined />}
          onClick={() => onLockToggle(userId)}
          loading={actionLoading}
          disabled={!canManage}
          title={!canManage ? manageDisabledReason : undefined}
        >
          {VI.admin.users.actions.unlock}
        </Button>
      );
    } else if (statusNormalized === 'BANNED' || statusNormalized.includes('BAN')) {
      buttons.push(
        <Button
          key="unban"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => onBanToggle(userId)}
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

  const getHintText = () => {
    if (statusNormalized === 'ACTIVE') return VI.admin.users.detail.statusHint.active;
    if (statusNormalized === 'INACTIVE' || statusNormalized.includes('LOCK'))
      return VI.admin.users.detail.statusHint.inactive;
    if (statusNormalized === 'BANNED' || statusNormalized.includes('BAN'))
      return VI.admin.users.detail.statusHint.banned;
    return '';
  };

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

  const avatarSize = 96;
  const noData = VI.admin.users.detail.noData;

  return (
    <Modal
      title={VI.admin.users.detail.title}
      open={open}
      onCancel={onClose}
      centered
      width={640}
      footer={modalFooter}
    >
      {profileLoading ? (
        <Spin spinning>
          <div style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </Spin>
      ) : profile ? (
        <>
          {/* User ID */}
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              {VI.admin.users.detail.userId}
            </Text>
            <Text strong style={{ fontSize: 20 }}>
              #{profile.id}
            </Text>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Top section: Avatar + basic info */}
          <div style={{ marginBottom: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>
              {profile.avatarUrl ? (
                <Avatar
                  src={profile.avatarUrl}
                  alt={profile.username}
                  size={avatarSize}
                  style={{ width: avatarSize, height: avatarSize, borderRadius: 8 }}
                />
              ) : (
                <Avatar
                  size={avatarSize}
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: 8,
                    fontSize: 36,
                  }}
                >
                  {(profile.username || '?')[0].toUpperCase()}
                </Avatar>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>
                {VI.admin.users.detail.basicInfo}
              </Text>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label={VI.admin.users.columns.username}>
                  {profile.username}
                </Descriptions.Item>
                <Descriptions.Item label={VI.admin.users.columns.email}>
                  {profile.email}
                </Descriptions.Item>
                <Descriptions.Item label={VI.admin.users.columns.fullName}>
                  {profile.fullName ?? noData}
                </Descriptions.Item>
                <Descriptions.Item label={VI.admin.users.columns.phone}>
                  {profile.phone ?? noData}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Account section: status + roles (from list) */}
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>
              {VI.admin.users.detail.accountInfo}
            </Text>
            <Descriptions column={1} bordered size="small">
              {rolesFromList.length > 0 && (
                <Descriptions.Item label={VI.admin.users.columns.roles}>
                  <Space size={4} wrap>
                    {(rolesFromList ?? []).map((role) => {
                      const { color, label } = getRoleTagProps(role);
                      return (
                        <Tag key={role} color={color}>
                          {label}
                        </Tag>
                      );
                    })}
                  </Space>
                </Descriptions.Item>
              )}
              <Descriptions.Item label={VI.admin.users.columns.status}>
                <Tag color={statusTagProps.color}>{statusTagProps.label}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      ) : selectedUserId != null ? (
        <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text type="secondary">Không tải được thông tin người dùng.</Text>
        </div>
      ) : null}
    </Modal>
  );
}

export const UserDetailDrawer = UserDetailModal;
