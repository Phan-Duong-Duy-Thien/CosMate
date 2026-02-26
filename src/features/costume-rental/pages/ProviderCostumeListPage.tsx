/**
 * ProviderCostumeListPage
 *
 * Placeholder list page for provider's own costumes.
 * Rendered inside DashboardLayout (same pattern as ProviderHomePage).
 *
 * TODO: Replace mock data with real API call via hook → service → API.
 */

import { Button, Table, Tag, Typography, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout'
import { providerSidebarItems } from '@/features/provider/constants/sidebar'

const { Title } = Typography

// Minimal placeholder columns
const columns = [
  {
    title: 'Tên trang phục',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Kích cỡ',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Giá / ngày',
    dataIndex: 'pricePerDay',
    key: 'pricePerDay',
    render: (v: number) => `${v.toLocaleString('vi-VN')} VNĐ`,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => (
      <Tag color={s === 'active' ? 'green' : 'default'}>
        {s === 'active' ? 'Đang hoạt động' : 'Nháp'}
      </Tag>
    ),
  },
]

// Placeholder data – replace with real API data when ready
const placeholderData = [
  { key: '1', name: 'Ví dụ: Trang phục Naruto', size: 'M', pricePerDay: 150000, status: 'active' },
  { key: '2', name: 'Ví dụ: Trang phục Goku', size: 'L', pricePerDay: 200000, status: 'draft' },
]

export default function ProviderCostumeListPage() {
  const navigate = useNavigate()

  const sidebarItems: DashboardSidebarItem[] = providerSidebarItems.map((item) => {
    const Icon = item.icon
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    }
  })

  return (
    <DashboardLayout
      title="Danh sách trang phục"
      sidebarItems={sidebarItems}
      brandName="CosMate Provider"
    >
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3}style={{ margin: 0 }}>Danh sách trang phục</Title>
        <Space>
          <Button
            type="primary"
            onClick={() => navigate('/provider-rental/costumes/create')}
          >
            + Tạo trang phục mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={placeholderData}
        pagination={{ pageSize: 10 }}
        bordered={false}
        style={{ borderRadius: 8 }}
      />
    </DashboardLayout>
  )
}
