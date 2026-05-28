/**
 * GeoVina — chuẩn hóa địa chỉ hành chính cũ/mới (trước/sau sáp nhập).
 * https://www.geovina.io.vn/docs
 *
 * Dev: proxy /geovina-proxy → https://www.geovina.io.vn
 */

import { getGeovinaApiBase, getGeovinaApiKey, isGeovinaConfigured } from '@/shared/config/env';

export { isGeovinaConfigured } from '@/shared/config/env';

export interface GeoVinaAdminUnit {
  id: string;
  name: string;
  level?: string;
  province_id?: string;
  province_name?: string;
  district_id?: string;
}

export interface GeoVinaParseData {
  input?: string;
  mode?: string;
  parsed_province_raw?: string;
  parsed_district_raw?: string;
  parsed_ward_raw?: string;
  address_prefix?: string;
  old_province?: GeoVinaAdminUnit;
  old_district?: GeoVinaAdminUnit;
  old_ward?: GeoVinaAdminUnit;
  new_province?: GeoVinaAdminUnit;
  matched_new_ward?: GeoVinaAdminUnit;
  ward_level_old_address?: string;
  ward_level_new_address?: string;
  full_old_address?: string;
  full_new_address?: string;
  warnings?: string[];
}

interface GeoVinaParseEnvelope {
  success: boolean;
  data?: GeoVinaParseData;
  message?: string;
}

function isHtmlBody(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith('<') || /<!doctype/i.test(trimmed);
}

export async function parseGeoVinaAddress(address: string): Promise<GeoVinaParseData | null> {
  const key = getGeovinaApiKey();
  if (!key || !address.trim() || !isGeovinaConfigured()) return null;

  try {
    const res = await fetch(`${getGeovinaApiBase()}/api/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': key,
      },
      body: JSON.stringify({ address: address.trim() }),
    });

    const text = await res.text();
    const trimmed = text.trim();

    if (!res.ok) {
      if (import.meta.env.DEV) {
        console.warn('[GeoVina] parse failed', res.status, trimmed.slice(0, 200));
      }
      return null;
    }

    if (!trimmed || isHtmlBody(trimmed)) {
      if (import.meta.env.DEV) {
        console.warn('[GeoVina] parse returned HTML instead of JSON');
      }
      return null;
    }

    let json: GeoVinaParseEnvelope;
    try {
      json = JSON.parse(trimmed) as GeoVinaParseEnvelope;
    } catch {
      if (import.meta.env.DEV) {
        console.warn('[GeoVina] parse returned invalid JSON');
      }
      return null;
    }

    if (!json.success || !json.data) {
      if (import.meta.env.DEV) {
        console.warn('[GeoVina] parse unsuccessful', json.message);
      }
      return null;
    }

    return json.data;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[GeoVina] parse request failed', err);
    }
    return null;
  }
}
