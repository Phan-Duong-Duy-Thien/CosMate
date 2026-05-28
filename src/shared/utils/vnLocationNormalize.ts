/**
 * Normalize Vietnamese administrative unit names for fuzzy matching
 * (Province Open API V2, GHN master data, profile forms).
 */

const WARD_PREFIXES = ['Phường', 'Xã', 'Thị trấn', 'Thị xã'] as const;

export function normalizeVnAdminName(value: string | undefined | null): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(
      /^(tinh|thanh pho|tp\.?|thi tran|phuong|xa|quan|huyen|thi xa|p\.|x\.)\s+/gi,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip administrative prefix for core place name. */
export function stripVnAdminPrefix(value: string): string {
  return value
    .trim()
    .replace(/^(tỉnh|thành phố|tp\.?|thị trấn|phường|xã|quận|huyện|thị xã|p\.|x\.)\s+/i, '')
    .trim();
}

/**
 * Generate label variants for ward matching (Open API vs GHN naming).
 */
export function expandWardSearchLabels(label: string | undefined | null): string[] {
  if (!label?.trim()) return [];

  const trimmed = label.trim();
  const core = stripVnAdminPrefix(trimmed);
  const seen = new Set<string>();
  const result: string[] = [];

  const add = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const key = normalizeVnAdminName(v);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(v);
  };

  add(trimmed);
  if (core !== trimmed) add(core);

  for (const prefix of WARD_PREFIXES) {
    add(`${prefix} ${core}`);
    if (core !== trimmed) add(`${prefix} ${trimmed}`);
  }

  return result;
}

export function matchAdminUnitByName<T extends { name: string }>(
  items: T[],
  search: string | undefined | null
): T | undefined {
  if (!search?.trim() || items.length === 0) return undefined;

  const norm = normalizeVnAdminName(search);
  if (!norm) return undefined;

  const exact = items.find((i) => normalizeVnAdminName(i.name) === norm);
  if (exact) return exact;

  return items.find((i) => {
    const itemNorm = normalizeVnAdminName(i.name);
    return itemNorm.includes(norm) || norm.includes(itemNorm);
  });
}

/** Try each search label variant until one matches. */
export function matchAdminUnitByVariants<T extends { name: string }>(
  items: T[],
  search: string | undefined | null
): T | undefined {
  for (const label of expandWardSearchLabels(search)) {
    const matched = matchAdminUnitByName(items, label);
    if (matched) return matched;
  }
  return undefined;
}
