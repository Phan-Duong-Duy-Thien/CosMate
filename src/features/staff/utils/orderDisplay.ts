import { VI } from '@/shared/i18n/vi';
import { getCostumeOrderStatusProps } from '@/features/admin/utils/orderStatus';

export function getOrderTypeLabel(orderType: string): string {
  const labels = VI.staff.orders.orderTypes as Record<string, string>;
  return labels[orderType] ?? orderType;
}

export function getOrderStatusLabel(status: string): string {
  return getCostumeOrderStatusProps(status).label;
}

export function getOrderStatusTagColor(status: string): string {
  const normalized = status.toUpperCase();
  if (['UNPAID', 'PREPARING', 'WAITING_SERVICE_DATE'].includes(normalized)) return 'gold';
  if (['PAID', 'SHIPPING_OUT'].includes(normalized)) return 'blue';
  if (['IN_USE', 'IN_SERVICE'].includes(normalized)) return 'purple';
  if (['RETURNED', 'COMPLETED'].includes(normalized)) return 'green';
  if (['DISPUTE', 'SHIPPING_BACK'].includes(normalized)) return 'red';
  if (normalized === 'CANCELLED') return 'default';
  return 'default';
}
