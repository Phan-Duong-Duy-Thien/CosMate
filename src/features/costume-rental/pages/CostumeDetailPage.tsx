import * as React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { Button }from "@/shared/components/Button"
import { MediaGallery } from "../components/detail/MediaGallery"
import { PurchasePanel }from "../components/detail/PurchasePanel"
import { DetailTabs } from "../components/detail/DetailTabs"
import { ReviewsSection }from "../components/detail/ReviewsSection"
import { usePublicCostumeDetail }from "../hooks/usePublicCostumeDetail"
import { useUserAddresses } from "@/features/profile/hooks/useUserAddresses"
import { getUserId } from "@/features/auth/services/tokenStorage"

const reviewSamples = [
  { id: "review-1", author: "Ngọc Anh", rating: 5, content: "Đồ lên form đẹp, phụ kiện đầy đủ, giao đúng hẹn.", date: "20/01/2026", hasMedia: true },
  { id: "review-2", author: "Minh Khoa", rating: 4, content: "Vải mềm, dễ mặc, shop tư vấn nhanh.", date: "15/01/2026" },
  { id: "review-3", author: "Hà Linh", rating: 5, content: "Rất hợp chụp fes, màu lên ảnh xinh.", date: "10/01/2026", hasMedia: true },
]

export default function CostumeDetailPage() {
  const { costumeId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState("description")

  const {
    costume,
    isLoading,
    error,
    resolvedImages,
    days,
    setDays,
    startDate,
    setStartDate,
    selectedRentalOptionId,
    setSelectedRentalOptionId,
    checkedOptionalIds,
    toggleOptionalAccessory,
    quote,
    refetch,
  }= usePublicCostumeDetail(costumeId)

  React.useEffect(() => {
    setActiveTab("description")
  }, [costumeId])

  const handleRentNow = () => {
    if (!costume) return

    // Get current user ID
    const userId = getUserId()

    if (!userId) {
      // Not logged in - redirect to login with return URL
      const currentUrl = window.location.pathname
      navigate(`/login?returnTo=${encodeURIComponent(currentUrl)}`)
      return
    }

    // Check if user has addresses - fetch and check
    const checkAddresses = async () => {
      try {
        const { getUserAddresses } = await import('@/features/profile/services/userAddress.service')
        const addresses = await getUserAddresses(userId)

        if (addresses.length === 0) {
          // No addresses - redirect to address creation page
          const currentUrl = window.location.pathname
          navigate(`/profile/addresses/new?returnTo=${encodeURIComponent(currentUrl)}`)
        } else {
          // Has addresses - proceed with rental (placeholder for now)
          alert("Chức năng thuê sẽ được triển khai sau!")
        }
      } catch (err) {
        console.error('Failed to check addresses:', err)
        // On error, allow proceeding (or redirect to address creation as fallback)
        const currentUrl = window.location.pathname
        navigate(`/profile/addresses/new?returnTo=${encodeURIComponent(currentUrl)}`)
      }
    }

    checkAddresses()
  }

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-10">
          <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 p-10 text-center text-sm text-slate-500">
            Đang tải chi tiết trang phục...
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-10">
          <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-600">
            <p>{error}</p>
            <Button variant="soft" size="sm" className="mt-4 rounded-full" onClick={refetch}>
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!costume) {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-10 text-center">
          <div className="rounded-3xl border border-pink-100 bg-white/80 p-10 text-sm text-slate-600">
            Không tìm thấy trang phục bạn yêu cầu.
            <div className="mt-4">
              <Link to="/costumes" className="text-pink-600 underline">Quay lại danh sách</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const accessoryCount = Math.max((costume.numberOfItems ?? 1) - 1, 0)

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8">
        <div className="text-xs text-slate-500">
          CosMate &gt; Thuê đồ Cosplay &gt; {costume.name}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MediaGallery
            images={resolvedImages}
            isAdult18={false}
            bestSeller={costume.status !== "RENTED"}
            hasAccessories={accessoryCount > 0}
            accessoryCount={accessoryCount > 0 ? accessoryCount : undefined}
          />
          <PurchasePanel
            costume={costume}
            days={days}
            startDate={startDate}
            selectedRentalOptionId={selectedRentalOptionId}
            checkedOptionalIds={checkedOptionalIds}
            quote={quote}
            onDaysChange={setDays}
            onStartDateChange={setStartDate}
            onSelectRentalOption={setSelectedRentalOptionId}
            onToggleOptionalAccessory={toggleOptionalAccessory}
            onRentNow={handleRentNow}
          />
        </div>

        <div className="mt-8 space-y-6">
          <DetailTabs
            tabs={[
              { key: "description", label: "Mô tả" },
              { key: "reviews", label: "Đánh giá" },
            ]}
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            {activeTab === "description" && (
              <p className="text-sm leading-relaxed text-slate-600">
                {costume.description || "Chưa có mô tả."}
              </p>
            )}
            {activeTab === "reviews" && (
              <ReviewsSection average={0} total={0}reviews={reviewSamples} />
            )}
          </DetailTabs>
        </div>
      </div>
    </section>
  )
}
