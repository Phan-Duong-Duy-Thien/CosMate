import { useParams, useNavigate } from 'react-router-dom'
import { useProviderShopProfile } from '../hooks/useProviderShopProfile'
import { useShopProducts } from '../hooks/useShopProducts'
import { useShopReviews } from '../hooks/useShopReviews'
import { ShopProfileHero } from '../components/shop-profile/ShopProfileHero'
import { ShopContactsSection } from '../components/shop-profile/ShopContactsSection'
import { ShopPoliciesSection } from '../components/shop-profile/ShopPoliciesSection'
import { ShopReviewsSection } from '../components/shop-profile/ShopReviewsSection'
import { ShopProductToolbar } from '../components/shop-profile/ShopProductToolbar'
import { ShopProductGrid } from '../components/shop-profile/ShopProductGrid'
import { RecommendedProductsSection } from '../components/shop-profile/RecommendedProductsSection'
import { useStartChat } from '@/features/chat/hooks/useStartChat'
import { VI } from '@/shared/i18n/vi'

export default function ShopProfilePage() {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const providerIdNum = providerId ? Number(providerId) : undefined

  const { shop, loading, error } = useProviderShopProfile(providerIdNum)
  const {
    products,
    recommendedProducts,
    filterState,
    setSearch,
    setSort,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useShopProducts(providerIdNum)
  const { reviews, stats } = useShopReviews(providerIdNum)
  const { startChat, loading: chatLoading } = useStartChat()

  const handleChat = () => {
    if (shop?.userId) {
      console.log("[ShopProfilePage] Starting chat with userId (not providerId):", shop.userId)
      startChat(shop.userId, shop.shopName)
    }
  }

  const handleProductClick = (productId: string) => {
    navigate(`/costumes/${productId}`)
  }

  const handleWishlist = (productId: string) => {
    console.log('Wishlist clicked for:', productId)
    // Future: call wishlist API
  }

  if (loading) {
    return (
<<<<<<< Updated upstream
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-10">
=======
      <section className="min-h-screen bg-[image:var(--gradient-shop-page)] bg-[length:100%_100%] bg-no-repeat pb-20">
        <div className="mx-auto w-full min-w-0 max-w-6xl pt-10">
>>>>>>> Stashed changes
          <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 p-10 text-center text-sm text-slate-500">
            {VI.common.status.loading}
          </div>
        </div>
      </section>
    )
  }

  if (error || !shop) {
    return (
<<<<<<< Updated upstream
      <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-10">
=======
      <section className="min-h-screen bg-[image:var(--gradient-shop-page)] bg-[length:100%_100%] bg-no-repeat pb-20">
        <div className="mx-auto w-full min-w-0 max-w-6xl pt-10">
>>>>>>> Stashed changes
          <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-600">
            <p>{error || 'Không tìm thấy shop'}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
<<<<<<< Updated upstream
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-8">
=======
    <section className="min-h-screen bg-[image:var(--gradient-shop-page)] bg-[length:100%_100%] bg-no-repeat pb-20">
      <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 pt-8">
>>>>>>> Stashed changes
        {/* Shop Hero */}
        <ShopProfileHero shop={shop} onChat={handleChat} chatLoading={chatLoading} />

        {/* Contact Section */}
        <ShopContactsSection shop={shop} />

        {/* Policies Section */}
        <ShopPoliciesSection providerId={providerIdNum} />

        {/* Reviews Section */}
        <ShopReviewsSection reviews={reviews} stats={stats} />

        {/* Products Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-2xl border-2 border-[#FDCCD7] bg-white px-4 py-2">
            <h3 className="text-lg font-semibold tracking-wide text-slate-800">
              {VI.provider.shop.products.title}
            </h3>
          </div>

          <ShopProductToolbar
            filterState={filterState}
            onSearchChange={setSearch}
            onSortChange={setSort}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onReset={resetFilters}
          />

          <ShopProductGrid
            products={products}
            onProductClick={handleProductClick}
            onWishlist={handleWishlist}
          />
        </div>

        {/* Recommended Products */}
        <RecommendedProductsSection
          products={recommendedProducts}
          onProductClick={handleProductClick}
          onWishlist={handleWishlist}
        />
      </div>
    </section>
  )
}
