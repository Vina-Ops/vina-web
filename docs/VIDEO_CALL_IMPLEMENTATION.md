# Video Call Implementation

This document describes the video call functionality implemented in the Vina Web application.

## Overview

The video call feature provides real-time video communication between users and therapists in the chat room. It uses WebRTC for peer-to-peer communication and Socket.IO for signaling.

## Architecture

### Components

1. **VideoCallService** (`services/video-call-service.ts`)

   - Manages WebRTC connections
   - Handles signaling through Socket.IO
   - Controls call state and media streams

2. **VideoCall Component** (`components/chat/VideoCall.tsx`)

   - Main video call interface
   - Displays local and remote video streams
   - Provides call controls (mute, video, screen share, etc.)

3. **IncomingCall Component** (`components/chat/IncomingCall.tsx`)

   - Handles incoming call notifications
   - Provides accept/reject options

4. **useVideoCall Hook** (`hooks/useVideoCall.ts`)
   - Custom React hook for video call state management
   - Provides clean API for video call operations

### Features

- **Real-time Video/Audio**: High-quality peer-to-peer communication
- **Screen Sharing**: Share screen during calls
- **Call Controls**: Mute, video toggle, speaker control
- **Incoming Call Handling**: Accept/reject incoming calls
- **Call Duration**: Track call duration
- **Minimize/Maximize**: Minimize call window while staying connected
- **Settings Panel**: Device selection and call settings

## Setup

### Dependencies

```bash
npm install socket.io-client simple-peer
npm install --save-dev @types/simple-peer
```

### Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### WebSocket Server

The application includes a basic Socket.IO server implementation in `pages/api/socket.ts`. For production, consider using a dedicated WebSocket server.

## Usage

### Starting a Video Call

```typescript
import { useVideoCall } from "@/hooks/useVideoCall";

const { startCall } = useVideoCall(currentUserId, chatId);

const handleStartCall = async () => {
  const participants = [
    {
      id: "therapist-id",
      name: "Dr. Sarah Johnson",
      avatar: "avatar-url",
      isTherapist: true,
      isMuted: false,
      isVideoEnabled: true,
    },
  ];

  const success = await startCall(participants);
  if (success) {
    // Call started successfully
  }
};
```

### Handling Incoming Calls

```typescript
const { incomingCall, acceptCall, rejectCall } = useVideoCall(
  currentUserId,
  chatId
);

// The hook automatically handles incoming calls
// incomingCall.isVisible will be true when there's an incoming call
// incomingCall.caller contains the caller's information
```

### Call Controls

```typescript
const { toggleMute, toggleVideo, toggleScreenShare, endCall } = useVideoCall(
  currentUserId,
  chatId
);

// Toggle mute
toggleMute();

// Toggle video
toggleVideo();

// Toggle screen sharing
await toggleScreenShare();

// End call
endCall();
```

## Integration with Chat Room

The video call functionality is integrated into the chat room page (`app/chat-room/[id]/page.tsx`):

1. **Video Button**: Click the video icon in the chat header to start a call
2. **Incoming Call Notifications**: Automatically displayed when receiving calls
3. **Call Interface**: Full-screen video call interface with controls

## WebRTC Implementation

### Peer Connection

The implementation uses the `simple-peer` library for WebRTC peer connections:

- **Initiator**: The user who starts the call
- **Receiver**: The user who receives the call
- **Signaling**: Socket.IO handles offer/answer exchange and ICE candidates

### Media Streams

- **Local Stream**: User's camera and microphone
- **Remote Streams**: Other participants' video/audio
- **Screen Share**: Optional screen sharing stream

### ICE Candidates

The service automatically handles ICE candidate exchange for NAT traversal.

## Security Considerations

1. **HTTPS Required**: WebRTC requires HTTPS in production
2. **Permissions**: Camera and microphone permissions are requested
3. **Peer Validation**: Validate peer connections before establishing calls
4. **Room Access**: Ensure users can only join authorized chat rooms

## Browser Support

The video call feature requires modern browsers with WebRTC support:

- Chrome 56+
- Firefox 52+
- Safari 11+
- Edge 79+

## Troubleshooting

### Common Issues

1. **Camera/Microphone Access Denied**

   - Check browser permissions
   - Ensure HTTPS is used in production

2. **Connection Failures**

   - Check network connectivity
   - Verify WebSocket server is running
   - Check firewall settings

3. **Video Not Displaying**

   - Check if camera is in use by another application
   - Verify camera permissions

4. **Audio Issues**
   - Check microphone permissions
   - Verify audio device selection
   - Check browser audio settings

### Debug Mode

Enable debug logging by setting:

```typescript
// In video-call-service.ts
console.log("Debug mode enabled");
```

## Future Enhancements

1. **Recording**: Add call recording functionality
2. **Background Blur**: Implement background blur effects
3. **Virtual Background**: Add virtual background support
4. **Call Quality**: Implement adaptive bitrate
5. **Group Calls**: Support for multiple participants
6. **Call Analytics**: Track call quality and duration
7. **Push Notifications**: Notify users of incoming calls when app is closed

## API Reference

### VideoCallService

```typescript
class VideoCallService {
  static getInstance(): VideoCallService;
  initializeSocket(userId: string, chatId: string): void;
  startCall(participants: CallParticipant[]): Promise<boolean>;
  acceptCall(): Promise<boolean>;
  rejectCall(): void;
  endCall(): void;
  toggleMute(): void;
  toggleVideo(): void;
  startScreenShare(): Promise<boolean>;
  stopScreenShare(): void;
  getLocalStream(): MediaStream | null;
  getState(): VideoCallState;
  destroy(): void;
}
```

### useVideoCall Hook

```typescript
const {
  callState,
  remoteStreams,
  incomingCall,
  startCall,
  acceptCall,
  rejectCall,
  endCall,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  getLocalStream,
} = useVideoCall(currentUserId, chatId);
```

## Contributing

When contributing to the video call feature:

1. Test on multiple browsers
2. Verify WebRTC functionality
3. Check mobile responsiveness
4. Test with different network conditions
5. Update documentation for any API changes

