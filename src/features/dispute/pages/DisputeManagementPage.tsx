/**
 * DisputeManagementPage
 *
 * Staff dispute management page featuring:
 * - Dispute list with filter tabs (ALL / OPEN / RESOLVED / REJECTED)
 * - Resolve button for PENDING disputes
 * - Detail modal with image preview
 * - Resolve modal with form validation
 */
import { useState } from 'react';
import { Modal, Button } from 'antd';
import { ShieldCheck } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';
import { DisputeList } from '../components/DisputeList';
import { ResolveDisputeModal } from '../components/ResolveDisputeModal';
import { useDisputes } from '../hooks/useDisputes';
import { useResolveDispute } from '../hooks/useResolveDispute';
import type { Dispute, DisputeFilter, ResolveDisputePayload } from '../types/dispute.type';

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

function DisputeDetailModal({ dispute, open, onClose }: { dispute: Dispute | null; open: boolean; onClose: () => void }) {
  if (!dispute) return null;

  const canResolve = dispute.status === 'PENDING' || dispute.status === 'OPEN';

  return (
    <Modal
      open={open}
      title={`${VI.staff.disputes.disputeDetail} #${dispute.id}`}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {VI.common.actions.cancel}
        </Button>,
        canResolve ? (
          <Button
            key="resolve"
            type="primary"
            danger
            icon={<ShieldCheck size={14} />}
          >
            {VI.dispute.resolveAction}
          </Button>
        ) : null,
      ]}
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
            <p>
              <span className="text-slate-500">{VI.staff.disputes.orderId}:</span>{' '}
              <span className="font-medium">#{dispute.order.id}</span>
            </p>
            <p>
              <span className="text-slate-500">{VI.staff.disputes.cosplayerId}:</span>{' '}
              <span className="font-medium">{dispute.order.cosplayerId}</span>
            </p>
            <p>
              <span className="text-slate-500">{VI.staff.disputes.providerId}:</span>{' '}
              <span className="font-medium">{dispute.order.providerId}</span>
            </p>
            <p>
              <span className="text-slate-500">{VI.staff.disputes.totalAmount}:</span>{' '}
              <span className="font-medium">{formatCurrency(dispute.order.totalAmount)}</span>
            </p>
            <p>
              <span className="text-slate-500">{VI.staff.disputes.orderType}:</span>{' '}
              <span className="font-medium">{dispute.order.orderType}</span>
            </p>
            <p>
              <span className="text-slate-500">{VI.staff.disputes.orderStatus}:</span>{' '}
              <span className="font-medium">{dispute.order.status}</span>
            </p>
            <p>
              <span className="text-slate-500">{VI.staff.disputes.createdAt}:</span>{' '}
              <span className="font-medium">{formatDate(dispute.createdAt)}</span>
            </p>
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
              {dispute.result.result && (
                <p className="text-green-700">{dispute.result.result}</p>
              )}
              {dispute.result.penaltyAmount != null && (
                <p className="text-green-700">
                  {VI.staff.disputes.penaltyAmount}:{' '}
                  <span className="font-semibold">{formatCurrency(dispute.result.penaltyAmount)}</span>
                </p>
              )}
              {dispute.result.penaltyPercent != null && (
                <p className="text-green-700">
                  {VI.staff.disputes.penaltyPercent}:{' '}
                  <span className="font-semibold">{dispute.result.penaltyPercent}%</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function DisputeManagementPage() {
  const [filter, setFilter] = useState<DisputeFilter>('ALL');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  const params = filter === 'ALL' ? undefined : { status: filter };
  const { disputes, loading, error, refetch } = useDisputes(params);
  const { resolvingId, resolveDispute } = useResolveDispute({
    onSuccess: () => {
      setResolveModalOpen(false);
      void refetch();
    },
  });

  const openDetail = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDetailModalOpen(true);
  };

  const openResolveModal = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDetailModalOpen(false);
    setResolveModalOpen(true);
  };

  const handleResolve = async (data: ResolveDisputePayload) => {
    if (!selectedDispute) return;
    const success = await resolveDispute(selectedDispute.id, data);
    if (success) {
      setResolveModalOpen(false);
      void refetch();
    }
  };

  // Merge resolved dispute back into the list locally
  const resolvedDispute = resolvingId === null && selectedDispute ? selectedDispute : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{VI.staff.disputes.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{VI.staff.disputes.description}</p>
      </div>

      {/* Dispute list with filters */}
      <DisputeList
        disputes={disputes}
        loading={loading}
        error={error}
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={() => void refetch()}
        onCardClick={openDetail}
      />

      {/* Detail Modal */}
      <DisputeDetailModal
        dispute={selectedDispute}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      {/* Resolve Modal */}
      <ResolveDisputeModal
        open={resolveModalOpen}
        dispute={selectedDispute}
        loading={resolvingId !== null}
        onCancel={() => setResolveModalOpen(false)}
        onSubmit={handleResolve}
      />
    </div>
  );
}
