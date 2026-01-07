'use client';

import { useChatStore } from '@/stores/chatStore';
import { ConversationItem } from './ConversationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  List,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConversationStatus } from '@/lib/types';

const statusTabs = [
  { status: 'assigned' as const, label: 'Assigned' },
  { status: 'unassigned' as const, label: 'Unassigned' },
  { status: 'resolved' as const, label: 'Resolved' },
];

export function ConversationList() {
  const {
    filteredConversations,
    selectedConversationId,
    selectConversation,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    conversations,
    activeType,
  } = useChatStore();

  const filteredConvs = filteredConversations();

  // Platform to type mapping
  const platformTypeMap: Record<string, 'chat' | 'comment' | 'email'> = {
    'instagram-dm': 'chat',
    'facebook-messenger': 'chat',
    'whatsapp': 'chat',
    'webchat': 'chat',
    'instagram-comment': 'comment',
    'facebook-comment': 'comment',
    'email': 'email',
  };

  // Get counts per status for current type
  const getCounts = () => {
    const typeConversations = conversations.filter(
      (c) => platformTypeMap[c.platform] === activeType
    );

    return {
      assigned: typeConversations.filter((c) => c.status === 'assigned').length,
      unassigned: typeConversations.filter((c) => c.status === 'unassigned').length,
      resolved: typeConversations.filter((c) => c.status === 'resolved').length,
    };
  };

  const counts = getCounts();

  return (
    <div className="w-[380px] border-r border-gray-200 bg-white flex flex-col">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          {/* All Agent Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                All Agent
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All Agent</DropdownMenuItem>
              <DropdownMenuItem>John Doe</DropdownMenuItem>
              <DropdownMenuItem>Jane Smith</DropdownMenuItem>
              <DropdownMenuItem>Alex Johnson</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Button */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>

          {/* Filter Button */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>

          <div className="flex-1" />

          {/* Add Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New Conversation</DropdownMenuItem>
              <DropdownMenuItem>Broadcast Message</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* List View Toggle */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <List className="h-4 w-4" />
          </Button>

          {/* Mark All Read */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <CheckCheck className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 h-9 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Horizontal Status Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-3">
        {statusTabs.map((tab) => {
          const count = counts[tab.status];
          const isActive = activeStatus === tab.status;

          return (
            <button
              key={tab.status}
              onClick={() => setActiveStatus(tab.status)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors relative',
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Conversation List */}
      {filteredConvs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-gray-500">No conversations found</p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters or search query
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div>
            {filteredConvs.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => selectConversation(conversation.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
