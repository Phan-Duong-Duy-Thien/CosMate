/**
 * useProviderProfileCompletion
 *
 * Phase 1: addresses — JWT user id (/api/users/{userId}/addresses)
 * Phase 2: provider profile — provider record id (profile.id, PUT /api/providers/{id})
 */
import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getProviderByUserId } from '../api/provider.api';
import {
  saveProviderProfile,
  fetchUserAddresses,
  createUserAddressForShop,
  uploadProviderAvatar,
  uploadProviderCoverImageSvc,
} from '../services/provider.service';
import type { UserAddress } from '@/features/profile/api/userAddress.api';
import type { ProviderProfile, UpdateProviderProfilePayload } from '../types';
import type { Province, District } from '@/features/profile/types';

export interface UseProviderProfileCompletionResult {
  addresses: UserAddress[];
  addressesLoading: boolean;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
  isCreatingAddress: boolean;
  createAddress: (
    data: CreateAddressFormData,
    provinceName: string,
    districtName: string,
  ) => Promise<UserAddress | null>;
  formData: ProviderFormData;
  updateFormField: <K extends keyof ProviderFormData>(key: K, value: ProviderFormData[K]) => void;
  saving: boolean;
  saveError: string | null;
  submit: (shopAddressId: number) => Promise<boolean>;
  provinces: Province[];
  districts: District[];
  locationLoading: boolean;
  loadDistricts: (provinceCode: number) => Promise<void>;
  providerId: number | null;
  uploadAvatar: (file: File) => Promise<void>;
  uploadCoverImage: (file: File) => Promise<void>;
  /** Phase 1 — đã chọn hoặc tạo địa chỉ shop. */
  canProceedToPhase2: boolean;
  /** Phase 2 — đủ trường bắt buộc (trim). */
  canSubmitProfile: boolean;
  profileLoadError: string | null;
}

export interface ProviderFormData {
  shopName: string;
  bio: string;
  bankAccountNumber: string;
  bankName: string;
}

export interface CreateAddressFormData {
  name: string;
  phone: string;
  provinceCode: number | null;
  districtCode: number | null;
  streetAddress: string;
  addressName: string;
}

let provinceCache: Province[] | null = null;
const districtCache: Map<number, District[]> = new Map();

async function loadProvinces(): Promise<Province[]> {
  if (provinceCache) return provinceCache;
  const { fetchProvinces } = await import('@/shared/api/vnLocation.api');
  provinceCache = await fetchProvinces();
  return provinceCache;
}

async function loadDistricts(provinceCode: number): Promise<District[]> {
  if (districtCache.has(provinceCode)) return districtCache.get(provinceCode)!;
  const { fetchWardsByProvince } = await import('@/shared/api/vnLocation.api');
  const districts = await fetchWardsByProvince(provinceCode);
  districtCache.set(provinceCode, districts);
  return districts;
}

/** User account id for /api/users/* — never use provider.id here. */
function resolveAccountUserId(
  jwtUserId: number | null,
  profile: ProviderProfile | null | undefined,
): number | null {
  if (!jwtUserId) return null;
  const fromProfile = profile?.userId;
  if (fromProfile && fromProfile > 0 && fromProfile !== profile?.id) {
    return fromProfile;
  }
  return jwtUserId;
}

