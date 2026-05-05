/**
 * Shared Vietnam Area Locations Hook
 *
 * Provides province / ward cascading selection for service area selection.
 * Uses Province Open API V2:
 *   GET /p/         -> list all provinces
 *   GET /p/{code}?depth=2 -> province with its wards (Phường/Xã)
 *
 * Note: V2 does not have a /d endpoint. The second level are wards (Phường/Xã)
 * grouped under each district. We expose them directly as the second dropdown.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchProvinces, fetchWardsByProvince } from '@/shared/api/vnLocation.api';
import type { Province, District } from '@/features/profile/types';

interface UseAreaLocationsResult {
  selectedProvinceId: number | null;
  selectedDistrictId: number | null;
  provinces: Province[];
  districts: District[];
  isLoadingProvinces: boolean;
  isLoadingDistricts: boolean;
  error: string | null;
  setSelectedProvinceId: (id: number | null) => void;
  setSelectedDistrictId: (id: number | null) => void;
  selectedProvince: Province | undefined;
  selectedDistrict: District | undefined;
  reset: () => void;
}

export function useAreaLocations(): UseAreaLocationsResult {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const data = await fetchProvinces();
        setProvinces(data);
      } catch {
        setError('Không thể tải danh sách tỉnh/thành phố.');
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    void loadProvinces();
  }, []);

  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvinceId === null) {
        setDistricts([]);
        setSelectedDistrictId(null);
        return;
      }
      setIsLoadingDistricts(true);
      try {
        const data = await fetchWardsByProvince(selectedProvinceId);
        setDistricts(data);
      } catch {
        setError('Không thể tải danh sách quận/huyện.');
      } finally {
        setIsLoadingDistricts(false);
      }
    };
    void loadDistricts();
  }, [selectedProvinceId]);

  const handleSetProvinceId = useCallback((id: number | null) => {
    setSelectedProvinceId(id);
    setSelectedDistrictId(null);
  }, []);

  const selectedProvince = provinces.find((p) => p.code === selectedProvinceId);
  const selectedDistrict = districts.find((d) => d.code === selectedDistrictId);

  const reset = useCallback(() => {
    setSelectedProvinceId(null);
    setSelectedDistrictId(null);
    setDistricts([]);
  }, []);

  return {
    selectedProvinceId,
    selectedDistrictId,
    provinces,
    districts,
    isLoadingProvinces,
    isLoadingDistricts,
    error,
    setSelectedProvinceId: handleSetProvinceId,
    setSelectedDistrictId,
    selectedProvince,
    selectedDistrict,
    reset,
  };
}
