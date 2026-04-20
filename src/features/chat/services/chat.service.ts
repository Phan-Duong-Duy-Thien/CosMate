import { getOrCreateChatRoom, getChatPartner, getChatMessages, getUserChatRooms, getUnreadCount, markRoomAsRead, uploadImage } from "../api/chat.api"
import type { ChatRoom, ChatPartner, ChatMessage, ChatRoomListItem } from "../types"

export async function getOrCreateChatRoomService(user1Id: number, user2Id: number): Promise<ChatRoom> {
  console.log("[chat.service] getOrCreateChatRoom:", user1Id, user2Id)
  return getOrCreateChatRoom(user1Id, user2Id)
}

export async function getChatPartnerService(roomId: number, currentUserId: number): Promise<ChatPartner> {
  console.log("[chat.service] getChatPartner:", roomId, currentUserId)
  return getChatPartner(roomId, currentUserId)
}

export async function getChatMessagesService(
  roomId: number,
  page = 0,
  size = 20
): Promise<{ content: ChatMessage[]; number: number; totalPages: number; last: boolean }> {
  console.log("[chat.service] getChatMessages:", roomId, page, size)
  return getChatMessages(roomId, page, size)
}

export async function getUserChatRoomsService(userId: number): Promise<ChatRoomListItem[]> {
  console.log("[chat.service] getUserChatRooms:", userId)
  return getUserChatRooms(userId)
}

export async function getUnreadCountService(userId: number): Promise<number> {
  console.log("[chat.service] getUnreadCount:", userId)
  return getUnreadCount(userId)
}

export async function markRoomAsReadService(roomId: number, currentUserId: number): Promise<void> {
  console.log("[chat.service] markRoomAsRead:", roomId, currentUserId)
  return markRoomAsRead(roomId, currentUserId)
}

export async function uploadImageService(roomId: number, file: File): Promise<string> {
  console.log("[chat.service] uploadImage:", roomId, file)
  return uploadImage(roomId, file)
}
