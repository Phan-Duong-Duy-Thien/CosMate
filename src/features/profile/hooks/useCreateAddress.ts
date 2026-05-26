/**
 * useCreateAddress Hook
 * Manages form state, dependent dropdowns, and address creation
 */
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { VI } from '@/shared/i18n/vi';
import * as vnLocationApi from '../api/vnLocation.api';
import * as userAddressService from '../services/userAddress.service';
import type { Province, District } from '../types';
import { getPhoneValidationError } from '../utils/addressValidation';

interface UseCreateAddressResult {
  // Form state
  name: string;
  phone: string;
  provinceCode: number | null;
  districtCode: number | null;
  streetAddress: string;
  addressName: string;

  // Dropdown options
  provinces: Province[];
  districts: District[];

  // Loading states
  isLoadingProvinces: boolean;
  isLoadingDistricts: boolean;
  isSubmitting: boolean;

  // Setters
  setName: (value: string) => void;
  setPhone: (value: string) => void;
  setProvinceCode: (code: number | null) => void;
  setDistrictCode: (code: number | null) => void;
  setStreetAddress: (value: string) => void;
  setAddressName: (value: string) => void;

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
  const [streetAddress, setStreetAddress] = useState('');
  const [addressName, setAddressName] = useState('');

  // Dropdown options
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  // Loading states
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
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
        setDistrictCode(null);
        return;
      }

      setIsLoadingDistricts(true);
      setDistrictCode(null);
      setDistricts([]);

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

  const submit = useCallback(
    async (userId: number, provinceName: string, districtName: string): Promise<boolean> => {
      // Validate required fields
      if (!name.trim()) {
        message.error(VI.profile.address.validation.required);
        return false;
      }
      const phoneError = getPhoneValidationError(phone);
      if (phoneError) {
        message.error(phoneError);
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
      if (!streetAddress.trim()) {
        message.error(VI.profile.address.validation.required);
        return false;
      }

      setIsSubmitting(true);
      try {
        const formData: userAddressService.CreateAddressFormData = {
          name,
          phone,
          provinceCode,
          districtCode,
          streetAddress,
          addressName,
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
    [name, phone, provinceCode, districtCode, streetAddress, addressName]
  );

  const reset = useCallback(() => {
    setName('');
    setPhone('');
    setProvinceCode(null);
    setDistrictCode(null);
    setStreetAddress('');
    setAddressName('');
    setDistricts([]);
  }, []);

  return {
    // Form state
    name,
    phone,
    provinceCode,
    districtCode,
    streetAddress,
    addressName,

    // Dropdown options
    provinces,
    districts,

    // Loading states
    isLoadingProvinces,
    isLoadingDistricts,
    isSubmitting,

    // Setters
    setName,
    setPhone,
    setProvinceCode,
    setDistrictCode,
    setStreetAddress,
    setAddressName,

    // Actions
    submit,
    reset,
  };
}
