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
  masterDataVersion?: number;
}

interface GhnAddressCacheStore {
  version: number;
  masterDataVersion: number;
  byText: Record<string, GhnCachedResolve>;
  byAddressId: Record<string, GhnCachedResolve>;
}

const STORAGE_KEY = 'cosmate_ghn_address_map_v2';
const STORE_SCHEMA_VERSION = 2;
const MAX_TEXT_ENTRIES = 800;
const MAX_ID_ENTRIES = 400;

function emptyStore(masterDataVersion = 0): GhnAddressCacheStore {
  return {
    version: STORE_SCHEMA_VERSION,
    masterDataVersion,
    byText: {},
    byAddressId: {},
  };
}

function readStore(): GhnAddressCacheStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as GhnAddressCacheStore;
    if (parsed?.version !== STORE_SCHEMA_VERSION) {
      return emptyStore();
    }
    return {
      version: STORE_SCHEMA_VERSION,
      masterDataVersion: parsed.masterDataVersion ?? 0,
      byText: parsed.byText ?? {},
      byAddressId: parsed.byAddressId ?? {},
    };
  } catch {
    return emptyStore();
  }
}

function trimRecord<T>(record: Record<string, T>, max: number): Record<string, T> {
  const keys = Object.keys(record);
  if (keys.length <= max) return record;
  const trimmed = keys.slice(-max);
  const next: Record<string, T> = {};
  for (const k of trimmed) next[k] = record[k];
  return next;
}

function writeStore(store: GhnAddressCacheStore): void {
  try {
    store.byText = trimRecord(store.byText, MAX_TEXT_ENTRIES);
    store.byAddressId = trimRecord(store.byAddressId, MAX_ID_ENTRIES);
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

export function buildGhnAddressIdCacheKey(addressId: number): string {
  return `id:${addressId}`;
}

export function invalidateGhnAddressCacheIfMasterVersionChanged(
  masterDataVersion: number
): void {
  const store = readStore();
  if (store.masterDataVersion === masterDataVersion) return;
  writeStore(emptyStore(masterDataVersion));
}

export function getGhnAddressCache(key: string): GhnCachedResolve | null {
  const store = readStore();
  return store.byText[key] ?? store.byAddressId[key] ?? null;
}

export function getGhnAddressCacheById(addressId: number): GhnCachedResolve | null {
  const store = readStore();
  return store.byAddressId[buildGhnAddressIdCacheKey(addressId)] ?? null;
}

export function setGhnAddressCache(
  key: string,
  value: GhnCachedResolve,
  options?: { addressId?: number; masterDataVersion?: number }
): void {
  const store = readStore();
  if (options?.masterDataVersion != null) {
    store.masterDataVersion = options.masterDataVersion;
  }
  store.byText[key] = value;
  if (options?.addressId != null) {
    store.byAddressId[buildGhnAddressIdCacheKey(options.addressId)] = value;
  }
  writeStore(store);
}