export function useProviderProfileCompletion(
  verifiedProfile?: ProviderProfile | null,
): UseProviderProfileCompletionResult {
  const jwtUserId = getUserId();

  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);

  const mergedProfile = providerProfile ?? verifiedProfile ?? null;
  const providerId = mergedProfile?.id ?? null;
  const accountUserId = resolveAccountUserId(jwtUserId, mergedProfile);

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);

  const [formData, setFormData] = useState<ProviderFormData>({
    shopName: '',
    bio: '',
    bankAccountNumber: '',
    bankName: '',
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const loadProviderProfile = useCallback(async () => {
    if (!jwtUserId) {
      setProfileLoadError('Không tìm thấy phiên đăng nhập. Vui lòng đăng nhập lại.');
      return;
    }
    if (verifiedProfile?.id) {
      setProviderProfile(verifiedProfile);
      setProfileLoadError(null);
      return;
    }
    try {
      const profile = await getProviderByUserId(jwtUserId);
      setProviderProfile(profile);
      setProfileLoadError(null);
    } catch (err) {
      console.error('[useProviderProfileCompletion] load provider profile error:', err);
      setProfileLoadError(
        err instanceof Error ? err.message : 'Không thể tải hồ sơ nhà cung cấp.',
      );
    }
  }, [jwtUserId, verifiedProfile]);

  useEffect(() => {
    loadProviderProfile();
  }, [loadProviderProfile]);

  useEffect(() => {
    const shopAddressId = mergedProfile?.shopAddressId;
    if (shopAddressId && shopAddressId > 0) {
      setSelectedAddressId(shopAddressId);
    }
  }, [mergedProfile?.shopAddressId]);

  const loadAddresses = useCallback(async () => {
    if (!accountUserId) return;
    setAddressesLoading(true);
    try {
      const data = await fetchUserAddresses(accountUserId);
      setAddresses(data);
    } catch (err) {
      console.error('[useProviderProfileCompletion] load addresses error:', err);
      message.error('Không thể tải danh sách địa chỉ.');
    } finally {
      setAddressesLoading(false);
    }
  }, [accountUserId]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  /** Tự chọn địa chỉ đầu tiên nếu user chưa chọn. */
  useEffect(() => {
    if (selectedAddressId != null || addresses.length === 0) return;
    setSelectedAddressId(addresses[0].id);
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    loadProvinces().then(setProvinces).catch(console.error);
  }, []);

  const loadDistrictsFn = useCallback(async (provinceCode: number) => {
    setLocationLoading(true);
    try {
      const data = await loadDistricts(provinceCode);
      setDistricts(data);
    } catch (err) {
      console.error('[useProviderProfileCompletion] load districts error:', err);
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const createAddress = useCallback(
    async (
      data: CreateAddressFormData,
      provinceName: string,
      districtName: string,
    ): Promise<UserAddress | null> => {
      if (!accountUserId) {
        message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return null;
      }
      setIsCreatingAddress(true);
      try {
        const created = await createUserAddressForShop(
          accountUserId,
          data,
          provinceName,
          districtName,
        );
        setAddresses((prev) => [...prev, created]);
        setSelectedAddressId(created.id);
        message.success('Địa chỉ đã được tạo thành công');
        return created;
      } catch (err) {
        console.error('[useProviderProfileCompletion] create address error:', err);
        message.error('Tạo địa chỉ thất bại. Vui lòng thử lại.');
        return null;
      } finally {
        setIsCreatingAddress(false);
      }
    },
    [accountUserId],
  );

  const updateFormField = useCallback(<K extends keyof ProviderFormData>(
    key: K,
    value: ProviderFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const submit = useCallback(
    async (shopAddressId: number): Promise<boolean> => {
      if (!providerId) {
        setSaveError(profileLoadError || 'Không tìm thấy thông tin nhà cung cấp');
        return false;
      }
      setSaving(true);
      setSaveError(null);
      try {
        const payload: UpdateProviderProfilePayload = {
          shopName: formData.shopName.trim(),
          shopAddressId,
          bio: formData.bio.trim(),
          bankAccountNumber: formData.bankAccountNumber.trim(),
          bankName: formData.bankName.trim(),
        };
        await saveProviderProfile(providerId, payload);
        message.success('Hồ sơ đã được cập nhật thành công!');
        return true;
      } catch (err) {
        console.error('[useProviderProfileCompletion] submit error:', err);
        setSaveError('Có lỗi xảy ra. Vui lòng thử lại.');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [providerId, formData, profileLoadError],
  );

  const uploadAvatar = useCallback(
    async (file: File): Promise<void> => {
      if (!accountUserId) {
        message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      try {
        await uploadProviderAvatar(accountUserId, file);
        message.success('Avatar đã được cập nhật');
      } catch (err) {
        console.error('[useProviderProfileCompletion] upload avatar error:', err);
        message.error('Tải avatar thất bại. Vui lòng thử lại.');
      }
    },
    [accountUserId],
  );

  const uploadCoverImage = useCallback(
    async (file: File): Promise<void> => {
      if (!providerId) {
        message.error(profileLoadError || 'Không tìm thấy thông tin nhà cung cấp');
        return;
      }
      try {
        await uploadProviderCoverImageSvc(providerId, file);
        message.success('Ảnh bìa đã được cập nhật');
      } catch (err) {
        console.error('[useProviderProfileCompletion] upload cover image error:', err);
        message.error('Tải ảnh bìa thất bại. Vui lòng thử lại.');
      }
    },
    [providerId, profileLoadError],
  );

  const canProceedToPhase2 = selectedAddressId != null && selectedAddressId > 0;

  const canSubmitProfile = Boolean(
    formData.shopName.trim() &&
      formData.bio.trim() &&
      formData.bankAccountNumber.trim() &&
      formData.bankName.trim() &&
      canProceedToPhase2 &&
      providerId,
  );

  return {
    addresses,
    addressesLoading,
    selectedAddressId,
    setSelectedAddressId,
    isCreatingAddress,
    createAddress,
    formData,
    updateFormField,
    saving,
    saveError,
    submit,
    provinces,
    districts,
    locationLoading,
    loadDistricts: loadDistrictsFn,
    providerId,
    uploadAvatar,
    uploadCoverImage,
    canProceedToPhase2,
    canSubmitProfile,
    profileLoadError,
  };
}
