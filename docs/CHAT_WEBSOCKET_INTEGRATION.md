# Integrating Video Calls with Chat Room System

This guide explains how to integrate the video call functionality with your existing chat room system that uses API endpoints to create rooms and WebSocket connections for real-time communication.

## Overview

Your chat system works as follows:

1. **Create Chat Room**: `POST /therapy-chat-rooms/create-by-client/{therapist_id}` - Creates a chat room and returns a room ID
2. **Connect to WebSocket**: `wss://{{base-url}}/safe-space/{{room-id}}` - Connect to the specific room's WebSocket
3. **Video Calls**: Use the same WebSocket connection for both chat and video call signaling

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Chat Client   │    │   API Server     │    │   WebSocket     │
│                 │◄──►│                  │◄──►│   Server        │
│                 │    │                  │    │                 │
│ - Create Room   │    │ - Room Creation  │    │ - Chat Messages │
│ - Connect WS    │    │ - Room ID Return │    │ - Video Calls   │
│ - Video Calls   │    │                  │    │ - WebRTC Sig.   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Implementation Steps

### 1. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_WS_BASE_URL=wss://your-base-url
NEXT_PUBLIC_API_URL=https://your-api-url
```

### 2. Create Chat Room and Connect

```typescript
import { useChatVideoCall } from "@/hooks/useChatVideoCall";
import { chatWithTherapist } from "@/services/general-service";

