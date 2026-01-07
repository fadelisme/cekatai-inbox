import { create } from 'zustand';
import type { Platform, PlatformConnection } from '@/lib/types';

interface PlatformState {
  platforms: PlatformConnection[];
  connectPlatform: (platform: Platform, accountInfo?: { name: string; username: string }) => void;
  disconnectPlatform: (platform: Platform) => void;
}

const initialPlatforms: PlatformConnection[] = [
  {
    platform: 'instagram-dm',
    isConnected: true,
    connectedAt: '2026-01-01T00:00:00Z',
    accountInfo: {
      name: 'FadhelAI',
      username: '@fadhelai',
    },
  },
  {
    platform: 'instagram-comment',
    isConnected: false,
  },
  {
    platform: 'facebook-messenger',
    isConnected: true,
    connectedAt: '2026-01-02T00:00:00Z',
    accountInfo: {
      name: 'FadhelAI Business',
      username: 'fadhelai.business',
    },
  },
  {
    platform: 'facebook-comment',
    isConnected: false,
  },
  {
    platform: 'whatsapp',
    isConnected: true,
    connectedAt: '2026-01-03T00:00:00Z',
    accountInfo: {
      name: 'FadhelAI Support',
      username: '+1234567890',
    },
  },
  {
    platform: 'webchat',
    isConnected: false,
  },
  {
    platform: 'email',
    isConnected: false,
  },
];

export const usePlatformStore = create<PlatformState>((set) => ({
  platforms: initialPlatforms,

  connectPlatform: (platform, accountInfo) => {
    set((state) => ({
      platforms: state.platforms.map((p) =>
        p.platform === platform
          ? {
              ...p,
              isConnected: true,
              connectedAt: new Date().toISOString(),
              accountInfo: accountInfo || {
                name: 'Test Account',
                username: '@testaccount',
              },
            }
          : p
      ),
    }));
  },

  disconnectPlatform: (platform) => {
    set((state) => ({
      platforms: state.platforms.map((p) =>
        p.platform === platform
          ? {
              ...p,
              isConnected: false,
              connectedAt: undefined,
              accountInfo: undefined,
            }
          : p
      ),
    }));
  },
}));
