import { useState, type ReactNode } from 'react';
import { Avatar, Spin, Tag } from 'antd';
import { Pencil } from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { VI } from '@/shared/i18n/vi';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { getRoleTagProps } from '@/features/admin/utils/userRole';
import { getStatusTagProps } from '@/features/admin/utils/userStatus';
import { useUserProfile } from '../hooks/useUserProfile';
import EditProfileModal from '../components/EditProfileModal';

function ProfileField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

export default function DashboardProfilePage() {
  const {
    profile,
    displayName,
    initials,
    loading,
    error,
    userId,
    setProfile,
  } = useUserProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const roles = getRoles();
  const primaryRole = roles[0];
  const roleTag = primaryRole ? getRoleTagProps(primaryRole) : null;
  const statusTag = profile ? getStatusTagProps(profile.status) : null;

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Card className="p-6">
        <p className="text-center text-sm text-destructive">{error ?? VI.common.status.noData}</p>
      </Card>
    );
  }

  const apiRoleTag = profile.role ? getRoleTagProps(profile.role) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{VI.profile.dashboard.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{VI.profile.dashboard.subtitle}</p>
        </div>
        <Button
          type="button"
          className="inline-flex items-center gap-2"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="h-4 w-4" aria-hidden />
          {VI.profile.edit}
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:gap-6">
          {profile.avatarUrl ? (
            <Avatar src={profile.avatarUrl} size={88} className="shrink-0" />
          ) : (
            <Avatar size={88} className="shrink-0 bg-pink-100 text-xl font-bold text-pink-600">
              {initials}
            </Avatar>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">{displayName}</h3>
            <p className="mt-0.5 text-sm text-slate-500">@{profile.username}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {statusTag && <Tag color={statusTag.color}>{statusTag.label}</Tag>}
              {roleTag && <Tag color={roleTag.color}>{roleTag.label}</Tag>}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ProfileField label={VI.profile.dashboard.accountId} value={`#${profile.id}`} />
          <ProfileField label={VI.admin.users.columns.username} value={profile.username} />
          <ProfileField label={VI.admin.users.columns.fullName} value={profile.fullName ?? '—'} />
          <ProfileField label={VI.admin.users.columns.email} value={profile.email} />
          <ProfileField label={VI.admin.users.columns.phone} value={profile.phone ?? '—'} />
          {apiRoleTag && (
            <ProfileField
              label={VI.admin.users.columns.roles}
              value={<Tag color={apiRoleTag.color}>{apiRoleTag.label}</Tag>}
            />
          )}
          {profile.numberOfToken != null && (
            <ProfileField
              label={VI.profile.token.balance}
              value={profile.numberOfToken.toLocaleString('vi-VN')}
            />
          )}
        </div>
      </Card>

      <EditProfileModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        userId={userId}
        profile={profile}
        onProfileUpdated={setProfile}
      />
    </div>
  );
}
