import { useCallback, useState } from "react"
import { notification } from "antd"
import axios from "axios"

import axiosInstance from "@/services/axiosInstance"

export interface AISearchRequest {
  files: File[]
  text: string
}

export interface AISearchResultItem {
  costumeId: number
  costumeName: string
  imageUrl: string
  price: number
  similarityScore: number
}

interface ApiResponse<T> {
  code: number
  message?: string
  result: T
}

interface UseAISearchResult {
  data: AISearchResultItem[]
  isLoading: boolean
  error: string | null
  fallbackUsed: boolean
  executeSearch: (payload: AISearchRequest) => Promise<AISearchResultItem[] | null>
}

const OVERLOAD_MESSAGE = "Hệ thống AI đang bảo trì, hiển thị kết quả tìm kiếm thông thường"

function extractFallbackResults(result: unknown): AISearchResultItem[] {
  if (!Array.isArray(result)) return []
  return result as AISearchResultItem[]
}

export function useAISearch(): UseAISearchResult {
  const [data, setData] = useState<AISearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackUsed, setFallbackUsed] = useState(false)

  const executeSearch = useCallback(async (payload: AISearchRequest): Promise<AISearchResultItem[] | null> => {
    setIsLoading(true)
    setError(null)
    setFallbackUsed(false)

    try {
      const formData = new FormData()
      payload.files.forEach((file) => formData.append("files", file))
      formData.append("text", payload.text ?? "")

      const response = await axiosInstance.post<ApiResponse<AISearchResultItem[]>>(
        "/api/search/ai",
        formData
      )

      const result = response.data?.result ?? []
      setData(result)
      return result
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status && [429, 503].includes(err.response.status)) {
        const fallbackResult = extractFallbackResults(err.response?.data?.result)
        setFallbackUsed(true)
        setError(OVERLOAD_MESSAGE)
        setData(fallbackResult)
        notification.warning({ message: OVERLOAD_MESSAGE })
        return fallbackResult
      }

      setError("Không thể thực hiện tìm kiếm AI.")
      setData([])
      notification.error({ message: "Không thể thực hiện tìm kiếm AI." })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    fallbackUsed,
    executeSearch,
  }
}
