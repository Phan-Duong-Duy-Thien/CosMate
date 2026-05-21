/**
 * Resolve order addresses to GHN IDs and estimate shipping fee (FE-only).
 *
 * Address semantics (Province Open API V2):
 * - city     → Tỉnh / Thành phố
 * - district → Phường / Xã (ward); legacy rows may store quận name
 */
import { fetchOrderDetail } from './order.service';
import type { AddressFieldsForGhn, OrderAddress } from '../types';
import { isGeovinaConfigured } from '../api/geovina.api';
import { normalizeAddressViaGeovina } from './geovinaAddress.service';
import {
  calculateGhnShippingFee,
  fetchGhnDistricts,
  fetchGhnProvinces,
  fetchGhnWards,
  isGhnConfigured,
  type GhnDistrict,
  type GhnWard,
} from '../api/ghn.api';
import { fetchProvinces, fetchWardsByProvince } from '@/shared/api/vnLocation.api';
import {
  matchAdminUnitByName,
  matchAdminUnitByVariants,
  normalizeVnAdminName,
  expandWardSearchLabels,
} from '@/shared/utils/vnLocationNormalize';
import {
  buildGhnAddressCacheKey,
  getGhnAddressCache,
  setGhnAddressCache,
  type GhnCachedResolve,
} from '@/shared/utils/ghnAddressCache';

const DEFAULT_WEIGHT_GRAM = Number(import.meta.env.VITE_GHN_DEFAULT_WEIGHT_GRAM) || 1000;
const DEFAULT_LENGTH = Number(import.meta.env.VITE_GHN_DEFAULT_LENGTH_CM) || 30;
const DEFAULT_WIDTH = Number(import.meta.env.VITE_GHN_DEFAULT_WIDTH_CM) || 30;
const DEFAULT_HEIGHT = Number(import.meta.env.VITE_GHN_DEFAULT_HEIGHT_CM) || 10;

const BATCH_SIZE = 8;
const WARD_FETCH_RETRIES = 2;
const WARD_RETRY_DELAY_MS = 300;

export type GhnResolveTier = GhnCachedResolve['resolveTier'];

export interface GhnResolveResult {
  districtId: number;
  wardCode: string;
  approximate?: boolean;
  resolveTier: GhnResolveTier;
}

export interface GhnFeeEstimate {
  fee: number;
  approximate: boolean;
}

type WardIndexEntry = {
  districtId: number;
  wardCode: string;
  wardName: string;
};

type GlobalWardHit = {
  ghnProvinceId: number;
  districtId: number;
  wardCode: string;
  wardName: string;
};

const wardIndexByProvince = new Map<number, WardIndexEntry[]>();
const ghnDistrictsByProvince = new Map<number, GhnDistrict[]>();
const ghnWardsByDistrict = new Map<number, GhnWard[]>();
const globalWardByNormName = new Map<string, GlobalWardHit[]>();

let provincesCache: Awaited<ReturnType<typeof fetchGhnProvinces>> | null = null;
let openApiProvincesCache: Awaited<ReturnType<typeof fetchProvinces>> | null = null;
let globalWardCacheReady = false;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toCachedResult(result: GhnResolveResult): GhnCachedResolve {
  return {
    districtId: result.districtId,
    wardCode: result.wardCode,
    approximate: result.approximate,
    resolveTier: result.resolveTier,
  };
}

function fromCachedResult(cached: GhnCachedResolve): GhnResolveResult {
  return { ...cached };
}

async function getGhnProvinces() {
  if (!provincesCache) {
    const raw = await fetchGhnProvinces();
    provincesCache = Array.isArray(raw) ? raw : [];
  }
  return provincesCache;
}

async function getOpenApiProvinces() {
  if (!openApiProvincesCache) {
    openApiProvincesCache = await fetchProvinces();
  }
  return openApiProvincesCache;
}

