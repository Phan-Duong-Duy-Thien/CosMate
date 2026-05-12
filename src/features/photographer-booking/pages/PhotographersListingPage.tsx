import * as React from "react"
import { Camera, Sparkles } from "lucide-react"

import { Pagination } from "@/features/costume-rental/components/Pagination"
import { PhotographerCard } from "@/features/photographer-booking/components/PhotographerCard"
import { ListingFilterBar } from "@/features/photographer-booking/components/ListingFilterBar"
import { cn } from "@/lib/utils"
import { useProvidersByRole, PROVIDER_ROLE } from "@/features/photographer-booking/hooks/useProvidersByRole"

const PAGE_SIZE = 16

export default function PhotographersListingPage() {
  const { providers, loading, error } = useProvidersByRole(PROVIDER_ROLE.PHOTOGRAPHER)
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [providers.length])

  const totalPages = Math.ceil(providers.length / PAGE_SIZE)
  const hasResults = providers.length > 0
  const safePage = Math.min(currentPage, Math.max(totalPages || 1, 1))
  const displayPage = hasResults ? safePage : 0
  const displayTotalPages = hasResults ? totalPages : 0
  const pagedProviders = hasResults
    ? providers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    : []

  return (
    <div className="min-h-screen bg-white selection:bg-[#FFD7E5] selection:text-[#4A3B6B] font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto py-12 px-6 lg:px-8 w-full">
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
              Hiển thị <span className="text-[#4A3B6B] font-bold">{providers.length}</span> nhiếp ảnh gia
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
            pagedProviders.map((provider) => <PhotographerCard key={provider.id} {...provider} />)
          )}
        </section>

        {hasResults && !loading && !error && (
          <div className="pb-8">
            <Pagination
              currentPage={displayPage}
              totalPages={displayTotalPages}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
            />
          </div>
        )}
      </main>
    </div>
  );
}
