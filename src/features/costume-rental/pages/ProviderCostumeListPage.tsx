/**
 * ProviderCostumeListPage
 *
 * Provider's "My Costumes" overview table + detail modal + edit modal.
 *
 * Data flow: Page → hooks → services → API → axiosInstance
 * No direct API calls in this file.
 */

import {
  Table,
  Tag,
  Space,
  Modal,
  Tabs,
  Image,
  Descriptions,
  List,
  Alert,
  Spin,
  Input,
  Select,
  Typography,
  Popconfirm,
  Tooltip,
  Empty,
} from 'antd'
import type { TableProps }from 'antd'
import { ReloadOutlined, EyeOutlined, PlusOutlined, EditOutlined, SearchOutlined, DeleteOutlined, UpOutlined, DownOutlined }from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout'
import { providerSidebarItems } from '@/features/provider/constants/sidebar'
import { useProviderCostumes, type CostumeSortKey }from '../hooks/useProviderCostumes'
import { useEditCostumeModal }from '../hooks/useEditCostumeModal'
import EditCostumeModal from '../components/edit/EditCostumeModal'
import type { Costume, CostumeStatus }from '../types'
import { useProviderGate } from '@/features/provider/hooks/useProviderGate'
import { ProviderActivationGate } from '@/features/provider/components/ProviderActivationGate'
import { VI } from '@/shared/i18n/vi'
import { Button as UiButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const { Text } = Typography

// ── Status tag helpers ────────────────────────────────────────────────────────

function getStatusTagClassName(status: CostumeStatus): string {
  if (status === 'AVAILABLE') {
    return 'border-cosmate-success/35 bg-cosmate-success/15 text-cosmate-success'
  }
  if (status === 'RENTED') {
    return 'border-cosmate-warning/40 bg-cosmate-warning/15 text-cosmate-warning'
  }
  if (status === 'MAINTENANCE') {
    return 'border-cosmate-info/35 bg-cosmate-info/15 text-cosmate-info'
  }
  return 'border-border bg-muted text-muted-foreground'
}

function getStatusLabel(status: CostumeStatus): string {
  if (status === 'AVAILABLE') return 'Có sẵn'
  if (status === 'RENTED') return 'Đang được thuê'
  return status
}

// ── Sidebar helper ────────────────────────────────────────────────────────────

function buildSidebarItems(): DashboardSidebarItem[] {
  return providerSidebarItems.map((item) => {
    const Icon = item.icon
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    }
  })
}

// ── Detail Modal (view-only) ──────────────────────────────────────────────────

interface DetailModalProps {
  open: boolean
  costume: Costume | null
  loading: boolean
  onClose: () => void
}

