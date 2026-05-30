/**
 * ReturnOrderModal — cosplayer return shipment
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Select, Alert, QRCode, Spin } from 'antd';
import { Image as AntImage } from 'antd';
import { ImageIcon, RefreshCw, Smartphone } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';
import { SHIPPING_CARRIER_OPTIONS, resolveCarrierName } from '../constants/shippingCarriers';
import { useGhnShippingFee } from '../hooks/useGhnShippingFee';
import { useConfirmDeliverySession } from '../hooks/useConfirmDeliverySession';

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
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [customCarrier, setCustomCarrier] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    qrValue,
    previewImages,
    isListening,
    sessionLoading,
    sessionError,
    refreshSession,
    canRefreshQr,
    refreshCooldownLabel,
  } = useConfirmDeliverySession({ orderId, open });

  const hasCarrier = Boolean(selectedCarrier);
  const { fee, loading: feeLoading, error: feeError, approximate: feeApproximate } =
    useGhnShippingFee(open && hasCarrier ? orderId : null, 'return');

  useEffect(() => {
    if (!open) {
      setSelectedCarrier(null);
      setCustomCarrier('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedCarrier) {
      message.error(VI.profile.orders.validationReturn.carrierSelectRequired);
      return;
    }

    if (previewImages.length === 0) {
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

    for (const preview of previewImages) {
      const blobRes = await fetch(preview.url);
      const blob = await blobRes.blob();
      const ext = blob.type.includes('png') ? 'png' : 'jpg';
      images.push(
        new File([blob], `return-${preview.id}.${ext}`, {
          type: blob.type || 'image/jpeg',
        }),
      );
      notes.push('');
    }

    setSubmitting(true);
    try {
      await onSubmit({
        trackingCode: '',
        shippingCarrierName: carrierName,
        images,
        notes,
        autoCreateGhn: true,
      });
    } finally {
      setSubmitting(false);
    }
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
        <Button key="submit" type="primary" loading={loading || submitting} onClick={handleSubmit}>
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

        <div className="rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.18)]">
          <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-indigo-900/70">
            <Smartphone className="h-4 w-4 text-cosmate-pink" aria-hidden />
            {VI.profile.orders.confirmDeliveryQr.scanTitle}
          </div>

          <p className="mb-3 text-sm font-semibold leading-relaxed text-indigo-950/85">
            {VI.profile.orders.confirmDeliveryQr.intro}
          </p>

          <div className="flex flex-col items-center gap-3">
            {sessionError ? (
              <p className="text-center text-sm font-semibold text-rose-700">{sessionError}</p>
            ) : sessionLoading || !qrValue ? (
              <Spin />
            ) : (
              <div className="rounded-xl border-[3px] border-indigo-950 bg-white p-3 shadow-[4px_4px_0_0_rgba(30,27,75,0.15)]">
                <QRCode value={qrValue} size={180} bordered={false} />
              </div>
            )}

            <Button
              type="link"
              size="small"
              icon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={refreshSession}
              disabled={sessionLoading || !canRefreshQr}
              className="!font-semibold !text-indigo-800 disabled:!text-indigo-900/40"
            >
              {canRefreshQr
                ? VI.profile.orders.confirmDeliveryQr.refreshQr
                : VI.profile.orders.confirmDeliveryQr.refreshQrWait(refreshCooldownLabel ?? '')}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border-[3px] border-indigo-950/20 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-extrabold text-indigo-950">
              {VI.profile.orders.confirmDeliveryQr.previewTitle}
            </p>
            <span className="rounded-full border-2 border-indigo-950/25 bg-cosmate-soft-pink/40 px-2.5 py-0.5 text-xs font-bold text-indigo-950">
              {previewImages.length}
            </span>
          </div>

          {previewImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-950/25 bg-cosmate-soft-pink/15 px-4 py-8 text-center">
              {isListening ? (
                <Spin size="small" />
              ) : (
                <ImageIcon className="h-8 w-8 text-cosmate-mauve/60" aria-hidden />
              )}
              <p className="text-sm font-semibold text-indigo-900/70">
                {VI.profile.orders.confirmDeliveryQr.waitingImages}
              </p>
            </div>
          ) : (
            <AntImage.PreviewGroup>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {previewImages.map((img) => (
                  <li
                    key={img.id}
                    className="aspect-square overflow-hidden rounded-xl border-[2px] border-indigo-950/30 bg-slate-100"
                  >
                    <AntImage
                      src={img.url}
                      alt=""
                      className="!h-full !w-full !object-cover"
                      rootClassName="!h-full !w-full"
                    />
                  </li>
                ))}
              </ul>
            </AntImage.PreviewGroup>
          )}
        </div>

        <p className="text-xs text-slate-500">
          {VI.profile.orders.returnImages}: vui lòng quét QR bằng mobile để tải ảnh xác nhận tình trạng trang phục.
        </p>
      </div>
    </Modal>
  );
}
