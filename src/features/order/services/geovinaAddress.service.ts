/**
 * Chuẩn hóa địa chỉ DB → nhãn cũ/mới qua GeoVina, trước khi map GHN.
 */
import { parseGeoVinaAddress, type GeoVinaParseData } from '../api/geovina.api';
import type { AddressFieldsForGhn } from '../types';

export interface GeoVinaNormalizedCandidates {
  /** Hệ cũ: phường và/hoặc quận — gần master GHN */
  old: AddressFieldsForGhn[];
  /** Hệ mới sau sáp nhập — khớp Open API V2 */
  new?: AddressFieldsForGhn;
}

function formatQuanName(district: GeoVinaParseData['old_district']): string | undefined {
  if (!district?.name?.trim()) return undefined;
  const raw = district.name.trim();
  if (/^quận|^huyện|^thị xã/i.test(raw)) return raw;
  const level = district.level?.toLowerCase() ?? '';
  if (level.includes('quận')) return `Quận ${raw}`;
  if (level.includes('huyện')) return `Huyện ${raw}`;
  if (level.includes('thị xã')) return `Thị xã ${raw}`;
  return `Quận ${raw}`;
}

function formatPhuongName(ward: GeoVinaParseData['old_ward'], parsedWardRaw?: string): string | undefined {
  if (parsedWardRaw?.trim()) return parsedWardRaw.trim();
  if (!ward?.name?.trim()) return undefined;
  const raw = ward.name.trim();
  if (/^phường|^xã|^thị trấn/i.test(raw)) return raw;
  return `Phường ${raw}`;
}

function buildOldSystemCandidates(data: GeoVinaParseData, street: string): AddressFieldsForGhn[] {
  const city =
    data.old_province?.name?.trim() ||
    data.parsed_province_raw?.trim() ||
    data.ward_level_old_address?.split(',').pop()?.trim();
  if (!city) return [];

  const streetLine = data.address_prefix?.trim() || street;
  const wardLabel = formatPhuongName(data.old_ward, data.parsed_ward_raw);
  const quanLabel = formatQuanName(data.old_district);
  const out: AddressFieldsForGhn[] = [];

  if (wardLabel) {
    out.push({ city, district: wardLabel, address: streetLine });
  }
  if (quanLabel) {
    out.push({ city, district: quanLabel, address: streetLine });
  }
  return out;
}

function buildNewSystemFields(data: GeoVinaParseData, street: string): AddressFieldsForGhn | undefined {
  const city =
    data.new_province?.name?.trim() ||
    data.matched_new_ward?.province_name?.trim() ||
    data.parsed_province_raw?.trim();
  const district =
    data.matched_new_ward?.name?.trim() ||
    data.parsed_ward_raw?.trim();
  if (!city || !district) return undefined;

  const wardName = district;
  const districtLabel = /^phường|^xã|^thị trấn/i.test(wardName)
    ? wardName
    : `Phường ${wardName}`;

  return {
    city,
    district: districtLabel,
    address: data.address_prefix?.trim() || street,
  };
}

export function buildGeoVinaParseInput(fields: AddressFieldsForGhn): string {
  const parts = [fields.address, fields.district, fields.city]
    .map((p) => p?.trim())
    .filter(Boolean);
  return parts.join(', ');
}

export async function normalizeAddressViaGeovina(
  fields: AddressFieldsForGhn
): Promise<GeoVinaNormalizedCandidates | null> {
  const input = buildGeoVinaParseInput(fields);
  if (input.length < 3) return null;

  const data = await parseGeoVinaAddress(input);
  if (!data) return null;

  const street = fields.address?.trim() ?? '';
  const old = buildOldSystemCandidates(data, street);
  const newFields = buildNewSystemFields(data, street);

  if (old.length === 0 && !newFields) return null;

  return { old, new: newFields };
}
