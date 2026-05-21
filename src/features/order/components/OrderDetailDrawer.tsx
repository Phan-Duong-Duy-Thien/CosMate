/**
 * Order detail overlay (centered Modal + tabs).
 *
 * UI-only — data fetching via hooks inside component.
 */

import { useState, type ReactNode } from 'react';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { DATA_SYNC_EVENTS } from '@/shared/sync/dataSync';
import { Modal, Tabs, Descriptions, Spin, Empty, Tag, List, Typography, Button, Table } from 'antd';
import { UserOutlined, ShopOutlined, EnvironmentOutlined, PhoneOutlined, AppstoreOutlined, PlusCircleOutlined, HistoryOutlined, GiftOutlined, DollarOutlined } from '@ant-design/icons';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { useCostumeBasicInfo } from '../hooks/useCostumeBasicInfo';
import { resolveImageUrl } from '@/features/costume-rental/hooks/usePublicCostumeDetail';
import { ExtendRentalModal } from './ExtendRentalModal';
import { useExtendOrder } from '../hooks/useExtendOrder';
import { useOrderExtends } from '../hooks/useOrderExtends';
import { useExtendDetail } from '../hooks/useExtendDetail';
import { VI } from '@/shared/i18n/vi';
import type { OrderStatus } from '../types';
import type { PaymentMethod } from '../utils/paymentReturnUrls';
import type { ExtendPaymentStatus } from '../api/order.api';

const { Text } = Typography;

interface OrderDetailDrawerProps {
  open: boolean;
  orderId: number | null;
  orderType?: string; // 'RENT_COSTUME' — used to guard against cross-type contamination
  onClose: () => void;
  onExtendSuccess?: () => void;
  /** Hide rental-option package UI (staff/admin read-only surfaces). */
  hideRentalOptions?: boolean;
  /** Hide extend-rental actions and history (staff/admin). */
  hideExtendActions?: boolean;
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

function SubsectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-foreground">
      {icon}
      {children}
    </h3>
  );
}

function NamedLineItems({
  items,
  emptyDescription,
  nameFallback,
}: {
  items: { key: string | number; name: string; description?: string | null; badge?: string }[];
  emptyDescription: string;
  nameFallback: string;
}) {
  if (items.length === 0) {
    return <Empty description={emptyDescription} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <List
      size="small"
      bordered
      dataSource={items}
      renderItem={(item) => {
        const displayName = item.name?.trim() || nameFallback;
        return (
          <List.Item>
            <List.Item.Meta
              title={
                <span className="flex flex-wrap items-center gap-2">
                  <Text strong>{displayName}</Text>
                  {item.badge ? <Tag>{item.badge}</Tag> : null}
                </span>
              }
              description={item.description?.trim() || undefined}
            />
          </List.Item>
        );
      }}
    />
  );
}

// Format date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Status mapping
const getStatusLabel = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    PREPARING: 'Đang chuẩn bị',
    SHIPPING_OUT: 'Đang giao',
    DELIVERING_OUT: 'Chờ nhận',
    IN_USE: 'Đang sử dụng',
    SHIPPING_BACK: 'Đang trả',
    RETURNED: 'Đã trả',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    DISPUTE: 'Khiếu nại',
    EXTENDING: 'Gia hạn',
  };
  return statusMap[status] || status;
};

function formatTrackingDescription(trackingStatus: string, stage: string): string {
  const statusMap = VI.order.detail.trackingStatusLabels as Record<string, string>;
  const stageMap = VI.order.detail.trackingStageLabels as Record<string, string>;
  const statusLabel = statusMap[trackingStatus] ?? trackingStatus;
  const stageLabel = stageMap[stage] ?? stage;
  return `${statusLabel} · ${stageLabel}`;
}

const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    UNPAID: 'orange',
    PAID: 'blue',
    PREPARING: 'purple',
    SHIPPING_OUT: 'cyan',
    DELIVERING_OUT: 'cyan',
    IN_USE: 'purple',
    SHIPPING_BACK: 'volcano',
    RETURNED: 'green',
    COMPLETED: 'green',
    CANCELLED: 'default',
    DISPUTE: 'magenta',
    EXTENDING: 'gold',
  };
  return colorMap[status] || 'default';
};

