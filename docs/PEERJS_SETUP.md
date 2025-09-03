# PeerJS Setup Guide

## Overview

This guide explains how to set up PeerJS for video calls in the Vina Web application.

## What is PeerJS?

PeerJS is a library that simplifies WebRTC peer-to-peer connections. It handles:

- Signaling server communication
- WebRTC connection establishment
- Cross-browser compatibility
- Automatic reconnection

## Configuration Options

### 1. Use Public PeerJS Server (Recommended for Production)

```bash
# Add to your .env.local file
NEXT_PUBLIC_PEER_HOST=peerjs-server.herokuapp.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/peerjs
```

### 2. Use Local PeerJS Server (Development)

```bash
# Install PeerJS server globally
npm install -g peer

# Start the server
peer --port 9000

# Add to your .env.local file
NEXT_PUBLIC_PEER_HOST=localhost
NEXT_PUBLIC_PEER_PORT=9000
NEXT_PUBLIC_PEER_PATH=/peerjs
```

### 3. Use Your Own PeerJS Server

```bash
# Add to your .env.local file
NEXT_PUBLIC_PEER_HOST=your-server.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/peerjs
```

## Environment Variables

Create a `.env.local` file in your project root:

```bash
# PeerJS Server Configuration
NEXT_PUBLIC_PEER_HOST=peerjs-server.herokuapp.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/peerjs

# Alternative: Use local server for development
# NEXT_PUBLIC_PEER_HOST=localhost
# NEXT_PUBLIC_PEER_PORT=9000
# NEXT_PUBLIC_PEER_PATH=/peerjs
```

## How It Works

1. **PeerJS Initialization**: Each user gets a unique peer ID
2. **Call Establishment**: Users can call each other using peer IDs
3. **Media Streams**: Audio/video streams are exchanged directly between peers
4. **Signaling**: PeerJS handles all the complex WebRTC signaling automatically

## Benefits Over Previous Implementation

- **Simpler Code**: No manual WebRTC setup
- **Better Reliability**: Automatic reconnection and error handling
- **Cross-Platform**: Works consistently across browsers and devices
- **Maintained**: Active development and community support

## Testing

1. Open the app in two different browsers/tabs
2. Navigate to a chat room
3. Click the video call button
4. Accept the call in the other browser/tab
5. Verify audio and video are working

## Troubleshooting

### Connection Issues

- Check if the PeerJS server is accessible
- Verify environment variables are set correctly
- Check browser console for error messages

### Media Issues

- Ensure camera/microphone permissions are granted
- Check if other applications are using the camera/microphone
- Try refreshing the page

### Performance Issues

- Use a PeerJS server closer to your users
- Consider using TURN servers for complex network scenarios
