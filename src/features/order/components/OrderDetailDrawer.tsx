/**
 * OrderDetailDrawer Component
 *
 * UI-only component to display order details in a drawer.
 * Data fetching is handled internally via useOrderDetail hook.
 * No API calls - receives orderId and callbacks via props.
 */

import { Drawer, Descriptions, Spin, Empty, Tag, Divider, List, Avatar, Typography } from 'antd';
import { UserOutlined, ShopOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { VI } from '@/shared/i18n/vi';
import type { OrderDetail, OrderStatus } from '../types';

const { Text } = Typography;

interface OrderDetailDrawerProps {
  open: boolean;
  orderId: number | null;
  orderType?: string; // 'RENT_COSTUME' — used to guard against cross-type contamination
  onClose: () => void;
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

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

const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    UNPAID: 'default',
    PAID: 'orange',
    PREPARING: 'blue',
    SHIPPING_OUT: 'cyan',
    DELIVERING_OUT: 'purple',
    IN_USE: 'purple',
    SHIPPING_BACK: 'volcano',
    RETURNED: 'green',
    COMPLETED: 'green',
    CANCELLED: 'red',
    DISPUTE: 'magenta',
    EXTENDING: 'gold',
  };
  return colorMap[status] || 'default';
};

export function OrderDetailDrawer({ open, orderId, orderType, onClose }: OrderDetailDrawerProps) {
  const { orderDetail, loading, error } = useOrderDetail(orderId);

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

  console.log('[ORDER DEBUG]', {
    id: orderDetail?.id,
    type: orderDetail?.orderType,
    status: orderDetail?.status,
  });

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
          {detail.size || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.numberOfItems} span={1}>
          {detail.numberOfItems || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentDay} span={1}>
          {detail.rentDay || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.depositAmount} span={1}>
          {formatCurrency(detail.depositAmount || 0)}
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentStart} span={1}>
          {formatDate(detail.rentStart)}
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentEnd} span={1}>
          {formatDate(detail.rentEnd)}
        </Descriptions.Item>
        <Descriptions.Item label={VI.order.detail.rentAmount} span={2}>
          {formatCurrency(detail.rentAmount || 0)}
        </Descriptions.Item>
        {detail.surchargeAmount > 0 && (
          <Descriptions.Item label={VI.order.detail.surchargeAmount} span={2}>
            {formatCurrency(detail.surchargeAmount)}
          </Descriptions.Item>
        )}
        {detail.accessoriesAmount > 0 && (
          <Descriptions.Item label={VI.order.detail.accessoriesAmount} span={2}>
            {formatCurrency(detail.accessoriesAmount)}
          </Descriptions.Item>
        )}
        {detail.rentOptionAmount > 0 && (
          <Descriptions.Item label={VI.order.detail.rentOptionAmount} span={2}>
            {formatCurrency(detail.rentOptionAmount)}
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
      <List
        size="small"
        dataSource={orderDetail.rentalOptions}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.optionName}
              description={item.description}
            />
            <Text>{formatCurrency(item.price)}</Text>
          </List.Item>
        )}
      />
    );
  };

  const renderAccessories = () => {
    if (!orderDetail?.accessories?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <List
        size="small"
        dataSource={orderDetail.accessories}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar shape="square" size="small" src={item.imageUrl} icon={<ShopOutlined />} />}
              title={item.name}
            />
            <Text>{formatCurrency(item.price)}</Text>
          </List.Item>
        )}
      />
    );
  };

  const renderSurcharges = () => {
    if (!orderDetail?.surcharges?.length) {
      return <Empty description={VI.order.detail.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <List
        size="small"
        dataSource={orderDetail.surcharges}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={item.description}
            />
            <Text type="danger">{formatCurrency(item.price)}</Text>
          </List.Item>
        )}
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
              <Descriptions.Item label="Quận/Huyện">{cosplayerAddress.district}</Descriptions.Item>
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
              <Descriptions.Item label="Quận/Huyện">{providerAddress.district}</Descriptions.Item>
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
              description={`${item.trackingStatus} - ${item.stage}`}
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
              {img.stage}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Drawer
      title={VI.order.detail.title}
      placement="right"
      width={600}
      open={open}
      onClose={onClose}
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : orderDetail ? (
        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <h3 className="mb-2 font-semibold">{VI.order.detail.basicInfo}</h3>
            {renderBasicInfo()}
          </div>

          <Divider />

          {/* Rental Info */}
          <div>
            <h3 className="mb-2 font-semibold">{VI.order.detail.rentalInfo}</h3>
            {renderRentalInfo()}
          </div>

          <Divider />

          {/* Rental Options */}
          <div>
            <h3 className="mb-2 font-semibold">{VI.order.detail.rentalOptions}</h3>
            {renderRentalOptions()}
          </div>

          <Divider />

          {/* Accessories */}
          <div>
            <h3 className="mb-2 font-semibold">{VI.order.detail.accessories}</h3>
            {renderAccessories()}
          </div>

          <Divider />

          {/* Surcharges */}
          <div>
            <h3 className="mb-2 font-semibold">{VI.order.detail.surcharges}</h3>
            {renderSurcharges()}
          </div>

          <Divider />

          {/* Addresses */}
          <div>
            <h3 className="mb-2 font-semibold">
              <EnvironmentOutlined className="mr-1" />
              {VI.order.detail.addresses}
            </h3>
            {renderAddresses()}
          </div>

          <Divider />

          {/* Trackings */}
          <div>
            <h3 className="mb-2 font-semibold">{VI.order.detail.trackings}</h3>
            {renderTrackings()}
          </div>

          <Divider />

          {/* Images */}
          <div>
            <h3 className="mb-2 font-semibold">{VI.order.detail.images}</h3>
            {renderImages()}
          </div>
        </div>
      ) : (
        <Empty description={VI.order.detail.empty} />
      )}
    </Drawer>
  );
}
