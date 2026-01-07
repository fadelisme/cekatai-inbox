'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@/lib/types';

interface MessageThreadProps {
  conversationId: string;
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const messages = useChatStore((state) => state.messages[conversationId] || []);
  const customers = useChatStore((state) => state.customers);
  const conversations = useChatStore((state) => state.conversations);

  const conversation = conversations.find((c) => c.id === conversationId);
  const customer = conversation ? customers[conversation.customerId] : null;

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No messages yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message: Message) => {
          const isCustomer = message.senderType === 'customer';
          const avatar = isCustomer ? customer?.avatar : undefined;

          return (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                !isCustomer && 'flex-row-reverse'
              )}
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={avatar} />
                <AvatarFallback
                  className={cn(
                    isCustomer ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-600'
                  )}
                >
                  {getInitials(message.senderName)}
                </AvatarFallback>
              </Avatar>

              {/* Message Bubble */}
              <div
                className={cn(
                  'flex flex-col max-w-[70%]',
                  !isCustomer && 'items-end'
                )}
              >
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2',
                    isCustomer
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-500 text-white'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
