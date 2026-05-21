/**
 * Confirm delivery via mobile app (QR scan → upload on phone → confirm on web).
 */

import * as React from "react"
import { Modal, Button, QRCode, Spin } from "antd"
import { ImageIcon, RefreshCw, Smartphone } from "lucide-react"

import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"
import { useConfirmDeliverySession } from "../hooks/useConfirmDeliverySession"

interface ConfirmDeliveryModalProps {
  open: boolean
  orderId: number
  onCancel: () => void
  onSuccess: () => void
  onSubmittingChange?: (orderId: number | null) => void
}

export function ConfirmDeliveryModal({
  open,
  orderId,
  onCancel,
  onSuccess,
  onSubmittingChange,
}: ConfirmDeliveryModalProps) {
  const {
    qrValue,
    previewImages,
    isListening,
    sessionLoading,
    sessionError,
    refreshSession,
    confirmSession,
    isConfirming,
    canConfirm,
    canRefreshQr,
    refreshCooldownLabel,
    maxImages,
  } = useConfirmDeliverySession({ orderId, open })

  React.useEffect(() => {
    onSubmittingChange?.(isConfirming ? orderId : null)
  }, [isConfirming, orderId, onSubmittingChange])

  const runConfirm = async () => {
    const ok = await confirmSession()
    if (ok) onSuccess()
  }

  const handleConfirm = () => {
    if (previewImages.length > 0) {
      void runConfirm()
      return
    }

    Modal.confirm({
      title: VI.profile.orders.confirmDeliveryQr.noImagesWarningTitle,
      content: VI.profile.orders.confirmDeliveryQr.noImagesWarningContent,
      okText: VI.profile.orders.confirmDeliveryQr.noImagesWarningConfirm,
      cancelText: VI.profile.orders.confirmDeliveryQr.noImagesWarningCancel,
      okButtonProps: { className: "!rounded-lg !font-bold" },
      cancelButtonProps: { className: "!rounded-lg" },
      centered: true,
      onOk: () => runConfirm(),
    })
  }

  return (
    <Modal
      title={VI.profile.orders.actionConfirmDelivery}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {VI.common.actions.cancel}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isConfirming}
          disabled={!canConfirm || isConfirming}
          onClick={handleConfirm}
          className="!rounded-xl !font-bold"
        >
          {VI.profile.orders.actionConfirmDelivery}
        </Button>,
      ]}
      width={520}
      destroyOnClose
    >
      <div className="space-y-5">
        <p className="text-sm font-semibold leading-relaxed text-indigo-950/85">
          {VI.profile.orders.confirmDeliveryQr.intro}
        </p>

        <ol className="space-y-2 text-sm font-semibold text-indigo-950/90">
          {VI.profile.orders.confirmDeliveryQr.steps.map((step, index) => (
            <li key={step} className="flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-indigo-950 bg-cosmate-soft-pink/50 text-xs font-extrabold">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-center gap-3 rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.18)]">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-indigo-900/70">
            <Smartphone className="h-4 w-4 text-cosmate-pink" aria-hidden />
            {VI.profile.orders.confirmDeliveryQr.scanTitle}
          </div>

          {sessionError ? (
            <p className="text-center text-sm font-semibold text-rose-700">{sessionError}</p>
          ) : sessionLoading || !qrValue ? (
            <Spin />
          ) : (
            <div className="rounded-xl border-[3px] border-indigo-950 bg-white p-3 shadow-[4px_4px_0_0_rgba(30,27,75,0.15)]">
              <QRCode value={qrValue} size={200} bordered={false} />
            </div>
          )}

          <p className="text-center text-xs font-medium text-indigo-900/60">
            {VI.profile.orders.confirmDeliveryQr.appLoginHint}
          </p>

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
              : VI.profile.orders.confirmDeliveryQr.refreshQrWait(refreshCooldownLabel ?? "")}
          </Button>
        </div>

        <div className="rounded-2xl border-[3px] border-indigo-950/20 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-extrabold text-indigo-950">
              {VI.profile.orders.confirmDeliveryQr.previewTitle}
            </p>
            <span className="rounded-full border-2 border-indigo-950/25 bg-cosmate-soft-pink/40 px-2.5 py-0.5 text-xs font-bold text-indigo-950">
              {previewImages.length}/{maxImages}
            </span>
          </div>

          {previewImages.length === 0 ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-950/25",
                "bg-cosmate-soft-pink/15 px-4 py-8 text-center"
              )}
            >
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
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {previewImages.map((img) => (
                <li
                  key={img.id}
                  className="aspect-square overflow-hidden rounded-xl border-[2px] border-indigo-950/30 bg-slate-100"
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs font-medium text-indigo-900/55">{VI.profile.orders.confirmDeliveryQr.apiNote}</p>
      </div>
    </Modal>
  )
}
