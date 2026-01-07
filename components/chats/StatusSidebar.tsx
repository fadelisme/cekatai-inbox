'use client';

import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ConversationStatus } from '@/lib/types';

const statusGroups = [
  { status: 'assigned' as const, label: 'Assigned', color: 'bg-green-500' },
  { status: 'unassigned' as const, label: 'Unassigned', color: 'bg-orange-500' },
  { status: 'resolved' as const, label: 'Resolved', color: 'bg-gray-500' },
];

interface StatusSidebarProps {
  type: 'chat' | 'comment' | 'email';
}

export function StatusSidebar({ type }: StatusSidebarProps) {
  const { conversations, activeType, activeStatus, setActiveStatus, searchQuery, setSearchQuery } =
    useChatStore();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    assigned: true,
    unassigned: true,
    resolved: false,
  });

  const toggleGroup = (status: string) => {
    setExpandedGroups((prev) => ({ ...prev, [status]: !prev[status] }));
  };

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

  const getCounts = () => {
    // Filter conversations by type first
    const typeConversations = conversations.filter(
      (c) => platformTypeMap[c.platform] === type
    );

    const total = typeConversations.length;
    const assigned = typeConversations.filter((c) => c.status === 'assigned').length;
    const unassigned = typeConversations.filter((c) => c.status === 'unassigned').length;
    const resolved = typeConversations.filter((c) => c.status === 'resolved').length;

    return { total, assigned, unassigned, resolved };
  };

  const counts = getCounts();

  const getTitle = () => {
    switch (type) {
      case 'chat':
        return 'All Chats';
      case 'comment':
        return 'All Comments';
      case 'email':
        return 'All Email';
    }
  };

  return (
    <div className="w-[280px] border-r border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{getTitle()}</h2>
          <div className="text-lg font-medium text-gray-500">{counts.total}</div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 h-11 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Status Groups */}
      <div className="flex-1 overflow-y-auto p-3">
        {statusGroups.map((group) => {
          const count = counts[group.status];
          const isExpanded = expandedGroups[group.status];
          const isActive = activeStatus === group.status;

          return (
            <div key={group.status} className="mb-2">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.status)}
                className="w-full flex items-center justify-between py-2.5 px-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', group.color)} />
                  <span className="text-sm font-medium text-gray-900">{group.label}</span>
                </div>
                <div className={cn(
                  'text-sm font-medium rounded-full min-w-[24px] h-6 flex items-center justify-center px-2',
                  group.status === 'unassigned' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                )}>
                  {count}
                </div>
              </button>

              {/* Expandable Content */}
              {isExpanded && count > 0 && (
                <div className="ml-9 mt-1 space-y-0.5">
                  {conversations
                    .filter((conv) => platformTypeMap[conv.platform] === type && conv.status === group.status)
                    .slice(0, 3)
                    .map((conv) => (
                      <div
                        key={conv.id}
                        className="text-sm text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer truncate"
                      >
                        {conv.customerName}
                      </div>
                    ))}
                  {count > 3 && (
                    <div className="text-sm text-gray-400 px-3 py-1.5">
                      +{count - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
