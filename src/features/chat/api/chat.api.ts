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

export interface ChatMessagesPage {
  content: ChatMessage[];
  number: number;
  totalPages: number;
  last: boolean;
}

export async function getChatMessages(
  roomId: number,
  page = 0,
  size = 50,
): Promise<ChatMessagesPage> {
  const response = await axiosInstance.get<ApiWrapper<ChatMessagesPage>>(
    `/api/chat/messages/${roomId}`,
    { params: { page, size } },
  )
  const result = response.data.result
  if (Array.isArray(result)) {
    return { content: result, number: 0, totalPages: 1, last: true }
  }
  return {
    content: result?.content ?? [],
    number: result?.number ?? page,
    totalPages: result?.totalPages ?? 1,
    last: result?.last ?? true,
  }
}

/** Fetch every page of messages for a room (oldest → newest). */
export async function getAllChatMessages(roomId: number): Promise<ChatMessage[]> {
  const pageSize = 50
  let page = 0
  const all: ChatMessage[] = []

  for (let guard = 0; guard < 100; guard += 1) {
    const batch = await getChatMessages(roomId, page, pageSize)
    const items = batch.content ?? []
    if (items.length > 0) {
      all.push(...items)
    }
    if (batch.last || items.length < pageSize) {
      break
    }
    page += 1
  }

  return all.map((msg) => ({ ...msg, roomId: msg.roomId ?? roomId }))
}

export async function getUserChatRooms(userId: number): Promise<ChatRoomListItem[]> {
  const response = await axiosInstance.get<ApiWrapper<ChatRoomListItem[]>>(`/api/chat/rooms/user/${userId}`)
  return response.data.result
}

export async function getUnreadCount(userId: number): Promise<number> {
  const response = await axiosInstance.get<ApiWrapper<number>>(`/api/chat/unread-count/${userId}`)
  return response.data.result
}

export async function markRoomAsRead(roomId: number, currentUserId: number): Promise<void> {
  await axiosInstance.post(
    `/api/chat/room/${roomId}/read`,
    null,
    { params: { currentUserId } }
  )
}

export async function uploadImage(roomId: number, file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await axiosInstance.post<ApiWrapper<string>>(
    "/api/chat/upload-image",
    formData,
    {
      params: { roomId },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return response.data.result
}
