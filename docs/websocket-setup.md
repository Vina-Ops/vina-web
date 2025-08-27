# WebSocket Chat Implementation

This document describes the WebSocket implementation for the Vina chat functionality.

## Overview

The chat system uses WebSocket connections to provide real-time communication with the Vina AI service. The WebSocket endpoint is `wss://(base-url)/api/vina`.

## Architecture

### Components

1. **ChatWebSocketService** (`services/chat-service.ts`)

   - Manages WebSocket connection lifecycle
   - Handles reconnection logic
   - Processes incoming messages
   - Queues messages when disconnected

2. **useChatWebSocket Hook** (`hooks/use-chat-websocket.ts`)

   - React hook for managing chat state
   - Integrates with WebSocket service
   - Provides connection status and error handling

3. **Chat Components**
   - `ChatHeader`: Shows connection status
   - `ChatInput`: Message input with send functionality
   - `ChatMessages`: Displays message history
   - `ChatMessage`: Individual message component

### Message Format

#### Outgoing Messages (Client → Server)

```json
{
  "type": "message",
  "data": {
    "content": "User message content"
  }
}
```

#### Incoming Messages (Server → Client)

```json
{
  "type": "message|typing|error|connection",
  "data": {
    // Message-specific data
  }
}
```

## Configuration

### Environment Variables

Set these environment variables in your `.env.local` file:

```env
# Development
NEXT_PUBLIC_API_URL=https://your-dev-api.com

# Production
NEXT_PUBLIC_API_URL_PROD=https://your-prod-api.com

# Environment
ENVIRONMENT=development
```

### WebSocket URL Construction

The WebSocket URL is automatically constructed from the API URL:

- HTTP/HTTPS URLs are converted to WSS
- Endpoint `/api/vina` is appended
- Example: `https://api.example.com` → `wss://api.example.com/api/vina`

## Features

### Connection Management

- Automatic reconnection with exponential backoff
- Connection status indicators
- Message queuing when disconnected
- Graceful error handling

### Real-time Features

- Live message delivery
- Typing indicators
- Connection status updates
- Error notifications

### User Experience

- Visual connection status in header
- Error messages with dismiss functionality
- Smooth message animations
- Auto-scroll to latest messages

## Usage

### Basic Implementation

```tsx
import { useChatWebSocket } from "@/hooks/use-chat-websocket";

function ChatComponent() {
  const { messages, isTyping, isConnected, error, sendMessage } =
    useChatWebSocket();

  return (
    <div>
      <ChatHeader isConnected={isConnected} />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
```

### Error Handling

The system provides comprehensive error handling:

- Connection failures
- Message sending errors
- WebSocket unsupported environments
- Network timeouts

## Troubleshooting

### Common Issues

1. **Connection Failed**

   - Check environment variables
   - Verify API server is running
   - Check network connectivity

2. **Messages Not Sending**

   - Check WebSocket connection status
   - Verify message format
   - Check browser console for errors

3. **Reconnection Issues**
   - Check max reconnection attempts
   - Verify server availability
   - Check network stability

### Debug Mode

Enable debug logging by checking browser console for:

- WebSocket connection events
- Message send/receive logs
- Error details
- Reconnection attempts

## Security Considerations

- WebSocket connections should use WSS (secure) in production
- Implement proper authentication if required
- Validate incoming message formats
- Handle connection timeouts gracefully
