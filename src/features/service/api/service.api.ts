/**
 * Service API
 *
 * HTTP layer only — no business logic.
 * Uses axiosInstance for all requests.
 */
import axiosInstance from '@/services/axiosInstance';
import type { CreateServicePayload, CreatedService, ServiceItem, PublicServiceItem } from '../types';

type RawServiceRecord = Record<string, unknown>;

function readPositiveId(...values: unknown[]): number {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

function readNumber(...values: unknown[]): number {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function readNullableNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (value == null || value === '') continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** Map BE aliases (snake_case, partial list rows) to canonical ServiceItem fields. */
export function normalizeServiceItem<T extends ServiceItem | PublicServiceItem>(raw: RawServiceRecord & T): T {
  const userId = readPositiveId(
    raw.userId,
    raw.user_id,
    raw.providerUserId,
    raw.provider_user_id,
    raw.ownerUserId,
    raw.owner_user_id,
    raw.createdByUserId,
    raw.created_by_user_id,
  );
  const providerId = readPositiveId(raw.providerId, raw.provider_id);

  const imageUrls = (raw.imageUrls ?? raw.image_urls ?? []) as string[];
  const areas = (raw.areas ?? []) as ServiceItem['areas'];

  return {
    ...raw,
    id: readNumber(raw.id),
    serviceName: String(raw.serviceName ?? raw.service_name ?? ''),
    serviceType: String(raw.serviceType ?? raw.service_type ?? ''),
    description: String(raw.description ?? ''),
    slotDurationHours: readNumber(raw.slotDurationHours, raw.slot_duration_hours),
    pricePerSlot: readNumber(raw.pricePerSlot, raw.price_per_slot),
    equipmentDepreciationCost: readNumber(
      raw.equipmentDepreciationCost,
      raw.equipment_depreciation_cost,
    ),
    depositAmount: readNumber(raw.depositAmount, raw.deposit_amount),
    minPrice: readNullableNumber(raw.minPrice, raw.min_price) ?? 0,
    maxPrice: readNullableNumber(raw.maxPrice, raw.max_price) ?? 0,
    status: String(raw.status ?? ''),
    areas,
    imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    userId,
    providerId: providerId || readNumber(raw.providerId),
  } as T;
}

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
  const list = response.data.result ?? [];
  return list.map((item) => normalizeServiceItem(item as RawServiceRecord & ServiceItem));
}

/**
 * GET /api/services
 * Fetches all public services (for photographer/staff listing pages).
 */
export async function getPublicServices(): Promise<PublicServiceItem[]> {
  const response = await axiosInstance.get<ApiResponse<PublicServiceItem[]>>(
    '/api/services'
  );
  const list = response.data.result ?? [];
  return list.map((item) => normalizeServiceItem(item as RawServiceRecord & PublicServiceItem));
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
  const raw = response.data.result;
  return normalizeServiceItem(raw as RawServiceRecord & ServiceItem);
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

/**
 * DELETE /api/services/{id}
 * Success example: { code: 0, message: "Đã xóa dịch vụ!" }
 */
export async function deleteService(serviceId: number): Promise<void> {
  const response = await axiosInstance.delete<{ code: number; message?: string }>(
    `/api/services/${serviceId}`
  );
  const body = response.data;
  if (body && typeof body.code === 'number' && body.code !== 0) {
    throw new Error(body.message || 'Xóa dịch vụ thất bại');
  }
}
