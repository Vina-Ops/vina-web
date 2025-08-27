# WebSocket Environment Setup

This document explains how to set up the WebSocket connection for the Vina chat application.

## Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Development API URL
NEXT_PUBLIC_API_URL=https://vina-ai.onrender.com

# Production API URL
NEXT_PUBLIC_API_URL_PROD=https://vina-ai.onrender.com

# Environment (development/production)
NEXT_PUBLIC_ENVIRONMENT=development
```

## WebSocket Authentication

The WebSocket connection uses **token-based authentication** passed as a query parameter:

```
wss://vina-ai.onrender.com/api/vina?token=<access_token>
```

### Authentication Flow

1. **Token Retrieval**: The app fetches the access token from cookies via `/api/get-cookie`
2. **Connection**: WebSocket connects with token in query parameter
3. **Server Validation**: Server validates the token during handshake
4. **Connection Established**: If valid, connection stays open for real-time chat

### Security Notes

- Tokens are passed as query parameters (visible in network logs)
- Use short-lived tokens for better security
- Tokens are automatically refreshed by the auth system

## Architecture

### WebSocket Provider

The app uses a `WebSocketProvider` context that:

- Manages global WebSocket connection state
- Handles authentication automatically
- Provides connection status to all components
- Integrates with toast notifications for user feedback

### Usage in Components

```tsx
import { useWebSocket } from "@/context/websocket-context";

function MyComponent() {
  const { isConnected, error } = useWebSocket();

  return (
    <div>
      Status: {isConnected ? "Connected" : "Disconnected"}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

### Chat Hook

For chat-specific functionality, use the `useChatWebSocket` hook:

```tsx
import { useChatWebSocket } from "@/hooks/use-chat-websocket";

function ChatComponent() {
  const { messages, isTyping, sendMessage } = useChatWebSocket();

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {isTyping && <div>AI is typing...</div>}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **"Authorization header must be present"**

   - Ensure you're logged in and have a valid token
   - Check that the token is being fetched correctly
   - Verify environment variables are set

2. **Connection fails to establish**

   - Check network connectivity
   - Verify the WebSocket URL is correct
   - Ensure the server is running and accessible

3. **Connection drops frequently**
   - Check token expiration
   - Verify reconnection logic is working
   - Monitor server logs for issues

### Debug Logs

The WebSocket service includes comprehensive logging:

```javascript
// Connection attempts
console.log("Connecting to WebSocket:", wsUrl);
console.log("WebSocket auth - token available:", !!token);

// Connection status
console.log("WebSocket connected - calling connection change handler");
console.log("WebSocket disconnected:", event.code, event.reason);

// Authentication
console.log("Connecting with token in query parameter");
```

## Server Requirements

The WebSocket server expects:

- **Endpoint**: `/api/vina`
- **Authentication**: Token in query parameter (`?token=<token>`)
- **Message Format**: JSON with `type` and `data` fields
- **Supported Types**: `message`, `typing`, `error`, `connection`, `auth`

