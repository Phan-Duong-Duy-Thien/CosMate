import { getOrCreateChatRoom, getChatPartner, getChatMessages, getUserChatRooms } from "../api/chat.api"
import type { ChatRoom, ChatPartner, ChatMessage, ChatRoomListItem } from "../types"

export async function getOrCreateChatRoomService(user1Id: number, user2Id: number): Promise<ChatRoom> {
  console.log("[chat.service] getOrCreateChatRoom:", user1Id, user2Id)
  return getOrCreateChatRoom(user1Id, user2Id)
}

export async function getChatPartnerService(roomId: number, currentUserId: number): Promise<ChatPartner> {
  console.log("[chat.service] getChatPartner:", roomId, currentUserId)
  return getChatPartner(roomId, currentUserId)
}

export async function getChatMessagesService(roomId: number): Promise<ChatMessage[]> {
  console.log("[chat.service] getChatMessages:", roomId)
  return getChatMessages(roomId)
}

export async function getUserChatRoomsService(userId: number): Promise<ChatRoomListItem[]> {
  console.log("[chat.service] getUserChatRooms:", userId)
  return getUserChatRooms(userId)
}
