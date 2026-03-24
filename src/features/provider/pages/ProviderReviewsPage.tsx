/**
 * ProviderReviewsPage
 *
 * Provider dashboard page for viewing reviews
 * Uses: Page -> Hook -> Service -> API -> axiosInstance
 */

import { Table } from 'antd';
import type { TableProps } from 'antd';
import { Star } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { providerSidebarItems } from '@/features/provider/constants/sidebar';
import { useProviderReviews } from '../hooks/useProviderReviews';
import { VI } from '@/shared/i18n/vi';
import type { ProviderReview } from '../api/provider.api';

export default function ProviderReviewsPage() {
  const { reviews, loading, error, refetch } = useProviderReviews();

  // Convert provider sidebar items to DashboardLayout format
  const sidebarItems: DashboardSidebarItem[] = providerSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-slate-700">{rating}</span>
      </div>
    );
  };

  // Render images count
  const renderImages = (images: ProviderReview['images']) => {
    if (!images || images.length === 0) {
      return <span className="text-slate-400">-</span>;
    }
    return (
      <span className="text-sm text-slate-600">
        {images.length} {images.length === 1 ? 'ảnh' : 'ảnh'}
      </span>
    );
  };

  // Table columns
  const columns: TableProps<ProviderReview>['columns'] = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: VI.provider.reviews.columns.orderId,
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
      render: (orderId: number) => `#${orderId}`,
    },
    {
      title: VI.provider.reviews.columns.rating,
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating: number) => renderRating(rating),
    },
    {
      title: VI.provider.reviews.columns.comment,
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => (
        <span className="text-sm text-slate-600">
          {comment || <span className="text-slate-400">-</span>}
        </span>
      ),
    },
    {
      title: VI.provider.reviews.columns.images,
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images: ProviderReview['images']) => renderImages(images),
    },
    {
      title: VI.provider.reviews.columns.createdAt,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
  ];

  return (
    <DashboardLayout
      title={VI.provider.reviews.title}
      sidebarItems={sidebarItems}
      brandName="CosMate Provider"
    >
      {error && (
        <div style={{ color: '#ff4d4f', marginBottom: 16 }}>
          {error}
        </div>
      )}
      <Table
        dataSource={reviews}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: VI.provider.reviews.empty }}
      />
    </DashboardLayout>
  );
}
