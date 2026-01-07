'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ConversationList } from '@/components/chats/ConversationList';
import { ConversationDetail } from '@/components/chats/ConversationDetail';

export default function ChatsPage() {
  const loadMockData = useChatStore((state) => state.loadMockData);
  const setActiveType = useChatStore((state) => state.setActiveType);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);

  useEffect(() => {
    loadMockData();
    setActiveType('chat');
  }, [loadMockData, setActiveType]);

  return (
    <div className="flex-1 flex h-full">
      {/* Two-column layout */}
      <div className="flex w-full">
        {/* Column 1: Conversation List with toolbar and tabs (380px) */}
        <ConversationList />

        {/* Column 2: Conversation Detail (flex-1) */}
        {selectedConversationId ? (
          <ConversationDetail conversationId={selectedConversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500">Select a conversation to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
