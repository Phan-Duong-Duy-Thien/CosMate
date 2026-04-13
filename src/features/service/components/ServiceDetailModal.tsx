/**
 * ServiceDetailModal Component
 *
 * Displays service detail in a modal.
 * Called by ProviderServiceListPage when user clicks "View".
 */
import { Modal, Image, Typography, Spin, Descriptions, Tag, Row, Col } from 'antd';
import { VI } from '@/shared/i18n/vi';
import type { ServiceItem } from '../types';

const { Text, Paragraph } = Typography;

interface ServiceDetailModalProps {
  open: boolean;
  loading: boolean;
  service: ServiceItem | null;
  error: string | null;
  onClose: () => void;
}

function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return '-';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND';
}

function getStatusTagColor(status: string): string {
  if (status === 'ACTIVE') return 'green';
  if (status === 'INACTIVE') return 'red';
  return 'blue';
}

function getStatusLabel(status: string): string {
  if (status === 'ACTIVE') return VI.service.list.status.active;
  if (status === 'INACTIVE') return VI.service.list.status.inactive;
  return status;
}

function formatAreas(areas: ServiceItem['areas']): string {
  if (!areas || areas.length === 0) return VI.service.list.detail.areasEmpty;
  return areas
    .map((a) => {
      if (typeof a === 'string') return a;
      return `${a.district}, ${a.city}`;
    })
    .join(', ');
}

export function ServiceDetailModal({
  open,
  loading,
  service,
  error,
  onClose,
}: ServiceDetailModalProps) {
  return (
    <Modal
      open={open}
      title={VI.service.list.detail.title}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            {VI.service.list.detail.loading}
          </Text>
        </div>
      )}

      {!loading && error && (
        <Text type="danger">{error}</Text>
      )}

      {!loading && !error && service && (
        <div>
          {/* Service Name */}
          <Typography.Title level={4} style={{ marginBottom: 16 }}>
            {service.serviceName ?? VI.service.list.detail.serviceNameFallback}
          </Typography.Title>

          {/* Images Gallery */}
          <div style={{ marginBottom: 20 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              {VI.service.list.detail.images}
            </Text>
            {service.imageUrls && service.imageUrls.length > 0 ? (
              <Row gutter={[8, 8]}>
                {service.imageUrls.map((url, idx) => (
                  <Col key={idx} span={service.imageUrls.length === 1 ? 24 : 12}>
                    <Image
                      src={url}
                      style={{
                        width: '100%',
                        height: service.imageUrls.length === 1 ? 240 : 120,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Text type="secondary">{VI.service.list.detail.imagesEmpty}</Text>
            )}
          </div>

          {/* Info */}
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label={VI.service.list.detail.serviceType}>
              <Tag color="purple">{service.serviceType}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label={VI.service.list.detail.status}>
              <Tag color={getStatusTagColor(service.status)}>
                {getStatusLabel(service.status)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label={VI.service.list.detail.pricePerSlot}>
              {formatPrice(service.pricePerSlot)}
            </Descriptions.Item>

            <Descriptions.Item label={VI.service.list.detail.minPrice}>
              {formatPrice(service.minPrice)}
            </Descriptions.Item>

            <Descriptions.Item label={VI.service.list.detail.maxPrice}>
              {formatPrice(service.maxPrice)}
            </Descriptions.Item>

            <Descriptions.Item label={VI.service.list.detail.slotDuration}>
              {service.slotDurationHours}{VI.service.list.detail.slotDurationUnit}
            </Descriptions.Item>

            <Descriptions.Item label={VI.service.list.detail.depositAmount}>
              {formatPrice(service.depositAmount)}
            </Descriptions.Item>

            <Descriptions.Item label={VI.service.list.detail.areas}>
              {formatAreas(service.areas)}
            </Descriptions.Item>
          </Descriptions>

          {/* Description */}
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
              {VI.service.list.detail.description}
            </Text>
            {service.description ? (
              <Paragraph style={{ margin: 0 }}>{service.description}</Paragraph>
            ) : (
              <Text type="secondary">{VI.service.list.detail.descriptionEmpty}</Text>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}