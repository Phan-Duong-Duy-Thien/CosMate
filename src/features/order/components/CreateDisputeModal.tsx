/**
 * CreateDisputeModal
 *
 * UI-only modal for creating a dispute
 * Props: open, orderId, loading, onCancel, onSubmit
 */
import { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { VI } from '@/shared/i18n/vi';

interface CreateDisputeModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

export function CreateDisputeModal({ open, orderId, loading, onCancel, onSubmit }: CreateDisputeModalProps) {
  const [reason, setReason] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open]);

  const handleSubmit = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      return;
    }
    await onSubmit(trimmed);
  };

  return (
    <Modal
      title="Khiếu nại đơn hàng"
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
          disabled={!reason.trim()}
        >
          Gửi khiếu nại
        </Button>,
      ]}
      width={480}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Lý do khiếu nại <span style={{ color: '#ff4d4f' }}>*</span>
          </label>
          <Input.TextArea
            placeholder="Mô tả chi tiết lý do khiếu nại của bạn..."
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
