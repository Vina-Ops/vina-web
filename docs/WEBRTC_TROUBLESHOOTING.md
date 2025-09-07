# WebRTC Connectivity Troubleshooting Guide

## Problem: Users Can't See/Hear Each Other in Video Calls

This is a common WebRTC connectivity issue that occurs when users are on different networks and NAT traversal fails.

## Root Causes

1. **NAT/Firewall Restrictions**: Corporate firewalls or home routers block WebRTC traffic
2. **Insufficient TURN Servers**: No relay servers available for NAT traversal
3. **ICE Candidate Issues**: Failed to gather proper connection candidates
4. **Network Configuration**: Strict network policies blocking P2P connections

## Solutions Implemented

### 1. Enhanced ICE Server Configuration

**File**: `lib/peer-config.ts`

```typescript
iceServers: [
  // Multiple STUN servers for better discovery
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
  
  // Additional STUN servers
  { urls: "stun:stun.ekiga.net" },
  { urls: "stun:stun.ideasip.com" },
  { urls: "stun:stun.schlund.de" },
  { urls: "stun:stun.stunprotocol.org:3478" },
  
  // TURN servers for NAT traversal
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:openrelay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:openrelay.metered.ca:443?transport=tcp",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
],
```

### 2. Enhanced ICE Configuration

```typescript
config: {
  iceCandidatePoolSize: 10,
  iceTransportPolicy: "all", // Try both relay and host candidates
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
}
```

### 3. Connection Diagnostics

**New Component**: `components/chat/ConnectionDiagnostics.tsx`

- Real-time ICE connection state monitoring
- ICE candidate tracking
- Connection type detection
- Troubleshooting tips
- Server usage information

### 4. Enhanced Debugging

**File**: `hooks/usePeerVideoCall.ts`

Added comprehensive logging for:
- ICE connection state changes
- ICE candidate gathering
- Connection state transitions
- ICE candidate errors
- TURN/STUN server usage

## How to Use the Diagnostics

### 1. During a Video Call

1. **Open the video call interface**
2. **Look for the "Connection Status" widget** in the top-left corner
3. **Click to expand** for detailed information
4. **Check the connection states**:
   - `connected`: ✅ Working properly
   - `connecting`: ⏳ Still establishing connection
   - `failed`: ❌ Connection failed (see troubleshooting tips)
   - `disconnected`: ⚠️ Connection lost

### 2. Browser Console Logs

Open browser DevTools (F12) and look for these logs:

```
🧊 ICE Connection State: connected
✅ ICE connection established successfully
🧊 ICE Candidate: {type: "host", protocol: "udp", address: "192.168.1.100"}
```

**Error indicators**:
```
❌ ICE connection failed - this usually means NAT traversal failed
💡 Try using TURN servers or check firewall settings
❌ ICE Candidate Error: {errorCode: 701, errorText: "STUN server address resolution failed"}
```

## Troubleshooting Steps

### For Users

1. **Check Internet Connection**
   - Ensure stable internet connection
   - Try refreshing the page
   - Test with a different network (mobile hotspot)

2. **Browser Permissions**
   - Allow camera and microphone access
   - Check if browser is blocking WebRTC
   - Try a different browser (Chrome, Firefox, Safari)

3. **Network Issues**
   - Disable VPN if using one
   - Check if corporate firewall is blocking WebRTC
   - Try from a different network

4. **Browser Settings**
   - Enable WebRTC in browser settings
   - Clear browser cache and cookies
   - Disable browser extensions temporarily

### For Developers

1. **Check ICE Connection State**
   ```javascript
   // In browser console during a call
   console.log("ICE State:", pc.iceConnectionState);
   console.log("Connection State:", pc.connectionState);
   ```

2. **Monitor ICE Candidates**
   ```javascript
   pc.addEventListener('icecandidate', (event) => {
     if (event.candidate) {
       console.log('ICE Candidate:', event.candidate);
     }
   });
   ```

3. **Test TURN Servers**
   ```javascript
   // Test if TURN servers are accessible
   const pc = new RTCPeerConnection({
     iceServers: [{ urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' }]
   });
   ```

## Common Issues and Solutions

### Issue 1: "ICE connection failed"

**Cause**: NAT traversal failed, no TURN servers available

**Solutions**:
- Ensure TURN servers are properly configured
- Check if TURN servers are accessible
- Try different TURN servers
- Check firewall settings

### Issue 2: "No ICE candidates gathered"

**Cause**: STUN servers unreachable or blocked

**Solutions**:
- Add more STUN servers
- Check network connectivity to STUN servers
- Try different STUN server providers

### Issue 3: "Connection established but no media"

**Cause**: Media stream issues, not ICE connectivity

**Solutions**:
- Check camera/microphone permissions
- Verify media stream is being sent
- Check if media tracks are enabled

### Issue 4: "Intermittent connection drops"

**Cause**: Network instability or ICE connection state changes

**Solutions**:
- Monitor connection state changes
- Implement reconnection logic
- Use connection state monitoring

## Testing Connectivity

### 1. Local Testing
```bash
# Test with local PeerJS server
npm run dev
# Should connect to localhost:9000
```

### 2. Production Testing
```bash
# Test with public PeerJS server
npm run build
npm run start
# Should connect to 0.peerjs.com:443
```

### 3. ICE Connectivity Test
Visit: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

Add these servers:
```
stun:stun.l.google.com:19302
turn:openrelay.metered.ca:80
turn:openrelay.metered.ca:443
```

## Environment Variables

For custom TURN servers, set these environment variables:

```bash
# Custom TURN server
NEXT_PUBLIC_TURN_SERVER_URL=turn:your-turn-server.com:3478
NEXT_PUBLIC_TURN_USERNAME=your-username
NEXT_PUBLIC_TURN_CREDENTIAL=your-password

# Custom STUN server
NEXT_PUBLIC_STUN_SERVER_URL=stun:your-stun-server.com:3478
```

## Monitoring and Analytics

### 1. Connection Quality Metrics
- ICE connection state transitions
- ICE candidate types used
- TURN vs STUN server usage
- Connection establishment time

### 2. Error Tracking
- ICE candidate errors
- Connection failures
- Media stream issues
- Network timeouts

### 3. User Experience Metrics
- Call success rate
- Connection establishment time
- Call quality indicators
- User-reported issues

## Best Practices

1. **Always include TURN servers** for production
2. **Use multiple STUN servers** for redundancy
3. **Monitor connection states** in real-time
4. **Provide user feedback** on connection status
5. **Implement fallback mechanisms** for failed connections
6. **Test across different networks** and devices
7. **Keep TURN server credentials secure**
8. **Monitor TURN server usage** and costs

## Support and Resources

- **WebRTC Samples**: https://webrtc.github.io/samples/
- **ICE Connectivity Test**: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
- **TURN Server Providers**: 
  - Metered.ca (free tier available)
  - Xirsys
  - Twilio STUN/TURN
  - Google Cloud STUN/TURN

## Contact

If issues persist after following this guide, please:
1. Check browser console for error logs
2. Note the connection diagnostics information
3. Test with different networks/browsers
4. Contact support with detailed information
