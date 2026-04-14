import {
  addToWishlist as addToWishlistApi,
  getWishlist as getWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
} from '../api/wishlist.api'
import type { AddToWishlistResponse, GetWishlistResponse } from '../types'

export async function addToWishlist(
  userId: number,
  costumeId: number
): Promise<AddToWishlistResponse> {
  return addToWishlistApi(userId, costumeId)
}

export async function getWishlist(userId: number): Promise<GetWishlistResponse> {
  return getWishlistApi(userId)
}

export async function removeFromWishlist(
  userId: number,
  wishlistId: number
): Promise<void> {
  return removeFromWishlistApi(userId, wishlistId)
}
