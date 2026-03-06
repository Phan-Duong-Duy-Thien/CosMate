/**
 * Mock shop products data
 */
import type { BrandType } from '@/features/costume-rental/types'

export interface ShopProduct {
  id: string
  name: string
  characterName: string
  seriesName: string
  imageUrl: string
  pricePerDay: number
  rentalCount: number
  brandType: BrandType
  brandName?: string
  hasAccessories: boolean
  status: 'AVAILABLE' | 'RENTED'
}

export const mockShopProducts: ShopProduct[] = [
  {
    id: 'prod-001',
    name: 'Bộ đồng phục Công chúa tiên cá',
    characterName: 'Princess Ariel',
    seriesName: 'The Little Mermaid',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    pricePerDay: 350000,
    rentalCount: 156,
    brandType: 'brand',
    brandName: 'Miaowu',
    hasAccessories: true,
    status: 'AVAILABLE',
  },
  {
    id: 'prod-002',
    name: 'Trang phục Ninja',
    characterName: 'Naruto Uzumaki',
    seriesName: 'Naruto',
    imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400',
    pricePerDay: 280000,
    rentalCount: 234,
    brandType: 'non_brand',
    hasAccessories: false,
    status: 'AVAILABLE',
  },
  {
    id: 'prod-003',
    name: 'Bộ áo cơ Không lực',
    characterName: 'Zero Two',
    seriesName: 'Darling in the Franxx',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    pricePerDay: 420000,
    rentalCount: 89,
    brandType: 'design',
    brandName: 'Delusion1/2',
    hasAccessories: true,
    status: 'AVAILABLE',
  },
  {
    id: 'prod-004',
    name: 'Trang phục Witch',
    characterName: 'Wendy Marvell',
    seriesName: 'Fairy Tail',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    pricePerDay: 380000,
    rentalCount: 112,
    brandType: 'freestyle',
    hasAccessories: true,
    status: 'AVAILABLE',
  },
  {
    id: 'prod-005',
    name: 'Đồng phục Học viện',
    characterName: 'Miku Hatsune',
    seriesName: 'Vocaloid',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
    pricePerDay: 320000,
    rentalCount: 198,
    brandType: 'brand',
    brandName: 'Miaowu',
    hasAccessories: true,
    status: 'RENTED',
  },
  {
    id: 'prod-006',
    name: 'Trang phục Samurai',
    characterName: 'Saitama',
    seriesName: 'One Punch Man',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    pricePerDay: 250000,
    rentalCount: 67,
    brandType: 'non_brand',
    hasAccessories: false,
    status: 'AVAILABLE',
  },
  {
    id: 'prod-007',
    name: 'Bộ váy Gothic',
    characterName: 'Purple',
    seriesName: 'Original',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    pricePerDay: 400000,
    rentalCount: 45,
    brandType: 'design',
    brandName: 'Delusion1/2',
    hasAccessories: true,
    status: 'AVAILABLE',
  },
  {
    id: 'prod-008',
    name: 'Trang phục Maid',
    characterName: 'Maid Outfit',
    seriesName: 'Original',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    pricePerDay: 220000,
    rentalCount: 312,
    brandType: 'freestyle',
    hasAccessories: true,
    status: 'AVAILABLE',
  },
]

export function getMockShopProducts(providerId: number): ShopProduct[] {
  // In real app, filter by providerId
  return mockShopProducts
}

export function getMockRecommendedProducts(providerId: number): ShopProduct[] {
  // Return random subset as "recommended"
  return mockShopProducts.slice(0, 4)
}
