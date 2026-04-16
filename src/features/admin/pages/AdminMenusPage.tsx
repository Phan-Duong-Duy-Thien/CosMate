import { useState, useRef } from 'react';
import { Table, Button, Space, Switch, Popconfirm, Modal, Form, Input, Select, Tag, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { useMenuManagement } from '../hooks/useMenuManagement';


const routeOptions = [
  { label: 'Khu vực Admin', options: [
    { label: '/admin (Trang chủ Admin)', value: '/admin' },
    { label: '/admin/users (Quản lý User)', value: '/admin/users' },
    { label: '/admin/providers (Quản lý Provider)', value: '/admin/providers' },
    { label: '/admin/costumes (Quản lý Trang phục)', value: '/admin/costumes' },
    { label: '/admin/orders (Quản lý Đơn hàng)', value: '/admin/orders' },
    { label: '/admin/reports (Báo cáo)', value: '/admin/reports' },
    { label: '/admin/audit-logs (Nhật ký hệ thống)', value: '/admin/audit-logs' },
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
];

export default function AdminMenusPage() {
  const { menus, loading: tableLoading, handleToggleMenu, handleCreateMenu, handleDeleteMenu, handleCreateMenuItem, handleDeleteMenuItem, handleImport } = useMenuManagement();
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [formMenu] = Form.useForm();
  const [formItem] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuColumns = [
    { title: 'Tên Menu Nhóm', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Thứ tự hiển thị', dataIndex: 'displayOrder', key: 'displayOrder', width: 160 },
    { title: 'Hiển thị', key: 'isActive', render: (record: any) => <Switch checked={record.isActive} onChange={() => handleToggleMenu(record.id)} /> },
    { title: 'Loại', key: 'scope', render: () => <Tag color="blue">Admin only</Tag> },
    { title: 'Hành động', key: 'action', render: (record: any) => (
        <Space>
          <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => { setSelectedMenuId(record.id); formItem.resetFields(); setIsItemModalOpen(true); }}>Thêm Link Con</Button>
          <Popconfirm title="Xóa toàn bộ nhóm Menu này?" onConfirm={() => handleDeleteMenu(record.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (menu: any) => {
    const itemColumns = [
      { title: 'Tên nút bấm (Label)', dataIndex: 'title', key: 'title', width: 250 },
      { title: 'Đường dẫn (URL)', dataIndex: 'url', key: 'url' },
      { title: 'Icon (Tên Lucide)', dataIndex: 'icon', key: 'icon', width: 150 },
      { title: 'Hành động', key: 'action', render: (record: any) => (
          <Space>
            <Popconfirm title="Xóa nút này khỏi Sidebar?" onConfirm={() => handleDeleteMenuItem(record.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} /></Popconfirm>
          </Space>
        ),
      },
    ];
    return <Table columns={itemColumns} dataSource={menu.menuItems || []} pagination={false} rowKey="id" size="small" />;
  };

  return (
    <div className="space-y-4">

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button type="primary" icon={<FolderOutlined />} onClick={() => { formMenu.resetFields(); setIsMenuModalOpen(true); }}>Tạo Nhóm Menu Mới</Button>
        <input type="file" ref={fileInputRef} accept=".xlsx, .xls, .csv" style={{ display: 'none' }} onChange={(e) => { const file = e.target.files?.[0]; if (file) { handleImport(file); e.target.value = ''; } }} />
      </div>

      <Table columns={menuColumns} expandable={{ expandedRowRender }} dataSource={menus} rowKey="id" loading={tableLoading} pagination={false} />

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
