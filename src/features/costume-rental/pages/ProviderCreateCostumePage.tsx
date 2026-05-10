/**
 * ProviderCreateCostumePage
 *
 * 2-phase wizard for creating a costume.
 * Rendered inside DashboardLayout (same as ProviderHomePage).
 *
 * Data flow: Page → Hook → Service → API → axiosInstance
 */

import { useNavigate } from 'react-router-dom'
import { notification, Steps, Spin } from 'antd'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout'
import { providerSidebarItems } from '@/features/provider/constants/sidebar'
import { useCreateCostumeWizard } from '../hooks/useCreateCostumeWizard'
import Phase1BasicInfoForm from '../components/create/Phase1BasicInfoForm'
import Phase2BuilderTabs from '../components/create/Phase2BuilderTabs'
import { useProviderGate } from '@/features/provider/hooks/useProviderGate'
import { useCurrentProviderProfile } from '@/features/provider/hooks/useCurrentProviderProfile'
import { ProviderActivationGate } from '@/features/provider/components/ProviderActivationGate'
import { VI } from '@/shared/i18n/vi'

export default function ProviderCreateCostumePage() {
  const navigate = useNavigate()
  const wizard = useCreateCostumeWizard()
  const gate = useProviderGate()
  const { provider, loading: providerLoading } = useCurrentProviderProfile()

  const sidebarItems: DashboardSidebarItem[] = providerSidebarItems.map((item) => {
    const Icon = item.icon
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    }
  })

  const handlePhase2Finish = async () => {
    try {
      await wizard.handlePhase2Submit()
      notification.success({
        message: 'Tạo trang phục thành công!',
        description: 'Trang phục đã được lưu. Hệ thống đang định hình trang phục cho việc search hình ảnh.',
      })
      navigate('/provider-rental/costumes')
    } catch {
      // error already set in hook
    }
  }

  return (
    <DashboardLayout
      title="Tạo trang phục mới"
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName="CosMate Provider"
    >
      {gate.profileLoading && (
        <div className="py-20 text-center">
          <Spin size="large" />
          <p className="mt-4 text-muted-foreground">{VI.provider.activation.loadingProfile}</p>
        </div>
      )}

      {!gate.profileLoading && gate.verified === false && (
        <ProviderActivationGate
          plans={gate.plans}
          plansLoading={gate.plansLoading}
          plansError={gate.plansError}
          selectedPlanId={gate.selectedPlanId}
          onSelectPlan={gate.setSelectedPlanId}
          selectedMethod={gate.selectedMethod}
          onSelectMethod={gate.setSelectedMethod}
          onSubscribe={gate.handleSubscribe}
          subscribing={gate.subscribing}
          subscribeError={gate.subscribeError}
        />
      )}

      {!gate.profileLoading && gate.verified === true && (
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
            Đăng trang phục mới
          </h2>

          <div className="mx-auto w-full max-w-4xl">
            <Steps
              current={wizard.phase - 1}
              className="mb-8"
              items={[
                { title: 'Thông tin cơ bản' },
                { title: 'Phụ phí & Gói thuê' },
              ]}
            />

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {wizard.phase === 1 && (
                <Phase1BasicInfoForm
                  onSubmit={(values) => {
                    if (!provider?.id) {
                      notification.error({
                        message: 'Không thể xác định Provider',
                        description: 'Vui lòng tải lại hồ sơ Provider hoặc đăng nhập lại.',
                      })
                      return Promise.resolve()
                    }
                    return wizard.handlePhase1Submit({ ...values, providerId: provider.id })
                  }}
                  loading={wizard.isPhase1Loading}
                  error={wizard.phase1Error}
                  disabled={wizard.isPhase1Loading || providerLoading || !provider?.id}
                />
              )}

              {wizard.phase === 2 && (
                <Phase2BuilderTabs
                  surcharges={wizard.surcharges}
                  accessories={wizard.accessories}
                  rentalOptions={wizard.rentalOptions}
                  numberOfItems={wizard.numberOfItems}
                  onAddSurcharge={wizard.addSurcharge}
                  onUpdateSurcharge={wizard.updateSurcharge}
                  onRemoveSurcharge={wizard.removeSurcharge}
                  onAddAccessory={wizard.addAccessory}
                  onUpdateAccessory={wizard.updateAccessory}
                  onRemoveAccessory={wizard.removeAccessory}
                  onAddRentalOption={wizard.addRentalOption}
                  onUpdateRentalOption={wizard.updateRentalOption}
                  onRemoveRentalOption={wizard.removeRentalOption}
                  onFinish={handlePhase2Finish}
                  loading={wizard.isPhase2Loading}
                  error={wizard.phase2Error}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
