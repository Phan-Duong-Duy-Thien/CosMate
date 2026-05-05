/**
 * useProviderProfileEdit Hook
 *
 * Manages editing of provider profile:
 * - Loads current provider data
 * - Loads user addresses
 * - Manages edit form
 * - Submits updates via PUT /api/providers/{id}
 */
import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getProviderByUserId, uploadProviderCoverImage } from '@/features/provider/api/provider.api';
import { getUserAddresses } from '@/features/profile/api/userAddress.api';
import { updateUserAddress, deleteUserAddress } from '@/features/profile/api/userAddress.api';
import { updateProviderProfile } from '@/features/provider/api/provider.api';
import { uploadAvatar as uploadUserAvatar } from '@/features/profile/services/userProfile.service';
import type { ProviderProfile } from '@/features/provider/types';
import type { UserAddress, UpsertUserAddressPayload } from '@/features/profile/types';

interface EditFormData {
  shopName: string;
  bio: string;
  bankAccountNumber: string;
  bankName: string;
  shopAddressId: number | null;
}

interface UseProviderProfileEditResult {
  profile: ProviderProfile | null;
  addresses: UserAddress[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  formData: EditFormData;
  updateField: <K extends keyof EditFormData>(key: K, value: EditFormData[K]) => void;
  save: () => Promise<boolean>;
  refetch: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  uploadCoverImage: (file: File) => Promise<void>;
  addressSaving: boolean;
  updateAddress: (addressId: number, payload: UpsertUserAddressPayload) => Promise<boolean>;
  removeAddress: (addressId: number) => Promise<boolean>;
}

export function useProviderProfileEdit(): UseProviderProfileEditResult {
  const userId = getUserId();

  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EditFormData>({
    shopName: '',
    bio: '',
    bankAccountNumber: '',
    bankName: '',
    shopAddressId: null,
  });

  const updateField = useCallback(<K extends keyof EditFormData>(key: K, value: EditFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const loadData = useCallback(async () => {
    if (!userId) {
      setError('Không tìm thấy thông tin người dùng');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [profileData, addressData] = await Promise.all([
        getProviderByUserId(userId),
        getUserAddresses(userId),
      ]);

      setProfile(profileData);
      setAddresses(addressData);
      setFormData({
        shopName: profileData.shopName ?? '',
        bio: profileData.bio ?? '',
        bankAccountNumber: profileData.bankAccountNumber ?? '',
        bankName: profileData.bankName ?? '',
        shopAddressId: profileData.shopAddressId,
      });
    } catch (err) {
      console.error('[useProviderProfileEdit] load error:', err);
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const save = useCallback(async (): Promise<boolean> => {
    if (!profile) return false;

    setSaving(true);
    try {
      await updateProviderProfile(profile.id, {
        shopName: formData.shopName,
        shopAddressId: formData.shopAddressId ?? 0,
        bio: formData.bio,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
      });
      message.success('Hồ sơ đã được cập nhật');
      await loadData();
      return true;
    } catch (err) {
      console.error('[useProviderProfileEdit] save error:', err);
      message.error('Cập nhật thất bại. Vui lòng thử lại.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [profile, formData, loadData]);

  const uploadAvatar = useCallback(async (file: File): Promise<void> => {
    if (!profile) return;
    try {
      await uploadUserAvatar(profile.userId, file);
      message.success('Avatar đã được cập nhật');
      await loadData();
    } catch (err) {
      console.error('[useProviderProfileEdit] upload avatar error:', err);
      message.error('Tải avatar thất bại');
    }
  }, [profile, loadData]);

  const uploadCoverImage = useCallback(async (file: File): Promise<void> => {
    if (!profile) return;
    try {
      await uploadProviderCoverImage(profile.userId, file);
      message.success('Ảnh bìa đã được cập nhật');
      await loadData();
    } catch (err) {
      console.error('[useProviderProfileEdit] upload cover image error:', err);
      message.error('Tải ảnh bìa thất bại');
    }
  }, [profile, loadData]);

  const updateAddress = useCallback(async (
    addressId: number,
    payload: UpsertUserAddressPayload
  ): Promise<boolean> => {
    if (!userId) return false;

    setAddressSaving(true);
    try {
      await updateUserAddress(userId, addressId, payload);
      message.success('Địa chỉ đã được cập nhật');
      await loadData();
      return true;
    } catch (err) {
      console.error('[useProviderProfileEdit] update address error:', err);
      message.error('Cập nhật địa chỉ thất bại');
      return false;
    } finally {
      setAddressSaving(false);
    }
  }, [userId, loadData]);

  const removeAddress = useCallback(async (addressId: number): Promise<boolean> => {
    if (!userId) return false;

    setAddressSaving(true);
    try {
      await deleteUserAddress(userId, addressId);
      message.success('Địa chỉ đã được xóa');
      await loadData();
      return true;
    } catch (err) {
      console.error('[useProviderProfileEdit] delete address error:', err);
      message.error('Xóa địa chỉ thất bại');
      return false;
    } finally {
      setAddressSaving(false);
    }
  }, [userId, loadData]);

  return {
    profile,
    addresses,
    loading,
    saving,
    error,
    formData,
    updateField,
    save,
    refetch: loadData,
    uploadAvatar,
    uploadCoverImage,
    addressSaving,
    updateAddress,
    removeAddress,
  };
}
