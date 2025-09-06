# PeerJS Production Setup

This document explains how to configure PeerJS for production deployment.

## Environment Variables

Add the following environment variables to your production environment:

### Required for Production

```bash
# PeerJS Server Configuration
NEXT_PUBLIC_PEERJS_HOST=vina-ai.onrender.com
NEXT_PUBLIC_PEERJS_PORT=443
NEXT_PUBLIC_PEERJS_SECURE=true
```

### Optional (with defaults)

```bash
# If not set, will use defaults based on NODE_ENV
NODE_ENV=production
```

## Configuration Details

### Development vs Production

| Environment | Host                 | Port | Secure | Path    |
| ----------- | -------------------- | ---- | ------ | ------- |
| Development | localhost            | 9000 | false  | /peerjs |
| Production  | vina-ai.onrender.com | 443  | true   | /peerjs |

### ICE Servers

The configuration automatically includes:

**Development:**

- STUN servers only (Google's public STUN servers)

**Production:**

- STUN servers (Google's public STUN servers)
- TURN servers (Metered.ca free TURN servers for better connectivity)

### TURN Server Credentials

The production configuration uses Metered.ca's free TURN servers:

- **URLs**: `turn:openrelay.metered.ca:80` and `turn:openrelay.metered.ca:443`
- **Username**: `openrelayproject`
- **Credential**: `openrelayproject`

> **Note**: These are free public TURN servers. For production applications with high traffic, consider using your own TURN servers or paid services.

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `NEXT_PUBLIC_PEERJS_HOST` to your production domain
- [ ] Set `NEXT_PUBLIC_PEERJS_PORT` to 443 (or your HTTPS port)
- [ ] Set `NEXT_PUBLIC_PEERJS_SECURE=true` for HTTPS
- [ ] Ensure your PeerJS server is running on the production domain
- [ ] Test video calls in production environment

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check if PeerJS server is running on the specified host/port
2. **HTTPS Required**: Ensure `NEXT_PUBLIC_PEERJS_SECURE=true` for HTTPS connections
3. **Firewall Issues**: Ensure ports 80, 443, and 9000 are open
4. **TURN Server Issues**: Check if TURN servers are accessible from your network

### Debug Logs

The configuration logs the following information (credentials are hidden):

- Environment (development/production)
- Host, port, and security settings
- ICE server configuration
- Path configuration

## Alternative TURN Servers

If you need to use different TURN servers, you can modify the configuration in `lib/peer-config.ts`:

```typescript
// Replace the TURN servers in the production section
{
  urls: "turn:your-turn-server.com:3478",
  username: "your-username",
  credential: "your-password"
}
```

## Security Considerations

- Never commit TURN server credentials to version control
- Use environment variables for sensitive configuration
- Consider using your own TURN servers for production
- Monitor TURN server usage and costs
