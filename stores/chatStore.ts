import { create } from 'zustand';
import type { Conversation, Message, Customer, StaffMember, ConversationStatus, Platform } from '@/lib/types';
import conversationsData from '@/mock-data/conversations.json';
import messagesData from '@/mock-data/messages.json';
import customersData from '@/mock-data/customers.json';

type ConversationType = 'chat' | 'comment' | 'email';

interface ChatState {
  // View state
  activeType: ConversationType;
  activeStatus: ConversationStatus;
  selectedConversationId: string | null;
  searchQuery: string;

  // Data
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  customers: Record<string, Customer>;

  // Computed
  filteredConversations: () => Conversation[];

  // Actions
  setActiveType: (type: ConversationType) => void;
  setActiveStatus: (status: ConversationStatus) => void;
  selectConversation: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  assignConversation: (conversationId: string, staff: StaffMember) => void;
  resolveConversation: (conversationId: string) => void;
  loadMockData: () => void;
}

// Platform to type mapping
const platformTypeMap: Record<Platform, ConversationType> = {
  'instagram-dm': 'chat',
  'facebook-messenger': 'chat',
  'whatsapp': 'chat',
  'webchat': 'chat',
  'instagram-comment': 'comment',
  'facebook-comment': 'comment',
  'email': 'email',
};

const staffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'John Doe',
    email: 'john@fadhelai.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'agent',
    isOnline: true,
  },
  {
    id: 'staff-2',
    name: 'Jane Smith',
    email: 'jane@fadhelai.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'agent',
    isOnline: false,
  },
  {
    id: 'staff-3',
    name: 'Bob Johnson',
    email: 'bob@fadhelai.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    role: 'agent',
    isOnline: true,
  },
];

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  activeType: 'chat',
  activeStatus: 'assigned',
  selectedConversationId: null,
  searchQuery: '',
  conversations: [],
  messages: {},
  customers: {},

  // Computed
  filteredConversations: () => {
    const { conversations, activeType, activeStatus, searchQuery } = get();

    let filtered = conversations;

    // Filter by type (chat/comment/email)
    filtered = filtered.filter((conv) => platformTypeMap[conv.platform] === activeType);

    // Filter by status
    filtered = filtered.filter((conv) => conv.status === activeStatus);

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (conv) =>
          conv.customerName.toLowerCase().includes(query) ||
          conv.lastMessage.text.toLowerCase().includes(query)
      );
    }

    // Sort by most recent
    return filtered.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  // Actions
  setActiveType: (type) => set({ activeType: type, selectedConversationId: null }),
  setActiveStatus: (status) => set({ activeStatus: status }),

  selectConversation: (id) => {
    set({ selectedConversationId: id });

    // Mark as read
    if (id) {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === id ? { ...conv, unreadCount: 0 } : conv
        ),
      }));
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  sendMessage: (conversationId, text) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user',
      senderName: 'You',
      senderType: 'staff',
      text,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                text,
                timestamp: newMessage.timestamp,
                isFromCustomer: false,
              },
              updatedAt: newMessage.timestamp,
            }
          : conv
      ),
    }));
  },

  assignConversation: (conversationId, staff) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, status: 'assigned', assignedTo: staff }
          : conv
      ),
    }));
  },

  resolveConversation: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, status: 'resolved' } : conv
      ),
    }));
  },

  loadMockData: () => {
    const customersMap: Record<string, Customer> = {};
    (customersData as Customer[]).forEach((customer) => {
      customersMap[customer.id] = customer;
    });

    set({
      conversations: conversationsData as Conversation[],
      messages: messagesData as Record<string, Message[]>,
      customers: customersMap,
    });
  },
}));

export { staffMembers };
