'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2 } from 'lucide-react';
import type { Platform } from '@/lib/types';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform | null;
  onConnect: (accountInfo: { name: string; username: string }) => void;
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

export function ConnectionModal({ isOpen, onClose, platform, onConnect }: ConnectionModalProps) {
  const [step, setStep] = useState<'input' | 'connecting' | 'success'>('input');
  const [accountName, setAccountName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setAccountName('');
      setUsername('');
    }
  }, [isOpen]);

  const handleConnect = () => {
    if (!accountName || !username) return;

    // Simulate OAuth flow
    setStep('connecting');

    // Simulate API call delay
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConnect({ name: accountName, username });
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!platform) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {platformLabels[platform]}</DialogTitle>
          <DialogDescription>
            {step === 'input' && 'Enter your account details to connect'}
            {step === 'connecting' && 'Connecting to your account...'}
            {step === 'success' && 'Successfully connected!'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Account Name</label>
                <Input
                  placeholder="e.g., FadhelAI Business"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Username</label>
                <Input
                  placeholder={
                    platform === 'email'
                      ? 'support@fadhelai.com'
                      : platform === 'whatsapp'
                      ? '+1234567890'
                      : '@fadhelai'
                  }
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleConnect}
                disabled={!accountName || !username}
              >
                Connect Account
              </Button>
            </div>
          )}

          {step === 'connecting' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
              <p className="text-sm text-gray-600">Authenticating...</p>
              <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Connected!</p>
              <p className="text-sm text-gray-600">
                Your {platformLabels[platform]} account has been connected
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
