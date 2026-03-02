/**
 * useUserAddresses Hook
 * Manages fetching user addresses for gating logic
 */
import { useState, useEffect, useCallback } from 'react';
import { getUserAddresses } from '../services/userAddress.service';
import type { UserAddress } from '../types';

interface UseUserAddressesResult {
  addresses: UserAddress[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserAddresses(userId: number | null): UseUserAddressesResult {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (userId === null) {
      setAddresses([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserAddresses(userId);
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch user addresses:', err);
      setError('Không thể tải địa chỉ người dùng');
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
