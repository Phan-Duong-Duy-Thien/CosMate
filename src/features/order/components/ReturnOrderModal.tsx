/**
 * ReturnOrderModal
 *
 * UI-only modal for returning an order
 * Props: open, orderId, loading, onCancel, onSubmit
 */

import { useState, useEffect } from 'react';
import { Modal, Upload, Button, Input, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { VI } from '@/shared/i18n/vi';

interface ReturnOrderModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: { trackingCode: string; images: File[]; notes: string[] }) => Promise<void>;
}

export function ReturnOrderModal({ open, orderId, loading, onCancel, onSubmit }: ReturnOrderModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [trackingCode, setTrackingCode] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFileList([]);
      setTrackingCode('');
    }
  }, [open]);

  // Handle file change
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validate tracking code
    if (!trackingCode.trim()) {
      message.error(VI.profile.orders.validationReturn?.trackingRequired || 'Vui lòng nhập mã vận đơn');
      return;
    }

    // Validate images
    if (fileList.length === 0) {
      message.error(VI.profile.orders.validationReturn?.imagesRequired || 'Vui lòng tải lên ít nhất một hình ảnh');
      return;
    }

    // Build images and notes arrays (notes as empty strings - hidden from user)
    const images: File[] = [];
    const notes: string[] = [];

    for (const file of fileList) {
      if (file.originFileObj) {
        images.push(file.originFileObj);
        notes.push(''); // Empty notes as per business decision
      }
    }

    await onSubmit({ trackingCode: trackingCode.trim(), images, notes });
  };

  // Custom upload props
  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    onChange: handleFileChange,
    beforeUpload: () => {
      return false;
    },
    listType: 'picture-card',
    accept: 'image/*',
  };

  return (
    <Modal
      title={VI.profile.orders.actionReturn}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {VI.common.actions.cancel}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {VI.profile.orders.actionReturn}
        </Button>,
      ]}
      width={500}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {VI.profile.orders.returnTrackingCode}
          </label>
          <Input
            placeholder={VI.profile.orders.returnTrackingCodePlaceholder}
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {VI.profile.orders.returnImages}
          </label>
          <p className="mb-2 text-xs text-slate-500">
            Vui lòng tải lên hình ảnh xác nhận tình trạng trang phục trước khi gửi trả.
          </p>
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to upload</p>
            <p className="ant-upload-hint">Support for multiple images</p>
          </Upload.Dragger>
        </div>
      </div>
    </Modal>
  );
}
