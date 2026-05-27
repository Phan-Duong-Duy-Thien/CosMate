import { useState } from 'react';
import {
  Table,
  Descriptions,
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
  Popconfirm,
} from 'antd';
import type { TableProps } from 'antd';
import {
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Card } from '@/shared/components/Card';
import { VI } from '@/shared/i18n/vi';
import { AdminDetailEyeIcon } from '@/features/admin/components/AdminDetailEyeIcon';
import type { AiTokenPlan, CreateAiTokenPlanRequest } from '../types';

export type AiTokenPlansTexts = typeof VI.staff.tokenPlans;

export type AiTokenPlansManagementViewProps = {
  rows: AiTokenPlan[];
  total: number;
  loading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  search: string;
  setSearch: (value: string) => void;
  activeFilter: boolean | null;
  setActiveFilter: (value: boolean | null) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  refetch: (options?: { silent?: boolean }) => Promise<void>;
  createPlan: (payload: CreateAiTokenPlanRequest) => Promise<boolean>;
  updatePlan: (id: number, payload: CreateAiTokenPlanRequest) => Promise<boolean>;
  activatePlan: (id: number) => Promise<boolean>;
  deactivatePlan: (id: number) => Promise<boolean>;
  deletePlan: (id: number) => Promise<boolean>;
  togglingId: number | null;
  deletingId: number | null;
  texts: AiTokenPlansTexts;
  rowClassName?: string;
};

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

type PlanFormValues = {
  name: string;
  price: number;
  numberOfToken: number;
  isActive: boolean;
  description?: string;
};

