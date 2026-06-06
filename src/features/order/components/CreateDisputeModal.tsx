/**
 * CreateDisputeModal
 *
 * Modal for creating a dispute with:
 * - Reason textarea (required, min 10 chars)
 * - Image upload (optional, max 3 images)
 * - Image preview
 * - Uploads images first, then sends URLs + reason to API
 */
import { useState, useEffect } from 'react';
import { Modal, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';

interface CreateDisputeModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (payload: { reason: string; files: File[] }) => Promise<void>;
}

const { Dragger } = Upload;

export function CreateDisputeModal({ open, orderId, loading, onCancel, onSubmit }: CreateDisputeModalProps) {
  const [reason, setReason] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setReason('');
      setFileList([]);
    }
  }, [open]);

  // Validate reason (min 10 characters)
  const isReasonValid = reason.trim().length >= 10;

  // Handle file change - limit to 3 images
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (newFileList.length > 3) {
      message.warning(VI.dispute.maxImagesWarning);
      setFileList(newFileList.slice(0, 3));
    } else {
      setFileList(newFileList);
    }
  };

  // Custom upload props
  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    onChange: handleFileChange,
    beforeUpload: () => false,
    listType: 'picture-card',
    accept: 'image/*',
  };

  // Get upload button text
  const getUploadButtonText = () => {
    if (fileList.length >= 3) return VI.dispute.maxImagesReached;
    return VI.dispute.uploadImages;
  };

  // Handle submit - pass files directly (backend handles upload via multipart)
  const handleSubmit = async () => {
    if (!isReasonValid) {
      message.error(VI.dispute.reasonTooShort);
      return;
    }
    if (fileList.length === 0) {
      message.error('Vui lòng đính kèm ít nhất 1 hình ảnh làm bằng chứng.');
      return;
    }

    // Collect File objects for multipart upload
    const fileObjects: File[] = fileList
      .map((f) => f.originFileObj)
      .filter((f): f is File => f !== undefined);

    await onSubmit({
      reason: reason.trim(),
      files: fileObjects,
    });
  };

  // Compute submit button state
  const isSubmitDisabled = loading || !isReasonValid || fileList.length === 0;

  return (
    <Modal
      title={VI.dispute.modalTitle}
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
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          {VI.dispute.submit}
        </Button>,
      ]}
      width={520}
      destroyOnClose
    >
      <div className="space-y-5">
        {/* Reason textarea */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.reasonLabel} <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            placeholder={VI.dispute.reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            showCount
            maxLength={1000}
          />
          {reason.trim().length > 0 && reason.trim().length < 10 && (
            <p className="mt-1 text-xs text-orange-500">
              {VI.dispute.reasonTooShort} ({reason.trim().length}/10)
            </p>
          )}
        </div>

        {/* Image upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {VI.dispute.imagesLabel} <span className="text-red-500">*</span>
            <span className="ml-1 text-xs text-red-500 font-semibold">(hình ảnh đính kèm là bắt buộc)</span>
          </label>

          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{getUploadButtonText()}</p>
            <p className="ant-upload-hint">
              {`${VI.dispute.imagesHint} (${fileList.length}/3)`}
            </p>
          </Dragger>
        </div>

        {/* Helper text */}
        <p className="text-xs text-slate-400">{VI.dispute.helperText}</p>
      </div>
    </Modal>
  );
}