/**
 * useProviderProfileCompletion
 *
 * Manages the 2-phase profile completion flow for providers:
 * Phase 1: Address selection/creation (shopAddressId)
 * Phase 2: Provider info update (shopName, bio, bankAccountNumber, bankName)
 */
import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { saveProviderProfile, fetchUserAddresses, createUserAddressForShop } from '../services/provider.service';
import type { UserAddress } from '@/features/profile/api/userAddress.api';
import type { UpdateProviderProfilePayload } from '../types';
import type { Province, District } from '@/features/profile/types';

export interface UseProviderProfileCompletionResult {
  // Address phase
  addresses: UserAddress[];
  addressesLoading: boolean;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
  isCreatingAddress: boolean;
  createAddress: (data: CreateAddressFormData, provinceName: string, districtName: string) => Promise<UserAddress | null>;
  // Form phase
  formData: ProviderFormData;
  updateFormField: <K extends keyof ProviderFormData>(key: K, value: ProviderFormData[K]) => void;
  // Submission
  saving: boolean;
  saveError: string | null;
  submit: (shopAddressId: number) => Promise<boolean>;
  // Location cascade
  provinces: Province[];
  districts: District[];
  locationLoading: boolean;
  loadDistricts: (provinceCode: number) => Promise<void>;
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
let districtCache: Map<number, District[]> = new Map();

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

export function useProviderProfileCompletion(): UseProviderProfileCompletionResult {
  const userId = getUserId() as number;

  // Address phase
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);

  // Form phase
  const [formData, setFormData] = useState<ProviderFormData>({
    shopName: '',
    bio: '',
    bankAccountNumber: '',
    bankName: '',
  });

  // Submission
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Location cascade
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  // Load addresses on mount
  const loadAddresses = useCallback(async () => {
    if (!userId) return;
    setAddressesLoading(true);
    try {
      const data = await fetchUserAddresses(userId);
      setAddresses(data);
    } catch (err) {
      console.error('[useProviderProfileCompletion] load addresses error:', err);
    } finally {
      setAddressesLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Load provinces on mount
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

  const createAddress = useCallback(async (
    data: CreateAddressFormData,
    provinceName: string,
    districtName: string
  ): Promise<UserAddress | null> => {
    setIsCreatingAddress(true);
    try {
      const created = await createUserAddressForShop(userId, data, provinceName, districtName);
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
  }, [userId]);

  const updateFormField = useCallback(<K extends keyof ProviderFormData>(
    key: K,
    value: ProviderFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const submit = useCallback(async (shopAddressId: number): Promise<boolean> => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload: UpdateProviderProfilePayload = {
        shopName: formData.shopName,
        shopAddressId,
        bio: formData.bio,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
      };
      await saveProviderProfile(userId, payload);
      message.success('Hồ sơ đã được cập nhật thành công!');
      return true;
    } catch (err) {
      console.error('[useProviderProfileCompletion] submit error:', err);
      setSaveError('Có lỗi xảy ra. Vui lòng thử lại.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [userId, formData]);

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
  };
}
