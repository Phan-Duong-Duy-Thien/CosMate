import { VI } from '@/shared/i18n/vi';

const STATUS_LABELS = VI.staff.tokenPurchases.statusLabels as Record<string, string>;

export function getAiTokenPurchaseStatusLabel(status: string): string {
  const key = status?.trim().toUpperCase() ?? '';
  if (!key) return '—';
  return STATUS_LABELS[key] ?? status;
}

export function getAiTokenPurchaseStatusTagColor(status: string): string {
  const s = status?.trim().toUpperCase() ?? '';
  if (s === 'SUCCESS' || s === 'COMPLETED' || s === 'PAID') return 'green';
  if (s === 'FAILED' || s === 'CANCELLED' || s === 'CANCELED') return 'red';
  if (s === 'PENDING' || s === 'PROCESSING') return 'gold';
  return 'default';
}
