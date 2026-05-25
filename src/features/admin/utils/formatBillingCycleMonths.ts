/**
 * Chu kỳ gói đăng ký — hiển thị thống nhất theo tháng (vd. 1 tháng, 3 tháng, 12 tháng).
 */
const MONTHS_FROM_BILLING_KEY: Record<string, number> = {
  monthly: 1,
  month: 1,
  'per-month': 1,
  per_month: 1,
  quarterly: 3,
  quarter: 3,
  yearly: 12,
  annual: 12,
  year: 12,
  biannual: 6,
  semi_annual: 6,
  'semi-annual': 6,
};

const SPECIAL_CYCLE_LABEL_VI: Record<string, string> = {
  lifetime: 'Trọn đời',
  onetime: 'Một lần',
  'one-time': 'Một lần',
  daily: 'Theo ngày',
  day: 'Theo ngày',
  weekly: 'Theo tuần',
  week: 'Theo tuần',
};

const VI_CHARS = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;

/** Resolve month count from API fields (cycleMonths + billingCycle string). */
export function resolveBillingCycleMonthsCount(
  cycleMonths: number | undefined | null,
  billingCycle: string | undefined | null,
): number {
  const raw = (billingCycle ?? '').trim();
  const key = raw.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');

  let months = Number(cycleMonths);
  if (!Number.isFinite(months) || months <= 0) {
    months = MONTHS_FROM_BILLING_KEY[key] ?? 0;
  }

  return months > 0 ? months : 0;
}

export function formatBillingCycleMonths(cycleMonths: number, billingCycle: string): string {
  const raw = (billingCycle ?? '').trim();
  const key = raw.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');

  let months = resolveBillingCycleMonthsCount(cycleMonths, billingCycle);
  if (months <= 0 && key) {
    months = MONTHS_FROM_BILLING_KEY[key] ?? 0;
  }

  if (months > 0) {
    return `${months} tháng`;
  }

  const special = SPECIAL_CYCLE_LABEL_VI[key];
  if (special) return special;

  if (VI_CHARS.test(raw)) {
    return raw;
  }

  return '—';
}
