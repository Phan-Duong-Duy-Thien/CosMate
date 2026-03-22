/**
 * Shared Vietnam Locations Hook
 *
 * Provides province / commune cascading selection for all location-dependent
 * features (address forms, service area selection, etc.).
 *
 * Uses Province Open API V2 as the runtime source via the shared API layer.
 * Provides province / ward cascading selection.
 */
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { fetchProvinces, fetchWardsByProvince } from '@/shared/api/vnLocation.api';
import type { Province, District } from '@/features/profile/types';
import { VI } from '@/shared/i18n/vi';

interface UseVietnamLocationsResult {
  // Selected values
  selectedProvinceId: number | null;
  selectedCommuneId: number | null;

  // Dropdown options
  provinces: Province[];
  communes: District[];

  // Loading states
  isLoadingProvinces: boolean;
  isLoadingCommunes: boolean;

  // Error
  error: string | null;

  // Setters
  setSelectedProvinceId: (id: number | null) => void;
  setSelectedCommuneId: (id: number | null) => void;

  // Helpers
  selectedProvince: Province | undefined;
  selectedCommune: District | undefined;
  reset: () => void;
}

export function useVietnamLocations(): UseVietnamLocationsResult {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [communes, setCommunes] = useState<District[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedCommuneId, setSelectedCommuneId] = useState<number | null>(null);

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      setError(null);
      try {
        const data = await fetchProvinces();
        setProvinces(data);
      } catch {
        setError(VI.profile.address.messages.saveError);
        message.error(VI.profile.address.messages.saveError);
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    void loadProvinces();
  }, []);

  // Load communes when province changes
  useEffect(() => {
    const loadCommunes = async () => {
      if (selectedProvinceId === null) {
        setCommunes([]);
        setSelectedCommuneId(null);
        return;
      }

      setIsLoadingCommunes(true);
      setError(null);
      try {
        const data = await fetchWardsByProvince(selectedProvinceId);
        setCommunes(data);
      } catch {
        setError(VI.profile.address.messages.saveError);
        message.error(VI.profile.address.messages.saveError);
      } finally {
        setIsLoadingCommunes(false);
      }
    };
    void loadCommunes();
  }, [selectedProvinceId]);

  // Clear commune selection when province changes
  const handleSetProvinceId = useCallback((id: number | null) => {
    setSelectedProvinceId(id);
    setSelectedCommuneId(null);
  }, []);

  const selectedProvince = provinces.find((p) => p.code === selectedProvinceId);
  const selectedCommune = communes.find((c) => c.code === selectedCommuneId);

  const reset = useCallback(() => {
    setSelectedProvinceId(null);
    setSelectedCommuneId(null);
    setCommunes([]);
  }, []);

  return {
    selectedProvinceId,
    selectedCommuneId,
    provinces,
    communes,
    isLoadingProvinces,
    isLoadingCommunes,
    error,
    setSelectedProvinceId: handleSetProvinceId,
    setSelectedCommuneId,
    selectedProvince,
    selectedCommune,
    reset,
  };
}
