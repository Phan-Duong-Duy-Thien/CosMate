import axiosInstance from '@/services/axiosInstance'

export interface AdminCharacter {
  id: number
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

export async function getCharacters(): Promise<AdminCharacter[]> {
  const response = await axiosInstance.get<ApiWrapper<AdminCharacter[]> | AdminCharacter[]>('/api/characters')
  const data = unwrap(response.data)
  return Array.isArray(data) ? data : []
}

export async function syncTopAnimeCharacters(): Promise<number> {
  const response = await axiosInstance.post<ApiWrapper<{ addedCount?: number; added?: number } | number>>('/api/v1/admin/sync-characters')
  const data = unwrap(response.data)
  if (typeof data === 'number') return data
  return Number((data as { addedCount?: number; added?: number })?.addedCount ?? (data as { addedCount?: number; added?: number })?.added ?? 0)
}
