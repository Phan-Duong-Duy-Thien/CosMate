import { useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { ProfileSidebar } from "@/features/photographer-booking/components/ProfileSidebar"
import { ProfileMainContent } from "@/features/photographer-booking/components/ProfileMainContent"
import { useProviderProfile } from "@/features/provider/hooks/useProviderProfile"
import { useStartChat } from "@/features/chat/hooks/useStartChat"

export default function StaffProfilePage() {
  const { staffId } = useParams()
  const providerId = staffId ? Number(staffId) : undefined
  const { provider, loading, error } = useProviderProfile(providerId!)
  const { startChat, loading: chatLoading } = useStartChat()

  if (loading) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] px-4">
        <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] px-10 py-12 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" aria-hidden />
          <p className="mt-4 text-center text-sm font-extrabold text-indigo-950">Đang tải hồ sơ…</p>
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] px-4">
        <div className="max-w-md rounded-[1.25rem] border-[4px] border-red-700/35 bg-red-50 px-8 py-10 text-center shadow-[8px_8px_0_0_rgba(127,29,29,0.2)]">
          <p className="text-sm font-extrabold text-red-900">{error ?? "Không tìm thấy nhân sự"}</p>
        </div>
      </div>
    )
  }

  const handleChat = () => {
    if (!provider.verified || !provider.userId) return
    startChat(provider.userId, provider.shopName ?? undefined)
  }

  const reviewCount = provider.totalReviews ?? 0
  const avgRating =
    reviewCount > 0 && provider.totalRating != null
      ? provider.totalRating / reviewCount
      : null

  const staffData = {
    name: provider.shopName ?? "Nhân sự sự kiện",
    title: "Nhân sự hỗ trợ Cosplay",
    avatar: provider.avatarUrl ?? "",
    bio: provider.bio ?? "",
    jobs: provider.completedOrders ?? 0,
    rating: avgRating,
    reviewsCount: reviewCount,
    responseRate: "95%",
    skills: [] as string[],
    verified: provider.verified,
    chatLoading,
  }

  return (
    <div className="relative isolate min-h-screen overflow-x-clip pb-16 home-anime bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(50vh,420px)] opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(76, 29, 149, 0.09) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="relative z-[1] mx-auto w-full min-w-0 px-0 pt-6 sm:pt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          <ProfileSidebar {...staffData} onChat={handleChat} />
          <ProfileMainContent providerId={providerId} providerType="staff" />
        </div>
      </div>
    </div>
  )
}
