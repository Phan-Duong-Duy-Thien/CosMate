import { Button, Input, Table, Tag, Space, Drawer, Descriptions, message } from 'antd'
import type { TableProps } from 'antd'
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout'
import { useDynamicMenu } from '@/features/admin/hooks/useDynamicMenu'

interface ProviderRow {
  id: number
  name: string
  email?: string
  phone?: string
  status?: string
  verified?: boolean
}

export default function AdminProvidersPage() {
  const { sidebarItems } = useDynamicMenu()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ProviderRow | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<ProviderRow[]>([])

  useEffect(() => {
    setRows([])
  }, [])

  const filtered = useMemo(() => rows.filter((r) => `${r.name} ${r.email ?? ''}`.toLowerCase().includes(search.toLowerCase())), [rows, search])

  const columns: TableProps<ProviderRow>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Nhà cung cấp', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value) => <Tag color={value === 'ACTIVE' ? 'green' : 'default'}>{value ?? '—'}</Tag>,
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => { setSelected(record); setOpen(true) }}>Chi tiết</Button>
        </Space>
      ),
    },
  ]

  return (
    <DashboardLayout title="Quản lý Provider" sidebarItems={sidebarItems as DashboardSidebarItem[]}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Tìm provider" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button icon={<ReloadOutlined />} loading={loading} onClick={() => message.info('Chưa có API list provider riêng, đang dùng khung trang quản lý.')}>Làm mới</Button>
        </div>
        <Table rowKey="id" columns={columns} dataSource={filtered} loading={loading} />
        <Drawer open={open} onClose={() => setOpen(false)} title="Chi tiết provider" width={520}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selected?.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{selected?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected?.email ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{selected?.phone ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selected?.status ?? '—'}</Descriptions.Item>
          </Descriptions>
        </Drawer>
      </div>
    </DashboardLayout>
  )
}
