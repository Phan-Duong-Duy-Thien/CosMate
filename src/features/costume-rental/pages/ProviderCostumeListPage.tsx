/**
 * ProviderCostumeListPage
 *
 * Provider's "My Costumes" overview table + detail modal + edit modal.
 *
 * Data flow: Page → hooks → services → API → axiosInstance
 * No direct API calls in this file.
 */

import { Button, Table, Tag, Space, Modal, Image, Descriptions, List, Alert, Spin, Input, Select, Typography } from 'antd'
import type { TableProps }from 'antd'
import { ReloadOutlined, EyeOutlined, PlusOutlined, EditOutlined, SearchOutlined }from '@ant-design/icons'
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

const { Text } = Typography

// ── Status tag helpers ────────────────────────────────────────────────────────

function getStatusTagColor(status: CostumeStatus): string {
  if (status === 'AVAILABLE') return 'green'
  if (status === 'RENTED') return 'orange'
  return 'blue'
}

function getStatusLabel(status: CostumeStatus): string {
  if (status === 'AVAILABLE') return 'Có sẵn'
  if (status === 'RENTED') return 'Đang thuê'
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
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Đóng</Button>}
      title="Chi tiết trang phục"
      width={720}
      destroyOnClose
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
          Đang tải chi tiết...
        </div>
      )}

      {!loading && costume && (
        <div>
          {costume.imageUrls && costume.imageUrls.length > 0 && (
            <div style={{ marginBottom: 20 }}>
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

          <Descriptions bordered column={2}size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="Tên trang phục" span={2}>{costume.name}</Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>{costume.description || '—'}</Descriptions.Item>
            <Descriptions.Item label="Kích cỡ">{costume.size}</Descriptions.Item>
            <Descriptions.Item label="Số lượng">{costume.numberOfItems}</Descriptions.Item>
            <Descriptions.Item label="Giá / ngày">
              {costume.pricePerDay.toLocaleString('vi-VN')}VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Tiền đặt cọc">
              {costume.depositAmount.toLocaleString('vi-VN')} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={getStatusTagColor(costume.status)}>{getStatusLabel(costume.status)}</Tag>
            </Descriptions.Item>
          </Descriptions>

          {costume.surcharges && costume.surcharges.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>Phụ phí</Text>
              <List
                size="small"
                dataSource={costume.surcharges}
                renderItem={(s) => (
                  <List.Item>
                    <Text>{s.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {s.price.toLocaleString('vi-VN')}VNĐ — {s.description}
                    </Text>
                  </List.Item>
                )}
              />
            </div>
          )}

          {costume.accessories && costume.accessories.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>Phụ kiện</Text>
              <List
                size="small"
                dataSource={costume.accessories}
                renderItem={(a) => (
                  <List.Item>
                    <Text>{a.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {a.price.toLocaleString('vi-VN')} VNĐ
                      {a.isRequired ? ' (bắt buộc)' : ''}— {a.description}
                    </Text>
                  </List.Item>
                )}
              />
            </div>
          )}

          {costume.rentalOptions && costume.rentalOptions.length > 0 && (
            <div>
              <Text strong>Gói thuê</Text>
              <List
                size="small"
                dataSource={costume.rentalOptions}
                renderItem={(r) => (
                  <List.Item>
                    <Text>{r.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {r.price.toLocaleString('vi-VN')} VNĐ — {r.description}
                    </Text>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
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
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#bbb',
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
  },
  {
    title: 'Kích cỡ',
    dataIndex: 'size',
    key: 'size',
      width: 90,
    },
    {
      title: 'Số lượng',
      dataIndex: 'numberOfItems',
      key: 'numberOfItems',
      width: 100,
  },
  {
    title: 'Giá / ngày',
    dataIndex: 'pricePerDay',
    key: 'pricePerDay',
      width: 140,
    render: (v: number) => `${v.toLocaleString('vi-VN')} VNĐ`,
  },
    {
      title: 'Tiền đặt cọc',
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      width: 140,
      render: (v: number) => `${v.toLocaleString('vi-VN')}VNĐ`,
    },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
      width: 120,
      render: (status: CostumeStatus) => (
        <Tag color={getStatusTagColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openDetail(record.id)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editModal.openModal(record.id)}
          >
            Sửa
          </Button>
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
            <p style={{ color: '#6B7280', marginTop: 16 }}>{VI.provider.activation.loadingProfile}</p>
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
        {/* Sort/Filter Toolbar */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap style={{ marginBottom: 8 }}>
            <Input
              placeholder="Tìm kiếm tên trang phục..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 160 }}
            >
              <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
              <Select.Option value="AVAILABLE">Có sẵn</Select.Option>
              <Select.Option value="RENTED">Đang thuê</Select.Option>
              <Select.Option value="MAINTENANCE">Bảo trì</Select.Option>
            </Select>
            <Select
              value={sortKey}
              onChange={(val) => setSortKey(val as CostumeSortKey)}
              style={{ width: 160 }}
            >
              <Select.Option value="name">Tên</Select.Option>
              <Select.Option value="pricePerDay">Giá / ngày</Select.Option>
              <Select.Option value="status">Trạng thái</Select.Option>
            </Select>
            <Button
              icon={
                <span style={{ fontSize: 12, fontWeight: 'bold' }}>
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              }
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
            </Button>
          </Space>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={refetch} loading={isLoading}>
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/provider-rental/costumes/create')}
            >
              Tạo trang phục mới
            </Button>
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
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total}trang phục`,
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
