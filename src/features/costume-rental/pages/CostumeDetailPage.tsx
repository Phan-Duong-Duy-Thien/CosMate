import * as React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { costumeItems } from "../mocks/costumes.mock"
import { shops } from "../mocks/shops.mock"
import type { QuoteBreakdown, RentalPurpose, SizeKey, UIState } from "../types"
import { Button } from "@/shared/components/Button"
import { MediaGallery } from "../components/detail/MediaGallery"
import { PurchasePanel } from "../components/detail/PurchasePanel"
import { DetailTabs } from "../components/detail/DetailTabs"
import { ReviewsSection } from "../components/detail/ReviewsSection"
import { ShopInfoCard } from "../components/detail/ShopInfoCard"
import { RelatedCostumeList } from "../components/detail/RelatedCostumeList"

const tagLabelMap: Record<string, string> = {
  anime: "Anime",
  game: "Game",
  event: "Event",
  photoshoot: "Photoshoot",
  new: "New",
  adult18: "18+",
}

const reviewSamples = [
  {
    id: "review-1",
    author: "Ngọc Anh",
    rating: 5,
    content: "Đồ lên form đẹp, phụ kiện đầy đủ, giao đúng hẹn.",
    date: "20/01/2026",
    hasMedia: true,
  },
  {
    id: "review-2",
    author: "Minh Khoa",
    rating: 4,
    content: "Vải mềm, dễ mặc, shop tư vấn nhanh.",
    date: "15/01/2026",
  },
  {
    id: "review-3",
    author: "Hà Linh",
    rating: 5,
    content: "Rất hợp chụp fes, màu lên ảnh xinh.",
    date: "10/01/2026",
    hasMedia: true,
  },
]

