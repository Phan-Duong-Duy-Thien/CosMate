/**
 * Build legacy address API payload (city / district / address only for BE).
 */
import type { UpsertUserAddressPayload } from '../types';

export interface AddressPayloadInput {
  name: string;
  phone: string;
  addressName: string;
  provinceName: string;
  wardName: string;
  detailAddress: string;
}

export function buildLegacyAddressPayload(input: AddressPayloadInput): UpsertUserAddressPayload {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    addressName: input.addressName.trim(),
    city: input.provinceName.trim(),
    district: input.wardName.trim(),
    address: input.detailAddress.trim(),
  };
}