async function fetchWardsWithRetry(districtId: number): Promise<GhnWard[]> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= WARD_FETCH_RETRIES; attempt++) {
    try {
      return await fetchGhnWards(districtId);
    } catch (err) {
      lastError = err;
      if (attempt < WARD_FETCH_RETRIES) {
        await delay(WARD_RETRY_DELAY_MS);
      }
    }
  }
  if (import.meta.env.DEV) {
    console.warn(`[GHN] fetchGhnWards failed for district ${districtId}`, lastError);
  }
  return [];
}

async function getGhnDistricts(ghnProvinceId: number): Promise<GhnDistrict[]> {
  const cached = ghnDistrictsByProvince.get(ghnProvinceId);
  if (cached) return cached;
  const districts = await fetchGhnDistricts(ghnProvinceId);
  const list = Array.isArray(districts) ? districts : [];
  ghnDistrictsByProvince.set(ghnProvinceId, list);
  return list;
}

async function getGhnWardsForDistrict(districtId: number): Promise<GhnWard[]> {
  const cached = ghnWardsByDistrict.get(districtId);
  if (cached) return cached;
  const wards = await fetchWardsWithRetry(districtId);
  const list = Array.isArray(wards) ? wards : [];
  ghnWardsByDistrict.set(districtId, list);
  return list;
}

async function buildWardIndexForProvince(ghnProvinceId: number): Promise<WardIndexEntry[]> {
  const cached = wardIndexByProvince.get(ghnProvinceId);
  if (cached) return cached;

  const districts = await getGhnDistricts(ghnProvinceId);
  const index: WardIndexEntry[] = [];

  for (let i = 0; i < districts.length; i += BATCH_SIZE) {
    const batch = districts.slice(i, i + BATCH_SIZE);
    const wardGroups = await Promise.all(
      batch.map(async (d) => {
        const wards = await getGhnWardsForDistrict(d.DistrictID);
        return wards.map((w) => ({
          districtId: d.DistrictID,
          wardCode: w.WardCode,
          wardName: w.WardName,
        }));
      })
    );
    for (const group of wardGroups) {
      index.push(...group);
    }
  }

  wardIndexByProvince.set(ghnProvinceId, index);
  return index;
}

async function ensureGlobalWardCache(): Promise<void> {
  if (globalWardCacheReady) return;

  const provinces = await getGhnProvinces();
  for (const province of provinces) {
    const index = await buildWardIndexForProvince(province.ProvinceID);
    for (const entry of index) {
      const norm = normalizeVnAdminName(entry.wardName);
      if (!norm) continue;
      const hits = globalWardByNormName.get(norm) ?? [];
      hits.push({
        ghnProvinceId: province.ProvinceID,
        districtId: entry.districtId,
        wardCode: entry.wardCode,
        wardName: entry.wardName,
      });
      globalWardByNormName.set(norm, hits);
    }
  }

  globalWardCacheReady = true;
}

async function resolveGhnProvinceId(cityLabel: string): Promise<number> {
  const provinces = await getGhnProvinces();
  const provinceList = provinces.map((p) => ({
    id: p.ProvinceID,
    name: p.ProvinceName,
  }));

  const direct = matchAdminUnitByName(provinceList, cityLabel);
  if (direct) return direct.id;

  const openProvinces = await getOpenApiProvinces();
  const openProvince = matchAdminUnitByName(openProvinces, cityLabel);
  if (openProvince) {
    const viaOpenApi = matchAdminUnitByName(provinceList, openProvince.name);
    if (viaOpenApi) return viaOpenApi.id;
  }

  throw new Error(`Không map được tỉnh/thành: ${cityLabel}`);
}

function matchWardInIndex(
  wardIndex: WardIndexEntry[],
  wardLabel: string
): WardIndexEntry | undefined {
  const wardCandidates = wardIndex.map((w) => ({ name: w.wardName, entry: w }));

  for (const label of expandWardSearchLabels(wardLabel)) {
    const matched = matchAdminUnitByName(
      wardCandidates.map((c) => ({ name: c.name })),
      label
    );
    if (matched) {
      return wardCandidates.find((c) => c.name === matched.name)!.entry;
    }
  }

  return undefined;
}

