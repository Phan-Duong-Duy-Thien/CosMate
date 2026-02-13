/**
 * useAdminUsers Hook
 * 
 * State management for admin user management
 * Handles data fetching, filtering, and user actions
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

  /**
   * Fetch users from backend
   */
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminUsersService.listUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : VI.admin.users.messages.fetchError;
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Filter users based on search and filters (client-side)
   */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      if (searchText) {
        const search = searchText.toLowerCase();
        const matchesSearch =
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          (user.fullName && user.fullName.toLowerCase().includes(search)) ||
          (user.phone && user.phone.includes(search));
        
        if (!matchesSearch) return false;
      }
      
      // Role filter
      if (roleFilter.length > 0) {
        const hasMatchingRole = user.roles.some((role) => roleFilter.includes(role));
        if (!hasMatchingRole) return false;
      }
      
      // Status filter
      if (statusFilter) {
        if (user.status !== statusFilter) return false;
      }
      
      return true;
    });
  }, [users, searchText, roleFilter, statusFilter]);

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

  return {
    // Data
    users,
    filteredUsers,
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
  };
}
