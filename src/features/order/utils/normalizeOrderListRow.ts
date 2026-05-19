/**
 * Maps GET /api/orders list items to table row shape (admin + staff).
 */

export interface OrderListRow {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: string;
  totalAmount: number;
  totalDepositAmount: number;
  createdAt: string;
  rentDate: string | null;
  costumeId?: number;
  rentStart?: string;
  rentEnd?: string;
}

export function normalizeOrderListRow(raw: Record<string, unknown>): OrderListRow {
  const details = Array.isArray(raw.details) ? raw.details : [];
  const first = details[0] as Record<string, unknown> | undefined;

  return {
    id: Number(raw.id),
    cosplayerId: Number(raw.cosplayerId),
    providerId: Number(raw.providerId),
    orderType: String(raw.orderType ?? ''),
    status: String(raw.status ?? ''),
    totalAmount: Number(raw.totalAmount ?? 0),
    totalDepositAmount: Number(raw.totalDepositAmount ?? 0),
    createdAt: String(raw.createdAt ?? ''),
    rentDate: raw.rentDate != null ? String(raw.rentDate) : null,
    costumeId: first?.costumeId != null ? Number(first.costumeId) : undefined,
    rentStart: first?.rentStart != null ? String(first.rentStart) : undefined,
    rentEnd: first?.rentEnd != null ? String(first.rentEnd) : undefined,
  };
}
