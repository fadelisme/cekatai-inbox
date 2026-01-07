'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatformStore } from '@/stores/platformStore';
import { PlatformCard } from './PlatformCard';
import { ConnectionModal } from './ConnectionModal';
import { toast } from 'sonner';
import type { Platform } from '@/lib/types';

export function PlatformGrid() {
  const router = useRouter();
  const { platforms, connectPlatform, disconnectPlatform } = usePlatformStore();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  const handleManage = (platform: Platform) => {
    router.push(`/connected-platforms/manage?platform=${platform}`);
  };

  const handleConfirmConnect = (accountInfo: { name: string; username: string }) => {
    if (selectedPlatform) {
      connectPlatform(selectedPlatform, accountInfo);
      toast.success('Platform connected successfully!');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {platforms.map((platformConnection) => (
          <PlatformCard
            key={platformConnection.platform}
            platformConnection={platformConnection}
            onConnect={() => handleConnect(platformConnection.platform)}
            onManage={() => handleManage(platformConnection.platform)}
          />
        ))}
      </div>

      <ConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        platform={selectedPlatform}
        onConnect={handleConfirmConnect}
      />
    </>
  );
}
