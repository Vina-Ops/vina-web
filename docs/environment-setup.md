# Environment Setup for WebSocket Connection

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=development

# API URLs
NEXT_PUBLIC_API_URL=https://vina-ai.onrender.com
NEXT_PUBLIC_API_URL_PROD=https://vina-ai.onrender.com

# Internal API URL (for server-side calls)
NEXT_PUBLIC_INTERNAL_API_URL=http://localhost:3000
```

## WebSocket URL Construction

The WebSocket URL is automatically constructed from your API URL:

- Development: `wss://vina-ai.onrender.com/api/vina`
- Production: `wss://vina-ai.onrender.com/api/vina`

## Troubleshooting

### Issue: "No API URL configured, using fallback"

**Solution**: Set the environment variables in your `.env.local` file

### Issue: WebSocket connection fails

**Check**:

1. Environment variables are set correctly
2. The API server supports WebSocket connections
3. The endpoint `/api/vina` exists on your server

### Issue: Invalid WebSocket URL

**Check**: The URL format should be `wss://domain.com/api/vina`, not `wss://https://domain.com/api/vina`

## Testing the Connection

1. Set up your environment variables
2. Restart your development server
3. Check the browser console for WebSocket connection logs
4. The connection should show: "Connecting to WebSocket: wss://vina-ai.onrender.com/api/vina"
