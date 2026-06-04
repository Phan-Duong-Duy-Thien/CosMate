import { Modal, Tabs, Spin, Input } from 'antd'
import type { Costume, UpdateCostumeBasicInput, SurchargeUpdateInput, RentalOptionUpdateInput, SurchargeInput, RentalOptionInput, AccessoryInput, AccessoryUpdateInput } from '../../types'
import type { CostumeImage } from '../../api/costumeImages.api'
import EditBasicInfoForm from './EditBasicInfoForm'
import FeesTab from './FeesTab'
import ImagesTab from './ImagesTab'
import { VI } from '@/shared/i18n/vi'
import { AiTokenEmptyState } from '@/features/profile/components/AiTokenEmptyState'
import type { useAiTokenGate } from '@/features/profile/hooks/useAiTokenGate'

type AiTokenGateState = ReturnType<typeof useAiTokenGate>

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
  onDeleteSurcharge?: (id: number) => Promise<void>
  onDeleteRentalOption?: (id: number) => Promise<void>
  onDeleteAccessory?: (id: number) => Promise<void>
  onGenerateDescription: () => void
  aiTokenGate: AiTokenGateState
  isGeneratingDescription: boolean
  descriptionPrompt: string
  setDescriptionPrompt: (value: string) => void
  mainImages: CostumeImage[]
  detailImages: CostumeImage[]
  imagesLoading: boolean
  canDeleteMain: boolean
  deleting: number | null
  replacing: number | null
  uploading: boolean
  onDeleteDetail: (imageId: number) => void
  onReplaceMain: (imageId: number, file: File) => void
  onReplaceDetail: (imageId: number, file: File) => void
  onAddDetail: (file: File) => void
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
  onDeleteSurcharge,
  onDeleteRentalOption,
  onDeleteAccessory,
  // AI props unused in render but kept in signature/Props to avoid breaking parent components:
  // onGenerateDescription,
  // aiTokenGate,
  // isGeneratingDescription,
  // descriptionPrompt,
  // setDescriptionPrompt,
  mainImages,
  detailImages,
  imagesLoading,
  canDeleteMain,
  deleting,
  replacing,
  uploading,
  onDeleteDetail,
  onReplaceMain,
  onReplaceDetail,
  onAddDetail,
}: Props) {
  const tabItems = detail
    ? [
        {
          key: 'basic',
          label: VI.costumeRental.editCostume.basicInfoTab,
          children: (
            <div className="space-y-4">
              <EditBasicInfoForm
                initialValues={detail}
                onSubmit={onSubmitBasicInfo}
                loading={basicSubmitting}
                providerIdMissing={providerId === null}
              />
            </div>
          ),
        },
        {
          key: 'fees',
          label: VI.costumeRental.editCostume.feesTab,
          children: (
            <FeesTab
              surcharges={detail.surcharges ?? []}
              rentalOptions={[]}
              accessories={detail.accessories ?? []}
              numberOfItems={detail.numberOfItems ?? 1}
              hideRentalOptions
              onUpdateSurcharge={onUpdateSurcharge}
              onUpdateRentalOption={onUpdateRentalOption}
              onUpdateAccessory={onUpdateAccessory}
              onDeleteSurcharge={onDeleteSurcharge}
              onDeleteRentalOption={onDeleteRentalOption}
              onDeleteAccessory={onDeleteAccessory}
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
        {
          key: 'images',
          label: VI.costumeRental.editCostume.imagesTab,
          children: (
            <ImagesTab
              mainImages={mainImages}
              detailImages={detailImages}
              loading={imagesLoading}
              canDeleteMain={canDeleteMain}
              deleting={deleting}
              replacing={replacing}
              uploading={uploading}
              onDeleteDetail={onDeleteDetail}
              onReplaceMain={onReplaceMain}
              onReplaceDetail={onReplaceDetail}
              onAddDetail={onAddDetail}
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
        <div className="py-12 text-center text-muted-foreground">
          {VI.costumeRental.editCostume.loadError}
        </div>
      )}
    </Modal>
  )
}
