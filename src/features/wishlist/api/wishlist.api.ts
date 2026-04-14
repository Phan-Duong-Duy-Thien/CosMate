import axiosInstance from '@/services/axiosInstance'
import type { AddToWishlistResponse, GetWishlistResponse } from '../types'

export async function addToWishlist(
  userId: number,
  costumeId: number
): Promise<AddToWishlistResponse> {
  const response = await axiosInstance.post<AddToWishlistResponse>(
    `/api/users/${userId}/wishlist`,
    { costumeId }
  )
  return response.data
}

export async function getWishlist(userId: number): Promise<GetWishlistResponse> {
  const response = await axiosInstance.get<GetWishlistResponse>(
    `/api/users/${userId}/wishlist`
  )
  return response.data
}

export async function removeFromWishlist(
  userId: number,
  wishlistId: number
): Promise<void> {
  await axiosInstance.delete(`/api/users/${userId}/wishlist/${wishlistId}`)
}
