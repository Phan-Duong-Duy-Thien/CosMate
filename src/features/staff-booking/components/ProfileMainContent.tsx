import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Spin } from 'antd';
import { PortfolioGrid } from '../mocks/PortfolioGrid';
import { Star, Clock, CheckCircle2, ChevronRight, Camera, ShieldCheck, MapPin, ImageIcon } from 'lucide-react';
import type { PortfolioImage } from '../types';
import { usePublicProviderServices } from '@/features/service/hooks/usePublicProviderServices';
import type { ServiceItem } from '@/features/service/types';

interface ProfileMainContentProps {
  portfolioItems: PortfolioImage[];
  providerId: number | undefined;
}

export const ProfileMainContent: React.FC<ProfileMainContentProps> = ({ portfolioItems, providerId }) => {
  const navigate = useNavigate();
  const { services: apiServices, loading: servicesLoading, error: servicesError } = usePublicProviderServices(providerId);
  // Mặc định chọn tab đầu tiên
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

  const reviews = [
    {
      id: 1,
      user: 'Sakura Haruno',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      rating: 5,
      date: '2 tuần trước',
      comment: 'Dũng làm việc cực có tâm! Anh ấy thực sự hiểu style "anime" mà mình muốn. Ánh sáng đánh rất đẹp và Dũng hướng dẫn pose dáng nhiệt tình dù đây là lần đầu mình đi chụp.',
    },
    {
      id: 2,
      user: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5,
      date: '1 tháng trước',
      comment: 'Staff hỗ trợ tốt nhất mình từng làm việc cho bộ ảnh Cyberpunk. Kỹ năng hậu kỳ (edit) quá đỉnh. Rất đáng tiền, mọi người nên book nhé!',
    }
  ];

  return (
    <div className="flex-1 min-w-0">
      {/* Tabs Menu */}
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

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* TAB 1: PORTFOLIO */}
          {activeTab === 'Portfolio' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-cosmate-ink">Dự án nổi bật</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-cosmate-lavender-surface text-cosmate-text-soft text-xs font-bold rounded-full cursor-pointer hover:bg-cosmate-lavender hover:text-white transition-colors">Tất cả</span>
                  <span className="px-3 py-1 bg-white text-cosmate-lavender-muted text-xs font-bold rounded-full border border-cosmate-lavender-border cursor-pointer hover:border-cosmate-lavender transition-colors">Fantasy</span>
                  <span className="px-3 py-1 bg-white text-cosmate-lavender-muted text-xs font-bold rounded-full border border-cosmate-lavender-border cursor-pointer hover:border-cosmate-lavender transition-colors">Sci-Fi</span>
                  <span className="px-3 py-1 bg-white text-cosmate-lavender-muted text-xs font-bold rounded-full border border-cosmate-lavender-border cursor-pointer hover:border-cosmate-lavender transition-colors">Đường phố</span>
                </div>
              </div>
              <PortfolioGrid images={portfolioItems} />
            </div>
          )}

          {/* TAB 2: GÓI DỊCH VỤ */}
          {activeTab === 'Gói dịch vụ' && (
            <div>
              {servicesLoading && (
                <div className="flex justify-center py-16">
                  <Spin size="large" />
                </div>
              )}
              {!servicesLoading && servicesError && (
                <div className="text-center py-16 text-cosmate-lavender-muted">
                  {servicesError}
                </div>
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
                      className="bg-white border border-cosmate-lavender-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-cosmate-lavender-border/50 transition-all group flex flex-col"
                    >
                      {service.imageUrls && service.imageUrls.length > 0 ? (
                        <div className="w-full h-40 overflow-hidden bg-cosmate-lavender-surface">
                          <img
                            src={service.imageUrls[0]}
                            alt={service.serviceType}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-cosmate-lavender-surface flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-cosmate-icon-dim" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="mb-3">
                          <h3 className="text-base font-bold text-cosmate-ink mb-1">{service.serviceName || service.serviceType}</h3>
                          <div className="text-xl font-black text-cosmate-lavender">{formatPrice(service)}</div>
                        </div>

                        <div className="space-y-2 mb-4 flex-1">
                          {service.description && (
                            <p className="text-xs text-cosmate-text-soft line-clamp-2">{service.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-cosmate-mauve">
                            <Clock className="w-3.5 h-3.5 text-cosmate-lavender-muted" />
                            <span>Thời lượng: <span className="font-bold">{formatDuration(service.slotDurationHours)}</span></span>
                          </div>
                          {service.depositAmount != null && service.depositAmount > 0 && (
                            <div className="flex items-center gap-2 text-xs text-cosmate-mauve">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                              <span>Đặt cọc: <span className="font-bold">{service.depositAmount.toLocaleString('vi-VN')}đ</span></span>
                            </div>
                          )}
                          {service.areas && service.areas.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-cosmate-mauve">
                              <MapPin className="w-3.5 h-3.5 text-cosmate-lavender-muted" />
                              <span className="line-clamp-1">{service.areas[0]}</span>
                            </div>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleViewDetail(service.id)}
                          className="w-full py-2.5 bg-cosmate-lavender-surface text-cosmate-text-soft font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-cosmate-lavender group-hover:text-white transition-all shadow-sm text-sm"
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

          {/* TAB 3: ĐIỀU KHOẢN */}
          {activeTab === 'Điều khoản' && (
            <div className="bg-white border border-cosmate-lavender-border rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-cosmate-ink">Điều khoản & Chính sách</h2>
              <div className="space-y-4">
                <section>
                  <h3 className="font-bold text-cosmate-ink mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cosmate-lavender" />
                    Đặt cọc & Hủy lịch
                  </h3>
                  <p className="text-sm text-cosmate-mauve leading-relaxed">
                    Khách hàng cần đặt cọc để giữ lịch chụp (không hoàn lại). Nếu hủy lịch trước 48 giờ, bạn được hỗ trợ dời lịch 01 lần mà không mất cọc.
                  </p>
                </section>
                <section>
                  <h3 className="font-bold text-cosmate-ink mb-2 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-cosmate-lavender" />
                    Quyền sử dụng hình ảnh
                  </h3>
                  <p className="text-sm text-cosmate-mauve leading-relaxed">
                    Hình ảnh chỉ sử dụng cho mục đích cá nhân và portfolio. Nếu sử dụng cho mục đích thương mại, vui lòng liên hệ để thỏa thuận phí bản quyền.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 4: ĐÁNH GIÁ */}
          {activeTab === 'Đánh giá' && (
            <div className="space-y-6">
              <div className="bg-cosmate-lavender-surface rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-black text-cosmate-ink mb-1">4.9</div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-cosmate-star text-cosmate-star' : 'text-cosmate-icon-dim'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] uppercase font-bold text-cosmate-lavender-muted">Dựa trên 150 đánh giá</p>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-cosmate-ink w-3">{rating}</span>
                      <div className="flex-1 h-2 bg-cosmate-lavender-hover-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cosmate-lavender" 
                          style={{ width: `${rating === 5 ? 90 : rating === 4 ? 8 : 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-cosmate-lavender-border rounded-3xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-cosmate-ink">{review.user}</h4>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-cosmate-star text-cosmate-star' : 'text-cosmate-icon-dim'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-cosmate-lavender-muted font-medium">{review.date}</span>
                  </div>
                  <p className="text-cosmate-mauve text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};