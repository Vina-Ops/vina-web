# PeerJS Production Deployment Guide

## Problem

The PeerJS WebSocket connection is failing in production because Vercel doesn't support long-running WebSocket servers. The error shows:

```
WebSocket connection to 'wss://vina-web.vercel.app/peerjs' failed
```

## Solutions

### Solution 1: Use PeerJS.com Public Server (Recommended)

The easiest solution is to use the public PeerJS server provided by PeerJS.com.

**Configuration:**

```typescript
// lib/peer-config.ts
const peerHost = isDevelopment ? "localhost" : "0.peerjs.com";
const peerPort = isDevelopment ? 9000 : 443;
const isSecure = !isDevelopment;
```

**Pros:**

- ✅ No server setup required
- ✅ Free to use
- ✅ Reliable and maintained by PeerJS team
- ✅ Works immediately

**Cons:**

- ❌ Shared with other users (potential conflicts)
- ❌ No custom configuration
- ❌ Dependent on external service

### Solution 2: Deploy PeerJS Server Separately

#### Option A: Railway/Render.com

Deploy the PeerJS server to a platform that supports WebSockets:

1. **Create a separate repository for PeerJS server:**

```javascript
// server.js
const { PeerServer } = require("peerjs");

const server = PeerServer({
  port: process.env.PORT || 9000,
  path: "/peerjs",
  allow_discovery: true,
  cors: {
    origin: ["https://vina-web.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log("PeerJS Server running on port", process.env.PORT || 9000);
```

2. **Deploy to Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

3. **Update environment variables:**

```bash
# In Vercel dashboard
NEXT_PUBLIC_PEERJS_HOST=your-railway-app.railway.app
NEXT_PUBLIC_PEERJS_PORT=443
NEXT_PUBLIC_PEERJS_SECURE=true
```

#### Option B: DigitalOcean Droplet

Deploy a VPS with PeerJS server:

1. **Create a DigitalOcean droplet**
2. **Install Node.js and PM2:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

3. **Deploy PeerJS server:**

```bash
# Create server directory
mkdir peerjs-server
cd peerjs-server

# Create package.json
npm init -y
npm install peerjs

# Create server.js (same as above)
# Start with PM2
pm2 start server.js --name peerjs-server
pm2 startup
pm2 save
```

4. **Configure Nginx (optional):**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /peerjs {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Solution 3: Use Alternative WebRTC Services

#### Option A: Agora.io

```bash
npm install agora-rtc-sdk-ng
```

#### Option B: Twilio Video

```bash
npm install @twilio/video
```

#### Option C: Daily.co

```bash
npm install @daily-co/daily-js
```

## Current Implementation

The application is currently configured to use:

- **Development:** `localhost:9000` (local PeerJS server)
- **Production:** `0.peerjs.com:443` (public PeerJS server)

## Environment Variables

Add these to your Vercel environment variables:

```bash
# For custom PeerJS server
NEXT_PUBLIC_PEERJS_HOST=your-peerjs-server.com
NEXT_PUBLIC_PEERJS_PORT=443
NEXT_PUBLIC_PEERJS_SECURE=true

# For public PeerJS server (default)
# No environment variables needed
```

## Testing

1. **Local testing:**

```bash
npm run dev
# Should connect to localhost:9000
```

2. **Production testing:**

```bash
npm run build
npm run start
# Should connect to 0.peerjs.com:443
```

## Troubleshooting

### Connection Issues

1. Check browser console for WebSocket errors
2. Verify environment variables are set correctly
3. Test with different browsers
4. Check firewall/proxy settings

### Performance Issues

1. Monitor connection limits (30 max per client)
2. Implement connection cleanup
3. Use TURN servers for better connectivity
4. Monitor server resources

## Security Considerations

1. **CORS Configuration:** Restrict origins to your domain
2. **Rate Limiting:** Implement connection limits
3. **Authentication:** Add user authentication before allowing connections
4. **Monitoring:** Log and monitor all connections

## Cost Considerations

- **Public PeerJS:** Free
- **Railway:** $5/month for hobby plan
- **DigitalOcean:** $6/month for basic droplet
- **Agora.io:** Pay per minute of usage
- **Twilio Video:** Pay per participant per minute

## Recommendation

For immediate deployment, use **Solution 1** (public PeerJS server) as it requires no additional setup and works out of the box. For production applications with high usage, consider **Solution 2** with a dedicated server.
