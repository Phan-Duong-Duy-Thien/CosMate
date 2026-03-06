export interface MockReviewItem {
  id: string
  userDisplayName: string
  rating: number
  comment: string
  createdAt: string
  images: string[]
}

const mockReviews: MockReviewItem[] = [
  {
    id: "rev-001",
    userDisplayName: "Nguyễn Thị A",
    rating: 5,
    comment: "Trang phục rất đẹp, chất vải tốt, shop giao hàng nhanh chóng. Mình thuê cho buổi cosplay sự kiện và nhận được nhiều lời khen.",
    createdAt: "2024-01-15T10:30:00Z",
    images: [],
  },
  {
    id: "rev-002",
    userDisplayName: "Trần Văn B",
    rating: 4,
    comment: "Trang phục đúng như hình, size vừa vặn. Có chút nhăn nhưng ủi lại là đẹp.",
    createdAt: "2024-01-10T14:20:00Z",
    images: [],
  },
  {
    id: "rev-003",
    userDisplayName: "Lê Thị C",
    rating: 5,
    comment: "Shop rất nhiệt tình, tư vấn size rất chính xác. Trang phục hoàn hảo cho buổi chụp hình!",
    createdAt: "2024-01-05T09:15:00Z",
    images: [],
  },
  {
    id: "rev-004",
    userDisplayName: "Phạm Văn D",
    rating: 3,
    comment: "Trang phục được nhưng giao hàng hơi chậm. Shop nên cải thiện tốc độ giao hàng.",
    createdAt: "2023-12-28T16:45:00Z",
    images: [],
  },
  {
    id: "rev-005",
    userDisplayName: "Hoàng Thị E",
    rating: 5,
    comment: "Mình đã thuê 3 bộ từ shop này rồi, lần nào cũng rất hài lòng. Chất lượng ổn định, giá cả hợp lý.",
    createdAt: "2023-12-20T11:00:00Z",
    images: [],
  },
]

export function getMockProductReviews(costumeId: number): MockReviewItem[] {
  // In real implementation, filter by costumeId
  // For now, return all mock reviews
  return mockReviews
}

export function getMockReviewAverage(reviews: MockReviewItem[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return sum / reviews.length
}
