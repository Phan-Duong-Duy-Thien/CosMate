/**
 * Service Feature Types
 *
 * Shared types for photographer and event staff service creation.
 * Used by API, service, and hook layers.
 */

/**
 * Service type values derived from user role.
 */
export const SERVICE_TYPE = {
  PHOTOGRAPHER: 'Photographer',
  EVENT_STAFF: 'Event Staff',
} as const;

export type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];

/**
 * Service area: maps to backend [{ city: string; district: string }]
 */
export interface ServiceArea {
  city: string;
  district: string;
}

/**
 * Form data for creating a service.
 * Matches multipart/form-data fields sent to POST /api/services.
 */
export interface CreateServiceFormData {
  serviceType: ServiceType;
  description: string;
  slotDurationHours: number;
  pricePerSlot: number;
  equipmentDepreciationCost: number;
  depositAmount: number;
  providerId: number;
  areas: ServiceArea[];
  albumFiles: File[];
  minPrice: number;
  maxPrice: number;
}

/**
 * Service creation payload ready for API submission.
 * The areas array is stringified when sent as FormData.
 */
export interface CreateServicePayload {
  serviceType: ServiceType;
  description: string;
  slotDurationHours: number;
  pricePerSlot: number;
  equipmentDepreciationCost: number;
  depositAmount: number;
  providerId: number;
  areas: string; // JSON.stringify([{ city, district }])
  albumFiles: File[];
  minPrice: number;
  maxPrice: number;
}

/**
 * API response for a created service.
 */
export interface CreatedService {
  id: number;
  [key: string]: unknown;
}

/**
 * Service item returned from provider service list API.
 */
export interface ServiceItem {
  id: number;
  serviceType: string;
  description: string;
  slotDurationHours: number;
  pricePerSlot: number;
  equipmentDepreciationCost: number;
  status: string;
  providerId: number;
  areas: ServiceArea[];
  imageUrls: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

/**
 * Public service item returned from GET /api/services.
 * Used by photographer/staff listing pages.
 */
export interface PublicServiceItem {
  id: number;
  serviceType: string;
  description: string;
  slotDurationHours: number;
  pricePerSlot: number;
  equipmentDepreciationCost: number;
  status: string;
  providerId: number;
  areas: ServiceArea[];
  imageUrls: string[];
  minPrice: number | null;
  maxPrice: number | null;
}
