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

  // DEBUG: log all FormData entries
  const entries: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (value instanceof File) {
      entries[key] = `[File: ${value.name}, ${value.size} bytes]`;
    } else {
      entries[key] = value;
    }
  }
  console.log('[createService] FormData payload:', JSON.stringify(entries, null, 2));
  console.log('[createService] serviceType value:', payload.serviceType);
  console.log('[createService] pricePerSlot:', payload.pricePerSlot, '| type:', typeof payload.pricePerSlot);
  console.log('[createService] areas JSON:', payload.areas);

  console.log('[createService] POST /api/services with fields:', Object.keys(entries).join(', '));

  try {
    const response = await axiosInstance.post<ApiResponse<CreatedService>>(
      '/api/services',
      form
    );
    console.log('[createService] SUCCESS:', JSON.stringify(response.data));
    return response.data.result;
  } catch (err) {
    const axiosErr = err as { response?: { data?: unknown; status?: number } };
    console.error('[createService] FAILED:', JSON.stringify(axiosErr.response?.data), 'status:', axiosErr.response?.status);
    throw err;
  }
}

/**
 * GET /api/services/provider/{providerId}
 * Fetches all services for a specific provider.
 */
export async function getProviderServices(
  providerId: number
): Promise<ServiceItem[]> {
  console.log("[service.api] getProviderServices URL: /api/services/provider/" + providerId);
  const response = await axiosInstance.get<ApiResponse<ServiceItem[]>>(
    `/api/services/provider/${providerId}`
  );
  console.log("[service.api] response.data:", response.data);
  console.log("[service.api] services result:", response.data.result);
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
