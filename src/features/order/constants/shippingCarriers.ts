import { VI } from '@/shared/i18n/vi';

export const SHIPPING_CARRIER_OPTIONS = [
  { label: 'GHN (Giao Hàng Nhanh)', value: 'GHN' },
  { label: 'GHTK (Giao Hàng Tiết Kiệm)', value: 'GHTK' },
  { label: 'Viettel Post', value: 'VIETTEL_POST' },
  { label: 'VNPost', value: 'VNPOST' },
  { label: 'J&T Express', value: 'J&T' },
  { label: 'Shopee Express', value: 'SPX' },
  { label: 'Ninja Van', value: 'NINJA_VAN' },
  { label: 'Best Express', value: 'BEST' },
  { label: VI.common.actions.other, value: 'OTHER' },
] as const;

export function resolveCarrierName(
  selectedCarrier: string | null,
  customCarrier: string,
): string {
  if (!selectedCarrier) return '';
  if (selectedCarrier === 'OTHER') return customCarrier.trim();
  return selectedCarrier;
}
