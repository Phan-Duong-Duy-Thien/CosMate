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

export function useAdminUsers() {
  // Data state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Action state
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Modal profile state (detail fetched from GET /api/users/{id}/profile)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<AdminUserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const profileRequestIdRef = useRef(0);

  // Export and import state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  /**
   * Fetch users from backend
   */
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: Record<string, any> = {
        page: page - 1,
        size: pageSize,
      };

      if (searchText) params.search = searchText;
      if (statusFilter) params.status = statusFilter;
      
      if (roleFilter && roleFilter.length > 0) {
        params.role = roleFilter.join(',');
      }

      const data = await adminUsersService.getAdminUsersPage(params);
      
      setUsers(data.content || []);
      setTotal(data.totalElements || 0);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : VI.admin.users.messages.fetchError;
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchText, statusFilter, roleFilter]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Open profile modal: set selectedUserId and fetch profile.
   * Stale request guard: quick row switching won't show wrong profile.
   */
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

  /**
   * Close profile modal: clear profile state.
   */
  const closeProfile = useCallback(() => {
    setSelectedUserId(null);
    setProfile(null);
    setProfileLoading(false);
  }, []);

  /**
   * Execute a user action (ban/unban/lock/unlock)
   * CRITICAL: Always refetch after successful action
   */
  const runAction = useCallback(
    async (actionType: UserActionType, userId: number) => {
      try {
        setActionLoadingId(userId);
        
        // Execute action via service
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
        
        // CRITICAL: Refetch to get updated status from backend
        await fetchUsers();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : VI.admin.users.messages.actionError;
        message.error(errorMessage);
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchUsers]
  );

  // Export and import
  /**
   * Trigger download of a blob file
   */
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
      
      // Tạo chuỗi thời gian format theo chuẩn YYYYMMDD_HHMMSS
      const now = new Date();
      const timeString = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
      
      // Ghép tên danh sách với thời gian
      triggerDownload(blob, `Danh_sach_nguoi_dung_${timeString}.xlsx`);
      message.success('Xuất file thành công!');
    } catch (err) {
      message.error('Lỗi khi xuất file Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await adminUsersService.downloadUserTemplate();
      triggerDownload(blob, `user_template.xlsx`);
    } catch (err) {
      message.error('Lỗi khi tải file mẫu');
    }
  };

  const handleImport = async (file: File) => {
    try {
      setIsImporting(true);
      const res = await adminUsersService.importUsersExcel(file);
      message.success(`Import thành công ${res.successCount} dòng, lỗi ${res.failureCount} dòng!`);
      fetchUsers(); // Refresh lại danh sách
    } catch (err) {
      message.error('Lỗi khi import file Excel');
    } finally {
      setIsImporting(false);
    }
  };

  return {
    // Data & Pagination
    users,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    isLoading,
    error,
    
    // Filters
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    
    // Actions
    runAction,
    actionLoadingId,
    refetch: fetchUsers,
    
    // Modal profile (GET /api/users/{id}/profile)
    selectedUserId,
    profile,
    profileLoading,
    openProfile,
    closeProfile,

    // Export and import
    isExporting,
    isImporting,
    handleExport,
    handleDownloadTemplate,
    handleImport,
  };
}
