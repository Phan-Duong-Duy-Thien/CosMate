import axiosInstance from "@/services/axiosInstance"
import type { ChatRoom, ChatPartner, ChatMessage, ChatRoomListItem } from "../types"

interface ApiWrapper<T> {
  code: number;
  message: string;
  result: T;
}

export async function getOrCreateChatRoom(user1Id: number, user2Id: number): Promise<ChatRoom> {
  const response = await axiosInstance.get<ApiWrapper<ChatRoom>>("/api/chat/room", {
    params: { user1Id, user2Id },
  })
  return response.data.result
}

export async function getChatPartner(roomId: number, currentUserId: number): Promise<ChatPartner> {
  const response = await axiosInstance.get<ApiWrapper<ChatPartner>>(
    `/api/chat/room/${roomId}/partner`,
    { params: { currentUserId } }
  )
  return response.data.result
}

export async function getChatMessages(roomId: number): Promise<ChatMessage[]> {
  const response = await axiosInstance.get<ApiWrapper<ChatMessage[]>>(`/api/chat/messages/${roomId}`)
  return response.data.result
}

export async function getUserChatRooms(userId: number): Promise<ChatRoomListItem[]> {
  const response = await axiosInstance.get<ApiWrapper<ChatRoomListItem[]>>(`/api/chat/rooms/user/${userId}`)
  return response.data.result
}
