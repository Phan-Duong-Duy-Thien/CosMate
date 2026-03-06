/**
 * ConfirmDeliveryModal
 *
 * UI-only modal for confirming delivery of an order
 * Props: open, orderId, loading, onCancel, onSubmit
 */

import { useState, useEffect } from 'react';
import { Modal, Upload, Button, Space, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { VI } from '@/shared/i18n/vi';

interface ConfirmDeliveryModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: { images: File[]; notes: string[] }) => Promise<void>;
}

export function ConfirmDeliveryModal({ open, orderId, loading, onCancel, onSubmit }: ConfirmDeliveryModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFileList([]);
    }
  }, [open]);

  // Handle file change
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error(VI.profile.orders.validation?.imagesRequired || 'Vui lòng tải lên ít nhất một hình ảnh');
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

    await onSubmit({ images, notes });
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
      title={VI.profile.orders.actionConfirmDelivery}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {VI.common.actions.cancel}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {VI.profile.orders.actionConfirmDelivery}
        </Button>,
      ]}
      width={500}
      destroyOnClose
    >
      <p className="mb-4 text-sm text-slate-600">
        Vui lòng tải lên hình ảnh xác nhận đã nhận hàng.
      </p>

      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag files to upload</p>
        <p className="ant-upload-hint">Support for multiple images</p>
      </Upload.Dragger>
    </Modal>
  );
}
