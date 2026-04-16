import { Button, Input, Table, Tag, Space, Drawer, Descriptions } from 'antd'
import type { TableProps } from 'antd'
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { useDynamicMenu } from '@/features/admin/hooks/useDynamicMenu'

interface OrderRow {
  id: number
  code?: string
  userName?: string
  providerName?: string
  status?: string
  total?: number
}

export default function AdminOrdersPage() {
  const { sidebarItems } = useDynamicMenu()
  const [selected, setSelected] = useState<OrderRow | null>(null)
  const [open, setOpen] = useState(false)

  const columns: TableProps<OrderRow>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Mã đơn', dataIndex: 'code' },
    { title: 'Khách', dataIndex: 'userName' },
    { title: 'Provider', dataIndex: 'providerName' },
    { title: 'Tổng', dataIndex: 'total' },
    { title: 'Trạng thái', dataIndex: 'status', render: (v) => <Tag>{v ?? '—'}</Tag> },
    { title: 'Hành động', render: (_, r) => <Button icon={<EyeOutlined />} onClick={() => { setSelected(r); setOpen(true) }}>Chi tiết</Button> },
  ]

  return (
    <DashboardLayout title="Quản lý đơn hàng" sidebarItems={sidebarItems}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Tìm đơn hàng" />
          <Button icon={<ReloadOutlined />}>Làm mới</Button>
        </div>
        <Table rowKey="id" columns={columns} dataSource={[]} />
        <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết đơn hàng" width={560}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selected?.id}</Descriptions.Item>
            <Descriptions.Item label="Mã đơn">{selected?.code ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Khách">{selected?.userName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Provider">{selected?.providerName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Tổng">{selected?.total ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selected?.status ?? '—'}</Descriptions.Item>
          </Descriptions>
        </Drawer>
      </div>
    </DashboardLayout>
  )
}
