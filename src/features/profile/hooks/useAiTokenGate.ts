import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getUserProfile } from '@/features/admin/services/adminUsers.service';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { DATA_SYNC_EVENTS, subscribeDataSync } from '@/shared/sync/dataSync';
import { VI } from '@/shared/i18n/vi';

import {
  getAiTokenCost,
  getAiTokenFeatureLabelKey,
  type AiTokenFeature,
} from '../constants/aiTokenCosts';
import {
  getAiTokenInsufficientMessage,
  isAiTokenInsufficientError,
} from '../utils/aiTokenErrors';
import {
  getTokenHubPathForCurrentUser,
  getTokenHubPathFromPathname,
} from '../utils/tokenRoutes';

export type UseAiTokenGateOptions = {
  feature: AiTokenFeature;
  /** Provider shell: prefer pathname-based token hub */
  pathname?: string;
};

export function useAiTokenGate(options: UseAiTokenGateOptions) {
  const { feature, pathname: pathnameProp } = options;
  const { pathname: routePathname } = useLocation();
  const pathname = pathnameProp ?? routePathname;

  const cost = getAiTokenCost(feature);
  const featureLabelKey = getAiTokenFeatureLabelKey(feature);
  const featureLabel = VI.profile.token.features[featureLabelKey];

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  const tokenHubPath = useMemo(() => {
    return getTokenHubPathFromPathname(pathname) ?? getTokenHubPathForCurrentUser();
  }, [pathname]);

  const refetch = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setBalance(null);
      setFetchError(VI.common.permission.goLogin);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setFetchError(null);
      const profile = await getUserProfile(userId);
      setBalance(profile.numberOfToken ?? 0);
    } catch {
      setBalance(null);
      setFetchError(VI.common.status.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const onProfileRefresh = () => void refetch();
    window.addEventListener('profile:refresh', onProfileRefresh);
    const unsubToken = subscribeDataSync(DATA_SYNC_EVENTS.TOKEN_CHANGED, () => {
      void refetch();
    });
    return () => {
      window.removeEventListener('profile:refresh', onProfileRefresh);
      unsubToken();
    };
  }, [refetch]);

  const canUse = balance !== null && balance >= cost;
  const shortfall = balance !== null ? Math.max(0, cost - balance) : cost;

  const assertCanUse = useCallback((): boolean => {
    if (loading) return false;
    if (canUse) {
      setBlocked(false);
      setBlockedMessage(null);
      return true;
    }
    setBlocked(true);
    setBlockedMessage(
      balance !== null
        ? VI.profile.token.insufficientDetail(featureLabel, cost, balance)
        : VI.profile.token.insufficient,
    );
    return false;
  }, [loading, canUse, balance, cost, featureLabel]);

  const handleApiError = useCallback(
    (error: unknown): boolean => {
      if (!isAiTokenInsufficientError(error)) return false;
      setBlocked(true);
      setBlockedMessage(getAiTokenInsufficientMessage(error));
      return true;
    },
    [],
  );

  const clearBlocked = useCallback(() => {
    setBlocked(false);
    setBlockedMessage(null);
  }, []);

  return {
    balance,
    cost,
    loading,
    fetchError,
    canUse,
    shortfall,
    tokenHubPath,
    featureLabel,
    blocked,
    blockedMessage,
    refetch,
    assertCanUse,
    handleApiError,
    clearBlocked,
  };
}
