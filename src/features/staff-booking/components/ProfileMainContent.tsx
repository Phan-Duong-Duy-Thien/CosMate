import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Spin } from 'antd';
import { PortfolioGrid } from '../mocks/PortfolioGrid';
import { Star, Clock, CheckCircle2, ChevronRight, Camera, ShieldCheck, MapPin, ImageIcon, Loader2 } from 'lucide-react';
import type { PortfolioImage } from '../types';
import { usePublicProviderServices } from '@/features/service/hooks/usePublicProviderServices';
import type { ServiceItem } from '@/features/service/types';
import { useProviderPublicReviews } from '@/features/provider/hooks/useProviderPublicReviews';
import { ProviderReplyBlock } from '@/shared/components/ProviderReplyBlock';
import {
  getReviewReviewerInitial,
  getReviewReviewerName,
  resolveReviewAvatarUrl,
} from '@/shared/utils/reviewDisplay';
import { VI } from '@/shared/i18n/vi';

interface ProfileMainContentProps {
  portfolioItems: PortfolioImage[];
  providerId: number | undefined;
}

export const ProfileMainContent: React.FC<ProfileMainContentProps> = ({ portfolioItems, providerId }) => {
  const navigate = useNavigate();
  const { services: apiServices, loading: servicesLoading, error: servicesError } = usePublicProviderServices(providerId);
  const { reviews: providerReviews, loading: reviewsLoading, error: reviewsError } =
    useProviderPublicReviews(providerId);
  const [activeTab, setActiveTab] = useState('Portfolio');

  const tabs = ['Portfolio', 'Gói dịch vụ', 'Đánh giá', 'Điều khoản'];

  const formatPrice = (item: ServiceItem): string => {
    if (item.minPrice != null && item.maxPrice != null && item.minPrice > 0 && item.maxPrice > 0) {
      return `${item.minPrice.toLocaleString('vi-VN')} - ${item.maxPrice.toLocaleString('vi-VN')}đ`;
    }
    if (item.pricePerSlot > 0) {
      return `${item.pricePerSlot.toLocaleString('vi-VN')}đ`;
    }
    return 'Liên hệ';
  };

  const formatDuration = (hours: number): string => {
    if (hours >= 8) return 'Cả ngày';
    return `${hours} Giờ`;
  };

  const handleViewDetail = (serviceId: number) => {
    navigate(`/service/${serviceId}`, {
      state: { providerType: 'staff', providerId },
    });
  };

  const reviewStats = useMemo(() => {
    const n = providerReviews.length;
    if (n === 0) {
      return { avg: 0, total: 0, dist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number> };
    }
    const sum = providerReviews.reduce((s, r) => s + (r.rating ?? 0), 0);
    const avg = Math.round((sum / n) * 10) / 10;
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of providerReviews) {
      const k = Math.min(5, Math.max(1, Math.round(Number(r.rating))));
      dist[k] = (dist[k] ?? 0) + 1;
    }
    return { avg, total: n, dist };
  }, [providerReviews]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmate.site';
  const resolveMediaUrl = (url: string) =>
    !url ? '' : url.startsWith('http://') || url.startsWith('https://') ? url : `${API_BASE}${url}`;

  const formatReviewDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-8 border-b border-cosmate-lavender-border mb-8 sticky top-24 bg-white/80 backdrop-blur-md z-10 py-2 px-4 rounded-2xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === tab ? 'text-cosmate-ink' : 'text-cosmate-lavender-muted'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-cosmate-lavender rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'Portfolio' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-cosmate-ink">Dự án nổi bật</h2>
              </div>
              <PortfolioGrid images={portfolioItems} />
            </div>
          )}

          {activeTab === 'Gói dịch vụ' && (
            <div>
              {servicesLoading && (
                <div className="flex justify-center py-16">
                  <Spin size="large" />
                </div>
              )}
              {!servicesLoading && servicesError && (
                <div className="text-center py-16 text-cosmate-lavender-muted">{servicesError}</div>
              )}
              {!servicesLoading && !servicesError && apiServices.length === 0 && (
                <div className="text-center py-16 space-y-2">
                  <ImageIcon className="w-12 h-12 mx-auto text-cosmate-icon-dim" />
                  <p className="text-cosmate-lavender-muted font-medium">Nhà cung cấp này chưa có dịch vụ nào.</p>
                </div>
              )}
              {!servicesLoading && !servicesError && apiServices.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {apiServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white border border-cosmate-lavender-border rounded-3xl overflow-hidden hover:shadow-xl transition-all group flex flex-col"
                    >
                      {service.imageUrls && service.imageUrls.length > 0 ? (
                        <div className="w-full h-40 overflow-hidden bg-cosmate-lavender-surface">
                          <img src={service.imageUrls[0]} alt={service.serviceType} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-cosmate-lavender-surface flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-cosmate-icon-dim" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-bold text-cosmate-ink mb-1">{service.serviceName || service.serviceType}</h3>
                        <div className="text-xl font-black text-cosmate-lavender mb-4">{formatPrice(service)}</div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleViewDetail(service.id)}
                          className="mt-auto w-full py-2.5 bg-cosmate-lavender-surface text-cosmate-text-soft font-bold rounded-xl flex items-center justify-center gap-2 text-sm"
                        >
                          Xem chi tiết dịch vụ
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Điều khoản' && (
            <div className="bg-white border border-cosmate-lavender-border rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-cosmate-ink">Điều khoản & Chính sách</h2>
              <p className="text-sm text-cosmate-mauve leading-relaxed">
                Khách hàng cần đặt cọc để giữ lịch. Liên hệ provider để biết thêm chi tiết.
              </p>
            </div>
          )}

          {activeTab === 'Đánh giá' && (
            <div className="space-y-6">
              {reviewsLoading && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-cosmate-lavender-border bg-cosmate-lavender-surface py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-cosmate-lavender" aria-hidden />
                  <p className="mt-3 text-sm font-bold text-cosmate-ink">Đang tải đánh giá…</p>
                </div>
              )}
              {!reviewsLoading && reviewsError && (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm font-semibold text-red-800">
                  {reviewsError}
                </div>
              )}
              {!reviewsLoading && !reviewsError && providerReviews.length === 0 && (
                <div className="rounded-3xl border border-dashed border-cosmate-lavender-border bg-white px-8 py-12 text-center">
                  <Star className="mx-auto h-10 w-10 text-cosmate-icon-dim" aria-hidden />
                  <p className="mt-4 text-base font-bold text-cosmate-ink">Chưa có đánh giá nào</p>
                </div>
              )}
              {!reviewsLoading && !reviewsError && providerReviews.length > 0 && (
                <>
                  <div className="bg-cosmate-lavender-surface rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-black text-cosmate-ink mb-1">{reviewStats.avg.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= Math.round(reviewStats.avg) ? 'fill-cosmate-star text-cosmate-star' : 'text-cosmate-icon-dim'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] uppercase font-bold text-cosmate-lavender-muted">
                        {reviewStats.total} đánh giá
                      </p>
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviewStats.dist[rating] ?? 0;
                        const pct = reviewStats.total > 0 ? Math.round((count / reviewStats.total) * 100) : 0;
                        return (
                          <div key={rating} className="flex items-center gap-4">
                            <span className="text-xs font-bold text-cosmate-ink w-3">{rating}</span>
                            <div className="flex-1 h-2 bg-cosmate-lavender-hover-border rounded-full overflow-hidden">
                              <div className="h-full bg-cosmate-lavender" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-xs text-cosmate-lavender-muted">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {providerReviews.map((review) => (
                    <div key={review.id} className="bg-white border border-cosmate-lavender-border rounded-3xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-cosmate-ink">
                            {getReviewReviewerName(review, VI.provider.reviews.detailReviewerFallback)}
                          </h4>
                          <div className="mt-1 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= review.rating ? 'fill-cosmate-star text-cosmate-star' : 'text-cosmate-icon-dim'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-cosmate-lavender-muted font-medium">
                          {formatReviewDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-cosmate-mauve text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                      {review.images && review.images.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {review.images.map((img) => (
                            <img
                              key={img.id}
                              src={resolveMediaUrl(img.url)}
                              alt=""
                              className="h-20 w-20 rounded-xl border border-cosmate-lavender-border object-cover"
                            />
                          ))}
                        </div>
                      ) : null}
                      <ProviderReplyBlock
                        providerReply={review.providerReply}
                        repliedAt={review.repliedAt}
                        variant="lavender"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

