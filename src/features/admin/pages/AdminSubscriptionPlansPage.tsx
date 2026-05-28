import { useState } from 'react';
import {
  Table,
  Select,
  Tag,
  Empty,
  Input,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  Switch,
  Row,
  Col,
  Tooltip,
} from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useAdminSubscriptionPlans } from '../hooks/useAdminSubscriptionPlans';
import type { AdminSubscriptionPlan } from '../types';
import { formatBillingCycleMonths } from '../utils/formatBillingCycleMonths';
import { AdminDetailEyeIcon } from '../components/AdminDetailEyeIcon';
import { AdminSubscriptionPlanDetailModal } from '../components/AdminSubscriptionPlanDetailModal';

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(
    value
  );

/** Giá trị form → payload API (billingCycle + cycleMonths) */
const CREATE_CYCLE_PRESETS = [
  { label: '1 tháng', value: 'm1', billingCycle: 'monthly', cycleMonths: 1 },
  { label: '3 tháng', value: 'm3', billingCycle: 'quarterly', cycleMonths: 3 },
  { label: '6 tháng', value: 'm6', billingCycle: 'biannual', cycleMonths: 6 },
  { label: '12 tháng', value: 'm12', billingCycle: 'yearly', cycleMonths: 12 },
] as const;

type PlanFormValues = {
  name: string;
  cycleKey: (typeof CREATE_CYCLE_PRESETS)[number]['value'];
  price: number;
  monthlyToken: number;
  isActive: boolean;
  description?: string;
};

function inferCycleKeyFromPlan(plan: AdminSubscriptionPlan): PlanFormValues['cycleKey'] {
  const bc = plan.billingCycle.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  const exact = CREATE_CYCLE_PRESETS.find(
    (p) => p.cycleMonths === plan.cycleMonths && p.billingCycle === bc
  );
  if (exact) return exact.value;
  const byMonths = CREATE_CYCLE_PRESETS.find((p) => p.cycleMonths === plan.cycleMonths);
  if (byMonths) return byMonths.value;
  return CREATE_CYCLE_PRESETS[0].value;
}

