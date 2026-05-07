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

/** Raw row from GET /api/images/costume/{id} — field names vary by backend version */
type CostumeImageApiRow = {
  id: number
  type?: string
  url?: string
  fileUrl?: string
  imageUrl?: string
  costumeId?: number
}

function pickImageUrl(row: CostumeImageApiRow): string {
  const u = row.url ?? row.fileUrl ?? row.imageUrl
  return typeof u === 'string' ? u.trim() : ''
}

function normalizeImageType(raw: string | undefined): CostumeImageType {
  const t = String(raw ?? '').toUpperCase()
  return t === 'DETAIL' ? 'DETAIL' : 'MAIN'
}

/** GET /api/images/costume/{costumeId} */
export async function getCostumeImages(costumeId: number): Promise<CostumeImage[]> {
  const res = await axiosInstance.get<CostumeApiResponse<CostumeImageApiRow[]>>(
    `/api/images/costume/${costumeId}`,
  )
  const rows = res.data.result ?? []
  return rows.map((row) => ({
    id: Number(row.id),
    url: pickImageUrl(row),
    type: normalizeImageType(row.type),
    costumeId: row.costumeId,
  }))
}

/** POST /api/images/costume/{costumeId}?type=MAIN|DETAIL */
export async function uploadCostumeImage(
  costumeId: number,
  type: CostumeImageType,
  file: File,
): Promise<CostumeImage> {
  const form = new FormData()
  form.append('files', file)
  const res = await axiosInstance.post<CostumeApiResponse<CostumeImage[]>>(
    `/api/images/costume/${costumeId}?type=${type}`,
    form,
  )
  const firstImage = res.data.result?.[0]
  if (!firstImage) {
    throw new Error('Upload ảnh thành công nhưng backend không trả dữ liệu ảnh.')
  }
  return firstImage
}

/** DELETE /api/images/{imageId} */
export async function deleteCostumeImage(imageId: number): Promise<void> {
  await axiosInstance.delete(`/api/images/${imageId}`)
}
