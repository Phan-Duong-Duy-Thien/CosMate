/**
 * GHN Open API (via dev proxy /ghn-proxy or VITE_GHN_API_BASE).
 * https://api.ghn.vn/home/docs/detail
 */

const GHN_BASE =
  import.meta.env.VITE_GHN_API_BASE?.replace(/\/$/, '') || '/ghn-proxy';

function ghnToken(): string {
  return import.meta.env.VITE_GHN_TOKEN ?? '';
}

function ghnShopId(): string {
  return import.meta.env.VITE_GHN_SHOP_ID ?? '';
}

function ghnHeaders(requireShopId = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Token: ghnToken(),
  };
  if (requireShopId) {
    headers.ShopId = ghnShopId();
  }
  return headers;
}

interface GhnApiEnvelope<T> {
  code: number;
  message?: string;
  data?: T;
}

async function ghnRequest<T>(
  path: string,
  init?: RequestInit & { requireShopId?: boolean }
): Promise<GhnApiEnvelope<T>> {
  const { requireShopId = true, ...fetchInit } = init ?? {};
  const res = await fetch(`${GHN_BASE}${path}`, {
    ...fetchInit,
    headers: {
      ...ghnHeaders(requireShopId),
      ...(fetchInit.headers ?? {}),
    },
  });
  return (await res.json()) as GhnApiEnvelope<T>;
}

async function ghnFetch<T>(
  path: string,
  init?: RequestInit & { requireShopId?: boolean }
): Promise<T> {
  const json = await ghnRequest<T>(path, init);
  if (json.code !== 200 || json.data == null) {
    throw new Error(json.message ?? 'GHN API error');
  }
  return json.data;
}

/** GHN master-data sometimes returns code 200 with data: null — avoid .map on null. */
async function ghnFetchList<T>(
  path: string,
  init?: RequestInit & { requireShopId?: boolean }
): Promise<T[]> {
  const json = await ghnRequest<T[]>(path, init);
  if (json.code !== 200) {
    throw new Error(json.message ?? 'GHN API error');
  }
  return Array.isArray(json.data) ? json.data : [];
}

export interface GhnProvince {
  ProvinceID: number;
  ProvinceName: string;
}

export interface GhnDistrict {
  DistrictID: number;
  DistrictName: string;
}

export interface GhnWard {
  WardCode: string;
  WardName: string;
}

export interface GhnFeePayload {
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  service_type_id?: number;
}

export interface GhnFeeResult {
  total?: number;
  service_fee?: number;
}

export function isGhnConfigured(): boolean {
  return Boolean(ghnToken() && ghnShopId());
}

export async function fetchGhnProvinces(): Promise<GhnProvince[]> {
  return ghnFetchList<GhnProvince>('/shiip/public-api/master-data/province', { method: 'GET' });
}

export async function fetchGhnDistricts(provinceId: number): Promise<GhnDistrict[]> {
  return ghnFetchList<GhnDistrict>(
    `/shiip/public-api/master-data/district?province_id=${provinceId}`,
    { method: 'GET' }
  );
}

export async function fetchGhnWards(districtId: number): Promise<GhnWard[]> {
  return ghnFetchList<GhnWard>(
    `/shiip/public-api/master-data/ward?district_id=${districtId}`,
    { method: 'GET' }
  );
}

export async function calculateGhnShippingFee(payload: GhnFeePayload): Promise<GhnFeeResult> {
  const data = await ghnFetch<{ total?: number; service_fee?: number }>(
    '/shiip/public-api/v2/shipping-order/fee',
    {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        service_type_id: payload.service_type_id ?? 2,
      }),
    }
  );
  return data;
}
