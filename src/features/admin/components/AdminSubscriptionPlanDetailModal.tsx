/**
 * Presentational modal — subscription plan detail (admin theme).
 * No API calls; receives plan data via props.
 */

import type { ReactNode } from 'react';
import { Modal, Tag, Button, Typography } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { AdminSubscriptionPlan } from '../types';
import { formatBillingCycleMonths } from '../utils/formatBillingCycleMonths';

const { Text } = Typography;

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const formatDateTime = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('vi-VN');
};

interface AdminSubscriptionPlanDetailModalProps {
  open: boolean;
  plan: AdminSubscriptionPlan | null;
  onClose: () => void;
}

function DetailStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-cosmate-lavender-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-lg bg-cosmate-lavender-surface text-primary">
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-base font-semibold text-foreground tabular-nums">{value}</div>
    </div>
  );
}

export function AdminSubscriptionPlanDetailModal({
  open,
  plan,
  onClose,
}: AdminSubscriptionPlanDetailModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={560}
      destroyOnClose
      footer={
        <div className="flex justify-end">
          <Button type="primary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
      title={
        <span className="inline-flex items-center gap-2 text-foreground">
          <CrownOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
          Chi tiết gói đăng ký
        </span>
      }
      styles={{
        body: { paddingTop: 4, paddingBottom: 8 },
      }}
    >
      {plan && (
        <div className="space-y-4">
          {/* Hero */}
          <div className="rounded-xl border border-cosmate-lavender-border bg-gradient-to-br from-cosmate-lavender-surface to-cosmate-lavender-surface-alt px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-bold text-cosmate-ink">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold text-cosmate-pink tabular-nums">
                  {formatVnd(plan.price)}
                </p>
              </div>
              <Tag
                color={plan.isActive ? 'success' : 'default'}
                className="!m-0 !rounded-full !px-3 !py-0.5 !text-xs !font-semibold"
              >
                {plan.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
              </Tag>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailStat
              icon={<CalendarOutlined />}
              label="Chu kỳ thanh toán"
              value={formatBillingCycleMonths(plan.cycleMonths, plan.billingCycle)}
            />
            <DetailStat
              icon={<ThunderboltOutlined />}
              label="Token mỗi tháng"
              value={plan.monthlyToken.toLocaleString('vi-VN')}
            />
          </div>

          {/* Description */}
          <div className="rounded-xl border border-cosmate-lavender-border bg-muted/40 px-4 py-3">
            <Text type="secondary" className="!mb-1.5 !block !text-xs !font-semibold uppercase tracking-wide">
              Mô tả
            </Text>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {plan.description?.trim() ? plan.description : '—'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ClockCircleOutlined />
              Tạo lúc:{' '}
              <span className="font-medium text-foreground">{formatDateTime(plan.createdAt)}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ClockCircleOutlined />
              Cập nhật:{' '}
              <span className="font-medium text-foreground">{formatDateTime(plan.updatedAt)}</span>
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
