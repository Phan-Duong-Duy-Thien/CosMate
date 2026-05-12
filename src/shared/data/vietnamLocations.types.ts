/**
 * Shared Vietnam Location Types
 *
 * Single source of truth for Vietnam administrative division types.
 * Used across address forms and future service area selection.
 */

export interface VietnamWard {
  code: string | number;
  name: string;
}

export interface VietnamDistrict {
  code: string | number;
  name: string;
  wards?: VietnamWard[];
}

export interface VietnamCity {
  code: string | number;
  name: string;
  districts: VietnamDistrict[];
}