function ChatRoom() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [therapistId] = useState("therapist-123");
  const [currentUserId] = useState("user-456");

  const {
    callState,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    createChatRoom,
    connectToExistingRoom,
  } = useChatVideoCall({
    currentUserId,
    therapistId,
    roomId: roomId || undefined,
  });

  // Initialize chat room
  useEffect(() => {
    const initializeChat = async () => {
      if (!roomId && therapistId) {
        try {
          const newRoomId = await createChatRoom(therapistId);
          setRoomId(newRoomId);
          console.log("Chat room created:", newRoomId);
        } catch (error) {
          console.error("Failed to create chat room:", error);
        }
      }
    };

    initializeChat();
  }, [therapistId, roomId, createChatRoom]);

  const handleStartVideoCall = async () => {
    const participants = [
      {
        id: therapistId,
        name: "Dr. Sarah Johnson",
        avatar: "avatar-url",
        isTherapist: true,
        isMuted: false,
        isVideoEnabled: true,
      },
    ];

    const success = await startCall(participants);
    if (success) {
      setShowVideoCall(true);
    }
  };

  // Rest of your component...
}
```

### 3. WebSocket Server Events

Your WebSocket server should handle both chat and video call events:

```typescript
// In your WebSocket server
io.on("connection", (socket) => {
  console.log("User connected to room:", socket.handshake.query.roomId);

  // === CHAT EVENTS ===
  socket.on("send-message", (data) => {
    socket.to(socket.handshake.query.roomId).emit("new-message", {
      ...data,
      from: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("typing", (data) => {
    socket.to(socket.handshake.query.roomId).emit("user-typing", {
      userId: socket.id,
      isTyping: data.isTyping,
    });
  });

  // === VIDEO CALL EVENTS ===
  socket.on("video-call:request", (data) => {
    const { participants } = data;
    participants.forEach((participant) => {
      socket.to(participant.id).emit("video-call:request", {
        from: socket.id,
        participant: data,
      });
    });
  });

  socket.on("video-call:accept", () => {
    socket.broadcast.emit("video-call:accepted", { from: socket.id });
  });

  socket.on("video-call:reject", () => {
    socket.broadcast.emit("video-call:rejected", { from: socket.id });
  });

  socket.on("video-call:end", () => {
    socket.broadcast.emit("video-call:ended", { from: socket.id });
  });

  // WebRTC signaling
  socket.on("video-call:offer", (data) => {
    socket.to(data.to).emit("video-call:offer", {
      from: socket.id,
      offer: data.offer,
    });
  });

  socket.on("video-call:answer", (data) => {
    socket.to(data.to).emit("video-call:answer", {
      from: socket.id,
      answer: data.answer,
    });
  });

  socket.on("video-call:ice-candidate", (data) => {
    socket.to(data.to).emit("video-call:ice-candidate", {
      from: socket.id,
      candidate: data.candidate,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from room:", socket.handshake.query.roomId);
  });
});
```

## API Integration

### Create Chat Room

```typescript
// services/general-service.ts
export const chatWithTherapist = async (therapistId: string): Promise<any> => {
  try {
    const response = await apiClient.post(
      `/therapy-chat-rooms/create-by-client/${therapistId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};
```

### WebSocket Connection

```typescript
// services/video-call-service.ts
connectToChatRoom(roomId: string, userId: string): void {
  const wsUrl = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/safe-space/${roomId}`;

  this.socket = io(wsUrl, {
    query: { userId, roomId },
    transports: ['websocket', 'polling'],
  });

  this.setupSocketListeners();
}
```

## Usage Patterns

### Pattern 1: Create New Chat Room

```typescript
const { createChatRoom, startCall } = useChatVideoCall({
  currentUserId: "user-123",
  therapistId: "therapist-456",
});

// This will automatically create a room and connect to WebSocket
const handleStartCall = async () => {
  const success = await startCall(participants);
  // Room creation happens automatically if needed
};
```

### Pattern 2: Connect to Existing Room

```typescript
const { connectToExistingRoom, startCall } = useChatVideoCall({
  currentUserId: "user-123",
  roomId: "existing-room-id",
});

// Connect to existing room
connectToExistingRoom("existing-room-id");
```

### Pattern 3: Use Existing WebSocket

```typescript
const { startCall } = useChatVideoCall({
  currentUserId: "user-123",
  chatSocket: existingSocket, // Your existing WebSocket connection
});
```

## Event Flow

1. **Room Creation**:

   ```
   Client → POST /therapy-chat-rooms/create-by-client/{therapist_id}
   Server → Returns { room_id: "room-123" }
   ```

2. **WebSocket Connection**:

   ```
   Client → wss://base-url/safe-space/room-123
   Server → Accepts connection with room context
   ```

3. **Video Call Initiation**:

   ```
   Client → socket.emit('video-call:request', { participants, roomId })
   Server → socket.to(participant.id).emit('video-call:request', data)
   ```

4. **WebRTC Signaling**:
   ```
   Client A → socket.emit('video-call:offer', { to: clientB, offer })
   Server → socket.to(clientB).emit('video-call:offer', { from: clientA, offer })
   Client B → Receives offer and responds with answer
   ```

## Error Handling

```typescript
const handleStartCall = async () => {
  try {
    const success = await startCall(participants);
    if (!success) {
      alert("Failed to start call. Please check your camera permissions.");
    }
  } catch (error) {
    if (error.message.includes("Failed to create chat room")) {
      alert("Failed to create chat room. Please try again.");
    } else {
      alert("Failed to start video call. Please try again.");
    }
  }
};
```

## Room Management

- **Room Creation**: Automatic via API when needed
- **Room Connection**: Automatic WebSocket connection using room ID
- **Room Cleanup**: Handled by your existing chat system
- **Room Persistence**: Managed by your backend

## Testing

### Test Room Creation

```typescript
// Test API endpoint
const response = await chatWithTherapist("therapist-123");
console.log("Room created:", response.data?.id);
```

### Test WebSocket Connection

```typescript
// Test WebSocket connection
videoCallService.connectToChatRoom("room-123", "user-456");
```

### Test Video Call

```typescript
// Test video call in created room
const success = await startCall(participants);
console.log("Call started:", success);
```

## Troubleshooting

### Common Issues

1. **Room Creation Fails**

   - Check API endpoint URL
   - Verify therapist ID is valid
   - Check authentication headers

2. **WebSocket Connection Fails**

   - Verify WebSocket URL format
   - Check room ID is valid
   - Ensure WebSocket server is running

3. **Video Call Not Starting**
   - Check camera/microphone permissions
   - Verify WebRTC support
   - Check WebSocket connection is active

### Debug Mode

Enable debug logging:

```typescript
// In video-call-service.ts
console.log("Connecting to WebSocket:", wsUrl);
console.log("Room ID:", roomId);
console.log("User ID:", userId);
```

## Best Practices

1. **Always handle room creation errors** gracefully
2. **Use the same WebSocket connection** for chat and video calls
3. **Validate room ID** before connecting
4. **Handle WebSocket reconnections** properly
5. **Clean up resources** when calls end

## Example Integration

See `examples/chat-room-with-video-call.tsx` for a complete example of how to integrate video calls with your chat room system.
