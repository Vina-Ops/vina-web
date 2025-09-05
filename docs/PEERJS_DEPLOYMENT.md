# PeerJS Server Deployment Guide

This guide explains how to deploy your custom PeerJS server to handle the `/peerjs` endpoint on your production server.

## Overview

Your application now includes a custom PeerJS server that will run alongside your Next.js application, providing WebRTC signaling services for video calls.

## Files Added/Modified

### New Files:
- `server/peerjs-server.js` - Custom PeerJS server
- `render.yaml` - Render.com deployment configuration
- `Procfile` - Alternative deployment configuration

### Modified Files:
- `package.json` - Added dependencies and scripts
- `lib/peer-config.ts` - Updated to use custom server

## Dependencies Added

```json
{
  "express": "^4.18.2",
  "ws": "^8.14.2"
}
```

## Local Development

To run the PeerJS server locally:

```bash
# Install dependencies
npm install

# Run both Next.js and PeerJS server
npm run dev

# Or run PeerJS server separately
npm run start:peerjs
```

The PeerJS server will be available at:
- WebSocket: `ws://localhost:9000/peerjs`
- HTTP: `http://localhost:9000/peerjs`
- Health check: `http://localhost:9000/health`

## Production Deployment

### Render.com Deployment

1. **Update your Render.com service configuration:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `NEXT_PUBLIC_PEER_HOST=vina-ai.onrender.com`
     - `NEXT_PUBLIC_PEER_PORT=443`
     - `NEXT_PUBLIC_PEER_PATH=/peerjs`

2. **Deploy using the render.yaml file:**
   ```bash
   # Push to your repository
   git add .
   git commit -m "Add PeerJS server configuration"
   git push origin main
   ```

### Alternative Deployment Platforms

For other platforms (Heroku, Railway, etc.), use the `Procfile`:

```bash
# Deploy with Procfile
git add .
git commit -m "Add PeerJS server"
git push heroku main  # or your platform's command
```

## Environment Variables

Set these environment variables in your production environment:

```bash
NODE_ENV=production
NEXT_PUBLIC_PEER_HOST=vina-ai.onrender.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/peerjs
PORT=10000  # or your platform's assigned port
```

## Testing the Deployment

After deployment, test your PeerJS server:

1. **Health Check:**
   ```bash
   curl https://vina-ai.onrender.com/health
   ```

2. **PeerJS Endpoint:**
   ```bash
   curl https://vina-ai.onrender.com/peerjs
   ```

3. **WebSocket Connection:**
   - Open browser console
   - Check for successful PeerJS connections
   - Look for: `🎯 PeerJS connected with ID: ...`

## Troubleshooting

### Common Issues:

1. **Port Configuration:**
   - Ensure your platform assigns a port via `PORT` environment variable
   - The server will use `process.env.PORT` or default to 9000

2. **WebSocket Connection Issues:**
   - Check that your platform supports WebSocket connections
   - Verify the `/peerjs` path is accessible

3. **SSL/HTTPS:**
   - The server automatically handles SSL in production
   - Ensure your domain has valid SSL certificates

### Debug Commands:

```bash
# Check server logs
npm run start:peerjs

# Test local connection
curl http://localhost:9000/health

# Check WebSocket endpoint
curl http://localhost:9000/peerjs
```

## Configuration Options

The PeerJS server can be configured via environment variables:

- `PORT` - Server port (default: 9000)
- `NODE_ENV` - Environment (development/production)
- `SSL_KEY` - SSL private key (for custom SSL)
- `SSL_CERT` - SSL certificate (for custom SSL)

## Next Steps

1. Deploy your application with the new configuration
2. Test video calls in production
3. Monitor server logs for any connection issues
4. Consider adding monitoring/alerting for the PeerJS server

## Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify environment variables are set correctly
3. Test the health endpoint to ensure the server is running
4. Check browser console for WebSocket connection errors

