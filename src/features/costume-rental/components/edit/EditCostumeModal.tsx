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
import type { Costume, UpdateCostumeBasicInput, SurchargeUpdateInput, RentalOptionUpdateInput, SurchargeInput, RentalOptionInput, AccessoryInput, AccessoryUpdateInput } from '../../types'
import EditBasicInfoForm from './EditBasicInfoForm'
import FeesTab from './FeesTab'
import { VI } from '@/shared/i18n/vi'

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
  createSurchargeModalOpen: boolean
  setCreateSurchargeModalOpen: (open: boolean) => void
  createRentalOptionModalOpen: boolean
  setCreateRentalOptionModalOpen: (open: boolean) => void
  onCreateSurcharge: (values: SurchargeInput) => Promise<void>
  onCreateRentalOption: (values: RentalOptionInput) => Promise<void>
  accessorySubmitting: boolean
  createAccessoryModalOpen: boolean
  setCreateAccessoryModalOpen: (open: boolean) => void
  onCreateAccessory: (values: AccessoryInput) => Promise<void>
  onUpdateAccessory: (id: number, values: AccessoryUpdateInput) => Promise<void>
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
  createSurchargeModalOpen,
  setCreateSurchargeModalOpen,
  createRentalOptionModalOpen,
  setCreateRentalOptionModalOpen,
  onCreateSurcharge,
  onCreateRentalOption,
  accessorySubmitting,
  createAccessoryModalOpen,
  setCreateAccessoryModalOpen,
  onCreateAccessory,
  onUpdateAccessory,
}: Props) {
  const tabItems = detail
    ? [
        {
          key: 'basic',
          label: VI.costumeRental.editCostume.basicInfoTab,
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
          label: VI.costumeRental.editCostume.feesTab,
          children: (
            <FeesTab
              surcharges={detail.surcharges ?? []}
              rentalOptions={detail.rentalOptions ?? []}
              accessories={detail.accessories ?? []}
              onUpdateSurcharge={onUpdateSurcharge}
              onUpdateRentalOption={onUpdateRentalOption}
              onUpdateAccessory={onUpdateAccessory}
              surchargeSubmitting={surchargeSubmitting}
              rentalOptionSubmitting={rentalOptionSubmitting}
              accessorySubmitting={accessorySubmitting}
              createSurchargeModalOpen={createSurchargeModalOpen}
              setCreateSurchargeModalOpen={setCreateSurchargeModalOpen}
              createRentalOptionModalOpen={createRentalOptionModalOpen}
              setCreateRentalOptionModalOpen={setCreateRentalOptionModalOpen}
              createAccessoryModalOpen={createAccessoryModalOpen}
              setCreateAccessoryModalOpen={setCreateAccessoryModalOpen}
              onCreateSurcharge={onCreateSurcharge}
              onCreateRentalOption={onCreateRentalOption}
              onCreateAccessory={onCreateAccessory}
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
      title={VI.costumeRental.editCostume.title}
      width={760}
      destroyOnClose
    >
      {detailLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin tip={VI.costumeRental.editCostume.loadingDetail} />
        </div>
      )}

      {!detailLoading && detail && (
        <Tabs defaultActiveKey="basic" items={tabItems} />
      )}

      {!detailLoading && !detail && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
          {VI.costumeRental.editCostume.loadError}
        </div>
      )}
    </Modal>
  )
}