function CostumeDetailModal({ open, costume, loading, onClose }: DetailModalProps) {
  const extrasEmpty =
    !costume ||
    ((!costume.surcharges || costume.surcharges.length === 0) &&
      (!costume.accessories || costume.accessories.length === 0))

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Chi tiết trang phục"
      footer={null}
      width={720}
      centered
      destroyOnClose
      styles={{
        body: { maxHeight: 'min(72vh, 640px)', overflowY: 'auto', paddingTop: 8 },
      }}
    >
      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          Đang tải chi tiết...
        </div>
      )}

      {!loading && costume && (
        <Tabs
          defaultActiveKey="info"
          items={[
            {
              key: 'info',
              label: 'Thông tin',
              children: (
                <div className="pt-1">
                  {costume.imageUrls && costume.imageUrls.length > 0 && (
                    <div className="mb-4">
                      <Space wrap>
                        {costume.imageUrls.map((url, idx) => (
                          <Image
                            key={idx}
                            src={url}
                            width={120}
                            height={120}
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                            alt={`${costume.name} - ảnh ${idx + 1}`}
                          />
                        ))}
                      </Space>
                    </div>
                  )}

                  <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                    <Descriptions.Item label="Tên trang phục" span={2}>
                      {costume.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả" span={2}>
                      {costume.description || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kích cỡ">{costume.size}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{costume.numberOfItems}</Descriptions.Item>
                    <Descriptions.Item label="Giá / ngày">
                      {costume.pricePerDay.toLocaleString('vi-VN')} VNĐ
                    </Descriptions.Item>
                    <Descriptions.Item label="Tiền đặt cọc">
                      {costume.depositAmount.toLocaleString('vi-VN')} VNĐ
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                      <Tag className={cn('m-0 border font-semibold', getStatusTagClassName(costume.status))}>
                        {getStatusLabel(costume.status)}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              ),
            },
            {
              key: 'extras',
              label: 'Phụ phí & phụ kiện',
              children: (
                <div className="space-y-4 pt-1">
                  {extrasEmpty ? (
                    <Empty description="Chưa có phụ phí hay phụ kiện" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <>
                      {costume.surcharges && costume.surcharges.length > 0 && (
                        <div>
                          <Text strong className="mb-2 block">
                            Phụ phí
                          </Text>
                          <List
                            size="small"
                            bordered
                            dataSource={costume.surcharges}
                            renderItem={(s) => (
                              <List.Item>
                                <Text>{s.name}</Text>
                                <Text type="secondary" style={{ marginLeft: 8 }}>
                                  {s.price.toLocaleString('vi-VN')} VNĐ — {s.description}
                                </Text>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                      {costume.accessories && costume.accessories.length > 0 && (
                        <div>
                          <Text strong className="mb-2 block">
                            Phụ kiện
                          </Text>
                          <List
                            size="small"
                            bordered
                            dataSource={costume.accessories}
                            renderItem={(a) => (
                              <List.Item>
                                <Text>{a.name}</Text>
                                <Text type="secondary" style={{ marginLeft: 8 }}>
                                  {a.price.toLocaleString('vi-VN')} VNĐ
                                  {a.isRequired ? ' (bắt buộc)' : ''} — {a.description}
                                </Text>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </Modal>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProviderCostumeListPage() {
  const navigate = useNavigate()

  const gate = useProviderGate()

  const {
    filteredCostumes,
    isLoading,
    error,
    providerId,
    refetch,
    modalOpen,
    selectedCostume,
    detailLoading,
    openDetail,
    closeDetail,
    deletingId,
    removeCostume,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
  } = useProviderCostumes()

  const editModal = useEditCostumeModal({ onSuccess: refetch })

  const sidebarItems = buildSidebarItems()

  const columns: TableProps<Costume>['columns'] = [
    {
      title: 'Ảnh',
      key: 'thumbnail',
      width: 80,
      render: (_, record) =>
        record.imageUrls && record.imageUrls.length > 0 ? (
          <Image
            src={record.imageUrls[0]}
            width={56}
            height={56}
            style={{ objectFit: 'cover', borderRadius: 6 }}
            alt={record.name}
            preview={false}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 6,
              background: "var(--muted)",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: "var(--muted-foreground)",
              fontSize: 11,
            }}
          >
            N/A
          </div>
        ),
    },
  {
    title: 'Tên trang phục',
    dataIndex: 'name',
    key: 'name',
    width: 240,
    ellipsis: true,
  },
  {
    title: 'Kích cỡ',
    dataIndex: 'size',
    key: 'size',
      width: 90,
    },
    {
      title: 'Số lượng vật phẩm',
      dataIndex: 'numberOfItems',
      key: 'numberOfItems',
      width: 100,
  },
  {
    title: 'Giá / ngày',
    dataIndex: 'pricePerDay',
    key: 'pricePerDay',
      width: 140,
    render: (v: number) => <span className="font-semibold text-foreground">{`${v.toLocaleString('vi-VN')} VNĐ`}</span>,
  },
    {
      title: 'Tiền đặt cọc',
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      width: 140,
      render: (v: number) => `${v.toLocaleString('vi-VN')} VNĐ`,
    },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
      width: 120,
      render: (status: CostumeStatus) => (
        <Tag className={cn('m-0 border font-semibold', getStatusTagClassName(status))}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size={10} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Xem chi tiết">
            <EyeOutlined
              onClick={() => openDetail(record.id)}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-info)' }}
            />
          </Tooltip>
          <Tooltip title="Sửa trang phục">
            <EditOutlined
              onClick={() => editModal.openModal(record.id)}
              style={{ cursor: 'pointer', fontSize: 16, color: 'var(--cosmate-warning)' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa trang phục này?"
            description="Hành động này không thể hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
            onConfirm={() => void removeCostume(record.id)}
          >
            <span style={{ cursor: 'pointer', fontSize: 16, color: 'var(--destructive)' }}>
              <DeleteOutlined />
            </span>
          </Popconfirm>
        </Space>
    ),
  },
]

  return (
    <>
    <DashboardLayout
      title="Danh sách trang phục"
      sidebarItems={sidebarItems}
      showChatButton={false}
      brandName="CosMate Provider"
    >
        {/* Verification gate */}
        {gate.profileLoading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Spin size="large" />
            <p className="mt-4 text-muted-foreground">{VI.provider.activation.loadingProfile}</p>
          </div>
        )}
        {!gate.profileLoading && gate.verified === false && (
          <ProviderActivationGate
            plans={gate.plans}
            plansLoading={gate.plansLoading}
            plansError={gate.plansError}
            selectedPlanId={gate.selectedPlanId}
            onSelectPlan={gate.setSelectedPlanId}
            selectedMethod={gate.selectedMethod}
            onSelectMethod={gate.setSelectedMethod}
            onSubscribe={gate.handleSubscribe}
            subscribing={gate.subscribing}
            subscribeError={gate.subscribeError}
          />
        )}
        {!gate.profileLoading && gate.verified === true && (<>
        {/* Toolbar: Tier 1 (search/actions) + Tier 2 (filters/sort) */}
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Tìm kiếm tên trang phục..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <UiButton variant="cosmateOutline" disabled={isLoading} onClick={() => void refetch()}>
                <ReloadOutlined className={isLoading ? 'animate-spin' : ''} />
                Làm mới
              </UiButton>
              <UiButton variant="cosmate" onClick={() => navigate('/provider-rental/costumes/create')}>
                <PlusOutlined />
                Tạo trang phục mới
              </UiButton>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              className="min-w-[180px]"
              options={[
                { label: 'Tất cả trạng thái', value: 'ALL' },
                { label: 'Có sẵn', value: 'AVAILABLE' },
                { label: 'Đang được thuê', value: 'RENTED' },
                { label: 'Bảo trì', value: 'MAINTENANCE' },
              ]}
            />
            <Select
              value={sortKey}
              onChange={(val) => setSortKey(val as CostumeSortKey)}
              className="min-w-[160px]"
              options={[
                { label: 'Tên', value: 'name' },
                { label: 'Giá / ngày', value: 'pricePerDay' },
                { label: 'Trạng thái', value: 'status' },
              ]}
            />
            <UiButton
              variant="cosmateOutline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <UpOutlined /> : <DownOutlined />}
              {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
            </UiButton>
          </div>
        </div>

        {providerId === null && (
          <Alert
            type="error"
            message="Không tìm thấy thông tin provider trong phiên đăng nhập. Vui lòng đăng xuất và đăng nhập lại."
            style={{ marginBottom: 16 }}
          />
        )}

        {error && providerId !== null && (
          <Alert type="error" message={error} style={{ marginBottom: 16 }} closable />
        )}

        <Table<Costume>
        columns={columns}
          dataSource={filteredCostumes}
          rowKey="id"
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => openDetail(record.id),
            style: { cursor: 'pointer' },
          })}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} trang phục`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        bordered={false}
        style={{ borderRadius: 8 }}
      />
      </>)}
    </DashboardLayout>

      {/* View-only detail modal */}
      <CostumeDetailModal
        open={modalOpen}
        costume={selectedCostume}
        loading={detailLoading}
        onClose={closeDetail}
      />

      {/* Edit modal */}
      <EditCostumeModal
        open={editModal.open}
        detail={editModal.detail}
        detailLoading={editModal.detailLoading}
        providerId={editModal.providerId}
        basicSubmitting={editModal.basicSubmitting}
        surchargeSubmitting={editModal.surchargeSubmitting}
        rentalOptionSubmitting={editModal.rentalOptionSubmitting}
        onClose={editModal.closeModal}
        onSubmitBasicInfo={editModal.submitBasicInfo}
        onUpdateSurcharge={editModal.submitSurchargeUpdate}
        onUpdateRentalOption={editModal.submitRentalOptionUpdate}
        createSurchargeModalOpen={editModal.createSurchargeModalOpen}
        setCreateSurchargeModalOpen={editModal.setCreateSurchargeModalOpen}
        createRentalOptionModalOpen={editModal.createRentalOptionModalOpen}
        setCreateRentalOptionModalOpen={editModal.setCreateRentalOptionModalOpen}
        onCreateSurcharge={editModal.handleCreateSurcharge}
        onCreateRentalOption={editModal.handleCreateRentalOption}
        accessorySubmitting={editModal.accessorySubmitting}
        createAccessoryModalOpen={editModal.createAccessoryModalOpen}
        setCreateAccessoryModalOpen={editModal.setCreateAccessoryModalOpen}
        onCreateAccessory={editModal.handleCreateAccessory}
        onUpdateAccessory={editModal.handleUpdateAccessory}
        onGenerateDescription={editModal.onGenerateDescription}
        isGeneratingDescription={editModal.isGeneratingDescription}
        descriptionPrompt={editModal.descriptionPrompt}
        setDescriptionPrompt={editModal.setDescriptionPrompt}
        mainImages={editModal.mainImages}
        detailImages={editModal.detailImages}
        imagesLoading={editModal.imagesLoading}
        canDeleteMain={editModal.canDeleteMain}
        deleting={editModal.deleting}
        replacing={editModal.replacing}
        uploading={editModal.uploading}
        onDeleteDetail={editModal.deleteDetail}
        onReplaceMain={editModal.handleReplaceMain}
        onReplaceDetail={editModal.handleReplaceDetail}
        onAddDetail={editModal.addDetail}
      />
    </>
  )
}
