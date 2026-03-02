import * as React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/shared/components/Button"
import { MediaGallery } from "../components/detail/MediaGallery"
import { PurchasePanel } from "../components/detail/PurchasePanel"
import { DetailTabs } from "../components/detail/DetailTabs"
import { ReviewsSection } from "../components/detail/ReviewsSection"
import { usePublicCostumeDetail } from "../hooks/usePublicCostumeDetail"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { getUserAddresses } from "@/features/profile/services/userAddress.service"
import { saveDraft } from "@/features/order/utils/rentalDraftStorage"
import { VI } from "@/shared/i18n/vi"

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

  // Modal state for "no address" confirmation
  const [showNoAddressModal, setShowNoAddressModal] = React.useState(false)

  // Validation error state
  const [validationError, setValidationError] = React.useState<string | null>(null)

  // Convert date string to ISO format for backend
  const convertToIsoDateTime = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    // Set to start of day in local time, then format as ISO without milliseconds
    date.setHours(0, 0, 0, 0)
    return date.toISOString().split('.')[0] // Remove milliseconds
  }

  const handleRentNow = async () => {
    if (!costume) return

    // Validate rentStart is selected
    if (!startDate) {
      setValidationError(VI.costumeRental.validation.missingRentStart)
      return
    }

    // Validate rentDay is valid
    if (!days || days <= 0) {
      setValidationError(VI.costumeRental.validation.invalidRentDay)
      return
    }

    // Clear validation error
    setValidationError(null)

    // Get current user ID
    const userId = getUserId()

    if (!userId) {
      // Not logged in - redirect to login with return URL
      const currentUrl = window.location.pathname
      navigate(`/login?returnTo=${encodeURIComponent(currentUrl)}`)
      return
    }

    // Convert startDate to ISO format for backend
    const rentStartIso = convertToIsoDateTime(startDate)

    // Save rental draft to sessionStorage
    saveDraft({
      costumeId: costume.id,
      rentDay: days,
      rentStart: rentStartIso,
      selectedAccessoryIds: Array.from(checkedOptionalIds),
      selectedRentalOptionId,
    })

    // Check if user has addresses
    try {
      const addresses = await getUserAddresses(userId)

      if (addresses.length === 0) {
        // No addresses - show confirmation modal
        setShowNoAddressModal(true)
      } else {
        // Has addresses - proceed to checkout
        navigate('/rent/checkout')
      }
    } catch (err) {
      console.error('Failed to check addresses:', err)
      // On error, show modal as fallback
      setShowNoAddressModal(true)
    }
  }

  const handleNoAddressConfirm = () => {
    setShowNoAddressModal(false)
    navigate('/profile/addresses/new?returnTo=/rent/checkout')
  }

  const handleNoAddressCancel = () => {
    setShowNoAddressModal(false)
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

          {/* Validation Error */}
          {validationError && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {validationError}
            </div>
          )}
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

        {/* No Address Confirmation Modal */}
        {showNoAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900">
                {VI.checkout.noAddress.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {VI.checkout.noAddress.message}
              </p>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" size="lg" className="flex-1 rounded-full" onClick={handleNoAddressCancel}>
                  {VI.checkout.noAddress.cancel}
                </Button>
                <Button variant="default" size="lg" className="flex-1 rounded-full" onClick={handleNoAddressConfirm}>
                  {VI.checkout.noAddress.confirm}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
