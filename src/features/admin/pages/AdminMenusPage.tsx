import { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Switch, Popconfirm, Modal, Form, Input, Select } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  FolderOutlined,
  UploadOutlined, 
  DownloadOutlined, 
  FileExcelOutlined 
} from '@ant-design/icons';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { useDynamicMenu } from '../hooks/useDynamicMenu';
import { useMenuManagement } from '../hooks/useMenuManagement';

const routeOptions = [
  { 
    label: 'Khu vực Admin', 
    options: [
      { label: '/admin (Trang chủ Admin)', value: '/admin' },
      { label: '/admin/users (Quản lý User)', value: '/admin/users' },
      { label: '/admin/menus (Quản lý Menu)', value: '/admin/menus' },
    ]
  },
  { 
    label: 'Khu vực Provider Rental', 
    options: [
      { label: '/provider-rental (Trang chủ Provider)', value: '/provider-rental' },
      { label: '/provider-rental/costumes (Quản lý Trang phục)', value: '/provider-rental/costumes' },
      { label: '/provider-rental/orders (Quản lý Đơn thuê)', value: '/provider-rental/orders' },
      { label: '/provider/reviews (Đánh giá)', value: '/provider/reviews' },
    ]
  }
];

const iconOptions = [
  { label: '📁 Thư mục (Mặc định)', value: 'folder' },
  { label: '📊 Bảng điều khiển', value: 'dashboard' },
  { label: '👥 Người dùng', value: 'users' },
  { label: '🛍️ Đơn hàng / Dịch vụ', value: 'bookings' },
  { label: '👕 Trang phục', value: 'costumes' },
  { label: '📈 Báo cáo', value: 'reports' },
  { label: '⚙️ Cài đặt', value: 'settings' },
  { label: '📋 Quản lý Menu', value: 'menu' },
];

