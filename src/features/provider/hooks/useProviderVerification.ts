/**
 * useProviderVerification
 * Fetches the provider profile for the current user and exposes verified state.
 */
import { useCallback, useEffect, useState } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getProviderByUserId } from '../api/provider.api';
import { isProviderProfileComplete } from '../services/provider.service';
import type { ProviderProfile } from '../types';

interface UseProviderVerificationResult {
  profile: ProviderProfile | null;
  verified: boolean | null; // null = not yet loaded
  profileComplete: boolean | null; // null = loading, else true/false
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProviderVerification(): UseProviderVerificationResult {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setError('no_user');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getProviderByUserId(userId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'fetch_error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    verified: profile ? profile.verified : null,
    profileComplete: profile ? isProviderProfileComplete(profile) : null,
    loading,
    error,
    refetch: fetchProfile,
  };
}
