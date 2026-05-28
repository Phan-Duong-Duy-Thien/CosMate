import { useEffect, useMemo, useState } from "react"
import { Sparkles } from "lucide-react"

import { PhotographerCard } from "@/features/photographer-booking/components/PhotographerCard"
import { ListingFilterBar } from "@/features/photographer-booking/components/ListingFilterBar"
import { ListingPagination } from "@/features/photographer-booking/components/ListingPagination"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { useProvidersByRole, PROVIDER_ROLE } from "@/features/photographer-booking/hooks/useProvidersByRole"

const PAGE_SIZE = 8

export default function PhotographersListingPage() {
  const { providers, loading, error } = useProvidersByRole(PROVIDER_ROLE.PHOTOGRAPHER, {
    verifiedOnly: true,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(providers.length / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [currentPage, totalPages])

  const pagedProviders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return providers.slice(start, start + PAGE_SIZE)
  }, [providers, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="relative isolate home-anime min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(65vh,560px)] w-full opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(76, 29, 149, 0.1) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <main className="relative z-[1] mx-auto w-full min-w-0 px-0 pt-6 sm:pt-8">
        <header className="relative z-30 mb-8 overflow-visible">
          <div
            className={cn(
              "mb-8 flex flex-col gap-6 rounded-[1.35rem] border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-pink-50/80 to-violet-100 p-6 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)] md:flex-row md:items-end md:justify-between md:p-8"
            )}
          >
            <div className="min-w-0 space-y-3">
              <h1 className="max-w-4xl text-balance text-[1.35rem] font-extrabold leading-tight tracking-tight text-indigo-950 md:text-2xl lg:text-3xl">
                <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  {VI.general.decorPageTitles.photographers}
                </span>
              </h1>
              <p className="max-w-2xl rounded-2xl border-[3px] border-indigo-950/25 bg-white/80 px-4 py-3 text-sm font-semibold leading-relaxed text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.12)]">
                Khám phá và đặt lịch với những nhiếp ảnh gia Cosplay hàng đầu cộng đồng.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start md:self-end">
              <span className="inline-flex items-center gap-1.5 rounded-xl border-[3px] border-indigo-950 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b]">
                <Sparkles className="h-3.5 w-3.5 text-pink-500" aria-hidden />
                Tổng{" "}
                <span className="tabular-nums text-pink-600">{loading ? "…" : providers.length}</span>{" "}
                nhiếp ảnh gia
              </span>
            </div>
          </div>

          <ListingFilterBar />
        </header>

        <section className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {loading && providers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] py-16 shadow-[8px_8px_0_0_rgba(30,27,75,0.25)]">
              <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-950 border-t-pink-500" />
              <p className="mt-4 text-sm font-extrabold text-indigo-950">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="col-span-full rounded-[1.25rem] border-[4px] border-red-700/40 bg-red-50 px-6 py-12 text-center text-sm font-semibold text-red-800 shadow-[6px_6px_0_0_rgba(127,29,29,0.2)]">
              {error}
            </div>
          ) : providers.length === 0 ? (
            <div className="col-span-full rounded-[1.25rem] border-[4px] border-dashed border-indigo-950/35 bg-white/70 px-6 py-14 text-center shadow-[6px_6px_0_0_rgba(30,27,75,0.12)]">
              <p className="text-base font-extrabold text-indigo-950">Chưa có photographer nào.</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">Quay lại sau hoặc đổi bộ lọc.</p>
            </div>
          ) : (
            pagedProviders.map((provider) => <PhotographerCard key={provider.id} {...provider} />)
          )}
        </section>

        {!loading && !error && providers.length > 0 && (
          <div className="flex flex-col items-center gap-5 pb-8">
            <ListingPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  )
}
