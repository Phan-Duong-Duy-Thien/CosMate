/**
 * Costume Images API
 *
 * HTTP layer only - no business logic.
 * All requests go through axiosInstance.
 *
 * Endpoints:
 *   GET    /api/images/costume/{costumeId}
 *   POST   /api/images/costume/{costumeId}?type=MAIN|DETAIL
 *   DELETE /api/images/{imageId}
 */

import axiosInstance from '@/services/axiosInstance'
import type { CostumeApiResponse } from '../types'

export type CostumeImageType = 'MAIN' | 'DETAIL'

export interface CostumeImage {
  id: number
  url: string
  type: CostumeImageType
  costumeId?: number
}

/** GET /api/images/costume/{costumeId} */
export async function getCostumeImages(costumeId: number): Promise<CostumeImage[]> {
  const res = await axiosInstance.get<CostumeApiResponse<CostumeImage[]>>(
    `/api/images/costume/${costumeId}`,
  )
  return res.data.result
}

/** POST /api/images/costume/{costumeId}?type=MAIN|DETAIL */
export async function uploadCostumeImage(
  costumeId: number,
  type: CostumeImageType,
  file: File,
): Promise<CostumeImage> {
  const form = new FormData()
  form.append('file', file)
  const res = await axiosInstance.post<CostumeApiResponse<CostumeImage>>(
    `/api/images/costume/${costumeId}?type=${type}`,
    form,
  )
  return res.data.result
}

/** DELETE /api/images/{imageId} */
export async function deleteCostumeImage(imageId: number): Promise<void> {
  await axiosInstance.delete(`/api/images/${imageId}`)
}
