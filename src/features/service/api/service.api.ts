/**
 * Service API
 *
 * HTTP layer only — no business logic.
 * Uses axiosInstance for all requests.
 */
import axiosInstance from '@/services/axiosInstance';
import type { CreateServicePayload, CreatedService, ServiceItem, PublicServiceItem } from '../types';

interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

/**
 * POST /api/services
 * Creates a new photographer or event staff service.
 * Accepts multipart/form-data for file uploads.
 */
export async function createService(
  payload: CreateServicePayload
): Promise<CreatedService> {
  const form = new FormData();

  form.append('serviceName', payload.serviceName ?? '');
  form.append('serviceType', payload.serviceType);
  form.append('description', payload.description);
  form.append('slotDurationHours', String(payload.slotDurationHours));
  form.append('pricePerSlot', String(payload.pricePerSlot));
  form.append('equipmentDepreciationCost', String(payload.equipmentDepreciationCost));
  form.append('depositAmount', String(payload.depositAmount));
  form.append('providerId', String(payload.providerId));
  form.append('areas', payload.areas);

  form.append('minPrice', String(payload.minPrice));
  form.append('maxPrice', String(payload.maxPrice));

  for (const file of payload.albumFiles) {
    form.append('albumFiles', file);
  }

  const response = await axiosInstance.post<ApiResponse<CreatedService>>(
    '/api/services',
    form
  );
  return response.data.result;
}

/**
 * GET /api/services/provider/{providerId}
 * Fetches all services for a specific provider.
 */
export async function getProviderServices(
  providerId: number
): Promise<ServiceItem[]> {
  const response = await axiosInstance.get<ApiResponse<ServiceItem[]>>(
    `/api/services/provider/${providerId}`
  );
  return response.data.result;
}

/**
 * GET /api/services
 * Fetches all public services (for photographer/staff listing pages).
 */
export async function getPublicServices(): Promise<PublicServiceItem[]> {
  const response = await axiosInstance.get<ApiResponse<PublicServiceItem[]>>(
    '/api/services'
  );
  return response.data.result;
}

/**
 * GET /api/services/:id
 * Fetches a single service by ID for public detail view.
 */
export async function getServiceById(
  serviceId: number
): Promise<ServiceItem> {
  const response = await axiosInstance.get<ApiResponse<ServiceItem>>(
    `/api/services/${serviceId}`
  );
  return response.data.result;
}

/**
 * PUT /api/services/:id
 * Updates an existing service.
 * Accepts multipart/form-data for file uploads (same fields as create).
 */
export async function updateService(
  serviceId: number,
  payload: CreateServicePayload
): Promise<ServiceItem> {
  const form = new FormData();

  form.append('serviceName', payload.serviceName ?? '');
  form.append('serviceType', payload.serviceType);
  form.append('description', payload.description);
  form.append('slotDurationHours', String(payload.slotDurationHours));
  form.append('pricePerSlot', String(payload.pricePerSlot));
  form.append('equipmentDepreciationCost', String(payload.equipmentDepreciationCost));
  form.append('depositAmount', String(payload.depositAmount));
  form.append('providerId', String(payload.providerId));
  form.append('areas', payload.areas);

  form.append('minPrice', String(payload.minPrice));
  form.append('maxPrice', String(payload.maxPrice));

  for (const file of payload.albumFiles) {
    form.append('albumFiles', file);
  }

  const response = await axiosInstance.put<ApiResponse<ServiceItem>>(
    `/api/services/${serviceId}`,
    form
  );
  return response.data.result;
}
