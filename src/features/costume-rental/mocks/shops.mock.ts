import type { Shop } from "../types"

const defaultRules = [
  "Giữ sạch trang phục, tránh dính màu lạ.",
  "Không tự ý chỉnh sửa form hoặc cắt may.",
  "Trả đúng hẹn để tránh phí phát sinh.",
]

const defaultTerms =
  "Trang phục được kiểm tra trước và sau khi giao. Các hư hỏng phát sinh do người thuê sẽ được xử lý theo mức độ. Shop ưu tiên hỗ trợ đổi size nếu còn hàng."

const defaultPoliciesSummary =
  "Hỗ trợ đổi lịch 1 lần miễn phí trước 24h. Hoàn cọc sau khi kiểm tra trong 24-48h."

export const shops: Shop[] = [
  {
    id: "shop-aurora",
    name: "Aurora Cosplay",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    totalRentals: 2480,
    followers: 18200,
    responseRate: 98,
    responseTimeText: "trong 5 phút",
    region: "hcm",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-otaku",
    name: "Otaku Closet",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    totalRentals: 1960,
    followers: 14100,
    responseRate: 96,
    responseTimeText: "trong 8 phút",
    region: "hn",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-noir",
    name: "Noir Atelier",
    avatarUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    totalRentals: 1540,
    followers: 9200,
    responseRate: 95,
    responseTimeText: "trong 12 phút",
    region: "hcm",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-moonlight",
    name: "Moonlight Forge",
    avatarUrl:
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    totalRentals: 2140,
    followers: 17600,
    responseRate: 97,
    responseTimeText: "trong 6 phút",
    region: "dn",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-pastel",
    name: "Pastel Armor",
    avatarUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&auto=format&fit=crop",
    rating: 4.6,
    totalRentals: 1260,
    followers: 7300,
    responseRate: 93,
    responseTimeText: "trong 15 phút",
    region: "ct",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-cherry",
    name: "Cherry Blossom Wardrobe",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    totalRentals: 1840,
    followers: 12100,
    responseRate: 96,
    responseTimeText: "trong 9 phút",
    region: "hn",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-nebula",
    name: "Nebula Gear",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    totalRentals: 1420,
    followers: 8600,
    responseRate: 94,
    responseTimeText: "trong 10 phút",
    region: "dn",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-cosmate",
    name: "CosMate Studio",
    avatarUrl:
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    totalRentals: 2680,
    followers: 20400,
    responseRate: 99,
    responseTimeText: "trong 4 phút",
    region: "hcm",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
  {
    id: "shop-starlit",
    name: "Starlit Workshop",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    rating: 4.5,
    totalRentals: 980,
    followers: 5400,
    responseRate: 92,
    responseTimeText: "trong 18 phút",
    region: "hp",
    rules: defaultRules,
    terms: defaultTerms,
    policiesSummary: defaultPoliciesSummary,
  },
]
