import { useParams, useNavigate } from 'react-router-dom'
import { useProviderShopProfile } from '../hooks/useProviderShopProfile'
import { useShopProducts } from '../hooks/useShopProducts'
import { useShopReviews } from '../hooks/useShopReviews'
import { ShopProfileHero } from '../components/shop-profile/ShopProfileHero'
import { ShopContactsSection } from '../components/shop-profile/ShopContactsSection'
import { ShopPoliciesSection } from '../components/shop-profile/ShopPoliciesSection'
import { ShopReviewsSection } from '../components/shop-profile/ShopReviewsSection'
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

  const shellClass = "home-anime min-h-[calc(100vh-64px)] bg-transparent pb-16 pt-2"

  if (loading) {
    return (
      <section className={shellClass}>
        <div className="rounded-3xl border-[3px] border-dashed border-indigo-950/40 bg-[#fffbeb]/80 p-10 text-center text-sm font-semibold text-indigo-900/75 shadow-[6px_6px_0_0_rgba(30,27,75,0.18)]">
          {VI.common.status.loading}
        </div>
      </section>
    )
  }

  if (error || !shop) {
    return (
      <section className={shellClass}>
        <div className="rounded-3xl border-[3px] border-indigo-950 bg-red-50 p-10 text-center text-sm font-bold text-red-700 shadow-[6px_6px_0_0_rgba(220,38,38,0.25)]">
          <p>{error || 'Không tìm thấy shop'}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={shellClass}>
      <div className="space-y-6">
        {/* Shop Hero */}
        <ShopProfileHero shop={shop} onChat={handleChat} chatLoading={chatLoading} />

        {/* Policies Section */}
        <ShopPoliciesSection providerId={providerIdNum} />

        {/* Products Section */}
        <div className="space-y-4">
          <div className="inline-flex rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#c4b5fd] px-4 py-1.5 shadow-[4px_4px_0_0_#1e1b4b]">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-indigo-950">
              {VI.provider.shop.products.title}
            </h3>
          </div>

          <ShopProductGrid
            products={products}
            onProductClick={handleProductClick}
            onWishlist={handleWishlist}
          />
        </div>

        {/* Contact Section */}
        <ShopContactsSection shop={shop} />

        {/* Reviews Section */}
        <ShopReviewsSection reviews={reviews} stats={stats} />

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
