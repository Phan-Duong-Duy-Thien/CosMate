/**
 * DisputeCard Component
 * Displays a single dispute summary in the list
 */
import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import type { Dispute } from '../types/dispute.type';
import { VI } from '@/shared/i18n/vi';

interface DisputeCardProps {
  dispute: Dispute;
  onClick: (dispute: Dispute) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case 'OPEN':
    case 'PENDING':
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
          {VI.staff.disputes.statusOpen}
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          {VI.staff.disputes.statusResolved}
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
          {VI.staff.disputes.statusRejected}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {status}
        </span>
      );
  }
}

export function DisputeCard({ dispute, onClick }: DisputeCardProps) {
  const canResolve = dispute.status === 'PENDING' || dispute.status === 'OPEN';

  return (
    <div
      onClick={() => onClick(dispute)}
      className="cursor-pointer rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">#{dispute.id}</span>
            {getStatusBadge(dispute.status)}
          </div>
          <p className="text-xs text-slate-500">
            {VI.staff.disputes.orderId}: <span className="font-medium text-slate-700">#{dispute.order.id}</span>
          </p>
          <p className="text-xs text-slate-500">
            {VI.staff.disputes.cosplayerId}: <span className="font-medium text-slate-700">{dispute.order.cosplayerId}</span>
          </p>
          <p className="text-xs text-slate-500">
            {VI.staff.disputes.providerId}: <span className="font-medium text-slate-700">{dispute.order.providerId}</span>
          </p>
          <p className="text-xs font-semibold text-slate-900">
            {VI.staff.disputes.totalAmount}: {formatCurrency(dispute.order.totalAmount)}
          </p>
          <p className="text-xs text-slate-500">
            {VI.staff.disputes.orderStatus}: <span className="font-medium text-slate-700">{dispute.order.status}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-right text-xs text-slate-500">{formatDate(dispute.createdAt)}</span>
          {canResolve && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-600">
              <CheckCircle size={10} />
              {VI.dispute.actionResolve}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-slate-700">{VI.staff.disputes.reason}</p>
        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{dispute.reason}</p>
      </div>

      {dispute.result != null && (
        <div className="mt-3 rounded-lg bg-green-50 p-2.5">
          <p className="text-xs font-medium text-green-700">{VI.staff.disputes.result}:</p>
          {dispute.result.penaltyAmount != null && (
            <p className="text-xs text-green-600">
              {VI.staff.disputes.penaltyAmount}: {formatCurrency(dispute.result.penaltyAmount)}
            </p>
          )}
          {dispute.result.penaltyPercent != null && (
            <p className="text-xs text-green-600">
              {VI.staff.disputes.penaltyPercent}: {dispute.result.penaltyPercent}%
            </p>
          )}
          {dispute.result.result && (
            <p className="mt-1 text-xs text-green-600">{dispute.result.result}</p>
          )}
        </div>
      )}
    </div>
  );
}