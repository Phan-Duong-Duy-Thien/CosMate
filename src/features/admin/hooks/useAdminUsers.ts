/**
 * useAdminUsers Hook
 *
 * State management for admin user management
 * Handles data fetching, filtering, and user actions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import * as adminUsersService from '../services/adminUsers.service';
import type { AdminUser, AdminUserProfile, UserActionType } from '../types';
import { VI } from '@/shared/i18n/vi';
import { usePendingListMutation } from '@/shared/hooks/usePendingListMutation';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge';
import { DATA_SYNC_EVENTS, notifyUsersChanged } from '@/shared/sync/dataSync';

function statusAfterAction(actionType: UserActionType): string {
  switch (actionType) {
    case 'lock':
      return 'INACTIVE';
    case 'unlock':
      return 'ACTIVE';
    case 'ban':
      return 'BANNED';
    case 'unban':
      return 'ACTIVE';
  }
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<AdminUserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const profileRequestIdRef = useRef(0);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const { mergeFetched, setPendingField } = usePendingListMutation<AdminUser, string>({
    getItemId: (u) => u.id,
    getFieldValue: (u) => u.status,
    setFieldValue: (u, status) => ({ ...u, status }),
  });

  const fetchUsers = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      try {
        if (!silent) {
          setIsLoading(true);
        }
        setError(null);

        const params: Record<string, unknown> = {
          page: page - 1,
          size: pageSize,
        };

        if (searchText) params.search = searchText;
        if (statusFilter) params.status = statusFilter;

        if (roleFilter && roleFilter.length > 0) {
          params.role = roleFilter.join(',');
        }

        const data = await adminUsersService.getAdminUsersPage(params);

        setUsers(mergeFetched(data.content || []));
        setTotal(data.totalElements || 0);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : VI.admin.users.messages.fetchError;
        setError(errorMessage);
        if (!silent) {
          message.error(errorMessage);
        }
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [page, pageSize, searchText, statusFilter, roleFilter, mergeFetched],
  );

  const scheduleSyncRefetch = useCallback(() => {
    scheduleBackgroundRefetch(() => fetchUsers({ silent: true }));
  }, [fetchUsers]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  useDataSyncRefetch(() => fetchUsers({ silent: true }), DATA_SYNC_EVENTS.USERS_CHANGED);

  const applyUserStatus = useCallback(
    (userId: number, nextStatus: string) => {
      setPendingField(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)),
      );
      setProfile((prev) =>
        prev && prev.id === userId
          ? { ...prev, status: nextStatus as AdminUserProfile['status'] }
          : prev,
      );
      notifyUsersChanged({ userId });
    },
    [setPendingField],
  );

  const openProfile = useCallback((userId: number) => {
    setProfile(null);
    setSelectedUserId(userId);
    const requestId = ++profileRequestIdRef.current;
    setProfileLoading(true);
    adminUsersService
      .getUserProfile(userId)
      .then((data) => {
        if (requestId === profileRequestIdRef.current) {
          setProfile(data);
        }
      })
      .catch((err) => {
        if (requestId === profileRequestIdRef.current) {
          message.error(err instanceof Error ? err.message : VI.admin.users.messages.fetchError);
        }
      })
      .finally(() => {
        if (requestId === profileRequestIdRef.current) {
          setProfileLoading(false);
        }
      });
  }, []);

  const closeProfile = useCallback(() => {
    setSelectedUserId(null);
    setProfile(null);
    setProfileLoading(false);
  }, []);

  const runAction = useCallback(
    async (actionType: UserActionType, userId: number) => {
      try {
        setActionLoadingId(userId);

        switch (actionType) {
          case 'ban':
            await adminUsersService.ban(userId);
            message.success(VI.admin.users.messages.banSuccess);
            break;
          case 'unban':
            await adminUsersService.unban(userId);
            message.success(VI.admin.users.messages.unbanSuccess);
            break;
          case 'lock':
            await adminUsersService.lock(userId);
            message.success(VI.admin.users.messages.lockSuccess);
            break;
          case 'unlock':
            await adminUsersService.unlock(userId);
            message.success(VI.admin.users.messages.unlockSuccess);
            break;
        }

        applyUserStatus(userId, statusAfterAction(actionType));
        scheduleSyncRefetch();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : VI.admin.users.messages.actionError;
        message.error(errorMessage);
      } finally {
        setActionLoadingId(null);
      }
    },
    [applyUserStatus, scheduleSyncRefetch],
  );

  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await adminUsersService.exportUsersExcel();

      const now = new Date();
      const timeString = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

      triggerDownload(blob, `Danh_sach_nguoi_dung_${timeString}.xlsx`);
      message.success('Xuất file thành công!');
    } catch {
      message.error('Lỗi khi xuất file Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await adminUsersService.downloadUserTemplate();
      triggerDownload(blob, `user_template.xlsx`);
    } catch {
      message.error('Lỗi khi tải file mẫu');
    }
  };

  const handleImport = async (file: File) => {
    try {
      setIsImporting(true);
      const res = await adminUsersService.importUsersExcel(file);
      message.success(`Import thành công ${res.successCount} dòng, lỗi ${res.failureCount} dòng!`);
      void fetchUsers();
    } catch {
      message.error('Lỗi khi import file Excel');
    } finally {
      setIsImporting(false);
    }
  };

  return {
    users,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    isLoading,
    error,
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    runAction,
    actionLoadingId,
    refetch: fetchUsers,
    selectedUserId,
    profile,
    profileLoading,
    openProfile,
    closeProfile,
    isExporting,
    isImporting,
    handleExport,
    handleDownloadTemplate,
    handleImport,
  };
}
