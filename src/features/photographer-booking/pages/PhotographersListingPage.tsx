import { Link } from 'react-router-dom';
import { PhotographerCard } from '@/features/photographer-booking/components/PhotographerCard';
import { ListingFilterBar } from '@/features/photographer-booking/components/ListingFilterBar';
import { Button } from '@/features/photographer-booking/components/ui/button';
import { motion } from 'motion/react';
import { usePublicServices } from '@/features/service/hooks/usePublicServices';
import { SERVICE_TYPE } from '@/features/service/types';

export default function PhotographersListingPage() {
  const { filteredServices, loading, error } = usePublicServices(SERVICE_TYPE.PHOTOGRAPHER);

  return (
    <div className="min-h-screen bg-white selection:bg-[#FFD7E5] selection:text-[#4A3B6B] font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto py-12 px-6 lg:px-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4" aria-label="Breadcrumb">
          <Link to="/" className="text-[#A090C5] opacity-50 hover:text-[#B59DFF] transition-colors">Dịch vụ</Link>
          <div className="w-1 h-1 rounded-full bg-[#B59DFF]" aria-hidden />
          <span className="text-[#4A3B6B] font-bold" aria-current="page">Nhiếp ảnh gia</span>
        </nav>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold text-[#4A3B6B] mb-2"
              >
                Tìm Kiếm Tầm Nhìn
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-lg"
              >
                Khám phá và đặt lịch với những nhiếp ảnh gia Cosplay hàng đầu cộng đồng.
              </motion.p>
            </div>
            <div className="text-sm font-medium text-gray-400">
              Hiển thị <span className="text-[#4A3B6B] font-bold">{filteredServices.length}</span> nhiếp ảnh gia
            </div>
          </div>

          <ListingFilterBar />
        </header>

        {/* Grid Area */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading && filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-400">{error}</div>
          ) : (
            filteredServices.map((service) => (
              <PhotographerCard key={service.id} {...service} />
            ))
          )}
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <Button
            variant="outline"
            className="rounded-full px-12 py-6 border-2 border-gray-100 hover:border-[#d4c5f9] hover:bg-[#F8F7FF] transition-all font-bold text-[#4A3B6B]"
          >
            Xem thêm
          </Button>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <button className="hover:text-[#B59DFF] transition-colors">Trước</button>
            <div className="flex gap-2">
              {[1, 2, 3, '...', 12].map((n, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${n === 1 ? 'bg-[#4A3B6B] text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button className="hover:text-[#B59DFF] transition-colors">Tiếp</button>
          </div>
        </div>
      </main>
    </div>
  );
}
