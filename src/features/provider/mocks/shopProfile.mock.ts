/**
 * Mock data for shop profile
 */
import type { ProviderShop } from '../types'

export const mockShopProfile: ProviderShop = {
  id: 1,
  userId: 1,
  shopName: "Cosplay Paradise",
  description: "Chuyên cho thuê trang phục cosplay chất lượng cao, uy tín và giá cả hợp lý.",
  verified: true,
  createdAt: "2023-01-15T10:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
  coverImageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
  bio: "Shop chuyên cho thuê trang phục cosplay anime, game, movie với hơn 5 năm kinh nghiệm. Đảm bảo chất lượng và dịch vụ tốt nhất cho các bạn cosplayer!",
  facebookUrl: "https://facebook.com/cosplayparadise",
  messengerUrl: "https://m.me/cosplayparadise",
  websiteUrl: "https://cosplayparadise.vn",
  phone: "0901234567",
  email: "contact@cosplayparadise.vn",
  isFeatured: true,
  totalRentals: 1250,
  totalReviews: 328,
  rating: 4.7,
}

export function getMockShopProfile(providerId: number): ProviderShop {
  // Return mock data for now
  return {
    ...mockShopProfile,
    id: providerId,
  }
}
