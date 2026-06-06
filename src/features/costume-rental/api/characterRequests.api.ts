import axiosInstance from '@/services/axiosInstance'

export interface CharacterRequestPayload {
  characterName: string
  animeName: string
  providerId: number
  imageUrl?: string
  file?: File
}

interface ApiWrapper<T> {
  code?: number
  message?: string
  result?: T
}

export async function createCharacterRequest(payload: CharacterRequestPayload): Promise<void> {
  const formData = new FormData()
  formData.append('characterName', payload.characterName)
  formData.append('animeName', payload.animeName)
  formData.append('providerId', payload.providerId.toString())
  
  if (payload.imageUrl) {
    formData.append('imageUrl', payload.imageUrl)
  }
  if (payload.file) {
    formData.append('file', payload.file)
  }

  const response = await axiosInstance.post<ApiWrapper<unknown>>('/api/character-requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  const body = response.data
  if (body?.message && typeof body.message === 'string') {
    return
  }
}
