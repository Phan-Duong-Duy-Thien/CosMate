/**
 * Vietnam Location Utilities
 *
 * Shared helpers for Vietnam location data transformation.
 * Compatible with the Cas AddressKit 2-level structure (province + commune).
 *
 * Service area payload mapping:
 *   city     = province name
 *   district = commune name
 *
 * Matches the existing backend contract:
 *   [{ city: string; district: string }]
 */

import type { Province, District } from '@/features/profile/types';

/**
 * Maps a selected province + commune pair to the service area payload shape.
 *
 * Used by: service creation forms, any feature that needs to submit
 * service areas in the [{ city: string; district: string }] format.
 */
export function toServiceAreaPayload(
  province: Province | undefined,
  commune: District | undefined
): { city: string; district: string }[] {
  if (!province || !commune) return [];
  return [{ city: province.name, district: commune.name }];
}

/**
 * Normalizes a Vietnamese location name for fuzzy matching.
 * Strips common prefixes like "Tinh", "Thanh pho".
 */
export function normalizeVnName(name: string | undefined | null): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/^(tinh|thanh pho)\s+/i, '')
    .replace(/\s+/g, ' ');
}

/**
 * Finds a province by its display label (fuzzy match).
 */
export function findProvinceByLabel(
  provinces: Province[],
  label: string | undefined | null
): Province | undefined {
  if (!label || provinces.length === 0) return undefined;
  const normalized = normalizeVnName(label);
  const exact = provinces.find(
    (p) => normalizeVnName(p.name) === normalized
  );
  if (exact) return exact;
  return provinces.find((p) => {
    const np = normalizeVnName(p.name);
    return normalized.includes(np) || np.includes(normalized);
  });
}

/**
 * Finds a commune/district by its display label (fuzzy match).
 */
export function findCommuneByLabel(
  communes: District[],
  label: string | undefined | null
): District | undefined {
  if (!label || communes.length === 0) return undefined;
  const normalized = normalizeVnName(label);
  const exact = communes.find(
    (c) => normalizeVnName(c.name) === normalized
  );
  if (exact) return exact;
  return communes.find((c) => {
    const nc = normalizeVnName(c.name);
    return normalized.includes(nc) || nc.includes(normalized);
  });
}
