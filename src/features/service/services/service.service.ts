/**
 * Service Service
 *
 * Orchestration layer — builds FormData and calls the API.
 * Called by hooks only; never by components or pages.
 */
import { createService, getProviderServices, getPublicServices, getServiceById } from '../api/service.api';
import type {
  CreateServiceFormData,
  CreateServicePayload,
  CreatedService,
  ServiceItem,
  PublicServiceItem,
} from '../types';

/**
 * Converts form data to API payload and submits.
 */
export async function submitService(
  formData: CreateServiceFormData
): Promise<CreatedService> {
  const areasJson = JSON.stringify(formData.areas);
  console.log('[submitService] areasJson:', areasJson);

  // Ant Design InputNumber with formatter/parser: if user submits without blurring,
  // validateFields() returns formatted string (e.g. "150,000"). Normalize all numeric
  // fields here so clean numbers reach the API regardless of blur state.
  const num = (val: string | number): number => Number(String(val).replace(/,/g, ''));

  const payload: CreateServicePayload = {
    serviceType: formData.serviceType,
    description: formData.description,
    slotDurationHours: num(formData.slotDurationHours),
    pricePerSlot: num(formData.pricePerSlot),
    equipmentDepreciationCost: num(formData.equipmentDepreciationCost),
    depositAmount: num(formData.depositAmount),
    providerId: formData.providerId,
    areas: areasJson,
    albumFiles: formData.albumFiles,
    minPrice: num(formData.minPrice),
    maxPrice: num(formData.maxPrice),
  };

  return createService(payload);
}

/**
 * Fetches all services for a provider.
 */
export async function fetchProviderServices(
  providerId: number
): Promise<ServiceItem[]> {
  return getProviderServices(providerId);
}

/**
 * Fetches all public services for listing pages.
 */
export async function fetchPublicServices(): Promise<PublicServiceItem[]> {
  return getPublicServices();
}

/**
 * Fetches a single service by its ID.
 */
export async function fetchServiceById(serviceId: number): Promise<ServiceItem> {
  return getServiceById(serviceId);
}
