import {
  getAllCostumes,
  getCostumeById as getCostumeByIdResponse,
  searchCostumes,
} from './costumeRental.api'
import type { Costume } from '../types'

/** Backend có thể trả `rentalCount` thay vì `rentalsCount`; chỉ hiện "bán chạy" khi flag đúng kiểu boolean. */
function normalizePublicCostume(raw: Costume): Costume {
  const r = raw as Costume & { rentalCount?: number }
  const rentalsCount =
    typeof r.rentalsCount === 'number' && Number.isFinite(r.rentalsCount)
      ? r.rentalsCount
      : typeof r.rentalCount === 'number' && Number.isFinite(r.rentalCount)
        ? r.rentalCount
        : undefined

  return {
    ...r,
    rentalsCount,
    bestSeller: r.bestSeller === true ? true : undefined,
  }
}

export async function getCostumes(): Promise<Costume[]> {
  const response = await getAllCostumes()
  return (response.result ?? []).map(normalizePublicCostume)
}

export async function getCostumeById(id: number): Promise<Costume> {
  const response = await getCostumeByIdResponse(id)
  const raw = response.result
  if (raw == null) {
    throw new Error(response.message || 'Không tìm thấy trang phục.')
  }
  return normalizePublicCostume(raw)
}

export { searchCostumes }
