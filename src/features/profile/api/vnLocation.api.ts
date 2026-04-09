/**
 * Vietnam Administrative Divisions API
 *
 * Delegates to the shared Province Open API V2 source at @/shared/api/vnLocation.api.
 * Single source of truth for all Vietnam location data in the frontend.
 *
 * Province Open API V2 reflects the post-07/2025 administrative structure.
 * Lower-level units are wards (not districts); maps to District interface
 * for backward compatibility with existing forms and backend payload.
 */
import type { Province, District, Ward } from '../types';
import {
  fetchProvinces as sharedFetchProvinces,
  fetchWardsByProvince,
} from '@/shared/api/vnLocation.api';

/**
 * Fetch all provinces (cities) via Province Open API V2
 */
export async function fetchProvinces(): Promise<Province[]> {
  return sharedFetchProvinces();
}

/**
 * Fetch districts (wards) by province code via Province Open API V2.
 * Maps ward data to the District interface for backward compatibility.
 */
export async function fetchDistricts(provinceCode: number): Promise<District[]> {
  return fetchWardsByProvince(provinceCode);
}

/**
 * Fetch wards by district code.
 *
 * Province Open API V2 provides ward data under the province endpoint (depth=2).
 * The district code is not used for ward lookup in this API version.
 * Returns an empty array for backward compatibility.
 */
export async function fetchWards(_districtCode: number): Promise<Ward[]> {
  return [];
}
