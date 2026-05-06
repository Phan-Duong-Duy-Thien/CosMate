import { StaffCard } from '@/features/staff-booking/components/StaffCard';
import { ListingFilterBar } from '@/features/staff-booking/components/ListingFilterBar';
import { Button } from '@/features/staff-booking/components/ui/button';
import { motion } from 'motion/react';
import { useProvidersByRole, PROVIDER_ROLE } from '@/features/photographer-booking/hooks/useProvidersByRole';

export default function StaffListingPage() {
  const { providers, loading, error } = useProvidersByRole(PROVIDER_ROLE.EVENT_STAFF);

  return (
    <div className="min-h-screen bg-white selection:bg-cosmate-selection-bg selection:text-cosmate-selection-fg font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto py-12 px-6 lg:px-8 w-full">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold text-cosmate-ink mb-2"
              >
                Tìm Đội Ngũ Hỗ Trợ
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-lg"
              >
                Khám phá và đặt lịch các chuyên gia hỗ trợ Cosplay tốt nhất trong cộng đồng.
              </motion.p>
            </div>
            <div className="text-sm font-medium text-gray-400">
              Hiển thị <span className="text-cosmate-ink font-bold">{providers.length}</span> nhân sự
            </div>
          </div>

          <ListingFilterBar />
        </header>

        {/* Grid Area */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading && providers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-400">{error}</div>
          ) : (
            providers.map((provider) => (
              <StaffCard key={provider.id} {...provider} />
            ))
          )}
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <Button
            variant="outline"
            className="rounded-full px-12 py-6 border-2 border-gray-100 hover:border-cosmate-lavender-hover-border hover:bg-cosmate-lavender-surface-alt transition-all font-bold text-cosmate-ink"
          >
            Xem thêm nhân sự
          </Button>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <button className="hover:text-cosmate-lavender transition-colors">Trước</button>
            <div className="flex gap-2">
              {[1, 2, 3, '...', 12].map((n, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${n === 1 ? 'bg-cosmate-ink text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button className="hover:text-cosmate-lavender transition-colors">Tiếp</button>
          </div>
        </div>
      </main>
    </div>
  );
}
