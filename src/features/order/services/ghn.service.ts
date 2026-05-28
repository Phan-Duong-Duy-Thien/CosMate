/**
 * Resolve order addresses to GHN IDs and estimate shipping fee (FE-only).
 *
 * Master-data (provinces/districts/wards) is loaded from public/data/ghn-master.json.
 * Only calculateGhnShippingFee calls GHN API at runtime.
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
  isGhnConfigured,
  type GhnWard,
} from '../api/ghn.api';
import { fetchProvinces, fetchWardsByProvince } from '@/shared/api/vnLocation.api';
import {
  loadGhnMasterData,
  getGhnMasterDataVersion,
  getGhnMasterDistricts,
  getGhnMasterProvinces,
  getGhnMasterWards,
} from '@/shared/data/ghnMasterData';
import {
  matchAdminUnitByName,
  matchAdminUnitByVariants,
  normalizeVnAdminName,
  expandWardSearchLabels,
} from '@/shared/utils/vnLocationNormalize';
import {
  buildGhnAddressCacheKey,
  getGhnAddressCache,
  getGhnAddressCacheById,
  invalidateGhnAddressCacheIfMasterVersionChanged,
  setGhnAddressCache,
  type GhnCachedResolve,
} from '@/shared/utils/ghnAddressCache';

const DEFAULT_WEIGHT_GRAM = Number(import.meta.env.VITE_GHN_DEFAULT_WEIGHT_GRAM) || 1000;
const DEFAULT_LENGTH = Number(import.meta.env.VITE_GHN_DEFAULT_LENGTH_CM) || 30;
const DEFAULT_WIDTH = Number(import.meta.env.VITE_GHN_DEFAULT_WIDTH_CM) || 30;
const DEFAULT_HEIGHT = Number(import.meta.env.VITE_GHN_DEFAULT_HEIGHT_CM) || 10;

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
const globalWardByNormName = new Map<string, GlobalWardHit[]>();
let globalWardCacheReady = false;

let openApiProvincesCache: Awaited<ReturnType<typeof fetchProvinces>> | null = null;

function toCachedResult(result: GhnResolveResult): GhnCachedResolve {
  return {
    districtId: result.districtId,
    wardCode: result.wardCode,
    approximate: result.approximate,
    resolveTier: result.resolveTier,
    masterDataVersion: getGhnMasterDataVersion(),
  };
}

function fromCachedResult(cached: GhnCachedResolve): GhnResolveResult {
  return { ...cached };
}

async function ensureMasterDataLoaded(): Promise<void> {
  await loadGhnMasterData();
  invalidateGhnAddressCacheIfMasterVersionChanged(getGhnMasterDataVersion());
}

async function getOpenApiProvinces() {
  if (!openApiProvincesCache) {
    openApiProvincesCache = await fetchProvinces();
  }
  return openApiProvincesCache;
}

function buildWardIndexForProvince(ghnProvinceId: number): WardIndexEntry[] {
  const cached = wardIndexByProvince.get(ghnProvinceId);
  if (cached) return cached;

  const districts = getGhnMasterDistricts(ghnProvinceId);
  const index: WardIndexEntry[] = [];

  for (const d of districts) {
    const wards = getGhnMasterWards(d.DistrictID);
    for (const w of wards) {
      index.push({
        districtId: d.DistrictID,
        wardCode: w.WardCode,
        wardName: w.WardName,
      });
    }
  }

  wardIndexByProvince.set(ghnProvinceId, index);
  return index;
}

function ensureGlobalWardCache(): void {
  if (globalWardCacheReady) return;

  const provinces = getGhnMasterProvinces();
  for (const province of provinces) {
    const index = buildWardIndexForProvince(province.ProvinceID);
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

function resolveGhnProvinceId(cityLabel: string): number {
  const provinces = getGhnMasterProvinces();
  const provinceList = provinces.map((p) => ({
    id: p.ProvinceID,
    name: p.ProvinceName,
  }));

  const direct = matchAdminUnitByName(provinceList, cityLabel);
  if (direct) return direct.id;

  throw new Error(`Không map được tỉnh/thành: ${cityLabel}`);
}

async function resolveGhnProvinceIdWithOpenApiBridge(cityLabel: string): Promise<number> {
  try {
    return resolveGhnProvinceId(cityLabel);
  } catch {
    const provinces = getGhnMasterProvinces();
    const provinceList = provinces.map((p) => ({
      id: p.ProvinceID,
      name: p.ProvinceName,
    }));

    const openProvinces = await getOpenApiProvinces();
    const openProvince = matchAdminUnitByName(openProvinces, cityLabel);
    if (openProvince) {
      const viaOpenApi = matchAdminUnitByName(provinceList, openProvince.name);
      if (viaOpenApi) return viaOpenApi.id;
    }

    throw new Error(`Không map được tỉnh/thành: ${cityLabel}`);
  }
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

function resolveViaOpenApiBridge(
  cityLabel: string,
  districtLabel: string,
  ghnProvinceId: number,
  openMatch: NonNullable<Awaited<ReturnType<typeof findOpenApiWard>>>
): GhnResolveResult | undefined {
  const wardIndex = buildWardIndexForProvince(ghnProvinceId);
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

function resolveViaGlobalWardScan(
  districtLabel: string,
  preferredGhnProvinceId: number,
  openMatch: NonNullable<Awaited<ReturnType<typeof findOpenApiWard>>>
): GhnResolveResult | undefined {
  ensureGlobalWardCache();

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

function resolveViaGhnDistrictFallback(
  ghnProvinceId: number,
  districtLabel: string,
  streetAddress?: string
): GhnResolveResult {
  const districts = getGhnMasterDistricts(ghnProvinceId);
  const districtList = districts.map((d) => ({ id: d.DistrictID, name: d.DistrictName }));
  const matched = matchAdminUnitByVariants(districtList, districtLabel);
  if (!matched) {
    throw new Error(`Không map được phường/xã: ${districtLabel}`);
  }

  const wards = getGhnMasterWards(matched.id);
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

  const ghnProvinceId = await resolveGhnProvinceIdWithOpenApiBridge(city);

  const wardIndex = buildWardIndexForProvince(ghnProvinceId);
  const wardEntry = matchWardInIndex(wardIndex, district);
  if (wardEntry) {
    return {
      districtId: wardEntry.districtId,
      wardCode: wardEntry.wardCode,
      approximate: false,
      resolveTier: 'ward',
    };
  }

  const openMatch = await findOpenApiWard(city, district);
  if (openMatch) {
    const openApiResult = resolveViaOpenApiBridge(city, district, ghnProvinceId, openMatch);
    if (openApiResult) return openApiResult;

    const globalResult = resolveViaGlobalWardScan(district, ghnProvinceId, openMatch);
    if (globalResult) return globalResult;
  }

  return resolveViaGhnDistrictFallback(ghnProvinceId, district, street);
}

export async function resolveAddressFieldsToGhn(
  fields: AddressFieldsForGhn,
  options?: { addressId?: number }
): Promise<GhnResolveResult> {
  await ensureMasterDataLoaded();

  const city = fields.city?.trim() ?? '';
  const district = fields.district?.trim() ?? '';
  const street = fields.address?.trim() ?? '';

  if (!district) {
    throw new Error('Thiếu phường/xã trên địa chỉ đơn hàng');
  }

  if (options?.addressId != null) {
    const byId = getGhnAddressCacheById(options.addressId);
    if (byId && (byId.masterDataVersion ?? 0) === getGhnMasterDataVersion()) {
      return fromCachedResult(byId);
    }
  }

  const cacheKey = buildGhnAddressCacheKey(city, district, street);
  const cached = getGhnAddressCache(cacheKey);
  if (cached && (cached.masterDataVersion ?? 0) === getGhnMasterDataVersion()) {
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
      setGhnAddressCache(cacheKey, toCachedResult(result), {
        addressId: options?.addressId,
        masterDataVersion: getGhnMasterDataVersion(),
      });
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
  return resolveAddressFieldsToGhn(
    {
      city: address.city,
      district: address.district,
      address: address.address,
    },
    { addressId: address.id }
  );
}

export type GhnShippingDirection = 'ship' | 'return';

export async function estimateOrderGhnFee(
  orderId: number,
  direction: GhnShippingDirection
): Promise<GhnFeeEstimate> {
  if (!isGhnConfigured()) {
    throw new Error('GHN_NOT_CONFIGURED');
  }

  await ensureMasterDataLoaded();

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
