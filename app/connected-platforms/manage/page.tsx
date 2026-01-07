'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlatformStore } from '@/stores/platformStore';
import { PlatformSelectionModal } from '@/components/platforms/PlatformSelectionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Platform } from '@/lib/types';
import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  MessageSquare,
} from 'lucide-react';

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

function ManagePlatformContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const platformParam = searchParams.get('platform') as Platform | null;

  const { platforms } = usePlatformStore();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(platformParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [description, setDescription] = useState('');
  const [aiAgent, setAiAgent] = useState('off');
  const [humanAgent, setHumanAgent] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('least-assigned');
  const [csatEnabled, setCsatEnabled] = useState(false);
  const [reassignEnabled, setReassignEnabled] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);

  useEffect(() => {
    if (platformParam) {
      setSelectedPlatform(platformParam);
    }
  }, [platformParam]);

  const connectedPlatforms = platforms.filter((p) => p.isConnected);

  const currentPlatform = platforms.find((p) => p.platform === selectedPlatform);
  const Icon = selectedPlatform ? platformIcons[selectedPlatform] : null;

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleDelete = () => {
    toast.success('Platform configuration deleted');
    router.push('/connected-platforms');
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    router.push(`/connected-platforms/manage?platform=${platform}`);
  };

  if (!selectedPlatform || !currentPlatform) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Select a platform to manage</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full bg-gray-50">
      {/* Left Sidebar - Platform List */}
      <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Inboxes</h2>
              <p className="text-sm text-gray-500 mt-1">
                This is where you can connect all your platforms
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-dashed border-2"
              onClick={() => setIsPlatformModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name..."
              className="pl-10 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Connected Platforms List */}
        <div className="flex-1 overflow-y-auto p-4">
          {connectedPlatforms.map((platformConn) => {
            const PlatformIcon = platformIcons[platformConn.platform];
            const isSelected = selectedPlatform === platformConn.platform;

            return (
              <button
                key={platformConn.platform}
                onClick={() => handlePlatformSelect(platformConn.platform)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg mb-3 transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    platformConn.platform.includes('instagram')
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : platformConn.platform.includes('facebook')
                      ? 'bg-blue-600'
                      : platformConn.platform === 'whatsapp'
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                  }`}
                >
                  <PlatformIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">
                    {platformConn.accountInfo?.username || platformLabels[platformConn.platform]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {platformLabels[platformConn.platform]}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Add Platform Button */}
          <button
            onClick={() => setIsPlatformModalOpen(true)}
            className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors mt-4"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-blue-600">Click to Connect A Platform</p>
              <p className="text-xs text-gray-500">Add a new Chatting Inbox</p>
            </div>
          </button>
        </div>
      </div>

      {/* Right Panel - Settings */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header with Save/Delete */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {Icon && (
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedPlatform.includes('instagram')
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : selectedPlatform.includes('facebook')
                      ? 'bg-blue-600'
                      : selectedPlatform === 'whatsapp'
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                  }`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentPlatform.accountInfo?.username || platformLabels[selectedPlatform]}
                </h1>
                <p className="text-sm text-gray-500">{platformLabels[selectedPlatform]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <Input
              placeholder="Type a description here..."
              className="text-center text-lg font-medium border-0 focus-visible:ring-0"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="basic"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Basic
              </TabsTrigger>
              <TabsTrigger
                value="flow"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Flow
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6 space-y-8">
              {/* AI Agent */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  AI Agent
                </label>
                <Select value={aiAgent} onValueChange={setAiAgent}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off (AI Tidak Menjawab)</SelectItem>
                    <SelectItem value="auto">Auto Reply</SelectItem>
                    <SelectItem value="assisted">AI Assisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Teams */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">Teams</label>
                  <Button variant="outline" size="sm" className="text-blue-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Division
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  You don't have any division yet. Create it now
                </p>
              </div>

              {/* Human Agent */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Human Agent
                </label>
                <Select value={humanAgent} onValueChange={setHumanAgent}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="bob">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chat Distribution Method */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Chat Distribution Method
                </label>
                <Select value={distributionMethod} onValueChange={setDistributionMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="least-assigned">Least Assigned First</SelectItem>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="random">Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CSAT Toggle */}
              <div className="flex items-start justify-between py-4 border-t border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-semibold text-gray-900">
                      Customer Satisfaction Feature (CSAT)
                    </label>
                    <SettingsIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Send a review link to the chat after it is resolved by an agent.
                  </p>
                </div>
                <Switch checked={csatEnabled} onCheckedChange={setCsatEnabled} />
              </div>

              {/* Reassign Toggle */}
              <div className="flex items-start justify-between py-4 border-t border-gray-200">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-900 mb-1 block">
                    Reassign Chat When Agent is Offline
                  </label>
                  <p className="text-sm text-gray-500">
                    Automatically reassign conversation to available agent when the assigned agent goes offline
                  </p>
                </div>
                <Switch checked={reassignEnabled} onCheckedChange={setReassignEnabled} />
              </div>
            </TabsContent>

            <TabsContent value="flow" className="mt-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Flow configuration coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Platform Selection Modal */}
      <PlatformSelectionModal
        isOpen={isPlatformModalOpen}
        onClose={() => setIsPlatformModalOpen(false)}
      />
    </div>
  );
}

export default function ManagePlatformPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <ManagePlatformContent />
    </Suspense>
  );
}
