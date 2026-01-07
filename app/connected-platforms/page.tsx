'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatformStore } from '@/stores/platformStore';

export default function ConnectedPlatformsPage() {
  const router = useRouter();
  const { platforms } = usePlatformStore();

  useEffect(() => {
    // Find the first connected platform
    const firstConnected = platforms.find((p) => p.isConnected);

    if (firstConnected) {
      // Redirect to manage page with the first connected platform
      router.replace(`/connected-platforms/manage?platform=${firstConnected.platform}`);
    }
  }, [platforms, router]);

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
