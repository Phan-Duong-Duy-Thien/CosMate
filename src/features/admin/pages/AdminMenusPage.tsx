import { useState, useRef } from 'react';
import { Table, Button, Space, Switch, Popconfirm, Modal, Form, Input, Select, Tag, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, FolderOutlined, ReloadOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button as UiButton } from '@/components/ui/button';
import { useMenuManagement } from '../hooks/useMenuManagement';

const routeOptions = [
  { label: 'Khu vực Admin', options: [
    { label: '/admin (Trang chủ Admin)', value: '/admin' },
    { label: '/admin/users (Quản lý User)', value: '/admin/users' },
    { label: '/admin/providers (Quản lý Provider)', value: '/admin/providers' },
    { label: '/admin/costumes (Quản lý Trang phục)', value: '/admin/costumes' },
    { label: '/admin/orders (Quản lý Đơn hàng)', value: '/admin/orders' },
    { label: '/admin/reports (Báo cáo)', value: '/admin/reports' },
    { label: '/admin/characters (Quản lý Nhân vật)', value: '/admin/characters' },
    { label: '/admin/character-requests (Yêu cầu thêm nhân vật)', value: '/admin/character-requests' },
    { label: '/admin/audit-logs (Nhật ký hệ thống)', value: '/admin/audit-logs' },
    { label: '/admin/subscription-plans (Gói đăng ký)', value: '/admin/subscription-plans' },
    { label: '/admin/ai-token-purchases (Lịch sử mua AI Token)', value: '/admin/ai-token-purchases' },
    { label: '/admin/menus (Quản lý menu)', value: '/admin/menus' },
  ]},
];

const iconOptions = [
  { label: '📁 Thư mục (Mặc định)', value: 'folder' },
  { label: '📊 Bảng điều khiển', value: 'dashboard' },
  { label: '👥 Người dùng', value: 'users' },
  { label: '📋 Quản lý Menu', value: 'menu' },
  { label: '🛍️ Đơn hàng', value: 'bookings' },
  { label: '👕 Trang phục', value: 'costumes' },
  { label: '📈 Báo cáo', value: 'reports' },
  { label: '💳 Gói đăng ký', value: 'subscription' },
  { label: '🪙 Token / Lịch sử mua', value: 'coins' },
];

export default function AdminMenusPage() {
  const {
    menus,
    loading: tableLoading,
    fetchMenus,
    handleToggleMenu,
    handleCreateMenu,
    handleDeleteMenu,
    handleCreateMenuItem,
    handleDeleteMenuItem,
    handleImport,
    isExporting,
    isImporting,
    handleExport,
    handleDownloadTemplate,
  } = useMenuManagement();
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [formMenu] = Form.useForm();
  const [formItem] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuColumns = [
    { title: 'Tên Menu Nhóm', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Thứ tự hiển thị', dataIndex: 'displayOrder', key: 'displayOrder', width: 160 },
    { title: 'Hiển thị', key: 'isActive', render: (record: { id: string; isActive: boolean }) => (
        <Switch checked={record.isActive} onChange={() => handleToggleMenu(record.id)} />
      ),
    },
    { title: 'Loại', key: 'scope', render: () => <Tag color="blue">Admin only</Tag> },
    { title: 'Hành động', key: 'action', render: (record: { id: string }) => (
        <Space>
          <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => { setSelectedMenuId(record.id); formItem.resetFields(); setIsItemModalOpen(true); }}>Thêm Link Con</Button>
          <Popconfirm title="Xóa toàn bộ nhóm Menu này?" onConfirm={() => handleDeleteMenu(record.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (menu: { id: string; menuItems?: unknown[] }) => {
    const itemColumns = [
      { title: 'Tên nút bấm (Label)', dataIndex: 'title', key: 'title', width: 250 },
      { title: 'Đường dẫn (URL)', dataIndex: 'url', key: 'url' },
      { title: 'Icon (Tên Lucide)', dataIndex: 'icon', key: 'icon', width: 150 },
      { title: 'Hành động', key: 'action', render: (record: { id: string }) => (
          <Space>
            <Popconfirm title="Xóa nút này khỏi Sidebar?" onConfirm={() => handleDeleteMenuItem(record.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} /></Popconfirm>
          </Space>
        ),
      },
    ];
    return <Table columns={itemColumns} dataSource={menu.menuItems || []} pagination={false} rowKey="id" size="small" />;
  };

  return (
    <div className="flex h-full w-full flex-col">
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls, .csv"
        className="hidden"
        title="Nhập Excel menu"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImport(file);
            e.target.value = '';
          }
        }}
      />

      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Quản lý menu sidebar</h2>

          <div className="flex flex-wrap gap-2">
            <UiButton variant="cosmateOutline" disabled={tableLoading} onClick={() => void fetchMenus()}>
              <ReloadOutlined className={tableLoading ? 'animate-spin' : ''} />
              Làm mới
            </UiButton>
            <UiButton variant="cosmateOutline" disabled={isExporting} onClick={() => void handleExport()}>
              <DownloadOutlined /> Xuất Excel
            </UiButton>
            <UiButton variant="cosmateOutline" onClick={() => void handleDownloadTemplate()}>
              <DownloadOutlined /> Tải file mẫu
            </UiButton>
            <UiButton variant="cosmateOutline" disabled={isImporting} onClick={() => fileInputRef.current?.click()}>
              <UploadOutlined /> Nhập Excel
            </UiButton>
            <UiButton variant="cosmate" onClick={() => { formMenu.resetFields(); setIsMenuModalOpen(true); }}>
              <FolderOutlined /> Tạo nhóm menu
            </UiButton>
          </div>
        </div>
      </div>

      <Alert
        type="info"
        showIcon
        className="mb-4"
        message="Import / Export Excel có thể báo lỗi nếu backend chưa bật API tương ứng."
      />

      <Table
        columns={menuColumns}
        expandable={{ expandedRowRender }}
        dataSource={menus}
        rowKey="id"
        loading={tableLoading}
        pagination={false}
      />

      <Modal title="Tạo Nhóm Menu Admin" open={isMenuModalOpen} onOk={() => formMenu.submit()} onCancel={() => setIsMenuModalOpen(false)}>
        <Form form={formMenu} layout="vertical" onFinish={(values) => { handleCreateMenu(values); setIsMenuModalOpen(false); }}>
          <Form.Item name="name" label="Tên nhóm Menu" rules={[{ required: true }]}><Input placeholder="VD: Quản trị viên" /></Form.Item>
          <Form.Item name="displayOrder" label="Thứ tự xuất hiện" initialValue={1}><Input type="number" /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Thêm Nút Bấm vào Sidebar" open={isItemModalOpen} onOk={() => formItem.submit()} onCancel={() => setIsItemModalOpen(false)}>
        <Form form={formItem} layout="vertical" onFinish={(values) => { handleCreateMenuItem({ ...values, menuId: selectedMenuId }); setIsItemModalOpen(false); }}>
          <Form.Item name="title" label="Tên hiển thị (Label)" rules={[{ required: true }]}><Input placeholder="VD: Quản lý Người dùng" /></Form.Item>
          <Form.Item name="url" label="Chọn Đường dẫn (URL) khi click vào" rules={[{ required: true }]}><Select options={routeOptions} placeholder="Chọn trang sẽ chuyển đến..." showSearch /></Form.Item>
          <Form.Item name="icon" label="Chọn Icon hiển thị"><Select options={iconOptions} placeholder="Chọn icon..." showSearch /></Form.Item>
          <Form.Item name="displayOrder" label="Thứ tự xuất hiện" initialValue={1}><Input type="number" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
