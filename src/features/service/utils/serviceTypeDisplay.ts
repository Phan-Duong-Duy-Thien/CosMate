import { SERVICE_TYPE, type ServiceType } from '../types';
import { VI } from '@/shared/i18n/vi';

/**
 * Maps API / form serviceType string to Vietnamese label for UI.
 */
export function getServiceTypeDisplayLabel(value: string | null | undefined): string {
  const v = (value ?? '').trim();
  if (v === SERVICE_TYPE.PHOTOGRAPHER || v === 'Photographer') {
    return VI.service.list.serviceTypeValues.photographer;
  }
  if (v === SERVICE_TYPE.EVENT_STAFF || v === 'Event Staff') {
    return VI.service.list.serviceTypeValues.eventStaff;
  }
  return v || '—';
}

export function getServiceTypeLabelForForm(serviceType: ServiceType): string {
  return getServiceTypeDisplayLabel(serviceType);
}
