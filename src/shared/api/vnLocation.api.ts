/**
 * Shared Vietnam Location API Layer
 *
 * Runtime source for Vietnam administrative divisions via Province Open API V2.
 * Single source of truth for all Vietnam location data in the frontend.
 *
 * API base: https://provinces.open-api.vn/api/v2
 * Endpoints:
 *   GET /p/                  -> list all provinces
 *   GET /p/{code}?depth=2  -> province with its wards (Phường/Xã)
 *
 * Note: After the 07/2025 administrative reform, the district level (Quận/Huyện)
 * is removed. The API only has Tỉnh/Thành phố -> Phường/Xã.
 */
import axios from 'axios';
import type { Province, District } from '@/features/profile/types';

// ============================================================================
// Config
// ============================================================================

const API_BASE_URL =
  import.meta.env.VITE_PROVINCES_API_URL || 'https://provinces.open-api.vn/api/v2';

// ============================================================================
// Raw API response shapes (Province Open API V2 format)
// ============================================================================

interface ProvinceApiItem {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
  wards?: WardApiItem[];
}

interface WardApiItem {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
}

// ============================================================================
// API client
// ============================================================================

async function apiGet<T>(path: string): Promise<T> {
  const response = await axios.get<T>(`${API_BASE_URL}${path}`);
  return response.data;
}

// ============================================================================
// Public API -- matches existing profile/vnLocation.api.ts signatures
// ============================================================================

/**
 * Fetch all provinces (Tỉnh / Thành phố) from Province Open API V2.
 */
export async function fetchProvinces(): Promise<Province[]> {
  const data = await apiGet<ProvinceApiItem[] | null>('/p/');
  return (Array.isArray(data) ? data : []).map((p) => ({ code: p.code, name: p.name }));
}

/**
 * Fetch wards (Phường / Xã) for a given province code.
 * Province Open API V2: GET /p/{code}?depth=2
 * Returns the province with its wards nested inside.
 */
export async function fetchWardsByProvince(
  provinceCode: number
): Promise<District[]> {
  const data = await apiGet<ProvinceApiItem>(`/p/${provinceCode}?depth=2`);
  return (data.wards ?? []).map((w) => ({
    code: w.code,
    name: w.name,
  }));
}
