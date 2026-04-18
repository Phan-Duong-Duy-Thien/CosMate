import { searchUsers } from "../api/user.api"

export interface SearchUserResult {
  id: number
  username: string
  fullName: string
  avatarUrl: string | null
  role: string
}

export async function searchUsersService(keyword: string): Promise<SearchUserResult[]> {
  console.log("[user.service] searchUsers:", keyword)
  return searchUsers(keyword)
}