import { VI } from '@/shared/i18n/vi';

const TRANSACTION_TYPE_KEYS = [
  'CREDIT',
  'SUBSCRIPTION',
  'DEBIT',
  'DEPOSIT_PENALTY',
  'ORDER_PAYOUT',
  'SUBSCRIPTION_TOKEN',
  'ORDER_REFUND',
  'EXTEND',
  'DEPOSIT_RETURN',
  'PROVIDER_PAYOUT',
  'CANCEL_PENALTY',
] as const;

export type WalletTransactionType = (typeof TRANSACTION_TYPE_KEYS)[number];

const LABELS: Record<WalletTransactionType, string> = VI.wallet.transactionTypes;

/**
 * Maps BE wallet transaction `type` to Vietnamese label.
 */
export function getWalletTransactionTypeLabel(type: string): string {
  const key = type?.trim().toUpperCase();
  if (!key) return VI.wallet.transactionTypeUnknown;
  if (key in LABELS) {
    return LABELS[key as WalletTransactionType];
  }
  return VI.wallet.transactionTypeUnknown;
}
