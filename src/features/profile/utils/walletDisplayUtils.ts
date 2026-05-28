import { VI } from '@/shared/i18n/vi';

export function formatWalletCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatWalletDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getWalletStatusColorClass(status: string): string {
  const normalizedStatus = status?.toUpperCase();
  if (normalizedStatus === 'COMPLETED') return 'bg-cosmate-success/15 text-cosmate-success';
  if (normalizedStatus === 'FAILED') return 'bg-destructive/10 text-destructive';
  if (normalizedStatus === 'PENDING') return 'bg-cosmate-warning/15 text-cosmate-warning';
  return 'bg-muted text-muted-foreground';
}

export function getWalletStatusLabel(status: string): string {
  const normalizedStatus = status?.toUpperCase();
  if (normalizedStatus === 'COMPLETED') return VI.wallet.statusCompleted;
  if (normalizedStatus === 'FAILED') return VI.wallet.statusFailed;
  if (normalizedStatus === 'PENDING') return VI.wallet.statusPending;
  return status;
}
