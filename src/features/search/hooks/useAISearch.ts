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
  executeSearch: (payload: AISearchRequest) => Promise<AISearchResultItem[] | null>
}

const OVERLOAD_MESSAGE = "Bé Mèo AI đang quá tải, vui lòng thử lại sau vài giây nhé!"

export function useAISearch(): UseAISearchResult {
  const [data, setData] = useState<AISearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeSearch = useCallback(async (payload: AISearchRequest): Promise<AISearchResultItem[] | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      payload.files.forEach((file) => formData.append("files", file))
      formData.append("text", payload.text)

      const response = await axiosInstance.post<ApiResponse<AISearchResultItem[]>>(
        "/api/search/ai",
        formData
      )

      const result = response.data?.result ?? []
      setData(result)
      return result
    } catch (err) {
      let nextError = "Đã có lỗi xảy ra khi tìm kiếm AI. Vui lòng thử lại."

      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 429 || status === 503) {
          nextError = OVERLOAD_MESSAGE
          notification.warning({
            message: OVERLOAD_MESSAGE,
          })
        } else {
          notification.error({
            message: "Không thể thực hiện tìm kiếm AI.",
          })
        }
      } else {
        notification.error({
          message: "Không thể thực hiện tìm kiếm AI.",
        })
      }

      setError(nextError)
      setData([])
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    executeSearch,
  }
}
