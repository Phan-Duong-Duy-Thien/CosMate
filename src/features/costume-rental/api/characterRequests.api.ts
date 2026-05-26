import axiosInstance from '@/services/axiosInstance'

export interface CharacterRequestPayload {
  characterName: string
  animeName: string
  providerId: number
}

interface ApiWrapper<T> {
  code?: number
  message?: string
  result?: T
}

export async function createCharacterRequest(payload: CharacterRequestPayload): Promise<void> {
  const response = await axiosInstance.post<ApiWrapper<unknown>>('/api/character-requests', payload)
  const body = response.data
  if (body?.message && typeof body.message === 'string') {
    return
  }
}
