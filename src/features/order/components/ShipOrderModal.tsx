/**
 * ShipOrderModal
 *
 * UI-only modal for shipping an order
 * Props: open, orderId, loading, onCancel, onSubmit
 */

import { useState, useEffect } from 'react';
import { Modal, Input, Upload, Button, Form, Space, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { VI } from '@/shared/i18n/vi';

interface ShipOrderModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: { trackingCode: string; notes: string[]; images: File[] }) => Promise<void>;
}

const { Dragger } = Upload;

export function ShipOrderModal({ open, orderId, loading, onCancel, onSubmit }: ShipOrderModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setFileList([]);
      setNoteMap({});
    }
  }, [open, form]);

  // Handle file change
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Remove notes for files that were removed
    const newNoteMap: Record<string, string> = {};
    newFileList.forEach((file) => {
      if (file.uid && noteMap[file.uid]) {
        newNoteMap[file.uid] = noteMap[file.uid];
      }
    });
    setNoteMap(newNoteMap);
    setFileList(newFileList);
  };

  // Handle note change for a specific file
  const handleNoteChange = (uid: string, value: string) => {
    setNoteMap((prev) => ({
      ...prev,
      [uid]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Validation
      if (!values.trackingCode?.trim()) {
        message.error(VI.provider.orders.validation.trackingRequired);
        return;
      }

      if (fileList.length === 0) {
        message.error(VI.provider.orders.validation.imagesRequired);
        return;
      }

      // Build notes array in the same order as fileList
      const notes: string[] = [];
      const images: File[] = [];

      for (const file of fileList) {
        if (file.originFileObj) {
          images.push(file.originFileObj);
          const note = noteMap[file.uid] || '';
          notes.push(note);
        }
      }

      if (notes.length !== images.length) {
        message.error(VI.provider.orders.validation.noteImageMismatch);
        return;
      }

      await onSubmit({
        trackingCode: values.trackingCode.trim(),
        notes,
        images,
      });
    } catch {
      // Validation error - don't submit
    }
  };

  // Custom upload props
  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    onChange: handleFileChange,
    beforeUpload: () => {
      // Prevent default upload behavior
      return false;
    },
    listType: 'picture-card',
    accept: 'image/*',
  };

  return (
    <Modal
      title={VI.provider.orders.shipModal.title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {VI.provider.orders.shipModal.cancel}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {VI.provider.orders.shipModal.submit}
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="trackingCode"
          label={VI.provider.orders.shipModal.trackingCode}
          rules={[{ required: true, message: VI.provider.orders.validation.trackingRequired }]}
        >
          <Input placeholder={VI.provider.orders.shipModal.trackingCodePlaceholder} />
        </Form.Item>

        <Form.Item label={VI.provider.orders.shipModal.images}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to upload</p>
            <p className="ant-upload-hint">Support for multiple images</p>
          </Dragger>
        </Form.Item>

        {fileList.length > 0 && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {fileList.map((file, index) => (
              <div key={file.uid} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, fontWeight: 500 }}>
                  {file.name || `Image ${index + 1}`}
                </div>
                <Input
                  placeholder={VI.provider.orders.shipModal.notePlaceholder}
                  value={noteMap[file.uid] || ''}
                  onChange={(e) => handleNoteChange(file.uid, e.target.value)}
                  style={{ flex: 2 }}
                />
              </div>
            ))}
          </Space>
        )}
      </Form>
    </Modal>
  );
}
