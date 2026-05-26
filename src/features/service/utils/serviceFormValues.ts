import type { ServiceItem } from '../types';
import { computeServiceMinPrice } from './computeServiceMinPrice';

export interface ServiceFormValues {
  serviceName: string;
  description: string;
  slotDurationHours: number;
  pricePerSlot: number;
  equipmentDepreciationCost: number;
  depositAmount: number;
  minPrice: number;
  maxPrice: number;
}

export const CREATE_SERVICE_FORM_DEFAULTS: ServiceFormValues = {
  serviceName: '',
  description: '',
  slotDurationHours: 1,
  pricePerSlot: 0,
  equipmentDepreciationCost: 0,
  depositAmount: 0,
  minPrice: 0,
  maxPrice: 0,
};

export function serviceToFormValues(service: ServiceItem): ServiceFormValues {
  const pricePerSlot = service.pricePerSlot ?? 0;
  const equipmentDepreciationCost = service.equipmentDepreciationCost ?? 0;
  const depositAmount = service.depositAmount ?? 0;

  return {
    serviceName: service.serviceName ?? '',
    description: service.description ?? '',
    slotDurationHours: service.slotDurationHours > 0 ? service.slotDurationHours : 1,
    pricePerSlot,
    equipmentDepreciationCost,
    depositAmount,
    minPrice:
      service.minPrice != null && service.minPrice > 0
        ? service.minPrice
        : computeServiceMinPrice(pricePerSlot, equipmentDepreciationCost, depositAmount),
    maxPrice: service.maxPrice ?? 0,
  };
}
