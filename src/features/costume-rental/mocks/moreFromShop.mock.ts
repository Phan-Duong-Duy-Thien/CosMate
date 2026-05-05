// DEPRECATED: use useProviderCostumesForShop + MoreFromShop instead
// This file is kept for backward compatibility during migration.

export interface MoreFromShopItem {
  id: string
  name: string
  characterName: string
  imageUrl: string
  pricePerDay: number
  rentalCount: number
  brandType: string
  brandName?: string
}

export function getMockMoreFromShop(_providerId: number): MoreFromShopItem[] {
  return []
}
