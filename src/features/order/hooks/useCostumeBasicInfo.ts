/**
 * useCostumeBasicInfo
 *
 * Fetches basic costume info by ID for display in OrderDetailDrawer.
 * Uses existing getCostumeById from costume-rental/api/costume.api.ts.
 * Lightweight — returns only the fields needed for order detail display:
 *   name, imageUrls, pricePerDay, depositAmount, size, status
 *
 * Data flow: Hook -> API -> axiosInstance
 */
import { useState, useEffect, useCallback } from 'react';
import { getCostumeById } from '@/features/costume-rental/api/costume.api';
import type { Costume } from '@/features/costume-rental/types';

interface CostumeBasicInfo {
  id: number;
  name: string;
  imageUrls: string[];
  pricePerDay: number;
  depositAmount: number;
  size: string;
  status: string;
}

export function useCostumeBasicInfo(costumeId: number | null | undefined) {
  const [costume, setCostume] = useState<CostumeBasicInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCostume = useCallback(async () => {
    if (!costumeId) return;
    setLoading(true);
    setError(null);
    try {
      const data: Costume = await getCostumeById(costumeId);
      setCostume({
        id: data.id,
        name: data.name,
        imageUrls: data.imageUrls ?? [],
        pricePerDay: data.pricePerDay ?? 0,
        depositAmount: data.depositAmount ?? 0,
        size: data.size ?? '-',
        status: data.status ?? '-',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin trang phục.');
    } finally {
      setLoading(false);
    }
  }, [costumeId]);

  useEffect(() => {
    fetchCostume();
  }, [fetchCostume]);

  return { costume, loading, error, refetch: fetchCostume };
}