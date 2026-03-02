/**
 * Vietnam Administrative Divisions API
 * Uses provinces.open-api.vn for standard Vietnam location data
 *
 * IMPORTANT: Uses v2 API for provinces (post-07/2025 merger dataset).
 * Districts/wards use v1 due to v2 endpoint limitations.
 * DO NOT remove v2 for provinces.
 */
import type { Province, District, Ward } from '../types';

// v2 = post-merger dataset (after July 2025) - only for provinces
const VN_LOCATION_API_V2 = 'https://provinces.open-api.vn/api/v2';
// v1 = for districts/wards (v2 doesn't support /d/{code} endpoint)
const VN_LOCATION_API_V1 = 'https://provinces.open-api.vn/api';

/**
 * Fetch all provinces (cities) - uses v2 for post-merger data
 */
export async function fetchProvinces(): Promise<Province[]> {
  const response = await fetch(`${VN_LOCATION_API_V2}/?depth=1`);
  if (!response.ok) {
    throw new Error('Failed to fetch provinces');
  }
  const data = await response.json();
  return data.map((item: { code: number; name: string }) => ({
    code: item.code,
    name: item.name,
  }));
}

/**
 * Fetch districts by province code - uses v1 (v2 doesn't support this endpoint)
 */
export async function fetchDistricts(provinceCode: number): Promise<District[]> {
  const response = await fetch(`${VN_LOCATION_API_V1}/p/${provinceCode}?depth=2`);
  if (!response.ok) {
    throw new Error('Failed to fetch districts');
  }
  const data = await response.json();
  return data.districts.map((item: { code: number; name: string }) => ({
    code: item.code,
    name: item.name,
  }));
}

/**
 * Fetch wards by district code - uses v1 (v2 doesn't support this endpoint)
 */
export async function fetchWards(districtCode: number): Promise<Ward[]> {
  const response = await fetch(`${VN_LOCATION_API_V1}/d/${districtCode}?depth=2`);
  if (!response.ok) {
    throw new Error('Failed to fetch wards');
  }
  const data = await response.json();
  return data.wards.map((item: { code: number; name: string }) => ({
    code: item.code,
    name: item.name,
  }));
}
