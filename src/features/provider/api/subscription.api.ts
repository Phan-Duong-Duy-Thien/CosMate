/**
 * Subscription API
 * HTTP layer only — no business logic.
 */
import axiosInstance from '@/services/axiosInstance';
import {
  formatBillingCycleMonths,
  resolveBillingCycleMonthsCount,
} from '@/features/admin/utils/formatBillingCycleMonths';
import type { ProviderSubscriptionInfo, SubscriptionPlan, SubscribeRequest } from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

type RawSubscriptionPlan = Record<string, unknown> & {
  id: number;
  name: string;
  price: number;
};

function readPositiveNumber(...values: unknown[]): number {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

function readString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function parseIsActive(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (value === 'true' || value === '1') return true;
  return false;
}

/** BE may send cycleMonths + billingCycle (admin) or billingCycleMonths; supports snake_case. */
function normalizeSubscriptionPlan(raw: RawSubscriptionPlan): SubscriptionPlan {
  const cycleMonths = readPositiveNumber(
    raw.cycleMonths,
    raw.cycle_months,
    raw.billingCycleMonths,
    raw.billing_cycle_months,
  );
  const billingCycle = readString(raw.billingCycle, raw.billing_cycle);
  const billingCycleMonths = resolveBillingCycleMonthsCount(cycleMonths, billingCycle);

  const cycleLabel = formatBillingCycleMonths(
    billingCycleMonths || cycleMonths,
    billingCycle,
  );

  return {
    id: raw.id,
    name: raw.name,
    description: (raw.description as string | null) ?? null,
    price: Number(raw.price) || 0,
    billingCycleMonths,
    cycleMonths: billingCycleMonths || cycleMonths || undefined,
    billingCycle: billingCycle || undefined,
    cycleLabel,
    isActive: parseIsActive(raw.isActive ?? raw.is_active),
    features: Array.isArray(raw.features) ? (raw.features as string[]) : [],
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
    updatedAt: String(raw.updatedAt ?? raw.updated_at ?? ''),
  };
}

/**
 * GET /api/subscription-plans
 * Returns all subscription plans.
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await axiosInstance.get<ApiResponse<RawSubscriptionPlan[]>>(
    '/api/subscription-plans',
  );
  const { code, message, result } = response.data;
  if (code !== 0) {
    throw new Error(message || 'Không thể tải danh sách gói dịch vụ.');
  }
  const list = result ?? [];
  return list.map(normalizeSubscriptionPlan);
}

/**
 * POST /api/providers/subscriptions/subscribe
 * Initiates a subscription payment and returns the payment URL.
 */
export async function subscribeProvider(payload: SubscribeRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>(
    '/api/providers/subscriptions/subscribe',
    payload,
  );
  const raw = response.data;
  return raw.result;
}

/**
 * GET /api/providers/id/{providerId}/subscriptions-info
 * Returns current plan name and remaining days for the provider.
 */
export async function getProviderSubscriptionInfo(
  providerId: number,
): Promise<ProviderSubscriptionInfo> {
  const response = await axiosInstance.get<ApiResponse<ProviderSubscriptionInfo>>(
    `/api/providers/id/${providerId}/subscriptions-info`,
  );
  const { code, message, result } = response.data;
  if (code !== 0) {
    throw new Error(message || 'Không thể tải thông tin gói dịch vụ.');
  }
  return result;
}
