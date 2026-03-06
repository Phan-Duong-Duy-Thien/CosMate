/**
 * useUserAddresses Hook
 * Manages fetching user addresses for gating logic
 */
import { useState, useEffect, useCallback } from 'react';
import { getUserAddresses } from '../services/userAddress.service';
import type { UserAddress } from '../types';
import { VI } from '@/shared/i18n/vi';

interface UseUserAddressesResult {
  addresses: UserAddress[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserAddresses(userId: number | null | undefined): UseUserAddressesResult {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (userId == null) {
      setAddresses([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserAddresses(userId);
      setAddresses(data);
    } catch {
      setError(VI.profile.addresses.error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    isLoading,
    error,
    refetch: fetchAddresses,
  };
}