export function AiTokenPlansManagementView({
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
  activatePlan,
  deactivatePlan,
  deletePlan,
  togglingId,
  deletingId,
  texts,
  rowClassName = 'staff-token-plan-row',
}: AiTokenPlansManagementViewProps) {
  const [selected, setSelected] = useState<AiTokenPlan | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [planFormOpen, setPlanFormOpen] = useState(false);
  const [planBeingEdited, setPlanBeingEdited] = useState<AiTokenPlan | null>(null);
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

  const openEditPlanForm = (plan: AiTokenPlan) => {
    setPlanBeingEdited(plan);
    setPlanFormOpen(true);
  };

  const handleActivate = async (plan: AiTokenPlan) => {
    const ok = await activatePlan(plan.id);
    if (ok && selected?.id === plan.id) {
      setSelected({ ...plan, isActive: true });
    }
  };

  const handleDeactivate = async (plan: AiTokenPlan) => {
    const ok = await deactivatePlan(plan.id);
    if (ok && selected?.id === plan.id) {
      setSelected({ ...plan, isActive: false });
    }
  };

  const handleDelete = async (plan: AiTokenPlan) => {
    const ok = await deletePlan(plan.id);
    if (ok && selected?.id === plan.id) {
      setDetailOpen(false);
      setSelected(null);
    }
  };

  const renderToggleAction = (record: AiTokenPlan) => {
    const isToggling = togglingId === record.id;

    if (record.isActive) {
      return (
        <Popconfirm
          title={texts.confirmDeactivate}
          onConfirm={() => void handleDeactivate(record)}
          okText={VI.common.actions.confirm}
          cancelText={VI.common.actions.cancel}
        >
          <Tooltip title={texts.deactivate}>
            <StopOutlined
              className={`cursor-pointer text-base transition-opacity hover:opacity-80 ${isToggling ? 'pointer-events-none opacity-40' : ''}`}
              style={{ color: 'var(--cosmate-warning)' }}
              onClick={(e) => e.stopPropagation()}
            />
          </Tooltip>
        </Popconfirm>
      );
    }

    return (
      <Popconfirm
        title={texts.confirmActivate}
        onConfirm={() => void handleActivate(record)}
        okText={VI.common.actions.confirm}
        cancelText={VI.common.actions.cancel}
      >
        <Tooltip title={texts.activate}>
          <CheckCircleOutlined
            className={`cursor-pointer text-base transition-opacity hover:opacity-80 ${isToggling ? 'pointer-events-none opacity-40' : ''}`}
            style={{ color: 'var(--cosmate-success)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </Tooltip>
      </Popconfirm>
    );
  };

  const renderDeleteAction = (record: AiTokenPlan) => {
    const isDeleting = deletingId === record.id;
    return (
      <Popconfirm
        title={texts.confirmDelete}
        onConfirm={() => void handleDelete(record)}
        okText={VI.common.actions.confirm}
        cancelText={VI.common.actions.cancel}
        okButtonProps={{ danger: true }}
      >
        <Tooltip title={texts.delete}>
          <DeleteOutlined
            className={`cursor-pointer text-base transition-opacity hover:opacity-80 ${isDeleting ? 'pointer-events-none opacity-40' : ''}`}
            style={{ color: 'var(--destructive)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </Tooltip>
      </Popconfirm>
    );
  };

  const handlePlanFormFinish = async (values: PlanFormValues) => {
    const payload = {
      name: values.name.trim(),
      price: Number(values.price),
      numberOfToken: Number(values.numberOfToken),
      isActive: values.isActive !== false,
      description: (values.description ?? '').trim(),
    };

    const ok = planBeingEdited
      ? await updatePlan(planBeingEdited.id, payload)
      : await createPlan(payload);

    if (ok) closePlanForm();
  };

  const planFormInitialValues = (): Partial<PlanFormValues> | undefined => {
    if (!planBeingEdited) {
      return { isActive: true };
    }
    return {
      name: planBeingEdited.name,
      price: planBeingEdited.price,
      numberOfToken: planBeingEdited.numberOfToken,
      isActive: planBeingEdited.isActive,
      description: planBeingEdited.description ?? '',
    };
  };

  const saveLoading = isCreating || isUpdating;

  const columns: TableProps<AiTokenPlan>['columns'] = [
    {
      title: texts.columns.id,
      dataIndex: 'id',
      key: 'id',
      width: 72,
      align: 'center',
    },
    {
      title: texts.columns.name,
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => <span className="font-semibold text-slate-900">{v || '—'}</span>,
    },
    {
      title: texts.columns.price,
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (v: number) => <span className="text-slate-800">{formatVnd(v)}</span>,
    },
    {
      title: texts.columns.numberOfToken,
      dataIndex: 'numberOfToken',
      key: 'numberOfToken',
      width: 120,
      align: 'center',
      render: (v: number) => (
        <span className="tabular-nums text-slate-800">{v?.toLocaleString('vi-VN') ?? '—'}</span>
      ),
    },
    {
      title: texts.columns.status,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 130,
      align: 'center',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'default'} style={{ margin: 0 }}>
          {value ? texts.statusActive : texts.statusInactive}
        </Tag>
      ),
    },
    {
      title: texts.columns.actions,
      key: 'actions',
      width: 210,
      align: 'center',
      render: (_, record) => (
        <div
          className="cosmate-admin-table-actions flex items-center justify-center gap-3"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title={texts.detail}>
            <AdminDetailEyeIcon
              onClick={() => {
                setSelected(record);
                setDetailOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={texts.edit}>
            <EditOutlined
              className="cosmate-admin-action-icon-edit cursor-pointer text-base transition-opacity hover:opacity-80"
              style={{ color: 'var(--primary)', fontSize: 16 }}
              onClick={() => openEditPlanForm(record)}
            />
          </Tooltip>
          {renderToggleAction(record)}
          {renderDeleteAction(record)}
        </div>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .${rowClassName}:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{texts.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{texts.description}</p>
          </div>
          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={() => void refetch()} loading={loading}>
              {VI.common.actions.refresh}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreatePlanForm}>
              {texts.create}
            </Button>
          </Space>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full max-w-sm">
            <Input
              placeholder={texts.searchPlaceholder}
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </div>
          <Select
            value={activeFilter === null ? 'all' : activeFilter}
            onChange={(v) => setActiveFilter(v === 'all' ? null : v)}
            className="min-w-[180px]"
            options={[
              { label: texts.statusAll, value: 'all' },
              { label: texts.statusActive, value: true },
              { label: texts.statusInactive, value: false },
            ]}
          />
        </div>

        <Card className="overflow-hidden p-0">
          <Table<AiTokenPlan>
            columns={columns}
            dataSource={rows}
            rowKey="id"
            loading={loading}
            locale={{
              emptyText: (
                <Empty description={texts.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ),
            }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (t) => `${t} ${texts.paginationTotal}`,
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
            }}
            rowClassName={() => rowClassName}
          />
        </Card>

        <Modal
          title={selected ? `${texts.detail}: ${selected.name}` : texts.detail}
          open={detailOpen}
          onCancel={() => {
            setDetailOpen(false);
            setSelected(null);
          }}
          footer={
            selected
              ? [
                  <Button key="close" onClick={() => setDetailOpen(false)}>
                    {VI.common.actions.close}
                  </Button>,
                  selected.isActive ? (
                    <Popconfirm
                      key="deactivate"
                      title={texts.confirmDeactivate}
                      onConfirm={() => void handleDeactivate(selected)}
                      okText={VI.common.actions.confirm}
                      cancelText={VI.common.actions.cancel}
                    >
                      <Button
                        danger
                        loading={togglingId === selected.id}
                        icon={<StopOutlined />}
                      >
                        {texts.deactivate}
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      key="activate"
                      title={texts.confirmActivate}
                      onConfirm={() => void handleActivate(selected)}
                      okText={VI.common.actions.confirm}
                      cancelText={VI.common.actions.cancel}
                    >
                      <Button
                        type="primary"
                        loading={togglingId === selected.id}
                        icon={<CheckCircleOutlined />}
                      >
                        {texts.activate}
                      </Button>
                    </Popconfirm>
                  ),
                  <Popconfirm
                    key="delete"
                    title={texts.confirmDelete}
                    onConfirm={() => void handleDelete(selected)}
                    okText={VI.common.actions.confirm}
                    cancelText={VI.common.actions.cancel}
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      loading={deletingId === selected.id}
                      icon={<DeleteOutlined />}
                    >
                      {texts.delete}
                    </Button>
                  </Popconfirm>,
                ]
              : null
          }
          centered
          width={480}
          destroyOnClose
        >
          {selected && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={texts.columns.id}>{selected.id}</Descriptions.Item>
              <Descriptions.Item label={texts.columns.name}>{selected.name}</Descriptions.Item>
              <Descriptions.Item label={texts.columns.price}>
                {formatVnd(selected.price)}
              </Descriptions.Item>
              <Descriptions.Item label={texts.columns.numberOfToken}>
                {selected.numberOfToken.toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label={texts.columns.status}>
                <Tag color={selected.isActive ? 'green' : 'default'}>
                  {selected.isActive ? texts.statusActive : texts.statusInactive}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={texts.form.description}>
                <span className="whitespace-pre-wrap">{selected.description || '—'}</span>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        <Modal
          title={planBeingEdited ? texts.edit : texts.create}
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
              label={texts.form.name}
              name="name"
              rules={[
                { required: true, message: texts.validation.nameRequired },
                { max: 200, message: texts.validation.nameMax },
              ]}
            >
              <Input placeholder={texts.form.namePlaceholder} />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={texts.form.price}
                  name="price"
                  rules={[
                    { required: true, message: texts.validation.priceRequired },
                    { type: 'number', min: 0, message: texts.validation.priceMin },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={0}
                    placeholder={texts.form.pricePlaceholder}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={texts.form.numberOfToken}
                  name="numberOfToken"
                  rules={[
                    { required: true, message: texts.validation.tokenRequired },
                    { type: 'number', min: 0, message: texts.validation.tokenMin },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={0}
                    placeholder={texts.form.numberOfTokenPlaceholder}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={texts.form.isActive} name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label={texts.form.description} name="description">
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 14 }}
                styles={{ textarea: { resize: 'none', width: '100%' } }}
                placeholder={texts.form.descriptionPlaceholder}
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={closePlanForm}>{VI.common.actions.cancel}</Button>
                <Button type="primary" htmlType="submit" loading={saveLoading}>
                  {planBeingEdited ? VI.common.actions.save : texts.create}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
