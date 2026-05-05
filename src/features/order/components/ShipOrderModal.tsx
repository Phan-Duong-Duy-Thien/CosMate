/**
 * ShipOrderModal
 *
 * UI-only modal for shipping an order
 * Props: open, orderId, loading, onCancel, onSubmit
 */

import { useState, useEffect } from 'react';
import { Modal, Input, Upload, Button, Form, Space, Select, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { VI } from '@/shared/i18n/vi';

interface ShipOrderModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: { trackingCode: string; shippingCarrierName: string; notes: string[]; images: File[] }) => Promise<void>;
}

const { Dragger } = Upload;

const CARRIER_OPTIONS = [
  { label: 'GHN (Giao Hàng Nhanh)', value: 'GHN' },
  { label: 'GHTK (Giao Hàng Tiết Kiệm)', value: 'GHTK' },
  { label: 'Viettel Post', value: 'VIETTEL_POST' },
  { label: 'VNPost', value: 'VNPOST' },
  { label: 'J&T Express', value: 'J&T' },
  { label: 'Shopee Express', value: 'SPX' },
  { label: 'Ninja Van', value: 'NINJA_VAN' },
  { label: 'Best Express', value: 'BEST' },
  { label: VI.common.actions.other,
    value: 'OTHER' },
];

export function ShipOrderModal({ open, orderId, loading, onCancel, onSubmit }: ShipOrderModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [customCarrier, setCustomCarrier] = useState<string>('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setFileList([]);
      setNoteMap({});
      setSelectedCarrier(null);
      setCustomCarrier('');
    }
  }, [open, form]);

  // Handle carrier selection change
  const handleCarrierChange = (value: string) => {
    setSelectedCarrier(value);
    if (value !== 'OTHER') {
      form.setFieldValue('shippingCarrierName', value);
      setCustomCarrier('');
    } else {
      form.setFieldValue('shippingCarrierName', '');
    }
  };

  // Handle file change
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
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

      // Resolve carrier name: dropdown value or custom input
      const carrierName =
        selectedCarrier === 'OTHER' ? customCarrier.trim() : (selectedCarrier ?? '');

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

      await onSubmit({
        trackingCode: values.trackingCode.trim(),
        shippingCarrierName: carrierName,
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
    beforeUpload: () => false,
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

        <Form.Item
          label={VI.provider.orders.shipModal.carrierName}
          required
        >
          <Select
            placeholder={VI.provider.orders.shipModal.selectCarrier}
            options={CARRIER_OPTIONS}
            value={selectedCarrier}
            onChange={handleCarrierChange}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {selectedCarrier === 'OTHER' && (
          <Form.Item
            name="customCarrier"
            label={VI.provider.orders.shipModal.carrierNameOther}
            rules={[{ required: true, message: VI.provider.orders.validation.carrierRequired }]}
          >
            <Input
              placeholder={VI.provider.orders.shipModal.carrierNameOtherPlaceholder}
              value={customCarrier}
              onChange={(e) => {
                setCustomCarrier(e.target.value);
                form.setFieldValue('shippingCarrierName', e.target.value);
              }}
            />
          </Form.Item>
        )}

        <Form.Item label={VI.provider.orders.shipModal.images}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{VI.provider.orders.shipModal.uploadText}</p>
            <p className="ant-upload-hint">{VI.provider.orders.shipModal.uploadHint}</p>
          </Dragger>
        </Form.Item>

        {fileList.length > 0 && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {fileList.map((file, index) => (
              <div key={file.uid} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, fontWeight: 500 }}>
                  {file.name || `${VI.provider.orders.shipModal.imagePrefix}${index + 1}`}
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