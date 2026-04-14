/**
 * CreateDisputeModal
 *
 * UI-only modal for creating a dispute.
 * Reason is collected for UX but NOT sent to the API (BE handles it internally).
 */
import { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { VI } from '@/shared/i18n/vi';

interface CreateDisputeModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
}

export function CreateDisputeModal({ open, loading, onCancel, onSubmit }: CreateDisputeModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) setReason('');
  }, [open]);

  // onSubmit does NOT receive reason — BE handles it internally
  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <Modal
      title={VI.dispute.modalTitle}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {VI.common.actions.cancel}
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={loading}
          onClick={handleSubmit}
        >
          {VI.dispute.submit}
        </Button>,
      ]}
      width={480}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {VI.dispute.reasonLabel}
          </label>
          <Input.TextArea
            placeholder={VI.dispute.reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            showCount
            maxLength={1000}
          />
        </div>
      </div>
    </Modal>
  );
}
