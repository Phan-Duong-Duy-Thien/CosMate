/**
 * Pending merge for the current user's provider profile (single record).
 * BE GET may lag after PUT / subscription payment — keep optimistic fields until server matches.
 */
import type { ProviderProfile, UpdateProviderProfilePayload } from '../types';
import { PENDING_LIST_DEFAULT_TTL_MS } from '@/shared/sync/pendingListMerge';

type PendingEntry = {
  patch: Partial<ProviderProfile>;
  updatedAt: number;
};

let pending: PendingEntry | null = null;

export function setPendingProviderPatch(patch: Partial<ProviderProfile>): void {
  pending = {
    patch: { ...(pending?.patch ?? {}), ...patch },
    updatedAt: Date.now(),
  };
}

export function clearPendingProviderProfile(): void {
  pending = null;
}

export function getPendingProviderPatch(): Partial<ProviderProfile> | null {
  if (!pending) return null;
  if (Date.now() - pending.updatedAt > PENDING_LIST_DEFAULT_TTL_MS) {
    pending = null;
    return null;
  }
  return pending.patch;
}

function valuesMatch(a: unknown, b: unknown): boolean {
  return a === b;
}

/** Merge server profile with pending overrides; drop pending keys when BE matches. */
export function mergeFetchedProviderProfile(fetched: ProviderProfile): ProviderProfile {
  if (!pending) return fetched;

  if (Date.now() - pending.updatedAt > PENDING_LIST_DEFAULT_TTL_MS) {
    pending = null;
    return fetched;
  }

  const merged: ProviderProfile = { ...fetched, ...pending.patch };
  const nextPatch: Partial<ProviderProfile> = { ...pending.patch };

  for (const key of Object.keys(pending.patch) as (keyof ProviderProfile)[]) {
    const pendingValue = pending.patch[key];
    if (valuesMatch(fetched[key], pendingValue)) {
      delete nextPatch[key];
    }
  }

  if (Object.keys(nextPatch).length === 0) {
    pending = null;
  } else {
    pending = { patch: nextPatch, updatedAt: pending.updatedAt };
  }

  return merged;
}

export function buildCompleteProfilePatch(
  payload: UpdateProviderProfilePayload,
): Partial<ProviderProfile> {
  return {
    shopName: payload.shopName,
    shopAddressId: payload.shopAddressId,
    bio: payload.bio,
    bankAccountNumber: payload.bankAccountNumber,
    bankName: payload.bankName,
  };
}

/** Apply pending patch onto an in-memory profile (for instant UI before refetch). */
export function applyPendingToProfile(profile: ProviderProfile): ProviderProfile {
  const patch = getPendingProviderPatch();
  if (!patch) return profile;
  return { ...profile, ...patch };
}
