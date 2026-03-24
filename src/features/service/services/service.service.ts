/**
 * Service Service
 *
 * Orchestration layer — builds FormData and calls the API.
 * Called by hooks only; never by components or pages.
 */
import { createService, getProviderServices, getPublicServices } from '../api/service.api';
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

  const payload: CreateServicePayload = {
    serviceType: formData.serviceType,
    description: formData.description,
    slotDurationHours: formData.slotDurationHours,
    pricePerSlot: formData.pricePerSlot,
    equipmentDepreciationCost: formData.equipmentDepreciationCost,
    depositAmount: formData.depositAmount,
    providerId: formData.providerId,
    areas: areasJson,
    albumFiles: formData.albumFiles,
    minPrice: formData.minPrice,
    maxPrice: formData.maxPrice,
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