export default function AdminSubscriptionPlansPage() {
  const {
    rows,
    total,
    loading,
    isCreating,
    isUpdating,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch,
    createPlan,
    updatePlan,
  } = useAdminSubscriptionPlans();

  const [selected, setSelected] = useState<AdminSubscriptionPlan | null>(null);
  const [open, setOpen] = useState(false);
  const [planFormOpen, setPlanFormOpen] = useState(false);
  const [planBeingEdited, setPlanBeingEdited] = useState<AdminSubscriptionPlan | null>(null);
  const [planForm] = Form.useForm<PlanFormValues>();

  const closePlanForm = () => {
    setPlanFormOpen(false);
    setPlanBeingEdited(null);
    planForm.resetFields();
  };

  const openCreatePlanForm = () => {
    setPlanBeingEdited(null);
    setPlanFormOpen(true);
  };

  const openEditPlanForm = (plan: AdminSubscriptionPlan) => {
    setPlanBeingEdited(plan);
    setPlanFormOpen(true);
  };

  const handlePlanFormFinish = async (values: PlanFormValues) => {
    const preset = CREATE_CYCLE_PRESETS.find((p) => p.value === values.cycleKey);
    if (!preset) return;

    const payload = {
      name: values.name.trim(),
      billingCycle: preset.billingCycle,
      cycleMonths: preset.cycleMonths,
      price: Number(values.price),
      isActive: values.isActive !== false,
      monthlyToken: Number(values.monthlyToken),
      description: (values.description ?? '').trim(),
    };

    const ok = planBeingEdited
      ? await updatePlan(planBeingEdited.id, payload)
      : await createPlan(payload);

    if (ok) closePlanForm();
  };

  const planFormInitialValues = (): Partial<PlanFormValues> | undefined => {
    if (!planBeingEdited) {
      return { cycleKey: 'm1', isActive: true };
    }
    return {
      name: planBeingEdited.name,
      cycleKey: inferCycleKeyFromPlan(planBeingEdited),
      price: planBeingEdited.price,
      monthlyToken: planBeingEdited.monthlyToken,
      isActive: planBeingEdited.isActive,
      description: planBeingEdited.description ?? '',
    };
  };

  const saveLoading = isCreating || isUpdating;

  const columns: TableProps<AdminSubscriptionPlan>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 72,
      align: 'center',
    },
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => <span className="font-semibold text-foreground">{v || '—'}</span>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (v: number) => <span className="text-foreground">{formatVnd(v)}</span>,
    },
    {
      title: 'Chu kỳ',
      key: 'cycle',
      width: 200,
      render: (_, record) => (
        <span className="text-foreground">{formatBillingCycleMonths(record.cycleMonths, record.billingCycle)}</span>
      ),
    },
    {
      title: 'Token/tháng',
      dataIndex: 'monthlyToken',
      key: 'monthlyToken',
      width: 120,
      align: 'center',
      render: (v: number) => <span className="tabular-nums">{v ?? '—'}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'default'} style={{ margin: 0 }}>
          {value ? 'Đang hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div
          className="cosmate-admin-table-actions flex items-center justify-center gap-3"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Chi tiết">
            <AdminDetailEyeIcon
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <EditOutlined
              className="cosmate-admin-action-icon-edit cursor-pointer text-base transition-opacity hover:opacity-80"
              style={{ color: 'var(--primary)', fontSize: 16 }}
              onClick={() => openEditPlanForm(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-subscription-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Gói đăng ký</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Xem các gói dành cho nhà cung cấp: giá, chu kỳ thanh toán và mức dùng token mỗi tháng.
              </p>
            </div>
            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={() => void refetch()} loading={loading}>
                Làm mới
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreatePlanForm}>
                Tạo gói đăng ký
              </Button>
            </Space>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Tìm theo tên, mô tả hoặc chu kỳ (vd. 12 tháng)"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <Select
              placeholder="Lọc trạng thái"
              value={activeFilter === null ? undefined : activeFilter}
              onChange={(v) => setActiveFilter(v === undefined ? null : v)}
              className="min-w-[180px]"
              options={[
                { label: 'Đang hoạt động', value: true },
                { label: 'Tạm dừng', value: false },
              ]}
              allowClear
            />
          </div>
        </div>

        <Table<AdminSubscriptionPlan>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: <Empty description="Chưa có gói đăng ký nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (t) => `${t} gói`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          rowClassName={() => 'admin-subscription-row'}
        />

        <AdminSubscriptionPlanDetailModal
          open={open}
          plan={selected}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
        />

        <Modal
          title={planBeingEdited ? 'Chỉnh sửa gói đăng ký' : 'Tạo gói đăng ký'}
          width={560}
          open={planFormOpen}
          onCancel={closePlanForm}
          footer={null}
          destroyOnClose
        >
          <Form<PlanFormValues>
            key={planBeingEdited ? `edit-${planBeingEdited.id}` : 'create'}
            form={planForm}
            layout="vertical"
            onFinish={handlePlanFormFinish}
            style={{ marginTop: 16 }}
            initialValues={planFormInitialValues()}
          >
            <Form.Item
              label="Tên gói"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên gói' },
                { max: 200, message: 'Tối đa 200 ký tự' },
              ]}
            >
              <Input placeholder="Ví dụ: Gói Pro cho studio ảnh" />
            </Form.Item>

            <Form.Item
              label="Chu kỳ thanh toán (theo tháng)"
              name="cycleKey"
              rules={[{ required: true, message: 'Vui lòng chọn chu kỳ' }]}
            >
              <Select
                placeholder="Chọn thời lượng một chu kỳ"
                options={CREATE_CYCLE_PRESETS.map((p) => ({ label: p.label, value: p.value }))}
              />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Giá (VNĐ)"
                  name="price"
                  rules={[
                    { required: true, message: 'Vui lòng nhập giá' },
                    {
                      type: 'number',
                      min: 0,
                      message: 'Giá phải từ 0 trở lên',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={0}
                    placeholder="Ví dụ: 299000"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Token mỗi tháng"
                  name="monthlyToken"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số token' },
                    {
                      type: 'number',
                      min: 0,
                      message: 'Token phải từ 0 trở lên',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={0}
                    placeholder="Số token cấp mỗi tháng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Kích hoạt ngay" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Mô tả cho nhà cung cấp" name="description">
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 14 }}
                styles={{ textarea: { resize: 'none', width: '100%' } }}
                placeholder="Giải thích ngắn gọn quyền lợi của gói (hiển thị cho người dùng cuối khi chọn gói)."
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={closePlanForm}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={saveLoading}>
                  {planBeingEdited ? 'Lưu thay đổi' : 'Tạo gói đăng ký'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
