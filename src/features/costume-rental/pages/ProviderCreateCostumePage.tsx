/**
 * ProviderCreateCostumePage
 *
 * 2-phase wizard for creating a costume.
 * Rendered inside DashboardLayout (same as ProviderHomePage).
 *
 * Data flow: Page → Hook → Service → API → axiosInstance
 */

import { useNavigate } from 'react-router-dom'
import { notification, Steps, Typography, Row, Col, Card } from 'antd'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import type { DashboardSidebarItem }from '@/app/layouts/DashboardLayout'
import { providerSidebarItems } from '@/features/provider/constants/sidebar'
import { useCreateCostumeWizard } from '../hooks/useCreateCostumeWizard'
import Phase1BasicInfoForm from '../components/create/Phase1BasicInfoForm'
import Phase2BuilderTabs from '../components/create/Phase2BuilderTabs'

const { Title } = Typography

export default function ProviderCreateCostumePage() {
  const navigate = useNavigate()
  const wizard = useCreateCostumeWizard()

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
        description: 'Trang phục đã được lưu cùng toàn bộ thông tin bổ sung.',
      })
      navigate('/provider-rental/costumes')
    }catch {
      // error already set in hook
    }
  }

  return (
    <DashboardLayout
      title="Đăng trang phục mới"
      sidebarItems={sidebarItems}
      brandName="CosMate Provider"
    >
      <Row justify="center">
        <Col xs={24}sm={22}md={20} lg={18} xl={16}>
          <Title level={3}style={{ marginBottom: 24 }}>
            Đăng trang phục mới
          </Title>

          <Steps
            current={wizard.phase - 1}
            style={{ marginBottom: 32 }}
            items={[
              { title: 'Thông tin cơ bản' },
              { title: 'Phụ phí & Gói thuê' },
            ]}
          />

          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {wizard.phase === 1 && (
              <Phase1BasicInfoForm
                onSubmit={wizard.handlePhase1Submit}
                loading={wizard.isPhase1Loading}
                error={wizard.phase1Error}
                disabled={wizard.isPhase1Loading}
              />
            )}

            {wizard.phase === 2 && (
              <Phase2BuilderTabs
                surcharges={wizard.surcharges}
                accessories={wizard.accessories}
                rentalOptions={wizard.rentalOptions}
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
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
