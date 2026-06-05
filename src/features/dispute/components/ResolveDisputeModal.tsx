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
import { Modal, Input, InputNumber, Button, message, Radio } from 'antd';
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
  const [inputMode, setInputMode] = useState<'amount' | 'percent'>('amount');
  const [penaltyAmount, setPenaltyAmount] = useState<number>(0);
  const [penaltyPercent, setPenaltyPercent] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const baseAmount = dispute?.order.totalDepositAmount || dispute?.order.totalAmount || 0;

  // Real-time calculated sync display values
  const displayAmount = inputMode === 'amount'
    ? penaltyAmount
    : Math.round((penaltyPercent / 100) * baseAmount);

  const displayPercent = inputMode === 'percent'
    ? penaltyPercent
    : (baseAmount > 0 ? Number(((penaltyAmount / baseAmount) * 100).toFixed(1)) : 0);

  useEffect(() => {
    if (!open) {
      setResult('');
      setInputMode('amount');
      setPenaltyAmount(0);
      setPenaltyPercent(0);
      setNotes('');
    }
  }, [open]);

  const isResultValid = result.trim().length > 0;
  const isPenaltyAmountValid = displayAmount >= 0;
  const isPenaltyPercentValid = displayPercent >= 0 && displayPercent <= 100;

  const handleSubmit = async () => {
    if (!isResultValid) {
      message.error(VI.dispute.resultRequired);
      return;
    }
    if (inputMode === 'amount' && !isPenaltyAmountValid) {
      message.error(VI.dispute.penaltyAmountInvalid);
      return;
    }
    if (inputMode === 'percent' && !isPenaltyPercentValid) {
      message.error(VI.dispute.penaltyPercentInvalid);
      return;
    }

    const payload: ResolveDisputePayload = {
      result: result.trim(),
      notes: notes.trim(),
      // Send only one of them to the API
      ...(inputMode === 'amount'
        ? { penaltyAmount: displayAmount }
        : { penaltyPercent: displayPercent }
      ),
    };

    await onSubmit(payload);
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
          <p className="mt-1 text-xs text-slate-500">
            Gốc tính phạt: <span className="font-semibold text-slate-800">{baseAmount.toLocaleString('vi-VN')} VND</span> {dispute.order.totalDepositAmount ? '(Tiền cọc)' : '(Tổng giá trị đơn)'}
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

        {/* Input Mode Selection */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Phương thức phạt
          </label>
          <Radio.Group
            value={inputMode}
            onChange={(e) => {
              const mode = e.target.value;
              setInputMode(mode);
              // Reset values on mode change
              if (mode === 'amount') {
                setPenaltyPercent(0);
              } else {
                setPenaltyAmount(0);
              }
            }}
          >
            <Radio value="amount">Nhập số tiền phạt (VND)</Radio>
            <Radio value="percent">Nhập phần trăm phạt (%)</Radio>
          </Radio.Group>
        </div>

        {/* Penalty Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.resolvePenaltyAmountLabel} {inputMode !== 'amount' && <span className="text-xs text-slate-400">(Tự động tính)</span>}
          </label>
          <InputNumber
            className="w-full"
            min={0}
            value={displayAmount}
            disabled={inputMode !== 'amount'}
            onChange={(val) => setPenaltyAmount(val ?? 0)}
            placeholder={VI.dispute.penaltyAmountPlaceholder}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => Number(value?.replace(/,/g, '')) ?? 0}
          />
        </div>

        {/* Penalty Percent */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.resolvePenaltyPercentLabel} {inputMode !== 'percent' && <span className="text-xs text-slate-400">(Tự động tính)</span>}
          </label>
          <InputNumber
            className="w-full"
            min={0}
            max={100}
            value={displayPercent}
            disabled={inputMode !== 'percent'}
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
