import { Camera, Sparkles } from "lucide-react"

import { PhotographerCard } from "@/features/photographer-booking/components/PhotographerCard"
import { ListingFilterBar } from "@/features/photographer-booking/components/ListingFilterBar"
import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"
import { useProvidersByRole, PROVIDER_ROLE } from "@/features/photographer-booking/hooks/useProvidersByRole"

export default function PhotographersListingPage() {
  const { providers, loading, error } = useProvidersByRole(PROVIDER_ROLE.PHOTOGRAPHER)

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
        <header className="mb-8">
          <div
            className={cn(
              "mb-8 flex flex-col gap-6 rounded-[1.35rem] border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-pink-50/80 to-violet-100 p-6 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)] md:flex-row md:items-end md:justify-between md:p-8"
            )}
          >
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-500 text-white shadow-[5px_5px_0_0_#1e1b4b]">
                  <Camera className="h-5 w-5" aria-hidden />
                </span>
                <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-indigo-950 md:text-3xl md:leading-tight">
                  <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    「 Tìm kiếm Photographer 」
                  </span>
                </h1>
              </div>
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
            providers.map((provider) => <PhotographerCard key={provider.id} {...provider} />)
          )}
        </section>

        <div className="flex flex-col items-center gap-5 pb-8">
          <Button
            variant="soft"
            type="button"
            className="rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-cyan-300 to-teal-400 px-10 py-3 text-sm font-extrabold text-indigo-950 shadow-[6px_6px_0_0_#1e1b4b] hover:brightness-105"
          >
            Xem thêm
          </Button>
          <nav
            aria-label="Phân trang"
            className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-indigo-900"
          >
            <button
              type="button"
              className="rounded-lg border-[2px] border-indigo-950/40 bg-white px-3 py-2 shadow-[3px_3px_0_0_rgba(30,27,75,0.15)] transition hover:bg-pink-50"
            >
              Trước
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, "...", 12].map((n, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border-[2px] px-2 transition",
                    n === 1
                      ? "border-indigo-950 bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white shadow-[3px_3px_0_0_#1e1b4b]"
                      : "border-indigo-950/35 bg-white text-indigo-900 shadow-[3px_3px_0_0_rgba(30,27,75,0.1)] hover:bg-amber-100"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rounded-lg border-[2px] border-indigo-950/40 bg-white px-3 py-2 shadow-[3px_3px_0_0_rgba(30,27,75,0.15)] transition hover:bg-pink-50"
            >
              Tiếp
            </button>
          </nav>
        </div>
      </main>
    </div>
  )
}