function pickDefaultWardInDistrict(wards: GhnWard[], streetAddress?: string): GhnWard {
  if (wards.length === 0) {
    throw new Error('Quận/huyện không có phường/xã trên GHN');
  }
  if (wards.length === 1) return wards[0];

  const street = streetAddress?.trim();
  if (street) {
    const streetMatched = matchAdminUnitByVariants(
      wards.map((w) => ({ name: w.WardName })),
      street
    );
    if (streetMatched) {
      return wards.find((w) => w.WardName === streetMatched.name)!;
    }
  }

  return wards[0];
}

async function findOpenApiWard(cityLabel: string, districtLabel: string) {
  const openProvinces = await getOpenApiProvinces();
  const openProvince = matchAdminUnitByName(openProvinces, cityLabel);
  if (!openProvince) return undefined;

  const openWards = await fetchWardsByProvince(openProvince.code);
  const openWard = matchAdminUnitByVariants(openWards, districtLabel);
  if (!openWard) return undefined;

  return { openProvince, openWard };
}

async function resolveViaOpenApiBridge(
  cityLabel: string,
  districtLabel: string,
  ghnProvinceId: number
): Promise<GhnResolveResult | undefined> {
  const openMatch = await findOpenApiWard(cityLabel, districtLabel);
  if (!openMatch) return undefined;

  const wardIndex = await buildWardIndexForProvince(ghnProvinceId);
  const labelsToTry = [
    ...expandWardSearchLabels(openMatch.openWard.name),
    ...expandWardSearchLabels(districtLabel),
  ];

  for (const label of labelsToTry) {
    const entry = matchWardInIndex(wardIndex, label);
    if (entry) {
      return {
        districtId: entry.districtId,
        wardCode: entry.wardCode,
        approximate: false,
        resolveTier: 'openApiBridge',
      };
    }
  }

  return undefined;
}

async function resolveViaGlobalWardScan(
  cityLabel: string,
  districtLabel: string,
  preferredGhnProvinceId: number
): Promise<GhnResolveResult | undefined> {
  const openMatch = await findOpenApiWard(cityLabel, districtLabel);
  if (!openMatch) return undefined;

  await ensureGlobalWardCache();

  const labelsToTry = [
    ...expandWardSearchLabels(openMatch.openWard.name),
    ...expandWardSearchLabels(districtLabel),
  ];

  for (const label of labelsToTry) {
    const norm = normalizeVnAdminName(label);
    if (!norm) continue;

    const hits = globalWardByNormName.get(norm);
    if (!hits?.length) continue;

    const preferredHit = hits.find((h) => h.ghnProvinceId === preferredGhnProvinceId);
    const hit = preferredHit ?? hits[0];

    return {
      districtId: hit.districtId,
      wardCode: hit.wardCode,
      approximate: !preferredHit || hits.length > 1,
      resolveTier: 'globalWardScan',
    };
  }

  return undefined;
}

async function resolveViaGhnDistrictFallback(
  ghnProvinceId: number,
  districtLabel: string,
  streetAddress?: string
): Promise<GhnResolveResult> {
  const districts = await getGhnDistricts(ghnProvinceId);
  const districtList = districts.map((d) => ({ id: d.DistrictID, name: d.DistrictName }));
  const matched = matchAdminUnitByVariants(districtList, districtLabel);
  if (!matched) {
    throw new Error(`Không map được phường/xã: ${districtLabel}`);
  }

  const wards = await getGhnWardsForDistrict(matched.id);
  const ward = pickDefaultWardInDistrict(wards, streetAddress);

  return {
    districtId: matched.id,
    wardCode: ward.WardCode,
    approximate: true,
    resolveTier: 'ghnDistrictDefault',
  };
}

function dedupeAddressCandidates(candidates: AddressFieldsForGhn[]): AddressFieldsForGhn[] {
  const seen = new Set<string>();
  const out: AddressFieldsForGhn[] = [];
  for (const c of candidates) {
    const district = c.district?.trim() ?? '';
    if (!district) continue;
    const key = buildGhnAddressCacheKey(c.city ?? '', district, c.address ?? '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      city: c.city?.trim() ?? '',
      district,
      address: c.address?.trim() ?? '',
    });
  }
  return out;
}

