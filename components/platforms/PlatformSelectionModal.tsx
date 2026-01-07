'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Settings } from 'lucide-react';
import { usePlatformStore } from '@/stores/platformStore';
import { ConnectionModal } from './ConnectionModal';
import { toast } from 'sonner';
import type { Platform } from '@/lib/types';
import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  MessageSquare,
} from 'lucide-react';

interface PlatformSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platformIcons = {
  'instagram-dm': Instagram,
  'instagram-comment': Instagram,
  'facebook-messenger': Facebook,
  'facebook-comment': Facebook,
  'whatsapp': MessageCircle,
  'webchat': MessageSquare,
  'email': Mail,
};

const platformLabels: Record<Platform, string> = {
  'instagram-dm': 'Instagram - DM',
  'instagram-comment': 'Instagram - Comment',
  'facebook-messenger': 'Facebook - Messenger',
  'facebook-comment': 'Facebook - Comment',
  'whatsapp': 'WhatsApp Business',
  'webchat': 'Web Live Chat',
  'email': 'Email',
};

const platformColors = {
  'instagram-dm': 'bg-gradient-to-br from-purple-500 to-pink-500',
  'instagram-comment': 'bg-gradient-to-br from-purple-500 to-pink-500',
  'facebook-messenger': 'bg-blue-600',
  'facebook-comment': 'bg-blue-600',
  'whatsapp': 'bg-green-500',
  'webchat': 'bg-gray-600',
  'email': 'bg-gray-600',
};

export function PlatformSelectionModal({ isOpen, onClose }: PlatformSelectionModalProps) {
  const router = useRouter();
  const { platforms, connectPlatform } = usePlatformStore();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const handleConnect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsConnectModalOpen(true);
  };

  const handleManage = (platform: Platform) => {
    onClose();
    router.push(`/connected-platforms/manage?platform=${platform}`);
  };

  const handleConfirmConnect = (accountInfo: { name: string; username: string }) => {
    if (selectedPlatform) {
      connectPlatform(selectedPlatform, accountInfo);
      toast.success('Platform connected successfully!');
      setIsConnectModalOpen(false);

      // Redirect to manage page for the newly connected platform
      setTimeout(() => {
        onClose();
        router.push(`/connected-platforms/manage?platform=${selectedPlatform}`);
      }, 500);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-[95vw] w-[1400px] max-h-[90vh] overflow-y-auto p-0">
          {/* Header Section with gradient background */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-b border-gray-100 px-10 pt-8 pb-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight">
                    Connected Platforms
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1.5 text-gray-600 font-normal">
                    Connect your social media and communication channels to start managing conversations
                  </DialogDescription>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong className="font-semibold">Note:</strong> Instagram and Facebook require a single OAuth connection, but you can configure{' '}
                  <strong className="font-semibold">DM</strong> and <strong className="font-semibold">Comment</strong> channels separately for each platform.
                </p>
              </div>
            </DialogHeader>
          </div>

          {/* Platform Grid - with padding container */}
          <div className="px-10 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {platforms.map((platformConn) => {
                const Icon = platformIcons[platformConn.platform];
                const isConnected = platformConn.isConnected;

                return (
                  <div
                    key={platformConn.platform}
                    className="relative border-2 border-gray-100 rounded-2xl p-6 bg-white hover:border-gray-200 hover:shadow-xl transition-all duration-300 ease-out group min-w-[260px]"
                  >
                    {/* Connection Status Badge */}
                    {isConnected && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 text-xs font-medium shadow-sm">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                    )}

                    {/* Platform Icon */}
                    <div className={`w-16 h-16 rounded-xl ${platformColors[platformConn.platform]} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Platform Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug truncate">
                      {platformLabels[platformConn.platform].split(' - ')[0]}
                    </h3>
                    <div className="text-sm font-medium text-gray-500 mb-4 truncate">
                      {platformLabels[platformConn.platform].split(' - ')[1] || ' '}
                    </div>

                    {/* Account Info or Description */}
                    {isConnected && platformConn.accountInfo ? (
                      <div className="mb-5 min-h-[52px] bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate" title={platformConn.accountInfo.name}>
                          {platformConn.accountInfo.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate" title={platformConn.accountInfo.username}>
                          {platformConn.accountInfo.username}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-5 min-h-[52px] flex items-center">
                        <p className="text-sm text-gray-500 leading-relaxed">
                          Connect to receive messages from this platform
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    {isConnected ? (
                      <Button
                        variant="outline"
                        className="w-full h-10 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium transition-colors"
                        onClick={() => handleManage(platformConn.platform)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-md hover:shadow-lg transition-all"
                        onClick={() => handleConnect(platformConn.platform)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        platform={selectedPlatform}
        onConnect={handleConfirmConnect}
      />
    </>
  );
}
