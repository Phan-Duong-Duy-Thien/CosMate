import * as React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { AlertCircle } from "lucide-react"
import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { MediaGallery } from "../components/detail/MediaGallery"
import { PurchasePanel } from "../components/detail/PurchasePanel"
import { ProviderShopCard } from "../components/detail/ProviderShopCard"
import { ProductInfoSections } from "../components/detail/ProductInfoSections"
import { ProductReviewsSection } from "../components/detail/ProductReviewsSection"
import { MyReviewForm } from "../components/detail/MyReviewForm"
import { MoreFromShop } from "../components/detail/MoreFromShop"
import { usePublicCostumeDetail } from "../hooks/usePublicCostumeDetail"
import { useProviderInfo } from "../hooks/useProviderInfo"
import { useCreateReview } from "../hooks/useCreateReview"
import { useReviewPermission } from "../hooks/useReviewPermission"
import { useWishlist } from "@/features/wishlist/hooks/useWishlist"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { getUserAddresses } from "@/features/profile/services/userAddress.service"
import { saveDraft } from "@/features/order/utils/rentalDraftStorage"
import { useBreadcrumb } from "@/app/providers/BreadcrumbProvider"
import { VI } from "@/shared/i18n/vi"
import { publicCostumeStatusLabel } from "../utils/publicCostumeStatusLabel"

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
    checkedOptionalIds,
    toggleOptionalAccessory,
    quote,
    refetch,
  }= usePublicCostumeDetail(costumeId)

  // Modal state for "no address" confirmation
  const [showNoAddressModal, setShowNoAddressModal] = React.useState(false)

  // Validation error popup state
  const [validationError, setValidationError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!validationError) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setValidationError(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [validationError])

  // Get current user ID
  const currentUserId = getUserId()

  // Fetch provider info
  const { provider } = useProviderInfo(costume?.providerId)

  // Review permission and submission
  const { submit: submitReview, loading: reviewSubmitting } = useCreateReview()
  const { canReview, orderId, loading: reviewPermissionLoading } = useReviewPermission(
    costume ? Number(costume.id) : 0
  )

  // Wishlist
  const { isInWishlist, addToWishlist: addToWishlistHandler, removeFromWishlist: removeFromWishlistHandler, wishlistItems } = useWishlist()
  const isCostumeWishlisted = costume ? isInWishlist(costume.id) : false
  const wishlistItem = wishlistItems.find((w) => w.costumeId === costume?.id)
  const [wishlistToggling, setWishlistToggling] = React.useState(false)

  const handleToggleWishlist = async () => {
    if (!costume) return
    if (wishlistToggling) return
    setWishlistToggling(true)
    try {
      if (isCostumeWishlisted && wishlistItem) {
        await removeFromWishlistHandler(wishlistItem.id)
      } else {
        await addToWishlistHandler(costume.id)
      }
    } finally {
      setWishlistToggling(false)
    }
  }

  const handleViewShop = () => {
    if (provider?.id) {
      navigate(`/shop/${provider.id}`)
    }
  }

  const handleReviewSubmit = async (data: { rating: number; comment: string; images: File[] }) => {
    if (!currentUserId || !orderId) {
      alert("Bạn cần đăng nhập để gửi đánh giá")
      return
    }

    const result = await submitReview({
      cosplayerId: currentUserId,
      orderId: orderId,
      rating: data.rating,
      comment: data.comment,
      images: data.images,
    })

    if (result) {
      alert("Đánh giá của bạn đã được gửi thành công!")
    }
  }

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

  const characterRows = React.useMemo(
    () => (costume?.characters ?? []).filter((c) => c.name?.trim() || c.anime?.trim()),
    [costume],
  )

  // Convert date string to YYYY-MM-DD for storage
  // The backend appends T00:00:00 at submission time (order.service.ts)
  const formatRentDate = (dateString: string): string => {
    if (!dateString) return ''
    // Parse using local time to avoid UTC timezone shift
    const [year, month, day] = dateString.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
    const y = localDate.getFullYear()
    const m = String(localDate.getMonth() + 1).padStart(2, '0')
    const d = String(localDate.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
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

    // Validate startDate is at least 3 days from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const minDate = new Date(today)
    minDate.setDate(minDate.getDate() + 3)
    const selected = new Date(startDate)
    selected.setHours(0, 0, 0, 0)
    if (selected < minDate) {
      setValidationError('Ngày thuê phải cách ngày hiện tại tối thiểu 3 ngày để shop chuẩn bị và đơn vị vận chuyển giao hàng.')
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
    const rentStartFormatted = formatRentDate(startDate)

    // Save rental draft to sessionStorage
    saveDraft({
      costumeId: costume.id,
      rentDay: days,
      rentStart: rentStartFormatted,
      selectedAccessoryIds: Array.from(checkedOptionalIds),
      selectedRentalOptionId: null,
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

  const pageShellClass = "home-anime min-h-screen bg-transparent pb-16"

  if (isLoading) {
    return (
      <section className={pageShellClass}>
        <div className="mx-auto w-full max-w-[min(1300px,100%)] px-4 pt-6">
          <div className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-8 text-center text-sm font-semibold text-indigo-950 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
            Đang tải chi tiết trang phục...
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={pageShellClass}>
        <div className="mx-auto w-full max-w-[min(1300px,100%)] px-4 pt-6">
          <div className="rounded-2xl border-[4px] border-[#B91C1C] bg-[#FEE2E2] p-6 text-center text-sm font-semibold text-[#991B1B] shadow-[8px_8px_0_0_rgba(127,29,29,0.3)]">
            <p>{error}</p>
            <Button variant="soft" size="sm" className="mt-3 rounded-xl border-[3px] border-[#991B1B]" onClick={refetch}>
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!costume) {
    return (
      <section className={pageShellClass}>
        <div className="mx-auto w-full max-w-[min(1300px,100%)] px-4 pt-6 text-center">
          <div className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-6 text-sm font-semibold text-indigo-950 shadow-[8px_8px_0_0_rgba(30,27,75,0.45)]">
            Không tìm thấy trang phục bạn yêu cầu.
            <div className="mt-3">
              <Link to="/costumes" className="font-bold text-fuchsia-700 underline">Quay lại danh sách</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const accessoryListCount = costume.accessories?.length ?? 0

  return (
    <section className={pageShellClass}>
      <div className="mx-auto w-full max-w-[min(1300px,100%)] px-4 pt-5">

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <MediaGallery
            images={resolvedImages}
            isAdult18={false}
            bestSeller={costume.bestSeller === true}
            rentalsCount={costume.rentalsCount}
            hasAccessories={accessoryListCount > 0}
            accessoryCount={accessoryListCount > 0 ? accessoryListCount : undefined}
            isWishlisted={isCostumeWishlisted}
            onToggleWishlist={handleToggleWishlist}
            wishlistLoading={wishlistToggling}
          />
          <div className="lg:sticky lg:top-[84px] lg:self-start">
            <PurchasePanel
              costume={costume}
              days={days}
              startDate={startDate}
              checkedOptionalIds={checkedOptionalIds}
              quote={quote}
              onDaysChange={setDays}
              onStartDateChange={setStartDate}
              onToggleOptionalAccessory={toggleOptionalAccessory}
              onRentNow={handleRentNow}
            />
          </div>
        </div>


        {/* Shop Info Card */}
        {provider && (
          <div className="mt-5">
            <ProviderShopCard provider={provider} onViewShop={handleViewShop} />
          </div>
        )}

        {/* Product Info Sections */}
        <div className="mt-5 space-y-5">
          {characterRows.length > 0 && (
            <div>
              <div className="inline-flex rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#c4b5fd] px-4 py-1.5 shadow-[4px_4px_0_0_#1e1b4b]">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-indigo-950">
                  {VI.costumeRental.charactersHeading}
                </h3>
              </div>
              <Card className="mt-2 rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
                <ul className="list-inside list-disc space-y-1 text-sm font-semibold text-indigo-950/90">
                  {characterRows.map((c) => {
                    const name = c.name?.trim() ?? ""
                    const anime = c.anime?.trim() ?? ""
                    const line =
                      name && anime ? `${name} (${anime})` : name || anime
                    return <li key={c.id}>{line}</li>
                  })}
                </ul>
              </Card>
            </div>
          )}
          <ProductInfoSections
            details={[
              { label: VI.costumeRental.costumeName, value: costume.name },
              {
                label: VI.costumeRental.status,
                value: publicCostumeStatusLabel(costume.status),
                valueTone:
                  costume.status === "AVAILABLE"
                    ? "available"
                    : costume.status === "RENTED"
                      ? "rented"
                      : "neutral",
              },
              { label: VI.costumeRental.size, value: costume.size },
              { label: VI.costumeRental.numberOfItems, value: String(costume.numberOfItems) },
              { label: VI.costumeRental.pricePerDay, value: `${costume.pricePerDay.toLocaleString("vi-VN")} VNĐ` },
              { label: VI.costumeRental.depositAmount, value: `${costume.depositAmount.toLocaleString("vi-VN")} VNĐ` },
            ]}
            description={costume.description}
          />
        </div>

        {/* Reviews Section */}
        {costume.id && (
          <div className="mt-5">
            <ProductReviewsSection costumeId={Number(costume.id)} />
          </div>
        )}

        {/* My Review Form */}
        {!reviewPermissionLoading && canReview && currentUserId && (
          <div className="mt-4">
            <MyReviewForm
              canReview={canReview}
              orderId={orderId}
              cosplayerId={currentUserId}
              onSubmit={handleReviewSubmit}
              loading={reviewSubmitting}
            />
          </div>
        )}

        {/* More from Shop */}
        {provider && (
          <div className="mt-5">
            <MoreFromShop
              providerId={provider.id}
              onSelectCostume={(id) => navigate(`/costumes/${id}`)}
              currentCostumeId={String(costume.id)}
            />
          </div>
        )}

        {/* Validation Error Popup */}
        {validationError && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="validation-error-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setValidationError(null)}
          >
            <div
              className="w-full max-w-md rounded-3xl border-[5px] border-[#B91C1C] bg-gradient-to-b from-[#fffbeb] via-[#fee2e2] to-[#fecaca] p-6 shadow-[12px_12px_0_0_rgba(127,29,29,0.55)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#B91C1C] bg-white shadow-[3px_3px_0_0_rgba(127,29,29,0.35)]">
                  <AlertCircle className="h-5 w-5 text-[#B91C1C]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 id="validation-error-title" className="text-base font-extrabold text-[#7F1D1D]">
                    Thông báo
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-[#991B1B]">
                    {validationError}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-xl border-[3px] border-[#7F1D1D] bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-6 font-extrabold text-white shadow-[5px_5px_0_0_#7F1D1D] hover:brightness-110"
                  onClick={() => setValidationError(null)}
                  autoFocus
                >
                  Đã hiểu
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* No Address Confirmation Modal */}
        {showNoAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl border-[5px] border-indigo-950 bg-gradient-to-b from-[#fffbeb] via-[#fce7f3] to-[#dbeafe] p-6 shadow-[12px_12px_0_0_rgba(30,27,75,0.65)]">
              <h3 className="text-lg font-extrabold text-indigo-950">
                {VI.checkout.noAddress.title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-indigo-900/85">
                {VI.checkout.noAddress.message}
              </p>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" size="lg" className="flex-1 rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-[#fffbeb]" onClick={handleNoAddressCancel}>
                  {VI.checkout.noAddress.cancel}
                </Button>
                <Button variant="default" size="lg" className="flex-1 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] hover:brightness-110" onClick={handleNoAddressConfirm}>
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
