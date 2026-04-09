/**
 * Shared Vietnam Location Types
 *
 * Single source of truth for Vietnam administrative division types.
 * Used across address forms and future service area selection.
 */

export interface VietnamWard {
  code: string;
  name: string;
}

export interface VietnamDistrict {
  code: string;
  name: string;
  wards?: VietnamWard[];
}

export interface VietnamCity {
  code: string;
  name: string;
  districts: VietnamDistrict[];
}
