/**
 * EditCostumeModal
 *
 * Modal with 2 tabs:
 *   A) Basic Info  – EditBasicInfoForm
 *   B) Phụ phí & Gói thuê – FeesTab
 *
 * UI-only orchestrator. Receives all state/handlers from useEditCostumeModal hook.
 * Never calls API directly.
 */

import { Modal, Tabs, Spin } from 'antd'
import type { Costume, UpdateCostumeBasicInput, SurchargeUpdateInput, RentalOptionUpdateInput } from '../../types'
import EditBasicInfoForm from './EditBasicInfoForm'
import FeesTab from './FeesTab'

interface Props {
  open: boolean
  detail: Costume | null
  detailLoading: boolean
  providerId: number | null
  basicSubmitting: boolean
  surchargeSubmitting: boolean
  rentalOptionSubmitting: boolean
  onClose: () => void
  onSubmitBasicInfo: (values: UpdateCostumeBasicInput) => Promise<void>
  onUpdateSurcharge: (id: number, values: SurchargeUpdateInput) => Promise<void>
  onUpdateRentalOption: (id: number, values: RentalOptionUpdateInput) => Promise<void>
}

export default function EditCostumeModal({
  open,
  detail,
  detailLoading,
  providerId,
  basicSubmitting,
  surchargeSubmitting,
  rentalOptionSubmitting,
  onClose,
  onSubmitBasicInfo,
  onUpdateSurcharge,
  onUpdateRentalOption,
}: Props) {
  const tabItems = detail
    ? [
        {
          key: 'basic',
          label: 'Thông tin cơ bản',
          children: (
            <EditBasicInfoForm
              initialValues={detail}
              onSubmit={onSubmitBasicInfo}
              loading={basicSubmitting}
              providerIdMissing={providerId === null}
            />
          ),
        },
        {
          key: 'fees',
          label: 'Phụ phí & Gói thuê',
          children: (
            <FeesTab
              surcharges={detail.surcharges ?? []}
              rentalOptions={detail.rentalOptions ?? []}
              onUpdateSurcharge={onUpdateSurcharge}
              onUpdateRentalOption={onUpdateRentalOption}
              surchargeSubmitting={surchargeSubmitting}
              rentalOptionSubmitting={rentalOptionSubmitting}
            />
          ),
        },
      ]
    : []

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chỉnh sửa trang phục"
      width={760}
      destroyOnClose
    >
      {detailLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      )}

      {!detailLoading && detail && (
        <Tabs defaultActiveKey="basic" items={tabItems} />
      )}

      {!detailLoading && !detail && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
          Không thể tải dữ liệu trang phục.
        </div>
      )}
    </Modal>
  )
}
