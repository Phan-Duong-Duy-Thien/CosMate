/**
 * User Address Service
 * Orchestrates address operations and handles data mapping
 */
import * as userAddressApi from '../api/userAddress.api';
import type { UserAddress, UpsertUserAddressPayload } from '../types';

/**
 * Get a single user address by ID
 */
export async function getAddressById(userId: number, addressId: number): Promise<UserAddress> {
  return userAddressApi.getAddressById(userId, addressId);
}

export interface CreateAddressFormData {
  name: string;
  phone: string;
  provinceCode: number | null;
  districtCode: number | null;
  streetAddress: string;
  addressName: string;
}

/**
 * Get all user addresses
 */
export async function getUserAddresses(userId: number): Promise<UserAddress[]> {
  return userAddressApi.getUserAddresses(userId);
}

/**
 * Fetch addresses (CRUD hook usage)
 */
export async function fetchAddresses(userId: number): Promise<UserAddress[]> {
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
  const payload: UpsertUserAddressPayload = {
    name: formData.name,
    phone: formData.phone,
    city: provinceName,
    district: districtName,
    address: formData.streetAddress,
    addressName: formData.addressName,
  };

  return userAddressApi.createUserAddress(userId, payload);
}

/**
 * Add address (CRUD hook usage)
 */
export async function addAddress(
  userId: number,
  payload: UpsertUserAddressPayload
): Promise<UserAddress> {
  return userAddressApi.createUserAddress(userId, payload);
}

/**
 * Edit address (CRUD hook usage)
 */
export async function editAddress(
  userId: number,
  addressId: number,
  payload: UpsertUserAddressPayload
): Promise<UserAddress> {
  return userAddressApi.updateUserAddress(userId, addressId, payload);
}

/**
 * Delete address (prepared for future UI usage)
 */
export async function deleteAddress(
  userId: number,
  addressId: number
): Promise<void> {
  await userAddressApi.deleteUserAddress(userId, addressId);
}
