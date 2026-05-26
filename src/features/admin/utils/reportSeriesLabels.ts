/**
 * Map raw API series keys (reports) to Vietnamese labels using the same
 * helpers as list pages (users, orders, disputes).
 */

import { VI } from '@/shared/i18n/vi';
import { getCostumeOrderStatusProps } from './orderStatus';
import { getStatusTagProps } from './userStatus';

/** Order / rental / service order status keys from admin reports. */
export function formatOrdersReportLabel(raw: string | undefined): string {
  if (raw == null || raw === '') return '—';
  return getCostumeOrderStatusProps(String(raw).trim()).label;
}

export function getOrdersReportTagColor(raw: string | undefined): string {
  if (!raw) return 'default';
  const s = raw.trim().toUpperCase();
  if (['UNPAID', 'PREPARING', 'WAITING_SERVICE_DATE'].includes(s)) return 'gold';
  if (['PAID', 'SHIPPING_OUT'].includes(s)) return 'blue';
  if (['IN_USE', 'IN_SERVICE'].includes(s)) return 'purple';
  if (['RETURNED', 'COMPLETED'].includes(s)) return 'green';
  if (['DISPUTE', 'SHIPPING_BACK'].includes(s)) return 'red';
  if (s === 'CANCELLED') return 'default';
  return 'default';
}

/** Same labels as admin user table (ACTIVE, BANNED, …). */
export function formatUsersReportLabel(raw: string | undefined): string {
  if (raw == null || raw === '') return '—';
  return getStatusTagProps(String(raw).trim()).label;
}

export function getUsersReportTagColor(raw: string | undefined): string {
  if (!raw) return 'default';
  return getStatusTagProps(raw.trim()).color;
}

/**
 * Provider aggregates: often ACTIVE / INACTIVE or verified flags.
 */
export function formatProvidersReportLabel(raw: string | undefined): string {
  if (raw == null || raw === '') return '—';
  const s = String(raw).trim();
  const upper = s.toUpperCase();
  if (upper === 'PENDING') return 'Chờ duyệt';
  if (upper === 'TRUE' || upper === 'VERIFIED' || upper === 'YES') return 'Đã duyệt';
  if (upper === 'FALSE' || upper === 'UNVERIFIED' || upper === 'NO') return 'Chưa duyệt';
  return getStatusTagProps(s).label;
}

export function getProvidersReportTagColor(raw: string | undefined): string {
  if (!raw) return 'default';
  const upper = raw.trim().toUpperCase();
  if (upper === 'PENDING') return 'gold';
  if (upper === 'TRUE' || upper === 'VERIFIED' || upper === 'YES') return 'green';
  if (upper === 'FALSE' || upper === 'UNVERIFIED' || upper === 'NO') return 'gold';
  return getStatusTagProps(raw.trim()).color;
}

/** Dispute pipeline — align with staff dispute UI copy. */
export function formatDisputesReportLabel(raw: string | undefined): string {
  if (raw == null || raw === '') return '—';
  const u = String(raw).trim().toUpperCase();
  if (u === 'OPEN' || u === 'PENDING') return VI.staff.disputes.statusOpen;
  if (u === 'RESOLVED') return VI.staff.disputes.statusResolved;
  if (u === 'REJECTED') return VI.staff.disputes.statusRejected;
  return raw.trim();
}

export function getDisputesReportTagColor(raw: string | undefined): string {
  if (!raw) return 'default';
  const u = raw.trim().toUpperCase();
  if (u === 'OPEN' || u === 'PENDING') return 'gold';
  if (u === 'RESOLVED') return 'green';
  if (u === 'REJECTED') return 'red';
  return 'default';
}
