/**
 * User Address Service
 * Orchestrates address operations and handles data mapping
 */
import * as userAddressApi from '../api/userAddress.api';
import type { UserAddress, CreateUserAddressPayload, Ward } from '../types';

export interface CreateAddressFormData {
  name: string;
  phone: string;
  provinceCode: number | null;
  districtCode: number | null;
  ward: Ward | null;
  streetAddress: string;
}

/**
 * Get all user addresses
 */
export async function getUserAddresses(userId: number): Promise<UserAddress[]> {
  return userAddressApi.getUserAddresses(userId);
}

/**
 * Create a new user address
 * Maps form data to API payload
 */
export async function createUserAddress(
  userId: number,
  formData: CreateAddressFormData,
  provinceName: string,
  districtName: string
): Promise<UserAddress> {
  // Build the address string: streetAddress + ward name
  const addressString = formData.ward
    ? `${formData.streetAddress}, ${formData.ward.name}`
    : formData.streetAddress;

  const payload: CreateUserAddressPayload = {
    name: formData.name,
    phone: formData.phone,
    city: provinceName,
    district: districtName,
    address: addressString,
  };

  return userAddressApi.createUserAddress(userId, payload);
}
