/**
 * Vietnam Administrative Divisions API
 * Uses provinces.open-api.vn for standard Vietnam location data
 */
import type { Province, District, Ward } from '../types';

const VN_LOCATION_API_BASE = 'https://provinces.open-api.vn/api';

/**
 * Fetch all provinces (cities)
 */
export async function fetchProvinces(): Promise<Province[]> {
  const response = await fetch(`${VN_LOCATION_API_BASE}/?depth=1`);
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
 * Fetch districts by province code
 */
export async function fetchDistricts(provinceCode: number): Promise<District[]> {
  const response = await fetch(`${VN_LOCATION_API_BASE}/p/${provinceCode}?depth=2`);
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
 * Fetch wards by district code
 */
export async function fetchWards(districtCode: number): Promise<Ward[]> {
  const response = await fetch(`${VN_LOCATION_API_BASE}/d/${districtCode}?depth=2`);
  if (!response.ok) {
    throw new Error('Failed to fetch wards');
  }
  const data = await response.json();
  return data.wards.map((item: { code: number; name: string }) => ({
    code: item.code,
    name: item.name,
  }));
}
