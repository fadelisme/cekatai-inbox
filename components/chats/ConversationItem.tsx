'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Conversation, Platform } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const platformIcons: Record<Platform, string> = {
  'instagram-dm': '/icons/instagram.svg',
  'instagram-comment': '/icons/instagram.svg',
  'facebook-messenger': '/icons/facebook.svg',
  'facebook-comment': '/icons/facebook.svg',
  'whatsapp': '/icons/whatsapp.svg',
  'webchat': '/icons/webchat.svg',
  'email': '/icons/email.svg',
};

const platformColors: Record<Platform, string> = {
  'instagram-dm': 'text-pink-500',
  'instagram-comment': 'text-pink-500',
  'facebook-messenger': 'text-blue-600',
  'facebook-comment': 'text-blue-600',
  'whatsapp': 'text-green-500',
  'webchat': 'text-gray-600',
  'email': 'text-gray-600',
};

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        .replace('about ', '')
        .replace(' ago', '');
    } catch {
      return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left relative',
        isSelected && 'bg-blue-50 border-l-4 border-l-blue-500 hover:bg-blue-50'
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={conversation.customerAvatar} />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {getInitials(conversation.customerName)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Time */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {conversation.customerName}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatTime(conversation.lastMessage.timestamp)}
            </span>
          </div>

          {/* Last Message */}
          <p
            className={cn(
              'text-sm text-gray-600 truncate',
              conversation.unreadCount > 0 && 'font-medium text-gray-900'
            )}
          >
            {conversation.lastMessage.text}
          </p>

          {/* Platform and Unread Badge */}
          <div className="flex items-center gap-2 mt-2">
            {/* Platform Icon */}
            <div className={cn('flex items-center gap-1', platformColors[conversation.platform])}>
              <Image
                src={platformIcons[conversation.platform]}
                alt={conversation.platform}
                width={14}
                height={14}
                className={platformColors[conversation.platform]}
              />
              <span className="text-xs capitalize">
                {conversation.platform.replace('-', ' ')}
              </span>
            </div>

            {/* Unread Badge */}
            {conversation.unreadCount > 0 && (
              <Badge variant="default" className="bg-blue-500 text-white text-xs px-1.5 py-0">
                {conversation.unreadCount}
              </Badge>
            )}

            {/* Assigned Badge */}
            {conversation.assignedTo && (
              <Badge variant="outline" className="text-xs">
                {conversation.assignedTo.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
