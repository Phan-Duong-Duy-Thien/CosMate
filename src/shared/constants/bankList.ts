/**
 * Shared list of supported Vietnamese banks.
 * Reused across Provider profile and Cosplayer withdraw forms.
 */
export const BANK_LIST = [
  'Vietcombank',
  'VietinBank',
  'BIDV',
  'Agribank',
  'TPBank',
  'MB Bank',
  'ACB',
  'Techcombank',
  'VPBank',
  'Sacombank',
  'Shinhan Bank',
  'Citibank',
] as const;

export type BankName = (typeof BANK_LIST)[number];
