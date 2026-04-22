/**
 * ResolveDisputeModal
 *
 * Staff modal for resolving a dispute with:
 * - Result textarea (required)
 * - Penalty amount (number, >= 0)
 * - Penalty percent (number, 0-100)
 * - Notes textarea (optional)
 */
import { useState, useEffect } from 'react';
import { Modal, Input, InputNumber, Button, message } from 'antd';
import { VI } from '@/shared/i18n/vi';
import type { Dispute, ResolveDisputePayload } from '../types/dispute.type';

interface ResolveDisputeModalProps {
  open: boolean;
  dispute: Dispute | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: ResolveDisputePayload) => Promise<void>;
}

export function ResolveDisputeModal({
  open,
  dispute,
  loading,
  onCancel,
  onSubmit,
}: ResolveDisputeModalProps) {
  const [result, setResult] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState<number>(0);
  const [penaltyPercent, setPenaltyPercent] = useState<number>(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) {
      setResult('');
      setPenaltyAmount(0);
      setPenaltyPercent(0);
      setNotes('');
    }
  }, [open]);

  const isResultValid = result.trim().length > 0;
  const isPenaltyAmountValid = penaltyAmount >= 0;
  const isPenaltyPercentValid = penaltyPercent >= 0 && penaltyPercent <= 100;

  const handleSubmit = async () => {
    if (!isResultValid) {
      message.error(VI.dispute.resultRequired);
      return;
    }
    if (!isPenaltyAmountValid) {
      message.error(VI.dispute.penaltyAmountInvalid);
      return;
    }
    if (!isPenaltyPercentValid) {
      message.error(VI.dispute.penaltyPercentInvalid);
      return;
    }

    await onSubmit({
      result: result.trim(),
      penaltyAmount,
      penaltyPercent,
      notes: notes.trim(),
    });
  };

  return (
    <Modal
      title={VI.dispute.resolveModalTitle}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {VI.common.actions.cancel}
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={loading}
          disabled={!isResultValid || !isPenaltyAmountValid || !isPenaltyPercentValid}
          onClick={handleSubmit}
        >
          {loading ? VI.dispute.resolving : VI.dispute.resolveSubmit}
        </Button>,
      ]}
      width={520}
      destroyOnClose
    >
      {dispute && (
        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            {VI.staff.disputes.orderId}: <span className="font-medium">#{dispute.order.id}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {VI.staff.disputes.reason}: <span className="font-medium">{dispute.reason}</span>
          </p>
        </div>
      )}

      <div className="space-y-5">
        {/* Result */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.resolveResultLabel} <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            placeholder={VI.dispute.resolveResultPlaceholder}
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={4}
            showCount
            maxLength={1000}
          />
        </div>

        {/* Penalty Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.resolvePenaltyAmountLabel}
          </label>
          <InputNumber
            className="w-full"
            min={0}
            value={penaltyAmount}
            onChange={(val) => setPenaltyAmount(val ?? 0)}
            placeholder={VI.dispute.penaltyAmountPlaceholder}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => Number(value?.replace(/,/g, '')) ?? 0}
          />
        </div>

        {/* Penalty Percent */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.resolvePenaltyPercentLabel}
          </label>
          <InputNumber
            className="w-full"
            min={0}
            max={100}
            value={penaltyPercent}
            onChange={(val) => setPenaltyPercent(val ?? 0)}
            placeholder={VI.dispute.penaltyPercentPlaceholder}
            suffix="%"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.resolveNotesLabel}
          </label>
          <Input.TextArea
            placeholder={VI.dispute.resolveNotesPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>
      </div>
    </Modal>
  );
}
