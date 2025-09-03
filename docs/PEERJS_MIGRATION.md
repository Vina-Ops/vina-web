# PeerJS Migration Guide

## What Changed

We've successfully migrated from a complex WebRTC implementation to **PeerJS** for video calls. This migration simplifies the code significantly and improves reliability.

## Files Modified

### 1. New Files Created

- `hooks/usePeerVideoCall.ts` - New PeerJS-based video call hook
- `lib/peer-config.ts` - PeerJS server configuration
- `app/peerjs-demo/page.tsx` - Demo page for testing PeerJS functionality
- `docs/PEERJS_SETUP.md` - Setup instructions for PeerJS

### 2. Files Updated

- `app/chat-room/[id]/page.tsx` - Now uses `usePeerVideoCall` instead of `useChatVideoCall`
- `app/therapist/sessions/page.tsx` - Now uses `usePeerVideoCall` instead of `useChatVideoCall`

### 3. Dependencies Added

- `peerjs` - Main PeerJS library
- `@types/peerjs` - TypeScript definitions

## Key Benefits of the Migration

### Before (WebRTC Implementation)

- Complex manual WebRTC setup
- Manual signaling through WebSockets
- Complex connection state management
- Manual peer connection handling
- More prone to connection issues

### After (PeerJS Implementation)

- Simple API with automatic WebRTC handling
- Built-in signaling server
- Automatic reconnection and error handling
- Cross-browser compatibility
- More reliable connections

## How to Use

### 1. Basic Usage

```typescript
import { usePeerVideoCall } from "@/hooks/usePeerVideoCall";

const {
  callState,
  remoteStreams,
  startCall,
  acceptCall,
  rejectCall,
  endCall,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
} = usePeerVideoCall({
  currentUserId: "user-123",
  roomId: "room-456",
});
```

### 2. Starting a Call

```typescript
const participants = [
  {
    id: "therapist-789",
    name: "Dr. Smith",
    avatar: "avatar-url",
    isTherapist: true,
    isMuted: false,
    isVideoEnabled: true,
  },
];

const success = await startCall(participants);
```

### 3. Handling Incoming Calls

```typescript
// The hook automatically handles incoming calls
// You can access the incoming call state:
if (incomingCall.isVisible) {
  // Show incoming call UI
  // Call acceptCall() or rejectCall()
}
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# For production (public PeerJS server)
NEXT_PUBLIC_PEER_HOST=peerjs-server.herokuapp.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/peerjs

# For development (local PeerJS server)
# NEXT_PUBLIC_PEER_HOST=localhost
# NEXT_PUBLIC_PEER_PORT=9000
# NEXT_PUBLIC_PEER_PATH=/peerjs
```

### Local Development Setup

```bash
# Install PeerJS server globally
npm install -g peer

# Start the server
peer --port 9000
```

## Testing

### 1. Use the Demo Page

Navigate to `/peerjs-demo` to test the video call functionality.

### 2. Test Between Tabs

1. Open `/peerjs-demo` in two different browser tabs
2. Note your Peer ID from the status
3. In the other tab, enter your Peer ID and click "Start Call"
4. Accept the incoming call
5. Test video, audio, and screen sharing

### 3. Test in Your App

- Navigate to a chat room
- Click the video call button
- Test the call functionality

## Migration Checklist

- [x] Install PeerJS dependencies
- [x] Create new `usePeerVideoCall` hook
- [x] Update chat room page
- [x] Update therapist sessions page
- [x] Create configuration files
- [x] Create demo page
- [x] Update documentation

## Troubleshooting

### Common Issues

1. **"PeerJS not connected"**

   - Check if the PeerJS server is running
   - Verify environment variables
   - Check browser console for errors

2. **"Failed to get user media"**

   - Ensure camera/microphone permissions are granted
   - Check if other apps are using the camera/microphone

3. **"Call not connecting"**
   - Verify both peers are using the same PeerJS server
   - Check network connectivity
   - Try refreshing the page

### Debug Mode

The hook includes extensive logging. Check the browser console for:

- PeerJS connection status
- Call establishment steps
- Media stream information
- Error details

## Next Steps

1. **Test thoroughly** in your development environment
2. **Configure production** PeerJS server settings
3. **Monitor performance** and connection stability
4. **Consider TURN servers** for complex network scenarios
5. **Add analytics** to track call success rates

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify PeerJS server configuration
3. Test with the demo page first
4. Check the PeerJS documentation: https://peerjs.com/docs
