/**
 * Mock shop reviews data
 */
export interface ShopReview {
  id: string
  userName: string
  userAvatar?: string
  rating: number // 1-5 stars
  comment: string
  createdAt: string
  images?: string[]
  productName?: string
}

export const mockShopReviews: ShopReview[] = [
  {
    id: 'rev-001',
    userName: 'Nguyễn Thị A',
    rating: 5,
    comment: 'Shop rất uy tín! Trang phục đẹp, chất vải tốt, giao hàng nhanh chóng. Mình đã thuê 3 bộ và đều rất hài lòng. Sẽ ủng hộ shop dài dài!',
    createdAt: '2024-01-15T10:30:00Z',
    images: [],
    productName: 'Bộ đồng phục Công chúa tiên cá',
  },
  {
    id: 'rev-002',
    userName: 'Trần Văn B',
    rating: 4,
    comment: 'Trang phục đúng như hình, size vừa vặn. Shop tư vấn nhiệt tình. Có chút nhăn nhưng ủi lại là đẹp.',
    createdAt: '2024-01-10T14:20:00Z',
    images: [],
    productName: 'Trang phục Ninja',
  },
  {
    id: 'rev-003',
    userName: 'Lê Thị C',
    rating: 5,
    comment: 'Lần đầu thuê trang phục cosplay và rất ấn tượng với shop này. Nhân viên rất nhiệt tình, tư vấn size cực chính xác. Trang phục hoàn hảo cho buổi chụp hình!',
    createdAt: '2024-01-05T09:15:00Z',
    images: [],
    productName: 'Bộ áo cơ Không lực',
  },
  {
    id: 'rev-004',
    userName: 'Phạm Văn D',
    rating: 3,
    comment: 'Trang phục được nhưng giao hàng hơi chậm. Shop nên cải thiện tốc độ giao hàng hơn.',
    createdAt: '2023-12-28T16:45:00Z',
    images: [],
    productName: 'Trang phục Witch',
  },
  {
    id: 'rev-005',
    userName: 'Hoàng Thị E',
    rating: 5,
    comment: 'Đã thuê 5 bộ từ shop rồi, lần nào cũng rất hài lòng. Chất lượng ổn định, giá cả hợp lý. Điểm cộng lớn là shop luôn có nhiều size để chọn!',
    createdAt: '2023-12-20T11:00:00Z',
    images: [],
    productName: 'Đồng phục Học viện',
  },
  {
    id: 'rev-006',
    userName: 'Vũ Văn F',
    rating: 4,
    comment: 'Shop đẹp, trang phục đa dạng. Phụ kiện đi kèm đầy đủ. Giao hàng đúng hẹn.',
    createdAt: '2023-12-15T13:30:00Z',
    images: [],
    productName: 'Trang phục Samurai',
  },
]

export function getMockShopReviews(providerId: number): ShopReview[] {
  // In real app, filter by providerId
  return mockShopReviews
}

export function getMockShopReviewStats(reviews: ShopReview[]): {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
} {
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach(r => {
    ratingDistribution[r.rating]++
  })

  return {
    averageRating,
    totalReviews,
    ratingDistribution,
  }
}
