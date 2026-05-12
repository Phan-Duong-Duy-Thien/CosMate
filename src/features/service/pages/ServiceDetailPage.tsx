/**
 * ServiceDetailPage
 *
 * Public page showing full details of a single service.
 * Route: /service/:serviceId
 */
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ArrowLeft, Clock, MapPin, CheckCircle2, ImageIcon, MessageCircle } from 'lucide-react';
import { useServiceDetail } from '../hooks/useServiceDetail';
import { useStartChat } from '@/features/chat/hooks/useStartChat';

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const id = serviceId ? Number(serviceId) : undefined;

  const { service, loading, error } = useServiceDetail(id);
  const { startChat, loading: chatLoading } = useStartChat();

  if (loading) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]">
        <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] px-10 py-12 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" aria-hidden />
          <p className="mt-4 text-center text-sm font-extrabold text-indigo-950">Đang tải dịch vụ…</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="home-anime flex min-h-screen flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]">
        <div className="max-w-md rounded-[1.25rem] border-[4px] border-indigo-950/35 bg-[#fffbeb] px-8 py-10 text-center shadow-[8px_8px_0_0_rgba(30,27,75,0.25)]">
          <p className="font-extrabold text-indigo-950">{error ?? "Không tìm thấy dịch vụ."}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl border-[3px] border-indigo-950 bg-white px-5 py-2.5 text-sm font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] hover:bg-pink-50"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (): string => {
    if (service.minPrice != null && service.maxPrice != null && service.minPrice > 0 && service.maxPrice > 0) {
      return `${service.minPrice.toLocaleString('vi-VN')} - ${service.maxPrice.toLocaleString('vi-VN')}đ`;
    }
    if (service.pricePerSlot > 0) {
      return `${service.pricePerSlot.toLocaleString('vi-VN')}đ`;
    }
    return 'Liên hệ';
  };

  const formatDuration = (hours: number): string => {
    if (hours >= 8) return 'Cả ngày';
    return `${hours} Giờ`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-[#FFD7E5] selection:text-[#4A3B6B] font-sans">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#A090C5] hover:text-[#B59DFF] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* Main card */}
        <div className="bg-white border border-[#F0E6FF] rounded-3xl overflow-hidden">
          {/* Cover image */}
          {service.imageUrls && service.imageUrls.length > 0 ? (
            <div className="w-full h-72 overflow-hidden bg-[#F5F1FF]">
              <img
                src={service.imageUrls[0]}
                alt={service.serviceType}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-72 bg-[#F5F1FF] flex items-center justify-center">
              <ImageIcon className="w-20 h-20 text-[#D7D0E5]" />
            </div>
          )}

          <div className="p-8 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#4A3B6B] mb-1">{service.serviceType}</h1>
                  <div className="text-3xl font-black text-[#B59DFF]">{formatPrice()}</div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  service.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {service.status === 'ACTIVE' ? 'Hoạt động' : service.status}
                </span>
                <button
                  onClick={() => service.userId ? startChat(service.userId, service.serviceType) : null}
                  disabled={chatLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-400 hover:bg-pink-500 text-white text-xs font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#F5F1FF] rounded-2xl">
                <Clock className="w-5 h-5 text-[#B59DFF]" />
                <div>
                  <p className="text-xs text-[#A090C5]">Thời lượng mỗi slot</p>
                  <p className="font-bold text-[#4A3B6B]">{formatDuration(service.slotDurationHours)}</p>
                </div>
              </div>
              {service.depositAmount != null && service.depositAmount > 0 && (
                <div className="flex items-center gap-3 p-4 bg-[#F5F1FF] rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-[#A090C5]">Tiền đặt cọc</p>
                    <p className="font-bold text-[#4A3B6B]">{service.depositAmount.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              )}
              {service.equipmentDepreciationCost > 0 && (
                <div className="flex items-center gap-3 p-4 bg-[#F5F1FF] rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-[#B59DFF]" />
                  <div>
                    <p className="text-xs text-[#A090C5]">Phí khấu hao thiết bị</p>
                    <p className="font-bold text-[#4A3B6B]">{service.equipmentDepreciationCost.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {service.description && (
              <div>
                <h2 className="text-lg font-bold text-[#4A3B6B] mb-2">Mô tả dịch vụ</h2>
                <p className="text-[#6B5A94] leading-relaxed">{service.description}</p>
              </div>
            )}

            {/* Areas */}
            {service.areas && service.areas.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[#4A3B6B] mb-2">Khu vực hoạt động</h2>
                <div className="flex flex-wrap gap-2">
                  {service.areas.map((area, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F1FF] text-[#8E7AB5] text-sm font-medium rounded-full">
                      <MapPin className="w-3.5 h-3.5" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* More images */}
            {service.imageUrls && service.imageUrls.length > 1 && (
              <div>
                <h2 className="text-lg font-bold text-[#4A3B6B] mb-3">Hình ảnh</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {service.imageUrls.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-[#F5F1FF]">
                      <img src={url} alt={`Hình ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
