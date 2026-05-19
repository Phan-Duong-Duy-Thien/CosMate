import axiosInstance from '@/services/axiosInstance'

export interface CharacterRequestItem {
  id: number
  characterName: string
  animeName: string
  providerId: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export interface CreateCharacterPayload {
  name: string
  anime: string
  imageUrl?: string
}

interface ApiWrapper<T> {
  code?: number
  message?: string
  result?: T
}

const unwrap = <T,>(data: ApiWrapper<T> | T): T => {
  const wrapped = data as ApiWrapper<T>
  return wrapped?.result ?? (data as T)
}

export async function getCharacterRequests(): Promise<CharacterRequestItem[]> {
  const response = await axiosInstance.get<ApiWrapper<CharacterRequestItem[]> | CharacterRequestItem[]>('/api/character-requests')
  const data = unwrap(response.data)
  return Array.isArray(data) ? data : []
}

export async function updateCharacterRequestStatus(id: number, status: CharacterRequestItem['status']): Promise<CharacterRequestItem> {
  const response = await axiosInstance.put<ApiWrapper<CharacterRequestItem> | CharacterRequestItem>(`/api/character-requests/${id}`, null, {
    params: { status },
  })
  return unwrap(response.data)
}

export async function createCharacter(payload: CreateCharacterPayload): Promise<CharacterRequestItem | unknown> {
  const response = await axiosInstance.post<ApiWrapper<unknown> | unknown>('/api/characters', payload)
  return unwrap(response.data)
}
