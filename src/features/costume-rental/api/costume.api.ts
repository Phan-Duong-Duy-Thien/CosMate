import {
  getAllCostumes,
  getCostumeById as getCostumeByIdResponse,
  searchCostumes,
} from './costumeRental.api'
import type { Costume } from '../types'

export async function getCostumes(): Promise<Costume[]> {
  const response = await getAllCostumes()
  return response.result ?? []
}

export async function getCostumeById(id: number): Promise<Costume> {
  const response = await getCostumeByIdResponse(id)
  return response.result
}

export { searchCostumes }
