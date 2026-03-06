import type { CostumeItem } from "../types"

interface MoreFromShopItem {
  id: string
  name: string
  characterName: string
  imageUrl: string
  pricePerDay: number
  rentalCount: number
  brandType: string
  brandName?: string
}

const moreFromShopItems: MoreFromShopItem[] = [
  {
    id: "costume-002",
    name: "Bộ đồng phục Công chúa",
    characterName: "Princess Luna",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
    pricePerDay: 350,
    rentalCount: 89,
    brandType: "BRAND",
    brandName: "Miaowu",
  },
  {
    id: "costume-003",
    name: "Trang phục Ninja",
    characterName: "Naruto Uzumaki",
    imageUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400",
    pricePerDay: 280,
    rentalCount: 156,
    brandType: "NON_BRAND",
  },
  {
    id: "costume-004",
    name: "Bộ áo cơ Không lực",
    characterName: "Zero Two",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    pricePerDay: 420,
    rentalCount: 67,
    brandType: "DESIGN",
    brandName: "Delusion1/2",
  },
  {
    id: "costume-005",
    name: "Trang phục Witch",
    characterName: "Wendy Marvell",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    pricePerDay: 380,
    rentalCount: 112,
    brandType: "FREESTYLE",
  },
]

export function getMockMoreFromShop(providerId: number): MoreFromShopItem[] {
  // In production, filter by providerId
  // For now, return mock items
  return moreFromShopItems
}
