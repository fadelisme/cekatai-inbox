'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Ticket,
  Phone,
  BarChart3,
  MessageCircle,
  Radio,
  Bot,
  Cable,
  Workflow,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: MessageSquare, label: 'Chats', href: '/chats' },
  { icon: MessageCircle, label: 'Comments', href: '/comments' },
  { icon: Ticket, label: 'Email', href: '/email' },
  { icon: Phone, label: 'Calls', href: '/calls' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Radio, label: 'Broadcasts', href: '/broadcasts' },
  { icon: Bot, label: 'AI Agents', href: '/ai-agents' },
  { icon: Cable, label: 'Connected Platforms', href: '/connected-platforms' },
  { icon: Workflow, label: 'Flow', href: '/flow' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