async function buildResolveCandidates(fields: AddressFieldsForGhn): Promise<AddressFieldsForGhn[]> {
  const list: AddressFieldsForGhn[] = [fields];

  if (isGeovinaConfigured()) {
    try {
      const normalized = await normalizeAddressViaGeovina(fields);
      if (normalized) {
        list.push(...normalized.old);
        if (normalized.new) list.push(normalized.new);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[GeoVina] normalize skipped', err);
      }
    }
  }

  return dedupeAddressCandidates(list);
}

async function resolveAddressFieldsToGhnCore(
  fields: AddressFieldsForGhn
): Promise<GhnResolveResult> {
  const city = fields.city?.trim() ?? '';
  const district = fields.district?.trim() ?? '';
  const street = fields.address?.trim() ?? '';

  if (!district) {
    throw new Error('Thiếu phường/xã trên địa chỉ đơn hàng');
  }

  const ghnProvinceId = await resolveGhnProvinceId(city);

  const wardIndex = await buildWardIndexForProvince(ghnProvinceId);
  const wardEntry = matchWardInIndex(wardIndex, district);
  if (wardEntry) {
    return {
      districtId: wardEntry.districtId,
      wardCode: wardEntry.wardCode,
      approximate: false,
      resolveTier: 'ward',
    };
  }

  const openApiResult = await resolveViaOpenApiBridge(city, district, ghnProvinceId);
  if (openApiResult) {
    return openApiResult;
  }

  const globalResult = await resolveViaGlobalWardScan(city, district, ghnProvinceId);
  if (globalResult) {
    return globalResult;
  }

  return resolveViaGhnDistrictFallback(ghnProvinceId, district, street);
}

export async function resolveAddressFieldsToGhn(
  fields: AddressFieldsForGhn
): Promise<GhnResolveResult> {
  const city = fields.city?.trim() ?? '';
  const district = fields.district?.trim() ?? '';
  const street = fields.address?.trim() ?? '';

  if (!district) {
    throw new Error('Thiếu phường/xã trên địa chỉ đơn hàng');
  }

  const cacheKey = buildGhnAddressCacheKey(city, district, street);
  const cached = getGhnAddressCache(cacheKey);
  if (cached) {
    return fromCachedResult(cached);
  }

  const candidates = await buildResolveCandidates({
    city,
    district,
    address: street,
  });

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      const result = await resolveAddressFieldsToGhnCore(candidate);
      setGhnAddressCache(cacheKey, toCachedResult(result));
      return result;
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error(`Không map được phường/xã: ${district}`);
}

export async function resolveAddressToGhn(address: OrderAddress): Promise<GhnResolveResult> {
  return resolveAddressFieldsToGhn({
    city: address.city,
    district: address.district,
    address: address.address,
  });
}

export type GhnShippingDirection = 'ship' | 'return';

export async function estimateOrderGhnFee(
  orderId: number,
  direction: GhnShippingDirection
): Promise<GhnFeeEstimate> {
  if (!isGhnConfigured()) {
    throw new Error('GHN_NOT_CONFIGURED');
  }

  const detail = await fetchOrderDetail(orderId);
  const provider = detail.addresses?.find((a) => a.addressFrom === 'PROVIDER');
  const cosplayer = detail.addresses?.find((a) => a.addressFrom === 'COSPLAYER');

  if (!provider || !cosplayer) {
    throw new Error('ORDER_ADDRESSES_MISSING');
  }

  const fromAddr = direction === 'ship' ? provider : cosplayer;
  const toAddr = direction === 'ship' ? cosplayer : provider;

  const [from, to] = await Promise.all([
    resolveAddressToGhn(fromAddr),
    resolveAddressToGhn(toAddr),
  ]);

  const result = await calculateGhnShippingFee({
    from_district_id: from.districtId,
    from_ward_code: from.wardCode,
    to_district_id: to.districtId,
    to_ward_code: to.wardCode,
    weight: DEFAULT_WEIGHT_GRAM,
    length: DEFAULT_LENGTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });

  const fee = result.total ?? result.service_fee ?? 0;
  const approximate = Boolean(from.approximate || to.approximate);

  return { fee, approximate };
}
