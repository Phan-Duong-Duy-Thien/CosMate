/**
 * GeoVina — chuẩn hóa địa chỉ hành chính cũ/mới (trước/sau sáp nhập).
 * https://www.geovina.io.vn/docs
 *
 * Dev: proxy /geovina-proxy → https://geovina.io.vn
 */

const GEOVINA_BASE =
  import.meta.env.VITE_GEOVINA_API_BASE?.replace(/\/$/, '') || '/geovina-proxy';

function geovinaApiKey(): string {
  return import.meta.env.VITE_GEOVINA_API_KEY ?? '';
}

export function isGeovinaConfigured(): boolean {
  return Boolean(geovinaApiKey());
}

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

export async function parseGeoVinaAddress(address: string): Promise<GeoVinaParseData | null> {
  const key = geovinaApiKey();
  if (!key || !address.trim()) return null;

  const res = await fetch(`${GEOVINA_BASE}/api/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': key,
    },
    body: JSON.stringify({ address: address.trim() }),
  });

  if (!res.ok) {
    if (import.meta.env.DEV) {
      console.warn('[GeoVina] parse failed', res.status, await res.text().catch(() => ''));
    }
    return null;
  }

  const json = (await res.json()) as GeoVinaParseEnvelope;
  if (!json.success || !json.data) {
    if (import.meta.env.DEV) {
      console.warn('[GeoVina] parse unsuccessful', json.message);
    }
    return null;
  }

  return json.data;
}