export default function CostumeDetailPage() {
  const { costumeId } = useParams()
  const navigate = useNavigate()
  const [uiState, setUiState] = React.useState<UIState>("loading")
  const [errorMessage, setErrorMessage] = React.useState("")

  const costume = React.useMemo(
    () => costumeItems.find((item) => item.id === costumeId),
    [costumeId]
  )
  const shop = React.useMemo(
    () => shops.find((item) => item.id === costume?.shopId),
    [costume]
  )

  const [purpose, setPurpose] = React.useState<RentalPurpose>("fes_shoot")
  const [size, setSize] = React.useState<SizeKey | null>(null)
  const [days, setDays] = React.useState(1)
  const [startDate, setStartDate] = React.useState("")
  const [accessoryIds, setAccessoryIds] = React.useState<string[]>([])
  const [isInCart, setIsInCart] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [showTerms, setShowTerms] = React.useState(false)

  React.useEffect(() => {
    setSize(null)
    setDays(1)
    setStartDate("")
    setAccessoryIds([])
    setIsInCart(false)
    setActiveTab("details")
  }, [costumeId])

  React.useEffect(() => {
    setUiState("loading")
    setErrorMessage("")
    const delay = 400 + Math.round(Math.random() * 300)
    const timer = window.setTimeout(() => {
      if (costumeId === "error") {
        setUiState("error")
        setErrorMessage("Không thể tải chi tiết trang phục.")
        return
      }
      if (!costume) {
        setUiState("notFound")
        return
      }
      setPurpose(costume.rentalPurposes[1] ?? costume.rentalPurposes[0])
      setSize(costume.sizeOptions[0] ?? null)
      setUiState("success")
    }, delay)
    return () => window.clearTimeout(timer)
  }, [costumeId, costume])

  const accessoryTotal = React.useMemo(() => {
    if (!costume) return 0
    return costume.accessoryOptions
      .filter((option) => accessoryIds.includes(option.id))
      .reduce((sum, option) => sum + option.price, 0)
  }, [costume, accessoryIds])

  const quote: QuoteBreakdown = React.useMemo(() => {
    if (!costume) {
      return {
        rentalPrice: 0,
        accessoryTotal: 0,
        laundryFee: 0,
        deposit: 0,
        total: 0,
      }
    }
    const rentalPrice = costume.basePriceByPurpose[purpose] * days
    const total =
      rentalPrice + accessoryTotal + costume.laundryFee + costume.deposit
    return {
      rentalPrice,
      accessoryTotal,
      laundryFee: costume.laundryFee,
      deposit: costume.deposit,
      total,
    }
  }, [costume, purpose, days, accessoryTotal])

  const relatedItems = React.useMemo(() => {
    if (!costume) return []
    return costumeItems
      .filter((item) => item.shopId === costume.shopId && item.id !== costume.id)
      .slice(0, 8)
  }, [costume])

  const handleToggleAccessory = (id: string) => {
    setAccessoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleRentNow = () => {
    if (!costume) return
    if (!size) {
      alert("Vui lòng chọn kích thước.")
      return
    }
    if (costume.isAdult18) {
      const confirmed = window.confirm(
        "Trang phục này dành cho người trên 18 tuổi. Bạn có muốn tiếp tục?"
      )
      if (!confirmed) return
    }
    if (days < 1) {
      setDays(1)
      return
    }
    setIsInCart(true)
  }

  if (uiState === "loading") {
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

  if (uiState === "error") {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-10">
          <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-600">
            <p>{errorMessage}</p>
            <Button
              variant="soft"
              size="sm"
              className="mt-4 rounded-full"
              onClick={() => navigate(0)}
            >
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (uiState === "notFound" || !costume || !shop) {
    return (
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-10 text-center">
          <div className="rounded-3xl border border-pink-100 bg-white/80 p-10 text-sm text-slate-600">
            Không tìm thấy trang phục bạn yêu cầu.
            <div className="mt-4">
              <Link to="/costumes" className="text-pink-600 underline">
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const breadcrumbTag =
    costume.tags.find((tag) => tag !== "adult18") ?? costume.tags[0]

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8">
        <div className="text-xs text-slate-500">
          CosMate &gt; Thuê đồ Cosplay &gt; {tagLabelMap[breadcrumbTag] ?? "Cosplay"}{" "}
          &gt; {costume.name}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MediaGallery
            images={costume.images}
            videoUrl={costume.videoUrl}
            isAdult18={costume.isAdult18}
            bestSeller={costume.bestSeller}
            hasAccessories={costume.hasAccessories}
            accessoryCount={costume.accessoryCount}
          />
          <PurchasePanel
            costume={costume}
            purpose={purpose}
            size={size}
            days={days}
            startDate={startDate}
            accessoryIds={accessoryIds}
            quote={quote}
            onPurposeChange={setPurpose}
            onSizeChange={setSize}
            onDaysChange={setDays}
            onStartDateChange={setStartDate}
            onToggleAccessory={handleToggleAccessory}
            onRentNow={handleRentNow}
            onAddToCart={() => setIsInCart((prev) => !prev)}
            isInCart={isInCart}
          />
        </div>

        <div className="mt-8 space-y-6">
          <DetailTabs
            tabs={[
              { key: "details", label: "Chi tiết sản phẩm" },
              { key: "description", label: "Mô tả" },
              { key: "terms", label: "Điều khoản & Quy định shop" },
              { key: "reviews", label: "Đánh giá" },
              { key: "related", label: "Sản phẩm khác của shop" },
            ]}
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            {activeTab === "details" && (
              <div className="space-y-3">
                {costume.details.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600"
                  >
                    <span className="font-semibold text-slate-700">
                      {item.label}
                    </span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "description" && (
              <p className="text-sm leading-relaxed text-slate-600">
                {costume.description}
              </p>
            )}

            {activeTab === "terms" && (
              <div className="space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-700">Quy định shop</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {shop.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="font-semibold text-slate-700">Chính sách</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {shop.policiesSummary}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="text-pink-600 underline"
                    onClick={() => setShowTerms((prev) => !prev)}
                  >
                    {showTerms ? "Thu gọn điều khoản" : "Xem điều khoản đầy đủ"}
                  </button>
                  {showTerms && (
                    <p className="mt-2 text-sm text-slate-600">{shop.terms}</p>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Điều khoản riêng của shop chỉ có giá trị bổ sung, không loại trừ
                  quy định nền tảng.
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsSection
                average={costume.rating}
                total={costume.reviewCount}
                reviews={reviewSamples}
              />
            )}

            {activeTab === "related" && (
              <RelatedCostumeList
                items={relatedItems}
                onSelect={(id) => navigate(`/costumes/${id}`)}
              />
            )}
          </DetailTabs>

          <ShopInfoCard shop={shop} />
        </div>
      </div>
    </section>
  )
}
