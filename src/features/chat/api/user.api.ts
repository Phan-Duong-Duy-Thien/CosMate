import axiosInstance from "@/services/axiosInstance"

interface SearchUserResult {
  id: number
  username: string
  fullName: string
  avatarUrl: string | null
  role: string
}

interface ApiWrapper<T> {
  code: number
  message: string
  result: T
}

export async function searchUsers(keyword: string): Promise<SearchUserResult[]> {
  const response = await axiosInstance.get<ApiWrapper<SearchUserResult[]>>("/api/users/search", {
    params: { keyword },
  })
  return response.data.result
}
