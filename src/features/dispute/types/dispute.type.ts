/**
 * Dispute Types
 * Central type definitions for the dispute feature
 */

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface DisputeResult {
  penaltyAmount: number | null;
  penaltyPercent: number | null;
  id?: number;
  dispute?: string;
  result?: string;
  createdAt?: string;
}

export interface DisputeImage {
  id: number;
  disputeImageUrl: string;
  dispute?: string;
}

export interface DisputeOrder {
  id: number;
  cosplayerId: number;
  providerId: number;
  orderType: string;
  status: string;
  totalAmount: number;
  totalDepositAmount?: number;
  createdAt: string;
  rentDate?: string;
}

// ─── Dispute ─────────────────────────────────────────────────────────────────

export interface Dispute {
  id: number;
  order: DisputeOrder;
  createdByUserId: number;
  staffId: number;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
  result: DisputeResult | null;
  images: DisputeImage[];
}

// ─── Dispute Status ───────────────────────────────────────────────────────────

export type DisputeStatus = 'PENDING' | 'OPEN' | 'RESOLVED' | 'REJECTED';

export const DISPUTE_STATUS = {
  PENDING: 'PENDING',
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
} as const;

// ─── Filter ───────────────────────────────────────────────────────────────────

export type DisputeFilter = 'ALL' | 'OPEN' | 'RESOLVED' | 'REJECTED';

export interface GetDisputesParams {
  status?: string;
  userId?: number;
}

// ─── Create Dispute ───────────────────────────────────────────────────────────

export interface CreateDisputeResponse {
  id: number;
  order: {
    id: number;
    status: string;
    [key: string]: unknown;
  };
  createdByUserId: number;
  staffId: number;
  reason: string;
  status: string;
  createdAt: string;
  result: DisputeResult | null;
  images: DisputeImage[];
}

export interface CreateDisputePayload {
  reason: string;
  files: File[];
}

// ─── Resolve Dispute ──────────────────────────────────────────────────────────

export interface ResolveDisputePayload {
  result: string;
  penaltyAmount: number;
  penaltyPercent: number;
  notes: string;
}

export interface ResolveDisputeResponse {
  id: number;
  status: DisputeStatus;
  result: DisputeResult;
}
