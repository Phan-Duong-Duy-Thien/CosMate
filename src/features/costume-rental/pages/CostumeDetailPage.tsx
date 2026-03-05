import * as React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/shared/components/Button"
import { MediaGallery } from "../components/detail/MediaGallery"
import { PurchasePanel } from "../components/detail/PurchasePanel"
import { usePublicCostumeDetail } from "../hooks/usePublicCostumeDetail"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { getUserAddresses } from "@/features/profile/services/userAddress.service"
import { saveDraft } from "@/features/order/utils/rentalDraftStorage"
import { useBreadcrumb } from "@/app/providers/BreadcrumbProvider"
import { VI } from "@/shared/i18n/vi"

export default function CostumeDetailPage() {
  const { costumeId } = useParams()
  const navigate = useNavigate()
  const { setItems } = useBreadcrumb()

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

  // Modal state for "no address" confirmation
  const [showNoAddressModal, setShowNoAddressModal] = React.useState(false)

  // Validation error state
  const [validationError, setValidationError] = React.useState<string | null>(null)

  // Set breadcrumb when costume data is loaded
  React.useEffect(() => {
    if (costume) {
      setItems([
        { label: VI.common.breadcrumb.home, to: "/" },
        { label: VI.common.breadcrumb.costumes, to: "/costumes" },
        { label: costume.name },
      ])
    }
  }, [costume, setItems])

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

        <div className="mt-8 space-y-6 rounded-3xl border border-pink-100 bg-white/85 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {VI.costumeRental.detailSectionTitle}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <ApiField label={VI.costumeRental.costumeName} value={costume.name} />
            <ApiField label={VI.costumeRental.status} value={costume.status} />
            <ApiField label={VI.costumeRental.size} value={costume.size} />
            <ApiField
              label={VI.costumeRental.numberOfItems}
              value={String(costume.numberOfItems)}
            />
            <ApiField
              label={VI.costumeRental.pricePerDay}
              value={`${costume.pricePerDay.toLocaleString("vi-VN")} VNĐ`}
            />
            <ApiField
              label={VI.costumeRental.depositAmount}
              value={`${costume.depositAmount.toLocaleString("vi-VN")} VNĐ`}
            />
            <ApiField
              label={VI.costumeRental.description}
              value={costume.description}
              fullWidth
              preWrap
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {VI.costumeRental.imageUrls}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {costume.imageUrls.map((imageUrl) => (
                <li key={imageUrl} className="break-all">{imageUrl}</li>
              ))}
            </ul>
          </div>

          <ApiListSection title={VI.costumeRental.surcharges.title}>
            {costume.surcharges.map((surcharge) => (
              <li key={surcharge.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{surcharge.name}</p>
                <p className="text-sm text-slate-600">{surcharge.description}</p>
                <p className="text-sm text-pink-600">
                  {surcharge.price.toLocaleString("vi-VN")} VNĐ
                </p>
              </li>
            ))}
          </ApiListSection>

          <ApiListSection title={VI.costumeRental.accessories.title}>
            {costume.accessories.map((accessory) => (
              <li key={accessory.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{accessory.name}</p>
                <p className="text-sm text-slate-600">{accessory.description}</p>
                <p className="text-sm text-pink-600">
                  {accessory.price.toLocaleString("vi-VN")} VNĐ
                </p>
                <p className="text-xs text-slate-500">
                  {VI.costumeRental.isRequired}: {String(accessory.isRequired)}
                </p>
              </li>
            ))}
          </ApiListSection>

          <ApiListSection title={VI.costumeRental.rentalOptions.title}>
            {costume.rentalOptions.map((option) => (
              <li key={option.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{option.name}</p>
                <p className="text-sm text-slate-600">{option.description}</p>
                <p className="text-sm text-pink-600">
                  {option.price.toLocaleString("vi-VN")} VNĐ
                </p>
              </li>
            ))}
          </ApiListSection>
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

function ApiField({
  label,
  value,
  fullWidth,
  preWrap,
}: {
  label: string
  value: string
  fullWidth?: boolean
  preWrap?: boolean
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : undefined}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-sm text-slate-700${preWrap ? " whitespace-pre-line" : ""}`}>{value}</p>
    </div>
  )
}

function ApiListSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <ul className="mt-2 space-y-2">{children}</ul>
    </div>
  )
}
