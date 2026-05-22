/**
 * Browser-local cache for GHN address resolution (FE-only).
 */
import { normalizeVnAdminName } from '@/shared/utils/vnLocationNormalize';

export type GhnCachedResolveTier =
  | 'ward'
  | 'openApiBridge'
  | 'ghnDistrictDefault'
  | 'globalWardScan';

export interface GhnCachedResolve {
  districtId: number;
  wardCode: string;
  approximate?: boolean;
  resolveTier: GhnCachedResolveTier;
}

const STORAGE_KEY = 'cosmate_ghn_address_map_v1';
const MAX_ENTRIES = 200;

function readStore(): Record<string, GhnCachedResolve> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, GhnCachedResolve>;
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, GhnCachedResolve>): void {
  try {
    const keys = Object.keys(store);
    if (keys.length > MAX_ENTRIES) {
      const trimmed = keys.slice(-MAX_ENTRIES);
      const next: Record<string, GhnCachedResolve> = {};
      for (const k of trimmed) next[k] = store[k];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota / private mode
  }
}

export function buildGhnAddressCacheKey(
  city: string,
  district: string,
  street = ''
): string {
  return [city, district, street]
    .map((part) => normalizeVnAdminName(part))
    .join('|');
}

export function getGhnAddressCache(key: string): GhnCachedResolve | null {
  const store = readStore();
  return store[key] ?? null;
}

export function setGhnAddressCache(key: string, value: GhnCachedResolve): void {
  const store = readStore();
  store[key] = value;
  writeStore(store);
}
