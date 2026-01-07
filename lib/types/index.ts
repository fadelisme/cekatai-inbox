export type Platform =
  | 'instagram-dm'
  | 'instagram-comment'
  | 'facebook-messenger'
  | 'facebook-comment'
  | 'whatsapp'
  | 'webchat'
  | 'email';

export type ConversationStatus = 'assigned' | 'unassigned' | 'resolved';

export interface Conversation {
  id: string;
  platform: Platform;
  status: ConversationStatus;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: {
    text: string;
    timestamp: string;
    isFromCustomer: boolean;
  };
  unreadCount: number;
  assignedTo?: StaffMember;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'staff';
  text: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  platform: Platform;
  tags: string[];
  notes: string;
  totalConversations: number;
  lastContactedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'agent';
  isOnline: boolean;
}

export interface SessionHistoryItem {
  id: string;
  customerId: string;
  platform: Platform;
  startedAt: string;
  endedAt?: string;
  messagesCount: number;
  assignedTo?: StaffMember;
  status: ConversationStatus;
}

export interface PlatformConnection {
  platform: Platform;
  isConnected: boolean;
  connectedAt?: string;
  accountInfo?: {
    name: string;
    username: string;
  };
}
