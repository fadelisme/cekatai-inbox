'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserPlus, CheckCircle, MoreVertical, Info } from 'lucide-react';
import { useChatStore, staffMembers } from '@/stores/chatStore';
import { MessageThread } from './MessageThread';
import { MessageInput } from './MessageInput';
import { toast } from 'sonner';
import Image from 'next/image';

interface ConversationDetailProps {
  conversationId: string;
}

const platformIcons = {
  'instagram-dm': '/icons/instagram.svg',
  'instagram-comment': '/icons/instagram.svg',
  'facebook-messenger': '/icons/facebook.svg',
  'facebook-comment': '/icons/facebook.svg',
  'whatsapp': '/icons/whatsapp.svg',
  'webchat': '/icons/webchat.svg',
  'email': '/icons/email.svg',
};

export function ConversationDetail({ conversationId }: ConversationDetailProps) {
  const conversations = useChatStore((state) => state.conversations);
  const customers = useChatStore((state) => state.customers);
  const assignConversation = useChatStore((state) => state.assignConversation);
  const resolveConversation = useChatStore((state) => state.resolveConversation);

  const conversation = conversations.find((c) => c.id === conversationId);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Select a conversation to view details</p>
        </div>
      </div>
    );
  }

  const customer = customers[conversation.customerId];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAssign = (staffId: string) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    if (staff) {
      assignConversation(conversationId, staff);
      toast.success(`Assigned to ${staff.name}`);
    }
  };

  const handleResolve = () => {
    resolveConversation(conversationId);
    toast.success('Conversation resolved');
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={customer?.avatar} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(conversation.customerName)}
            </AvatarFallback>
          </Avatar>

          {/* Name and Platform */}
          <div>
            <h2 className="text-base font-semibold">{conversation.customerName}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Image
                src={platformIcons[conversation.platform as keyof typeof platformIcons]}
                alt={conversation.platform}
                width={12}
                height={12}
              />
              <span className="capitalize">{conversation.platform.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant={
              conversation.status === 'assigned'
                ? 'default'
                : conversation.status === 'resolved'
                ? 'secondary'
                : 'destructive'
            }
            className="ml-2"
          >
            {conversation.status}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Assign Button */}
          {conversation.status !== 'resolved' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {conversation.assignedTo ? 'Reassign' : 'Assign'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {staffMembers.map((staff) => (
                  <DropdownMenuItem
                    key={staff.id}
                    onClick={() => handleAssign(staff.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">{staff.name}</div>
                        <div className="text-xs text-gray-500">{staff.email}</div>
                      </div>
                      {staff.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Resolve Button */}
          {conversation.status !== 'resolved' && (
            <Button variant="outline" size="sm" onClick={handleResolve}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </Button>
          )}

          {/* Info Button */}
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>

          {/* More Options */}
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Message Thread */}
      <MessageThread conversationId={conversationId} />

      {/* Message Input */}
      {conversation.status !== 'resolved' && (
        <MessageInput conversationId={conversationId} />
      )}
    </div>
  );
}
