/**
 * Static GHN master-data loaded from public/data/ghn-master.json (sync via npm run ghn:sync-master).
 */
import type { GhnDistrict, GhnProvince, GhnWard } from '@/features/order/api/ghn.api';

export interface GhnMasterDistrict extends GhnDistrict {
  wards: GhnWard[];
}

export interface GhnMasterProvince extends GhnProvince {
  districts: GhnMasterDistrict[];
}

export interface GhnMasterSnapshot {
  version: number;
  generatedAt: string;
  provinces: GhnMasterProvince[];
}

const MASTER_DATA_URL = '/data/ghn-master.json';

let loadPromise: Promise<GhnMasterSnapshot> | null = null;
let snapshot: GhnMasterSnapshot | null = null;

const districtsByProvince = new Map<number, GhnDistrict[]>();
const wardsByDistrict = new Map<number, GhnWard[]>();

function indexSnapshot(data: GhnMasterSnapshot): void {
  districtsByProvince.clear();
  wardsByDistrict.clear();

  for (const province of data.provinces) {
    const districts: GhnDistrict[] = province.districts.map((d) => ({
      DistrictID: d.DistrictID,
      DistrictName: d.DistrictName,
    }));
    districtsByProvince.set(province.ProvinceID, districts);

    for (const district of province.districts) {
      wardsByDistrict.set(district.DistrictID, district.wards);
    }
  }
}

/**
 * Load GHN master snapshot once (cached in memory for the session).
 */
export async function loadGhnMasterData(): Promise<GhnMasterSnapshot> {
  if (snapshot) return snapshot;

  if (!loadPromise) {
    loadPromise = fetch(MASTER_DATA_URL)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load GHN master data: HTTP ${res.status}`);
        }
        return res.json() as Promise<GhnMasterSnapshot>;
      })
      .then((data) => {
        if (!data?.provinces?.length) {
          throw new Error('GHN master data is empty or invalid');
        }
        snapshot = data;
        indexSnapshot(data);
        return data;
      })
      .catch((err) => {
        loadPromise = null;
        throw err;
      });
  }

  return loadPromise;
}

export function getGhnMasterDataVersion(): number {
  return snapshot?.version ?? 0;
}

export function getGhnMasterProvinces(): GhnProvince[] {
  if (!snapshot) {
    throw new Error('GHN master data not loaded. Call loadGhnMasterData() first.');
  }
  return snapshot.provinces.map((p) => ({
    ProvinceID: p.ProvinceID,
    ProvinceName: p.ProvinceName,
  }));
}

export function getGhnMasterDistricts(provinceId: number): GhnDistrict[] {
  if (!snapshot) {
    throw new Error('GHN master data not loaded. Call loadGhnMasterData() first.');
  }
  return districtsByProvince.get(provinceId) ?? [];
}

export function getGhnMasterWards(districtId: number): GhnWard[] {
  if (!snapshot) {
    throw new Error('GHN master data not loaded. Call loadGhnMasterData() first.');
  }
  return wardsByDistrict.get(districtId) ?? [];
}

/** Prefetch in background; errors are swallowed (fee estimate will surface them). */
export function prefetchGhnMasterData(): void {
  void loadGhnMasterData().catch((err) => {
    if (import.meta.env.DEV) {
      console.warn('[GHN] prefetch master data failed', err);
    }
  });
}
