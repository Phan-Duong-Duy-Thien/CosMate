/**
 * Service Service
 *
 * Orchestration layer — builds FormData and calls the API.
 * Called by hooks only; never by components or pages.
 */
import { createService, getProviderServices, getPublicServices, getServiceById, updateService as updateServiceApi } from '../api/service.api';
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
  const num = (val: string | number): number => Number(String(val).replace(/,/g, ''));

  const payload: CreateServicePayload = {
    serviceName: (formData.serviceName ?? '').trim(),
    serviceType: formData.serviceType,
    description: formData.description,
    slotDurationHours: num(formData.slotDurationHours),
    pricePerSlot: num(formData.pricePerSlot),
    equipmentDepreciationCost: num(formData.equipmentDepreciationCost),
    depositAmount: num(formData.depositAmount),
    providerId: formData.providerId,
    areas: JSON.stringify(formData.areas),
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
  console.log("[service.service] fetchProviderServices called with providerId:", providerId);
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

/**
 * Updates an existing service.
 */
export async function updateService(
  serviceId: number,
  formData: CreateServiceFormData
): Promise<ServiceItem> {
  const num = (val: string | number): number => Number(String(val).replace(/,/g, ''));

  const payload: CreateServicePayload = {
    serviceName: (formData.serviceName ?? '').trim(),
    serviceType: formData.serviceType,
    description: formData.description,
    slotDurationHours: num(formData.slotDurationHours),
    pricePerSlot: num(formData.pricePerSlot),
    equipmentDepreciationCost: num(formData.equipmentDepreciationCost),
    depositAmount: num(formData.depositAmount),
    providerId: formData.providerId,
    areas: JSON.stringify(formData.areas),
    albumFiles: formData.albumFiles,
    minPrice: num(formData.minPrice),
    maxPrice: num(formData.maxPrice),
  };

  return updateServiceApi(serviceId, payload);
}
