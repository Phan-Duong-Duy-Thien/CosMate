import { Button, Input, Table, Tag, Space, Drawer, Descriptions } from 'antd'
import type { TableProps } from 'antd'
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { useDynamicMenu } from '@/features/admin/hooks/useDynamicMenu'

interface CostumeRow {
  id: number
  name: string
  providerName?: string
  status?: string
  pricePerDay?: number
}

export default function AdminCostumesPage() {
  const { sidebarItems } = useDynamicMenu()
  const [selected, setSelected] = useState<CostumeRow | null>(null)
  const [open, setOpen] = useState(false)

  const columns: TableProps<CostumeRow>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Provider', dataIndex: 'providerName' },
    { title: 'Giá / ngày', dataIndex: 'pricePerDay' },
    { title: 'Trạng thái', dataIndex: 'status', render: (v) => <Tag>{v ?? '—'}</Tag> },
    { title: 'Hành động', render: (_, r) => <Button icon={<EyeOutlined />} onClick={() => { setSelected(r); setOpen(true) }}>Chi tiết</Button> },
  ]

  return (
    <DashboardLayout title="Quản lý trang phục" sidebarItems={sidebarItems}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Tìm trang phục" />
          <Button icon={<ReloadOutlined />}>Làm mới</Button>
        </div>
        <Table rowKey="id" columns={columns} dataSource={[]} />
        <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết trang phục" width={560}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selected?.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{selected?.name}</Descriptions.Item>
            <Descriptions.Item label="Provider">{selected?.providerName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Giá / ngày">{selected?.pricePerDay ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selected?.status ?? '—'}</Descriptions.Item>
          </Descriptions>
        </Drawer>
      </div>
    </DashboardLayout>
  )
}
