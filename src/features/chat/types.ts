export interface ChatRoom {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  lastMessageAt: string;
}

export interface ChatRoomListItem {
  roomId: number;
  partnerId: number;
  partnerName: string | null;
  partnerAvatar: string | null;
  lastMessageAt: string;
}

export interface ChatPartner {
  partnerId: number;
  fullName: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  messageType: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface SendMessagePayload {
  roomId: number;
  senderId: number;
  content: string;
}