export function OrderDetailDrawer({
  open,
  orderId,
  orderType,
  onClose,
  onExtendSuccess,
  hideRentalOptions = true,
  hideExtendActions = false,
}: OrderDetailDrawerProps) {
  const { orderDetail, loading, error, refetch } = useOrderDetail(orderId);

  useDataSyncRefetch(
    () => (orderId ? refetch() : undefined),
    DATA_SYNC_EVENTS.ORDERS_CHANGED,
    Boolean(orderId),
  );
  const { extendOrder, isExtending } = useExtendOrder();

  // Extend modal state
  const [extendModalOpen, setExtendModalOpen] = useState(false);

  // Extend detail modal state
  const [extendDetailModalOpen, setExtendDetailModalOpen] = useState(false);
  const [selectedExtendId, setSelectedExtendId] = useState<number | null>(null);
  const { detail: extendDetail, loading: extendDetailLoading, fetchDetail, reset: resetExtendDetail } = useExtendDetail();

  // Extend history hooks — only active when order is IN_USE
  const { extends: extendsList, loading: extendsLoading, refetch: refetchExtends } = useOrderExtends(
    orderDetail?.status === 'IN_USE' ? (orderId ?? null) : null
  );

  // Map extend payment status to badge color
  const getExtendPaymentColor = (status: ExtendPaymentStatus): string => {
    const map: Record<ExtendPaymentStatus, string> = {
      PAID: 'success',
      PENDING: 'warning',
      FAILED: 'error',
    };
    return map[status] ?? 'default';
  };

  const handleViewExtend = async (extendId: number) => {
    setSelectedExtendId(extendId);
    const detailId = orderDetail?.details?.[0]?.id;
    if (!orderId || !detailId) return;
    await fetchDetail(orderId, detailId, extendId);
    setExtendDetailModalOpen(true);
  };

  const handleCloseExtendDetail = () => {
    setExtendDetailModalOpen(false);
    setSelectedExtendId(null);
    resetExtendDetail();
  };

  const handlePayNow = (paymentUrl: string) => {
    window.location.href = paymentUrl;
  };

  // Fetch costume basic info from costumeId in first detail item
  const costumeId = orderDetail?.details?.[0]?.costumeId ?? null;
  const { costume: costumeInfo, loading: costumeLoading, error: costumeError } = useCostumeBasicInfo(costumeId);

  // Guard: reject cross-type contamination.
  // If orderType is passed but doesn't match, log a warning and skip rendering.
  if (orderDetail && orderType && orderDetail.orderType && orderDetail.orderType !== orderType) {
    console.warn(
      '[OrderDetailDrawer] Order type mismatch — expected',
      orderType,
      'but got',
      orderDetail.orderType,
      '(id:',
      orderId,
      '). This may indicate cross-contamination between order types.'
    );
  }

  const renderCostumeInfo = () => {
    if (costumeLoading) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <Spin size="small" />
          <span className="text-sm text-slate-500">{VI.costumeRental.detail.productDetailTitle}</span>
        </div>
      );
    }

    if (costumeError || !costumeInfo) {
      return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm text-slate-400">{VI.order.detail.empty}</span>
        </div>
      );
    }

    const primaryImage = costumeInfo.imageUrls?.[0];
    const resolvedUrl = primaryImage ? resolveImageUrl(primaryImage) : null;

    return (
      <div className="flex gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
        {resolvedUrl ? (
          <img
            src={resolvedUrl}
            alt={costumeInfo.name}
            className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
            <AppstoreOutlined className="text-2xl text-purple-300" />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <AppstoreOutlined className="text-purple-600" />
            <span className="font-semibold text-slate-800">{costumeInfo.name}</span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
            <span>
              {VI.order.detail.size}: {costumeInfo.size}
            </span>
            <span>
              {VI.order.detail.depositAmount}: {formatCurrency(costumeInfo.depositAmount)}
            </span>
            <span>
              {VI.order.detail.rentAmount.split(' ')[0]}: {formatCurrency(costumeInfo.pricePerDay)}/ngày
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => {
    if (!orderDetail) return null;

    return (
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label={VI.order.detail.orderId} span={1}>
          #{orderDetail.id}
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.status} span={1}>
          <Tag color={getStatusColor(orderDetail.status)}>
            {getStatusLabel(orderDetail.status)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.totalAmount} span={2}>
          <Text strong type="success">{formatCurrency(orderDetail.totalAmount)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.createdAt} span={2}>
          {formatDate(orderDetail.createdAt)}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderRentalInfo = () => {
    if (!orderDetail?.details?.length) {
      return <Empty description={VI.order.detail.empty} />;
    }

    const detail = orderDetail.details[0];

    return (
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label={VI.order.detail.size} span={1}>
          <Text strong>{detail.size || '—'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.numberOfItems} span={1}>
          <Text strong>{detail.numberOfItems ?? '—'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentDay} span={1}>
          <Text strong>
            {detail.rentDay ?? '—'} {VI.order.extend.daysSuffix}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.depositAmount} span={1}>
          <Text strong type="danger">
            {formatCurrency(detail.depositAmount || 0)}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentStart} span={1}>
          <Text strong>{formatDate(detail.rentStart)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentEnd} span={1}>
          <Text strong>{formatDate(detail.rentEnd)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentAmount} span={2}>
          <Text strong type="success">{formatCurrency(detail.rentAmount || 0)}</Text>
        </Descriptions.Item>
        {detail.surchargeAmount > 0 && (
          <Descriptions.Item label={VI.order.detail.surchargeAmount} span={2}>
            <Text strong type="success">{formatCurrency(detail.surchargeAmount)}</Text>
          </Descriptions.Item>
        )}
        {detail.accessoriesAmount > 0 && (
          <Descriptions.Item label={VI.order.detail.accessoriesAmount} span={2}>
            <Text strong type="success">{formatCurrency(detail.accessoriesAmount)}</Text>
          </Descriptions.Item>
        )}
        {!hideRentalOptions && detail.rentOptionAmount > 0 && (
          <Descriptions.Item label={VI.order.detail.rentOptionAmount} span={2}>
            <Text strong type="success">{formatCurrency(detail.rentOptionAmount)}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  const renderRentalOptions = () => {
    if (!orderDetail?.rentalOptions?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <NamedLineItems
        nameFallback={VI.order.detail.unnamedRentalOption}
        emptyDescription={VI.order.detail.empty}
        items={orderDetail.rentalOptions.map((item) => ({
          key: item.id,
          name: item.optionName,
          description: item.description,
        }))}
      />
    );
  };

  const renderAccessories = () => {
    if (!orderDetail?.accessories?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <NamedLineItems
        nameFallback={VI.order.detail.unnamedAccessory}
        emptyDescription={VI.order.detail.empty}
        items={orderDetail.accessories.map((item) => ({
          key: item.id,
          name: item.name,
        }))}
      />
    );
  };

  const renderSurcharges = () => {
    if (!orderDetail?.surcharges?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <NamedLineItems
        nameFallback={VI.order.detail.unnamedSurcharge}
        emptyDescription={VI.order.detail.empty}
        items={orderDetail.surcharges.map((item) => ({
          key: item.id,
          name: item.name,
          description: item.description,
        }))}
      />
    );
  };

  const renderAddresses = () => {
    if (!orderDetail?.addresses?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const cosplayerAddress = orderDetail.addresses.find(a => a.addressFrom === 'COSPLAYER');
    const providerAddress = orderDetail.addresses.find(a => a.addressFrom === 'PROVIDER');

    return (
      <div className="space-y-4">
        {cosplayerAddress && (
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <UserOutlined />
              {VI.order.detail.cosplayerAddress}
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={VI.order.detail.orderId}>{cosplayerAddress.name}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{cosplayerAddress.address}</Descriptions.Item>
              <Descriptions.Item label={VI.profile.address.form.district}>
                {cosplayerAddress.district}
              </Descriptions.Item>
              <Descriptions.Item label="Thành phố">{cosplayerAddress.city}</Descriptions.Item>
              <Descriptions.Item label="SĐT">
                <PhoneOutlined /> {cosplayerAddress.phone}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
        {providerAddress && (
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <ShopOutlined />
              {VI.order.detail.providerAddress}
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={VI.order.detail.orderId}>{providerAddress.name}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{providerAddress.address}</Descriptions.Item>
              <Descriptions.Item label={VI.profile.address.form.district}>
                {providerAddress.district}
              </Descriptions.Item>
              <Descriptions.Item label="Thành phố">{providerAddress.city}</Descriptions.Item>
              <Descriptions.Item label="SĐT">
                <PhoneOutlined /> {providerAddress.phone}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </div>
    );
  };

  const renderTrackings = () => {
    if (!orderDetail?.trackings?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <List
        size="small"
        dataSource={orderDetail.trackings}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.trackingCode}
              description={formatTrackingDescription(item.trackingStatus, item.stage)}
            />
            <Text type="secondary">{formatDate(item.createdAt)}</Text>
          </List.Item>
        )}
      />
    );
  };

  const renderImages = () => {
    if (!orderDetail?.images?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <div className="grid grid-cols-3 gap-2">
        {orderDetail.images.map((img) => (
          <div key={img.id} className="relative overflow-hidden rounded border">
            <img src={img.imageUrl} alt="" className="h-20 w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 text-xs text-white">
              {(VI.order.detail.trackingStageLabels as Record<string, string>)[img.stage] ?? img.stage}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const overviewTab =
    orderDetail ? (
      <div className="space-y-4 pt-1">
        <div>
          <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-foreground">
            <AppstoreOutlined className="text-purple-600" />
            {VI.order.detail.costumeInfo ?? 'Trang phục'}
          </h3>
          {renderCostumeInfo()}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">{VI.order.detail.basicInfo}</h3>
          {renderBasicInfo()}
        </div>

        {!hideExtendActions && orderDetail.status === 'IN_USE' && (
          <div className="flex flex-wrap items-center gap-3">
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setExtendModalOpen(true)}>
              {VI.provider.orders.tabs.extending}
            </Button>
          </div>
        )}

        {!hideExtendActions && orderDetail.status === 'IN_USE' && (
          <div>
            <h3 className="mb-3 flex items-center gap-1 text-sm font-semibold text-foreground">
              <HistoryOutlined className="text-purple-600" />
              {VI.order.extend.extendHistory}
            </h3>
            {extendsLoading ? (
              <div className="flex justify-center py-4">
                <Spin size="small" />
              </div>
            ) : extendsList.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">{VI.order.extend.empty}</p>
            ) : (
              <Table
                dataSource={extendsList}
                rowKey="id"
                size="small"
                pagination={false}
                scroll={{ x: 400 }}
                columns={[
                  {
                    title: VI.order.extend.createdAt,
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    render: (val) => formatDate(val),
                  },
                  {
                    title: VI.order.extend.extendDays,
                    dataIndex: 'extendDays',
                    key: 'extendDays',
                    render: (val) => `${val} ${VI.order.extend.daysSuffix}`,
                  },
                  {
                    title: VI.order.extend.extendPrice,
                    dataIndex: 'extendPrice',
                    key: 'extendPrice',
                    render: (val) => formatCurrency(val),
                  },
                  {
                    title: VI.order.extend.paymentStatus,
                    dataIndex: 'paymentStatus',
                    key: 'paymentStatus',
                    render: (status: ExtendPaymentStatus) => (
                      <Tag color={getExtendPaymentColor(status)}>{VI.order.extend.paymentStatusLabels[status]}</Tag>
                    ),
                  },
                  {
                    title: '',
                    key: 'action',
                    render: (_, record) => (
                      <Button type="link" size="small" onClick={() => handleViewExtend(record.id)}>
                        {VI.order.extend.viewDetail}
                      </Button>
                    ),
                  },
                ]}
              />
            )}
          </div>
        )}
      </div>
    ) : null;

  const rentalTab =
    orderDetail ? (
      <div className="space-y-4 pt-1">
        <div>
          <SubsectionTitle icon={<DollarOutlined className="text-purple-600" />}>
            {VI.order.detail.rentalInfo}
          </SubsectionTitle>
          {renderRentalInfo()}
          {(orderDetail.accessories?.length > 0 || orderDetail.surcharges?.length > 0) && (
            <Text type="secondary" className="mt-2 block text-xs">
              {VI.order.detail.lineItemsHint}
            </Text>
          )}
        </div>
        {!hideRentalOptions && orderDetail.rentalOptions?.length > 0 && (
          <div>
            <SubsectionTitle icon={<AppstoreOutlined className="text-purple-600" />}>
              {VI.order.detail.rentalOptions}
            </SubsectionTitle>
            {renderRentalOptions()}
          </div>
        )}
        {orderDetail.accessories?.length > 0 && (
          <div>
            <SubsectionTitle icon={<GiftOutlined className="text-purple-600" />}>
              {VI.order.detail.accessories}
            </SubsectionTitle>
            {renderAccessories()}
          </div>
        )}
        {orderDetail.surcharges?.length > 0 && (
          <div>
            <SubsectionTitle icon={<PlusCircleOutlined className="text-purple-600" />}>
              {VI.order.detail.surcharges}
            </SubsectionTitle>
            {renderSurcharges()}
          </div>
        )}
      </div>
    ) : null;

  const logisticsTab =
    orderDetail ? (
      <div className="space-y-4 pt-1">
        <div>
          <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-foreground">
            <EnvironmentOutlined className="mr-1" />
            {VI.order.detail.addresses}
          </h3>
          {renderAddresses()}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">{VI.order.detail.trackings}</h3>
          {renderTrackings()}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">{VI.order.detail.images}</h3>
          {renderImages()}
        </div>
      </div>
    ) : null;

  return (
    <>
      <Modal
        title={VI.order.detail.title}
        centered
        open={open}
        onCancel={onClose}
        footer={null}
        width={960}
        destroyOnClose
        styles={{
          body: { maxHeight: 'min(75vh, 800px)', overflowY: 'auto', paddingTop: 8 },
        }}
      >
        {loading ? (
          <div className="flex h-52 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : orderDetail ? (
          <Tabs
            defaultActiveKey="overview"
            items={[
              { key: 'overview', label: 'Tổng quan', children: overviewTab },
              { key: 'rental', label: 'Thuê & dịch vụ', children: rentalTab },
              { key: 'logistics', label: 'Giao nhận & chứng từ', children: logisticsTab },
            ]}
          />
        ) : (
          <Empty description={VI.order.detail.empty} />
        )}
      </Modal>
    <ExtendRentalModal
      open={extendModalOpen}
      onClose={() => setExtendModalOpen(false)}
      onConfirm={async (extendDays: number, paymentMethod: PaymentMethod) => {
        const detailId = orderDetail?.details?.[0]?.id;
        if (!orderId || !detailId) return;
        await extendOrder(orderId, detailId, { extendDays, paymentMethod, payNow: true });
        setExtendModalOpen(false);
        await refetch();
        await refetchExtends();
        onExtendSuccess?.();
      }}
      loading={isExtending}
    />

    {/* Extend Detail Modal */}
    <Modal
      title={VI.order.extend.title}
      open={extendDetailModalOpen}
      onCancel={handleCloseExtendDetail}
      footer={null}
      centered
      width={500}
      styles={{ body: { paddingTop: 8 } }}
    >
      {extendDetailLoading ? (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      ) : extendDetail ? (
        <div className="space-y-3">
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label={VI.order.extend.oldReturnDate}>
              {formatDate(extendDetail.oldReturnDate)}
            </Descriptions.Item>
            <Descriptions.Item label={VI.order.extend.newReturnDate}>
              {formatDate(extendDetail.newReturnDate)}
            </Descriptions.Item>
            <Descriptions.Item label={VI.order.extend.extendDays}>
              {extendDetail.extendDays} {VI.order.extend.daysSuffix}
            </Descriptions.Item>
            <Descriptions.Item label={VI.order.extend.extendPrice}>
              <Typography.Text type="success">{formatCurrency(extendDetail.extendPrice)}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label={VI.order.extend.paymentStatus}>
              <Tag color={getExtendPaymentColor(extendDetail.paymentStatus)}>
                {VI.order.extend.paymentStatusLabels[extendDetail.paymentStatus]}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {extendDetail.paymentStatus === 'PENDING' && extendDetail.paymentUrl && (
            <Button
              type="primary"
              block
              onClick={() => handlePayNow(extendDetail.paymentUrl!)}
            >
              {VI.order.extend.payNow}
            </Button>
          )}
        </div>
      ) : null}
    </Modal>
    </>
  );
}
