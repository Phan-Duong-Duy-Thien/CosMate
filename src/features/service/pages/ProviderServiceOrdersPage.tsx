/**
 * Provider Service Orders Page
 *
 * Displays all service orders for the provider (photographer/event-staff)
 * with server-side status filtering.
 *
 * Data flow: Page → hook → service → API → axiosInstance
 */
import { useState } from 'react';
import { Spin, Tooltip, Button, Modal } from 'antd';
import { CalendarClock, PackageCheck, Clock, PlayCircle, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { photographSidebarItems, eventStaffSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderServiceOrders, type ProviderServiceOrderTab } from '../hooks/useProviderServiceOrders';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { ROLE } from '@/types/auth';
import { VI } from '@/shared/i18n/vi';
import type { ServiceOrder } from '../api/booking.api';
import { ORDER_STATUS, ORDER_STATUS_UI, URGENT_STATUSES, type OrderStatusValue } from '@/constants/orderStatus';

// ─── Sidebar / Layout Helpers ─────────────────────────────────────────────────

function deriveSidebarItems(): DashboardSidebarItem[] {
  const roles = getRoles();
  const base = roles.includes(ROLE.PROVIDER_PHOTOGRAPH)
    ? photographSidebarItems
    : eventStaffSidebarItems;
  return base.map((item) => {
    const Icon = item.icon;
    return { key: item.key, label: item.label, icon: <Icon size={18} />, path: item.path };
  });
}

function deriveBrandName(): string {
  const roles = getRoles();
  return roles.includes(ROLE.PROVIDER_PHOTOGRAPH) ? 'CosMate Photographer' : 'CosMate Event Staff';
}

// ─── Status Tabs (driven by centralized config) ──────────────────────────────

const STATUS_TABS: Array<{ key: ProviderServiceOrderTab; label: string }> = [
  { key: 'all', label: VI.profile.orders.tabAll },
  { key: 'UNCONFIRM', label: VI.profile.serviceOrders.statusUnconfirm },
  { key: 'UNPAID', label: VI.profile.serviceOrders.statusUnpaid },
  { key: 'PAID', label: VI.profile.serviceOrders.statusPaid },
  { key: 'WAITING_SERVICE_DATE', label: VI.profile.serviceOrders.statusWaitingServiceDate },
  { key: 'IN_SERVICE', label: VI.profile.serviceOrders.statusInService },
  { key: 'COMPLETED', label: VI.profile.serviceOrders.statusCompleted },
  { key: 'DISPUTE', label: VI.profile.serviceOrders.statusDispute },
  { key: 'CANCELLED', label: VI.profile.serviceOrders.statusCancelled },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const uiConfig = ORDER_STATUS_UI[status as OrderStatusValue];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        uiConfig?.badgeClass ?? 'bg-slate-100 text-slate-600'
      }`}
    >
      {uiConfig?.label ?? status}
    </span>
  );
}

// ─── Order Card ────────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: ServiceOrder;
  isUrgent: boolean;
  onSetWaiting: (orderId: number) => void;
  onStartService: (orderId: number) => void;
  onCompleteService: (orderId: number) => void;
  isActionLoading: boolean;
}

function OrderCard({ order, isUrgent, onSetWaiting, onStartService, onCompleteService, isActionLoading }: OrderCardProps) {
  const orderCode = `${VI.profile.serviceOrders.orderCodePrefix}-${String(order.id).padStart(4, '0')}`;
  const uiConfig = ORDER_STATUS_UI[order.status as OrderStatusValue];
  const canSetWaiting = uiConfig?.actions.includes('SET_WAITING');
  const canStartService = uiConfig?.actions.includes('START_SERVICE');
  const canCompleteService = uiConfig?.actions.includes('COMPLETE_SERVICE');

  return (
    <div
      className={`flex gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-md ${
        isUrgent ? 'border-orange-300 ring-1 ring-orange-100' : 'border-slate-200'
      }`}
    >
      {/* Left: Icon */}
      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purple-50">
        <CalendarClock className="h-10 w-10 text-purple-400" />
      </div>

      {/* Middle: Info */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-slate-900">
              {VI.profile.serviceOrders.orderTitle}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-slate-500">{orderCode}</p>
          </div>
          <div className="ml-2 flex flex-col items-end gap-1">
            <StatusBadge status={order.status} />
            {canSetWaiting && (
              <Button
                size="small"
                type="default"
                loading={isActionLoading}
                onClick={() => onSetWaiting(order.id)}
                icon={<Clock size={12} />}
                className="flex items-center gap-1 text-xs"
              >
                {VI.profile.serviceOrders.setWaiting}
              </Button>
            )}
            {canStartService && (
              <Button
                size="small"
                type="primary"
                loading={isActionLoading}
                onClick={() => onStartService(order.id)}
                icon={<PlayCircle size={12} />}
                className="flex items-center gap-1 text-xs"
              >
                {VI.profile.serviceOrders.startService}
              </Button>
            )}
            {canCompleteService && (
              <Button
                size="small"
                type="primary"
                loading={isActionLoading}
                onClick={() => onCompleteService(order.id)}
                icon={<CheckCircle size={12} />}
                className="flex items-center gap-1 text-xs"
              >
                {VI.profile.serviceOrders.completeService}
              </Button>
            )}
          </div>
        </div>

        {/* Middle row: cosplayer name + created date */}
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>{order.cosplayerName ?? `Cosplayer ID: ${order.cosplayerId}`}</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>

        {/* Bookings summary */}
        <div className="mt-2 flex flex-col gap-1">
          {order.bookings.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              className="flex flex-wrap items-center gap-x-3 text-xs text-slate-600"
            >
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">
                {formatDate(booking.bookingDate)}
              </span>
              <span>{booking.timeSlot}</span>
              <span>{booking.numberOfHuman} {VI.profile.serviceOrders.cardPeopleCount}</span>
              <span className="text-slate-400">
                {VI.profile.serviceOrders.cardSlotAmount}: {booking.rentSlotAmount}
              </span>
            </div>
          ))}
          {order.bookings.length > 3 && (
            <span className="text-xs text-slate-400">
              +{order.bookings.length - 3} {VI.profile.serviceOrders.cardMoreBookings}
            </span>
          )}
        </div>
      </div>

      {/* Right: Total amount */}
      <div className="flex flex-col items-end justify-between text-right">
        <span className="text-base font-bold text-purple-600">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProviderServiceOrdersPage() {
  const {
    orders,
    loading,
    error,
    refetch,
    selectedStatus,
    setStatus,
    setWaitingStatus,
    startService,
    completeService,
    loadingAction,
  } = useProviderServiceOrders();

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; orderId: number | null; type: 'setWaiting' | 'startService' | 'completeService' }>({
    open: false,
    orderId: null,
    type: 'setWaiting',
  });

  const sidebarItems: DashboardSidebarItem[] = deriveSidebarItems();
  const brandName = deriveBrandName();

  // Calculate counts for each status
  const counts = STATUS_TABS.reduce<Record<string, number>>((acc, tab) => {
    if (tab.key === 'all') {
      acc[tab.key] = orders.length;
    } else {
      acc[tab.key] = orders.filter((o) => o.status === tab.key).length;
    }
    return acc;
  }, {});

  const handleSetWaitingClick = (orderId: number) => {
    setConfirmModal({ open: true, orderId, type: 'setWaiting' });
  };

  const handleStartServiceClick = (orderId: number) => {
    setConfirmModal({ open: true, orderId, type: 'startService' });
  };

  const handleCompleteServiceClick = (orderId: number) => {
    setConfirmModal({ open: true, orderId, type: 'completeService' });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.orderId !== null) {
      if (confirmModal.type === 'startService') {
        await startService(confirmModal.orderId);
      } else if (confirmModal.type === 'completeService') {
        await completeService(confirmModal.orderId);
      } else {
        await setWaitingStatus(confirmModal.orderId);
      }
      setConfirmModal({ open: false, orderId: null, type: 'setWaiting' });
    }
  };

  const handleCancelConfirm = () => {
    setConfirmModal({ open: false, orderId: null, type: 'setWaiting' });
  };

  return (
    <>
      <Modal
        title={
          confirmModal.type === 'startService'
            ? VI.profile.serviceOrders.startServiceModalTitle
            : confirmModal.type === 'completeService'
              ? VI.profile.serviceOrders.completeServiceModalTitle
              : VI.profile.serviceOrders.setWaitingModalTitle
        }
        open={confirmModal.open}
        onOk={handleConfirmAction}
        onCancel={handleCancelConfirm}
        okText={
          confirmModal.type === 'startService'
            ? VI.profile.serviceOrders.startServiceModalOk
            : confirmModal.type === 'completeService'
              ? VI.profile.serviceOrders.completeServiceModalOk
              : VI.profile.serviceOrders.setWaitingModalOk
        }
        cancelText={VI.common.actions.cancel}
        confirmLoading={confirmModal.orderId !== null && loadingAction === confirmModal.orderId}
      >
        <p>
          {confirmModal.type === 'startService'
            ? VI.profile.serviceOrders.startServiceModalMessage
            : confirmModal.type === 'completeService'
              ? VI.profile.serviceOrders.completeServiceModalMessage
              : VI.profile.serviceOrders.setWaitingModalMessage}
        </p>
      </Modal>

      <DashboardLayout
        title={VI.provider.serviceOrders.title}
        sidebarItems={sidebarItems}
        showChatButton={false}
        brandName={brandName}
      >
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Sticky status filter bar */}
        <div className="sticky top-0 z-10 mb-4 bg-white/95 py-3 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => {
              const isActive = selectedStatus === tab.key;
              const count = counts[tab.key] ?? 0;
              const isUrgent = URGENT_STATUSES.has(tab.key as OrderStatusValue) && count > 0;

              return (
                <Tooltip key={tab.key} title={tab.label} placement="top">
                  <button
                    type="button"
                    onClick={() => setStatus(tab.key)}
                    className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : isUrgent
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold leading-none ${
                          isActive
                            ? 'bg-white text-purple-600'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
            <span className="ml-3 text-slate-500">{VI.common.status.loading}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-12 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              {VI.profile.serviceOrders.empty}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isUrgent={URGENT_STATUSES.has(order.status as OrderStatusValue)}
                onSetWaiting={handleSetWaitingClick}
                onStartService={handleStartServiceClick}
                onCompleteService={handleCompleteServiceClick}
                isActionLoading={loadingAction === order.id}
              />
            ))}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
