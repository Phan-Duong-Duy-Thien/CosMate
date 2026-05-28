/**
 * GHN Open API (via dev proxy /ghn-proxy or VITE_GHN_API_BASE).
 * https://api.ghn.vn/home/docs/detail
 */

import {
  getGhnApiBase,
  getGhnConfigStatus,
  getGhnShopId,
  getGhnToken,
} from '@/shared/config/env';

export type GhnErrorCode =
  | 'GHN_HTML_RESPONSE'
  | 'GHN_INVALID_JSON'
  | 'GHN_HTTP_ERROR'
  | 'GHN_API_ERROR';

export class GhnResponseError extends Error {
  readonly code: GhnErrorCode;
  readonly httpStatus?: number;

  constructor(message: string, code: GhnErrorCode, httpStatus?: number) {
    super(message);
    this.name = 'GhnResponseError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

function ghnHeaders(requireShopId = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Token: getGhnToken(),
  };
  if (requireShopId) {
    headers.ShopId = getGhnShopId();
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
  const res = await fetch(`${getGhnApiBase()}${path}`, {
    ...fetchInit,
    headers: {
      ...ghnHeaders(requireShopId),
      ...(fetchInit.headers ?? {}),
    },
  });

  const text = await res.text();
  const trimmed = text.trim();

  if (trimmed.startsWith('<')) {
    throw new GhnResponseError(
      'GHN returned HTML instead of JSON',
      'GHN_HTML_RESPONSE',
      res.status
    );
  }

  if (!res.ok) {
    const snippet = trimmed.slice(0, 120);
    throw new GhnResponseError(
      snippet ? `GHN HTTP ${res.status}: ${snippet}` : `GHN HTTP ${res.status}`,
      'GHN_HTTP_ERROR',
      res.status
    );
  }

  let json: GhnApiEnvelope<T>;
  try {
    json = JSON.parse(trimmed) as GhnApiEnvelope<T>;
  } catch {
    throw new GhnResponseError('Invalid JSON from GHN', 'GHN_INVALID_JSON', res.status);
  }

  return json;
}

async function ghnFetch<T>(
  path: string,
  init?: RequestInit & { requireShopId?: boolean }
): Promise<T> {
  const json = await ghnRequest<T>(path, init);
  if (json.code !== 200 || json.data == null) {
    throw new GhnResponseError(json.message ?? 'GHN API error', 'GHN_API_ERROR');
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
    throw new GhnResponseError(json.message ?? 'GHN API error', 'GHN_API_ERROR');
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
  return getGhnConfigStatus() === 'ok';
}

export { getGhnConfigStatus } from '@/shared/config/env';

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
