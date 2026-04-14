export interface WishlistCostume {
  id: number
  name: string
  description?: string
  pricePerDay: number
  imageUrls: string[]
  [key: string]: unknown
}

export interface WishlistItem {
  id: number
  userId: number
  costumeId: number
  createdAt: string
  costume: WishlistCostume
}

export interface AddToWishlistRequest {
  costumeId: number
}

export interface AddToWishlistResponse {
  code: number
  message: string
  result: WishlistItem
}

export interface GetWishlistResponse {
  code: number
  message: string
  result: WishlistItem[]
}