export default function AdminMenusPage() {
  const { sidebarItems } = useDynamicMenu();
  const { 
    menus, 
    loading: tableLoading, 
    handleToggleMenu, 
    handleCreateMenu, 
    handleDeleteMenu, 
    handleCreateMenuItem, 
    handleDeleteMenuItem, 
    isExporting, 
    isImporting, 
    handleExport, 
    handleDownloadTemplate, 
    handleImport 
  } = useMenuManagement();
  
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  
  const [formMenu] = Form.useForm();
  const [formItem] = Form.useForm();
  
  // Tham chiếu (ref) dùng cho input chọn file Excel ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tự refresh sidebar khi có data mới
  useEffect(() => {
    const handleMenuUpdate = () => {
      // Logic reload trang nhẹ nếu sidebar cần cập nhật
    };
    window.addEventListener('menuUpdated', handleMenuUpdate);
    return () => window.removeEventListener('menuUpdated', handleMenuUpdate);
  }, []);

  // Bảng Menu Cha
  const menuColumns = [
    { title: 'Tên Menu Nhóm', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Thứ tự hiển thị', dataIndex: 'displayOrder', key: 'displayOrder', width: 250 },
    {
      title: 'Hiển thị',
      key: 'isActive',
      render: (record: any) => (
        <Switch checked={record.isActive} onChange={() => handleToggleMenu(record.id)} />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button 
            type="dashed" 
            size="small" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedMenuId(record.id);
              formItem.resetFields();
              setIsItemModalOpen(true);
            }}
          >
            Thêm Link Con
          </Button>
          <Popconfirm title="Xóa toàn bộ nhóm Menu này?" onConfirm={() => handleDeleteMenu(record.id)}>
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Bảng Menu Item Con (Xổ xuống)
  const expandedRowRender = (menu: any) => {
    const itemColumns = [
      { title: 'Tên nút bấm (Label)', dataIndex: 'title', key: 'title', width: 250 },
      { title: 'Đường dẫn (URL)', dataIndex: 'url', key: 'url' },
      { title: 'Icon (Tên Lucide)', dataIndex: 'icon', key: 'icon', width: 150 },
      {
        title: 'Hành động',
        key: 'action',
        render: (record: any) => (
          <Space>
            <Popconfirm title="Xóa nút này khỏi Sidebar?" onConfirm={() => handleDeleteMenuItem(record.id)}>
              <Button type="text" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ];
    return <Table columns={itemColumns} dataSource={menu.menuItems || []} pagination={false} rowKey="id" size="small" />;
  };

  return (
    <DashboardLayout title="Quản lý cấu hình Sidebar" sidebarItems={sidebarItems} brandName="CosMate">
      
      {/* Thanh Công Cụ (Toolbar) */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button 
          type="primary" 
          icon={<FolderOutlined />} 
          onClick={() => {
            formMenu.resetFields();
            setIsMenuModalOpen(true);
          }}
        >
          Tạo Nhóm Menu Mới
        </Button>

        <Button icon={<FileExcelOutlined />} onClick={handleDownloadTemplate}>
          Tải File Mẫu
        </Button>

        <Button icon={<DownloadOutlined />} onClick={handleExport} loading={isExporting}>
          Xuất Excel
        </Button>

        <Button icon={<UploadOutlined />} loading={isImporting} onClick={() => fileInputRef.current?.click()}>
          Nhập Excel
        </Button>

        {/* Thẻ input ẩn để chọn file Excel */}
        <input 
          type="file" 
          ref={fileInputRef}
          accept=".xlsx, .xls, .csv" 
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImport(file);
              e.target.value = ''; // Reset lại giá trị để có thể chọn lại cùng 1 file
            }
          }}
        />
      </div>

      {/* Bảng Dữ Liệu */}
      <Table 
        columns={menuColumns} 
        expandable={{ expandedRowRender }}
        dataSource={menus} 
        rowKey="id" 
        loading={tableLoading}
        pagination={false}
      />

      {/* Form Tạo Nhóm Menu Cha */}
      <Modal
        title="Tạo Nhóm Menu (VD: Admin Menu)"
        open={isMenuModalOpen}
        onOk={() => formMenu.submit()}
        onCancel={() => setIsMenuModalOpen(false)}
      >
        <Form form={formMenu} layout="vertical" onFinish={(values) => {
          handleCreateMenu(values);
          setIsMenuModalOpen(false);
        }}>
          <Form.Item name="name" label="Tên nhóm Menu" rules={[{ required: true }]}>
            <Input placeholder="VD: Quản trị viên" />
          </Form.Item>
          <Form.Item name="displayOrder" label="Thứ tự xuất hiện" initialValue={1}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Form Tạo Link Con (Có Dropdown chọn URL) */}
      <Modal
        title="Thêm Nút Bấm vào Sidebar"
        open={isItemModalOpen}
        onOk={() => formItem.submit()}
        onCancel={() => setIsItemModalOpen(false)}
      >
        <Form form={formItem} layout="vertical" onFinish={(values) => {
          handleCreateMenuItem({ ...values, menuId: selectedMenuId });
          setIsItemModalOpen(false);
        }}>
          <Form.Item name="title" label="Tên hiển thị (Label)" rules={[{ required: true }]}>
            <Input placeholder="VD: Quản lý Người dùng" />
          </Form.Item>
          
          <Form.Item name="url" label="Chọn Đường dẫn (URL) khi click vào" rules={[{ required: true }]}>
            <Select 
              options={routeOptions} 
              placeholder="Chọn trang sẽ chuyển đến..."
              showSearch
            />
          </Form.Item>

          <Form.Item name="icon" label="Chọn Icon hiển thị">
            <Select options={iconOptions} placeholder="Chọn icon..." showSearch />
          </Form.Item>
          <Form.Item name="displayOrder" label="Thứ tự xuất hiện" initialValue={1}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

    </DashboardLayout>
  );
}