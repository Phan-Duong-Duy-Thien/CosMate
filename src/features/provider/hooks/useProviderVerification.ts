/**
 * useProviderVerification
 * Fetches the provider profile for the current user and exposes verified state.
 * Synced across instances via dataSync + pending merge (post profile save / subscription pay).
 */
import { useCallback, useEffect, useState } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getProviderByUserId } from '../api/provider.api';
import { isProviderProfileComplete } from '../services/provider.service';
import type { ProviderProfile } from '../types';
import {
  applyPendingToProfile,
  mergeFetchedProviderProfile,
  setPendingProviderPatch,
} from '../utils/pendingProviderProfile';
import {
  DATA_SYNC_EVENTS,
  notifyProviderProfileChanged,
} from '@/shared/sync/dataSync';
import { useRefetchOnWindowFocus } from '@/shared/hooks/useRefetchOnWindowFocus';

interface UseProviderVerificationResult {
  profile: ProviderProfile | null;
  verified: boolean | null;
  profileComplete: boolean | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Optimistic patch + notify all hook instances (gate, completion page, etc.). */
export function applyOptimisticProviderPatch(patch: Partial<ProviderProfile>): void {
  setPendingProviderPatch(patch);
  notifyProviderProfileChanged(
    patch.id != null ? { providerId: patch.id } : undefined,
  );
}

export function useProviderVerification(): UseProviderVerificationResult {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (silent = false) => {
    const userId = getUserId();
    if (!userId) {
      setError('no_user');
      setLoading(false);
      return;
    }

    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getProviderByUserId(userId);
      setProfile(mergeFetchedProviderProfile(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'fetch_error');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchProfile(false);
  }, [fetchProfile]);

  useRefetchOnWindowFocus(() => fetchProfile(true));

  useEffect(() => {
    const applyLocalPending = () => {
      setProfile((prev) => (prev ? applyPendingToProfile(prev) : prev));
    };
    applyLocalPending();

    const onSync = () => {
      applyLocalPending();
      void fetchProfile(true);
    };

    window.addEventListener(DATA_SYNC_EVENTS.PROVIDER_PROFILE_CHANGED, onSync);
    return () => window.removeEventListener(DATA_SYNC_EVENTS.PROVIDER_PROFILE_CHANGED, onSync);
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    void fetchProfile(true);
  }, [fetchProfile]);

  return {
    profile,
    verified: profile ? profile.verified : null,
    profileComplete: profile ? isProviderProfileComplete(profile) : null,
    loading,
    error,
    refetch,
  };
}
