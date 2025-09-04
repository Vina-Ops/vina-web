# PeerJS Troubleshooting Guide

## 🚨 Common Issues and Solutions

### **1. Production Connection Errors**

**Problem**: `Lost connection to server` or `WebSocket connection failed`

**Solution**:

- The production config now uses `peerjs-server.herokuapp.com` which is a reliable public PeerJS server
- If you want to use your own server, set these environment variables:

```bash
# In your .env.local or production environment
NEXT_PUBLIC_PEER_HOST=your-peerjs-server.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/
```

### **2. Development Connection Issues**

**Problem**: Can't connect to local PeerJS server

**Solution**:

1. Install PeerJS server globally:

```bash
npm install -g peer
```

2. Start the server:

```bash
peer --port 9000 --path /
```

3. Or use the npm script:

```bash
npm run peerjs
```

### **3. URL Path Issues**

**Problem**: `/peerjs` being appended to URL incorrectly

**Solution**:

- Keep the path as `/` in your config
- PeerJS automatically appends `/peerjs` to the path
- The final URL will be: `ws://host:port/peerjs`

### **4. Therapist Video Call Not Working**

**Common Causes**:

1. **Peer ID Mismatch**: The therapist and patient need to know each other's peer IDs
2. **Network Issues**: Firewall or NAT issues blocking WebRTC
3. **Browser Permissions**: Camera/microphone not granted

**Debugging Steps**:

1. Check browser console for PeerJS connection logs
2. Verify both users have camera/microphone permissions
3. Test with the demo page: `/peerjs-demo`
4. Check network connectivity

### **5. Environment Configuration**

**For Production**:

```bash
NEXT_PUBLIC_PEER_HOST=peerjs-server.herokuapp.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/
NEXT_PUBLIC_PEER_USE_ALTERNATIVE=false
```

**For Development**:

```bash
NEXT_PUBLIC_PEER_HOST=localhost
NEXT_PUBLIC_PEER_PORT=9000
NEXT_PUBLIC_PEER_PATH=/
NEXT_PUBLIC_PEER_USE_ALTERNATIVE=false
```

**For Custom Server**:

```bash
NEXT_PUBLIC_PEER_HOST=your-server.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/
NEXT_PUBLIC_PEER_USE_ALTERNATIVE=false
```

## 🔧 Testing Your Setup

### **1. Test PeerJS Connection**

Visit `/peerjs-demo` to test the connection:

- Check if you get a peer ID
- Try starting a call between two browser tabs
- Verify video/audio works

### **2. Test Therapist Video Call**

1. Open therapist sessions page
2. Start a chat with a patient
3. Click the video call button
4. Check console logs for connection status

### **3. Debug Information**

The app logs detailed information to the console:

- PeerJS connection status
- Call state changes
- Stream acquisition status
- Network statistics

## 🚀 Quick Fixes

### **If Production Still Fails**:

1. Try the alternative server by setting:

```bash
NEXT_PUBLIC_PEER_USE_ALTERNATIVE=true
```

2. Or use a different public server:

```bash
NEXT_PUBLIC_PEER_HOST=peerjs-server.herokuapp.com
```

### **If Development Fails**:

1. Make sure PeerJS server is running:

```bash
npm run peerjs
```

2. Check if port 9000 is available
3. Try a different port:

```bash
peer --port 9001 --path /
```

## 📞 Support

If you're still having issues:

1. Check the browser console for error messages
2. Verify your network allows WebRTC connections
3. Test with different browsers
4. Check if your firewall is blocking the connections
