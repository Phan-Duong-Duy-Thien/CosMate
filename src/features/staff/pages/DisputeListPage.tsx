import { useState } from 'react';
import { Card } from '@/shared/components/Card';
import { RotateCw, AlertTriangle } from 'lucide-react';
import { Modal } from 'antd';
import { VI } from '@/shared/i18n/vi';
import { useDisputes } from '../hooks/useDisputes';
import type { Dispute } from '@/features/order/api/dispute.api';

type FilterStatus = 'ALL' | 'OPEN' | 'RESOLVED' | 'REJECTED';

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
  const s = status?.toUpperCase();
  if (s === 'OPEN') {
    return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">{VI.staff.disputes.statusOpen}</span>;
  }
  if (s === 'RESOLVED') {
    return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{VI.staff.disputes.statusResolved}</span>;
  }
  if (s === 'REJECTED') {
    return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">{VI.staff.disputes.statusRejected}</span>;
  }
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{status}</span>;
}

function DisputeCard({ dispute, onClick }: { dispute: Dispute; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
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
        <div className="text-right text-xs text-slate-500">
          <p>{formatDate(dispute.createdAt)}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-slate-700">{VI.staff.disputes.reason}</p>
        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{dispute.reason}</p>
      </div>

      {dispute.result != null && (
        <div className="mt-3 rounded-lg bg-slate-50 p-2.5">
          <p className="text-xs font-medium text-slate-700">{VI.staff.disputes.result}:</p>
          {dispute.result.penaltyAmount != null && (
            <p className="text-xs text-slate-600">
              {VI.staff.disputes.penaltyAmount}: {formatCurrency(dispute.result.penaltyAmount)}
            </p>
          )}
          {dispute.result.penaltyPercent != null && (
            <p className="text-xs text-slate-600">
              {VI.staff.disputes.penaltyPercent}: {dispute.result.penaltyPercent}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DisputeDetailModal({ dispute, open, onClose }: { dispute: Dispute | null; open: boolean; onClose: () => void }) {
  if (!dispute) return null;

  return (
    <Modal
      open={open}
      title={`${VI.staff.disputes.disputeDetail} #${dispute.id}`}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="mt-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{VI.staff.disputes.status}</span>
          {getStatusBadge(dispute.status)}
        </div>

        {/* Order info */}
        <div className="rounded-lg bg-slate-50 p-3">
          <h4 className="mb-2 text-sm font-semibold text-slate-700">{VI.staff.disputes.orderInfo}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <p><span className="text-slate-500">{VI.staff.disputes.orderId}:</span> <span className="font-medium">#{dispute.order.id}</span></p>
            <p><span className="text-slate-500">{VI.staff.disputes.cosplayerId}:</span> <span className="font-medium">{dispute.order.cosplayerId}</span></p>
            <p><span className="text-slate-500">{VI.staff.disputes.providerId}:</span> <span className="font-medium">{dispute.order.providerId}</span></p>
            <p><span className="text-slate-500">{VI.staff.disputes.totalAmount}:</span> <span className="font-medium">{formatCurrency(dispute.order.totalAmount)}</span></p>
            <p><span className="text-slate-500">{VI.staff.disputes.orderType}:</span> <span className="font-medium">{dispute.order.orderType}</span></p>
            <p><span className="text-slate-500">{VI.staff.disputes.orderStatus}:</span> <span className="font-medium">{dispute.order.status}</span></p>
            <p><span className="text-slate-500">{VI.staff.disputes.createdAt}:</span> <span className="font-medium">{formatDate(dispute.createdAt)}</span></p>
          </div>
        </div>

        {/* Reason */}
        <div>
          <h4 className="mb-1 text-sm font-semibold text-slate-700">{VI.staff.disputes.reason}</h4>
          <p className="text-sm text-slate-600">{dispute.reason}</p>
        </div>

        {/* Images */}
        {dispute.images.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">{VI.staff.disputes.evidence}</h4>
            <div className="flex flex-wrap gap-2">
              {dispute.images.map((img) => (
                <a
                  key={img.id}
                  href={img.disputeImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overflow-hidden rounded-lg border border-slate-200"
                >
                  <img
                    src={img.disputeImageUrl}
                    alt={VI.staff.disputes.disputeImageAlt}
                    className="h-20 w-20 object-cover transition-transform hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {dispute.result != null && (
          <div className="rounded-lg bg-green-50 p-3">
            <h4 className="mb-2 text-sm font-semibold text-green-700">{VI.staff.disputes.result}</h4>
            <div className="space-y-1 text-xs">
              {dispute.result.penaltyAmount != null && (
                <p className="text-green-700">
                  {VI.staff.disputes.penaltyAmount}: <span className="font-semibold">{formatCurrency(dispute.result.penaltyAmount)}</span>
                </p>
              )}
              {dispute.result.penaltyPercent != null && (
                <p className="text-green-700">
                  {VI.staff.disputes.penaltyPercent}: <span className="font-semibold">{dispute.result.penaltyPercent}%</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: VI.staff.disputes.filterAll },
  { value: 'OPEN', label: VI.staff.disputes.filterOpen },
  { value: 'RESOLVED', label: VI.staff.disputes.filterResolved },
  { value: 'REJECTED', label: VI.staff.disputes.filterRejected },
];

export default function DisputeListPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const params = filterStatus === 'ALL' ? undefined : { status: filterStatus };
  const { disputes, loading, error, refetch } = useDisputes(params);

  const openDetail = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{VI.staff.disputes.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{VI.staff.disputes.description}</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          disabled={loading}
        >
          <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          {VI.common.actions.refresh}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilterStatus(opt.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filterStatus === opt.value
                ? 'bg-pink-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Dispute list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RotateCw size={32} className="animate-spin text-slate-400" />
        </div>
      ) : disputes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <AlertTriangle size={40} className="text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">{VI.staff.disputes.empty}</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {disputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onClick={() => openDetail(dispute)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <DisputeDetailModal
        dispute={selectedDispute}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
}
