/**
 * useCreateAddress Hook
 * Manages form state, dependent dropdowns, and address creation
 */
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { VI } from '@/shared/i18n/vi';
import * as vnLocationApi from '../api/vnLocation.api';
import * as userAddressService from '../services/userAddress.service';
import type { Province, District, Ward } from '../types';

interface UseCreateAddressResult {
  // Form state
  name: string;
  phone: string;
  provinceCode: number | null;
  districtCode: number | null;
  ward: Ward | null;
  streetAddress: string;

  // Dropdown options
  provinces: Province[];
  districts: District[];
  wards: Ward[];

  // Loading states
  isLoadingProvinces: boolean;
  isLoadingDistricts: boolean;
  isLoadingWards: boolean;
  isSubmitting: boolean;

  // Setters
  setName: (value: string) => void;
  setPhone: (value: string) => void;
  setProvinceCode: (code: number | null) => void;
  setDistrictCode: (code: number | null) => void;
  setWard: (ward: Ward | null) => void;
  setStreetAddress: (value: string) => void;

  // Actions
  submit: (userId: number, provinceName: string, districtName: string) => Promise<boolean>;
  reset: () => void;
}

export function useCreateAddress(): UseCreateAddressResult {
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [districtCode, setDistrictCode] = useState<number | null>(null);
  const [ward, setWard] = useState<Ward | null>(null);
  const [streetAddress, setStreetAddress] = useState('');

  // Dropdown options
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Loading states
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const data = await vnLocationApi.fetchProvinces();
        setProvinces(data);
      } catch (err) {
        console.error('Failed to fetch provinces:', err);
        message.error('Không thể tải danh sách tỉnh/thành phố');
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (provinceCode === null) {
        setDistricts([]);
        setWards([]);
        setDistrictCode(null);
        setWard(null);
        return;
      }

      setIsLoadingDistricts(true);
      setDistrictCode(null);
      setWard(null);
      setDistricts([]);
      setWards([]);

      try {
        const data = await vnLocationApi.fetchDistricts(provinceCode);
        setDistricts(data);
      } catch (err) {
        console.error('Failed to fetch districts:', err);
        message.error('Không thể tải danh sách quận/huyện');
      } finally {
        setIsLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [provinceCode]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (districtCode === null) {
        setWards([]);
        setWard(null);
        return;
      }

      setIsLoadingWards(true);
      setWard(null);
      setWards([]);

      try {
        const data = await vnLocationApi.fetchWards(districtCode);
        setWards(data);
      } catch (err) {
        console.error('Failed to fetch wards:', err);
        message.error('Không thể tải danh sách phường/xã');
      } finally {
        setIsLoadingWards(false);
      }
    };
    fetchWards();
  }, [districtCode]);

  const submit = useCallback(
    async (userId: number, provinceName: string, districtName: string): Promise<boolean> => {
      // Validate required fields
      if (!name.trim()) {
        message.error(VI.profile.address.validation.required);
        return false;
      }
      if (!phone.trim()) {
        message.error(VI.profile.address.validation.required);
        return false;
      }
      if (!provinceCode) {
        message.error(VI.profile.address.validation.selectCity);
        return false;
      }
      if (!districtCode) {
        message.error(VI.profile.address.validation.selectDistrict);
        return false;
      }
      if (!ward) {
        message.error(VI.profile.address.validation.selectWard);
        return false;
      }
      if (!streetAddress.trim()) {
        message.error(VI.profile.address.validation.required);
        return false;
      }

      // Validate phone format (simple validation)
      const phoneRegex = /^(\+84|0)\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        message.error(VI.profile.address.validation.invalidPhone);
        return false;
      }

      setIsSubmitting(true);
      try {
        const formData: userAddressService.CreateAddressFormData = {
          name,
          phone,
          provinceCode,
          districtCode,
          ward,
          streetAddress,
        };

        await userAddressService.createUserAddress(userId, formData, provinceName, districtName);
        message.success(VI.profile.address.messages.createSuccess);
        return true;
      } catch (err) {
        console.error('Failed to create address:', err);
        message.error(VI.profile.address.messages.createError);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, phone, provinceCode, districtCode, ward, streetAddress]
  );

  const reset = useCallback(() => {
    setName('');
    setPhone('');
    setProvinceCode(null);
    setDistrictCode(null);
    setWard(null);
    setStreetAddress('');
    setDistricts([]);
    setWards([]);
  }, []);

  return {
    // Form state
    name,
    phone,
    provinceCode,
    districtCode,
    ward,
    streetAddress,

    // Dropdown options
    provinces,
    districts,
    wards,

    // Loading states
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    isSubmitting,

    // Setters
    setName,
    setPhone,
    setProvinceCode,
    setDistrictCode,
    setWard,
    setStreetAddress,

    // Actions
    submit,
    reset,
  };
}
