# CekatAI Inbox Prototype

A Next.js frontend prototype for CekatAI's unified inbox system featuring Chats, Comments, and Email channels with vertical status organization.

## Features

### ✨ Main Features
- **Three Separate Inbox Types**: Chats, Comments, and Email
- **Vertical Status Sidebar**: Organized by Assigned, Unassigned, and Resolved
- **7 Platform Integrations**:
  - Instagram - DM (separate from Comments)
  - Instagram - Comment (separate from DM)
  - Facebook - Messenger (separate from Comments)
  - Facebook - Comment (separate from Messenger)
  - WhatsApp Business
  - Web Live Chat
  - Email

### 💬 Chat Features
- Real-time message threads
- Send and receive messages
- Assign conversations to staff members
- Resolve conversations
- Search conversations
- Filter by status (Assigned/Unassigned/Resolved)
- Platform-specific icons and badges
- Unread message counts
- Toast notifications

### 🔌 Platform Management
- Connect/disconnect platforms
- Simulated OAuth flow
- Platform-specific account information
- Visual connection status indicators

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd cekatai-inbox
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

The app will automatically redirect to `/chats`.

## Project Structure

```
cekatai-inbox/
├── app/
│   ├── chats/              # Chats page (private messages)
│   ├── comments/           # Comments page (public comments)
│   ├── email/              # Email page
│   ├── connected-platforms/# Platform connections page
│   └── layout.tsx          # Root layout with Navbar & Sidebar
├── components/
│   ├── chats/
│   │   ├── StatusSidebar.tsx         # Vertical status filter sidebar
│   │   ├── ConversationList.tsx      # List of conversations
│   │   ├── ConversationItem.tsx      # Individual conversation card
│   │   ├── ConversationDetail.tsx    # Message thread view
│   │   ├── MessageThread.tsx         # Message display
│   │   └── MessageInput.tsx          # Send message input
│   ├── platforms/
│   │   ├── PlatformGrid.tsx          # Grid of platform cards
│   │   ├── PlatformCard.tsx          # Single platform card
│   │   └── ConnectionModal.tsx       # OAuth simulation modal
│   ├── layout/
│   │   ├── Navbar.tsx                # Top navigation bar
│   │   └── Sidebar.tsx               # App-level sidebar
│   └── ui/                            # shadcn/ui components
├── stores/
│   ├── chatStore.ts                   # Chat state management (Zustand)
│   └── platformStore.ts               # Platform connection state
├── mock-data/
│   ├── conversations.json             # Mock conversation data
│   ├── messages.json                  # Mock message threads
│   └── customers.json                 # Mock customer data
└── lib/
    └── types/
        └── index.ts                   # TypeScript type definitions
```

## Available Pages

### 1. Chats (`/chats`)
View and manage private chat conversations from:
- Instagram DM
- Facebook Messenger
- WhatsApp
- Web Live Chat

### 2. Comments (`/comments`)
View and manage public comment conversations from:
- Instagram Comments
- Facebook Comments

### 3. Email (`/email`)
View and manage email conversations

### 4. Connected Platforms (`/connected-platforms`)
Manage platform connections:
- Connect new platforms
- View connection status
- Disconnect platforms
- Simulated OAuth flow

## Key Interactions

### Assigning Conversations
1. Select a conversation from the list
2. Click the "Assign" button in the conversation header
3. Select a staff member from the dropdown
4. Conversation moves to "Assigned" status

### Resolving Conversations
1. Select a conversation
2. Click the "Resolve" button
3. Conversation moves to "Resolved" status

### Sending Messages
1. Select a conversation
2. Type your message in the input field at the bottom
3. Press Enter or click Send
4. Message appears in the thread instantly

### Connecting Platforms
1. Navigate to "Connected Platforms"
2. Click "Connect" on any platform card
3. Enter account details in the modal
4. Wait for simulated OAuth flow (2-3 seconds)
5. Platform shows as "Connected"

## Mock Data

The prototype includes:
- **10 conversations** across different platforms and statuses
- **30+ messages** demonstrating conversation threads
- **10 customer profiles** with realistic information
- **3 staff members** for assignment

## Design Principles

- **Clear Separation**: Distinct pages for Chats, Comments, and Email
- **Vertical Organization**: Status filters arranged vertically for better space usage
- **Platform Clarity**: Separate options for Instagram DM vs Comment, Facebook Messenger vs Comment
- **Visual Feedback**: Toast notifications for all actions
- **Realistic Flow**: Simulated OAuth and real-time-like message updates

## Notes

- This is a **frontend prototype only** - no backend API
- All data is **mocked** and stored in memory
- OAuth flows are **simulated** for demonstration
- **Desktop-only** design (no responsive breakpoints)
- No actual platform integrations or real authentication

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

This is a prototype created for demonstration purposes.
