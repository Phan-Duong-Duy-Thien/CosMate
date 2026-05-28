/**
 * ShipOrderModal
 *
 * UI-only modal for shipping an order
 */

import { useState, useEffect } from 'react';
import { Modal, Input, Upload, Button, Form, Space, Select, message, Alert } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { VI } from '@/shared/i18n/vi';
import { SHIPPING_CARRIER_OPTIONS, resolveCarrierName } from '../constants/shippingCarriers';
import { useGhnShippingFee } from '../hooks/useGhnShippingFee';

const { Dragger } = Upload;

export interface ShipOrderSubmitData {
  trackingCode: string;
  shippingCarrierName: string;
  notes: string[];
  images: File[];
  autoCreateGhn: boolean;
}

interface ShipOrderModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: ShipOrderSubmitData) => Promise<void>;
}

export function ShipOrderModal({ open, orderId, loading, onCancel, onSubmit }: ShipOrderModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [customCarrier, setCustomCarrier] = useState<string>('');

  const hasCarrier = Boolean(selectedCarrier);
  const { fee, loading: feeLoading, error: feeError, approximate: feeApproximate } =
    useGhnShippingFee(open && hasCarrier ? orderId : null, 'ship');

  useEffect(() => {
    if (!open) {
      setFileList([]);
      setNoteMap({});
      setSelectedCarrier(null);
      setCustomCarrier('');
      return;
    }
    form.resetFields();
  }, [open, form]);

  const handleCarrierChange = (value: string) => {
    setSelectedCarrier(value);
    if (value !== 'OTHER') {
      form.setFieldValue('shippingCarrierName', value);
      setCustomCarrier('');
    } else {
      form.setFieldValue('shippingCarrierName', '');
    }
  };

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

  const handleNoteChange = (uid: string, value: string) => {
    setNoteMap((prev) => ({
      ...prev,
      [uid]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      if (!selectedCarrier) {
        message.error(VI.provider.orders.validation.carrierSelectRequired);
        return;
      }

      if (fileList.length === 0) {
        message.error(VI.provider.orders.validation.imagesRequired);
        return;
      }

      const carrierName = resolveCarrierName(selectedCarrier, customCarrier);
      if (!carrierName) {
        message.error(VI.provider.orders.validation.carrierRequired);
        return;
      }

      const notes: string[] = [];
      const images: File[] = [];

      for (const file of fileList) {
        if (file.originFileObj) {
          images.push(file.originFileObj);
          notes.push(noteMap[file.uid] || '');
        }
      }

      await onSubmit({
        trackingCode: '',
        shippingCarrierName: carrierName,
        notes,
        images,
        autoCreateGhn: true,
      });
    } catch {
      // validation
    }
  };

  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    onChange: handleFileChange,
    beforeUpload: () => false,
    listType: 'picture-card',
    accept: 'image/*',
  };

  const formatFee = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

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
        <Form.Item label={VI.provider.orders.shipModal.carrierName} required>
          <Select
            placeholder={VI.provider.orders.shipModal.selectCarrier}
            options={[...SHIPPING_CARRIER_OPTIONS]}
            value={selectedCarrier}
            onChange={handleCarrierChange}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {hasCarrier && (
          <Alert
            type="info"
            showIcon
            className="mb-4"
            message={VI.provider.orders.shipModal.autoTrackingHint}
          />
        )}

        {hasCarrier && (
          <div className="mb-4 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
            <span className="font-medium text-foreground">
              {VI.provider.orders.shipModal.shippingFeeLabel}:{' '}
            </span>
            {feeLoading && (
              <span className="text-muted-foreground">{VI.provider.orders.shipModal.ghnFeeLoading}</span>
            )}
            {!feeLoading && fee != null && (
              <span className="font-semibold text-pink-600">{formatFee(fee)}</span>
            )}
            {!feeLoading && fee == null && (
              <span className="text-muted-foreground">
                {feeError ?? VI.provider.orders.shipModal.ghnFeeUnavailable}
              </span>
            )}
            {!feeLoading && fee != null && feeApproximate && (
              <p className="mt-1 text-xs text-amber-700">
                {VI.provider.orders.shipModal.shippingFeeApproximateHint}
              </p>
            )}
          </div>
        )}

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
