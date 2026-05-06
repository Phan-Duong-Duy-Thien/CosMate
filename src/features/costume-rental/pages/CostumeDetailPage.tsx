import * as React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { Card } from "@/components/ui/card"
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
import { useStartChat } from "@/features/chat/hooks/useStartChat"
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

  // Get current user ID
  const currentUserId = getUserId()

  // Fetch provider info
  const { provider, loading: providerLoading } = useProviderInfo(costume?.providerId)

  // Start chat
  const { startChat } = useStartChat()

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

  // Handlers for shop actions
  const handleChat = async () => {
    if (provider?.userId) {
      await startChat(provider.userId, provider.shopName)
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
      <section className="min-h-screen bg-[image:var(--gradient-shop-page)] bg-[length:100%_100%] bg-no-repeat pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6">
          <div className="rounded-2xl border border-dashed border-pink-200 bg-white/70 p-8 text-center text-sm text-slate-500">
            Đang tải chi tiết trang phục...
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white pb-12">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
            <p>{error}</p>
            <Button variant="soft" size="sm" className="mt-3 rounded-full" onClick={refetch}>
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!costume) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white pb-12">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 text-center">
          <div className="rounded-2xl border border-pink-100 bg-white/80 p-6 text-sm text-slate-600">
            Không tìm thấy trang phục bạn yêu cầu.
            <div className="mt-3">
              <Link to="/costumes" className="text-pink-600 underline">Quay lại danh sách</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const accessoryCount = Math.max((costume.numberOfItems ?? 1) - 1, 0)

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white pb-12">
      <div className="mx-auto w-full max-w-6xl px-4 pt-5">

        <div className="mt-4 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <MediaGallery
            images={resolvedImages}
            isAdult18={false}
            bestSeller={costume.status !== "RENTED"}
            rentalsCount={(costume as { rentalsCount?: number }).rentalsCount}
            hasAccessories={accessoryCount > 0}
            accessoryCount={accessoryCount > 0 ? accessoryCount : undefined}
            isWishlisted={isCostumeWishlisted}
            onToggleWishlist={handleToggleWishlist}
            wishlistLoading={wishlistToggling}
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
              <div className="inline-block rounded-lg border-2 border-pink-200 px-4 py-1.5">
                <h3 className="text-sm font-semibold text-slate-800">
                  {VI.costumeRental.charactersHeading}
                </h3>
              </div>
              <Card className="mt-2 rounded-xl border border-pink-100 bg-white p-4">
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
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
              { label: VI.costumeRental.status, value: costume.status },
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
