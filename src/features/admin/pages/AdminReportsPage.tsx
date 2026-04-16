import { Card, Col, Row, Statistic } from 'antd'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { useDynamicMenu } from '@/features/admin/hooks/useDynamicMenu'

export default function AdminReportsPage() {
  const { sidebarItems } = useDynamicMenu()

  return (
    <DashboardLayout title="Báo cáo hệ thống" sidebarItems={sidebarItems}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng user" value={0} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng provider" value={0} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng costume" value={0} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Doanh thu" value={0} /></Card></Col>
      </Row>
    </DashboardLayout>
  )
}
