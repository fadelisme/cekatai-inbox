'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Settings } from 'lucide-react';
import Image from 'next/image';
import type { Platform, PlatformConnection } from '@/lib/types';

interface PlatformCardProps {
  platformConnection: PlatformConnection;
  onConnect: () => void;
  onManage: () => void;
}

const platformLabels: Record<Platform, string> = {
  'instagram-dm': 'Instagram - DM',
  'instagram-comment': 'Instagram - Comment',
  'facebook-messenger': 'Facebook - Messenger',
  'facebook-comment': 'Facebook - Comment',
  'whatsapp': 'WhatsApp Business',
  'webchat': 'Web Live Chat',
  'email': 'Email',
};

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
  'instagram-dm': 'from-pink-500 to-purple-600',
  'instagram-comment': 'from-pink-500 to-purple-600',
  'facebook-messenger': 'from-blue-500 to-blue-600',
  'facebook-comment': 'from-blue-500 to-blue-600',
  'whatsapp': 'from-green-500 to-green-600',
  'webchat': 'from-gray-500 to-gray-600',
  'email': 'from-gray-500 to-gray-600',
};

export function PlatformCard({ platformConnection, onConnect, onManage }: PlatformCardProps) {
  const { platform, isConnected, accountInfo } = platformConnection;

  return (
    <div className="relative border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white">
      {/* Connection Status Badge */}
      {isConnected && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>
      )}

      {/* Platform Icon */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platformColors[platform]} flex items-center justify-center mb-4`}>
        <Image
          src={platformIcons[platform]}
          alt={platform}
          width={32}
          height={32}
          className="invert brightness-0 contrast-200"
        />
      </div>

      {/* Platform Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {platformLabels[platform]}
      </h3>

      {/* Account Info or Description */}
      {isConnected && accountInfo ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600">{accountInfo.name}</p>
          <p className="text-xs text-gray-500">{accountInfo.username}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          Connect to receive messages from this platform
        </p>
      )}

      {/* Action Button */}
      {isConnected ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={onManage}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
      ) : (
        <Button
          className="w-full"
          onClick={onConnect}
        >
          Connect
        </Button>
      )}
    </div>
  );
}
