/**
 * Costume Images Service
 *
 * Orchestration only – no React, no UI.
 * Called by hooks; never by components or pages.
 */

import {
  uploadCostumeImage,
  deleteCostumeImage,
  type CostumeImage,
} from '../api/costumeImages.api'

/**
 * Upload images after costume creation.
 * - files[0] -> MAIN
 * - files[1..n] -> DETAIL (one-by-one)
 *
 * Throws on MAIN upload failure (caller should stop).
 * Returns array of failed DETAIL indices so caller can show retry UI.
 */
export async function uploadMainThenDetails(
  costumeId: number,
  files: File[],
): Promise<{ mainImage: CostumeImage; failedDetailIndices: number[] }> {
  if (files.length === 0) throw new Error('No files provided')

  // Upload MAIN first – throw on failure
  const mainImage = await uploadCostumeImage(costumeId, 'MAIN', files[0])

  // Upload remaining as DETAIL – collect failures
  const failedDetailIndices: number[] = []
  for (let i = 1; i < files.length; i++) {
    try {
      await uploadCostumeImage(costumeId, 'DETAIL', files[i])
    } catch {
      failedDetailIndices.push(i)
    }
  }

  return { mainImage, failedDetailIndices }
}

/**
 * Replace MAIN image:
 * 1. Upload new MAIN
 * 2. If success -> delete old MAIN
 * Throws if upload fails (old MAIN is preserved).
 */
export async function replaceMain(
  costumeId: number,
  oldMainImageId: number,
  newFile: File,
): Promise<CostumeImage> {
  const newImage = await uploadCostumeImage(costumeId, 'MAIN', newFile)
  await deleteCostumeImage(oldMainImageId)
  return newImage
}

/**
 * Replace a DETAIL image:
 * 1. Delete old detail
 * 2. Upload new detail
 */
export async function replaceDetail(
  costumeId: number,
  oldImageId: number,
  newFile: File,
): Promise<CostumeImage> {
  await deleteCostumeImage(oldImageId)
  return uploadCostumeImage(costumeId, 'DETAIL', newFile)
}
