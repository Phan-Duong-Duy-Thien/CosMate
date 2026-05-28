/**
 * ReturnOrderModal — cosplayer return shipment
 */

import { useState, useEffect } from 'react';
import { Modal, Upload, Button, Input, message, Select, Alert } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { VI } from '@/shared/i18n/vi';
import { SHIPPING_CARRIER_OPTIONS, resolveCarrierName } from '../constants/shippingCarriers';
import { useGhnShippingFee } from '../hooks/useGhnShippingFee';

export interface ReturnOrderSubmitData {
  trackingCode: string;
  shippingCarrierName: string;
  images: File[];
  notes: string[];
  autoCreateGhn: boolean;
}

interface ReturnOrderModalProps {
  open: boolean;
  orderId: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: ReturnOrderSubmitData) => Promise<void>;
}

export function ReturnOrderModal({ open, orderId, loading, onCancel, onSubmit }: ReturnOrderModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [customCarrier, setCustomCarrier] = useState('');

  const hasCarrier = Boolean(selectedCarrier);
  const { fee, loading: feeLoading, error: feeError, approximate: feeApproximate } =
    useGhnShippingFee(open && hasCarrier ? orderId : null, 'return');

  useEffect(() => {
    if (!open) {
      setFileList([]);
      setSelectedCarrier(null);
      setCustomCarrier('');
    }
  }, [open]);

  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    if (!selectedCarrier) {
      message.error(VI.profile.orders.validationReturn.carrierSelectRequired);
      return;
    }

    if (fileList.length === 0) {
      message.error(VI.profile.orders.validationReturn.imagesRequired);
      return;
    }

    const carrierName = resolveCarrierName(selectedCarrier, customCarrier);
    if (!carrierName) {
      message.error(VI.provider.orders.validation.carrierRequired);
      return;
    }

    const images: File[] = [];
    const notes: string[] = [];

    for (const file of fileList) {
      if (file.originFileObj) {
        images.push(file.originFileObj);
        notes.push('');
      }
    }

    await onSubmit({
      trackingCode: '',
      shippingCarrierName: carrierName,
      images,
      notes,
      autoCreateGhn: true,
    });
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
      width={520}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {VI.profile.orders.returnCarrierName}
          </label>
          <Select
            placeholder={VI.profile.orders.returnSelectCarrier}
            options={[...SHIPPING_CARRIER_OPTIONS]}
            value={selectedCarrier}
            onChange={(value) => setSelectedCarrier(value)}
            style={{ width: '100%' }}
          />
        </div>

        {hasCarrier && (
          <Alert type="info" showIcon message={VI.profile.orders.returnAutoTrackingHint} />
        )}

        {hasCarrier && (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
            <span className="font-medium">{VI.provider.orders.shipModal.shippingFeeLabel}: </span>
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
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {VI.provider.orders.shipModal.carrierNameOther}
            </label>
            <Input
              placeholder={VI.provider.orders.shipModal.carrierNameOtherPlaceholder}
              value={customCarrier}
              onChange={(e) => setCustomCarrier(e.target.value)}
            />
          </div>
        )}

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
