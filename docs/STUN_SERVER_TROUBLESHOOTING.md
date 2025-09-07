# STUN Server Troubleshooting Guide

## Problem: STUN Host Lookup Errors

**Error**: `ICE Candidate Error: {errorCode: 701, errorText: 'STUN host lookup received error.'}`

This error indicates that some STUN servers in the configuration are not accessible or have DNS resolution issues.

## What Are STUN Servers?

STUN (Session Traversal Utilities for NAT) servers help WebRTC applications discover their public IP addresses and determine what type of NAT they're behind. They're essential for establishing peer-to-peer connections.

## Root Causes

1. **DNS Resolution Issues**: STUN server hostnames can't be resolved
2. **Network Firewall**: Corporate or home firewalls blocking STUN traffic
3. **Server Unavailability**: Some STUN servers may be temporarily down
4. **Network Configuration**: ISP or network blocking certain ports/protocols

## Solutions Implemented

### 1. Updated STUN Server Configuration

**File**: `lib/peer-config.ts`

**Removed problematic servers**:

- `stun:stun.ekiga.net` (often unreachable)
- `stun:stun.ideasip.com` (DNS issues)
- `stun:stun.schlund.de` (unreliable)
- `stun:stun.qq.com` (region-specific)
- `stun:stun.miwifi.com` (region-specific)

**Added reliable servers**:

- `stun:stun.cloudflare.com:3478` (very reliable)
- `stun:stun.nextcloud.com:443` (reliable)
- `stun:stun.voip.blackberry.com:3478` (stable)

**Current configuration**:

```typescript
iceServers: [
  // Google STUN servers (most reliable)
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },

  // Reliable public STUN servers
  { urls: "stun:stun.stunprotocol.org:3478" },
  { urls: "stun:stun.voiparound.com" },
  { urls: "stun:stun.voipbuster.com" },
  { urls: "stun:stun.voipstunt.com" },
  { urls: "stun:stun.counterpath.com" },
  { urls: "stun:stun.1und1.de" },
  { urls: "stun:stun.gmx.net" },

  // Cloudflare STUN servers (very reliable)
  { urls: "stun:stun.cloudflare.com:3478" },

  // Additional reliable servers
  { urls: "stun:stun.nextcloud.com:443" },
  { urls: "stun:stun.voip.blackberry.com:3478" },

  // TURN servers for NAT traversal
  // ... TURN server configuration
];
```

### 2. Enhanced Error Handling

**File**: `hooks/usePeerVideoCall.ts`

```typescript
pc.addEventListener("icecandidateerror", (event) => {
  // Only log errors for non-critical STUN servers
  const isCriticalError =
    event.errorCode === 701 &&
    (event.url?.includes("stun.l.google.com") ||
      event.url?.includes("stun.cloudflare.com") ||
      event.url?.includes("stun.stunprotocol.org"));

  if (isCriticalError) {
    console.error("❌ Critical ICE Candidate Error:", {
      errorCode: event.errorCode,
      errorText: event.errorText,
      url: event.url,
      address: event.address,
      port: event.port,
    });
  } else {
    console.warn(
      "⚠️ Non-critical ICE Candidate Error (continuing with other servers):",
      {
        errorCode: event.errorCode,
        errorText: event.errorText,
        url: event.url,
      }
    );
  }
});
```

**Benefits**:

- Reduces console noise from non-critical errors
- Only alerts on failures of essential STUN servers
- Continues operation with remaining working servers

### 3. STUN Server Testing Utility

**File**: `utils/stun-server-test.js`

A utility to test STUN server connectivity:

```javascript
// In browser console:
testStunServers();
```

**Features**:

- Tests all configured STUN servers
- Reports working, failed, and timeout servers
- Provides recommendations based on results
- Helps diagnose network connectivity issues

## Testing STUN Server Connectivity

### Method 1: Browser Console Test

1. **Open browser DevTools** (F12)
2. **Load the test utility**:

   ```javascript
   // Copy and paste the content of utils/stun-server-test.js
   // Then run:
   testStunServers();
   ```

3. **Review results**:

   ```
   🧪 Testing STUN server connectivity...

   Testing Google STUN 1...
   ✅ Google STUN 1: Working
   Testing Google STUN 2...
   ✅ Google STUN 2: Working
   Testing Cloudflare STUN...
   ✅ Cloudflare STUN: Working
   Testing STUN Protocol...
   ❌ STUN Protocol: 701: STUN host lookup received error.

   📊 Test Results Summary:
   ========================
   ✅ Working servers: 3
   ❌ Failed servers: 1
   ⏰ Timeout servers: 0

   💡 Recommendations:
   ✅ Good connectivity - WebRTC should work well
   ```

### Method 2: WebRTC Samples Test

Visit: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

Add these servers one by one:

```
stun:stun.l.google.com:19302
stun:stun.cloudflare.com:3478
stun:stun.stunprotocol.org:3478
```

### Method 3: Manual DNS Test

```bash
# Test DNS resolution
nslookup stun.l.google.com
nslookup stun.cloudflare.com
nslookup stun.stunprotocol.org

# Test connectivity
ping stun.l.google.com
ping stun.cloudflare.com
```

## Troubleshooting Steps

### For Users

1. **Check Internet Connection**

   - Ensure stable internet connection
   - Try different networks (mobile hotspot)

2. **Browser Settings**

   - Clear browser cache and cookies
   - Disable browser extensions temporarily
   - Try different browsers (Chrome, Firefox, Safari)

3. **Network Configuration**

   - Disable VPN if using one
   - Check if corporate firewall blocks STUN traffic
   - Try from different network (home vs office)

4. **Firewall Settings**
   - Allow UDP traffic on ports 3478, 19302
   - Allow STUN protocol traffic
   - Check Windows Firewall or router settings

### For Developers

1. **Monitor Console Logs**

   ```javascript
   // Look for these patterns:
   ✅ Working: "ICE Candidate: {type: 'host', ...}"
   ❌ Failed: "ICE Candidate Error: {errorCode: 701, ...}"
   ⚠️ Warning: "Non-critical ICE Candidate Error"
   ```

2. **Test Individual Servers**

   ```javascript
   // Test specific STUN server
   const pc = new RTCPeerConnection({
     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
   });
   ```

3. **Check Network Configuration**
   - Verify DNS resolution
   - Test UDP connectivity
   - Check firewall rules

## Common Error Codes

| Error Code | Description                     | Solution                                         |
| ---------- | ------------------------------- | ------------------------------------------------ |
| 701        | STUN host lookup received error | DNS resolution failed, try different STUN server |
| 702        | STUN host lookup timeout        | Network timeout, check connectivity              |
| 703        | STUN host lookup network error  | Network issue, check firewall                    |
| 704        | STUN host lookup DNS error      | DNS server issue, try different DNS              |

## Best Practices

1. **Use Multiple STUN Servers**

   - Always include Google STUN servers (most reliable)
   - Add Cloudflare STUN servers for redundancy
   - Include region-specific servers if needed

2. **Prioritize Reliability**

   - Use well-known, maintained STUN servers
   - Avoid servers that frequently have DNS issues
   - Test servers before adding to production

3. **Handle Errors Gracefully**

   - Don't fail on non-critical STUN server errors
   - Continue with working servers
   - Provide fallback mechanisms

4. **Monitor Performance**
   - Track STUN server success rates
   - Monitor connection establishment times
   - Log and analyze error patterns

## Alternative Solutions

### If STUN Servers Continue to Fail

1. **Use TURN Servers**

   - TURN servers can relay traffic when STUN fails
   - More reliable for strict NAT environments
   - Higher bandwidth usage

2. **Custom STUN Server**

   - Deploy your own STUN server
   - Full control over availability
   - Requires server maintenance

3. **Hybrid Approach**
   - Use STUN for discovery
   - Fall back to TURN for relay
   - Best of both worlds

## Environment Variables

For custom STUN server configuration:

```bash
# Custom STUN servers
NEXT_PUBLIC_CUSTOM_STUN_SERVERS=stun:your-stun-server.com:3478,stun:another-server.com:3478

# Disable problematic servers
NEXT_PUBLIC_DISABLE_STUN_SERVERS=stun.ideasip.com,stun.ekiga.net
```

## Monitoring and Analytics

### Key Metrics to Track

1. **STUN Server Success Rate**

   - Percentage of successful STUN requests
   - Per-server success rates
   - Geographic distribution of failures

2. **Connection Establishment Time**

   - Time to gather ICE candidates
   - STUN server response times
   - Overall connection setup time

3. **Error Patterns**
   - Most common error codes
   - Geographic correlation of errors
   - Time-based error patterns

### Recommended Monitoring

```javascript
// Track STUN server performance
const stunStats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTime: 0,
};

// Log STUN server metrics
console.log("STUN Server Stats:", stunStats);
```

## Support and Resources

- **WebRTC Samples**: https://webrtc.github.io/samples/
- **ICE Connectivity Test**: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
- **STUN Server List**: https://gist.github.com/zziuni/3741933
- **WebRTC Troubleshooting**: https://webrtc.org/getting-started/troubleshooting

## Contact

If STUN server issues persist:

1. Run the STUN server test utility
2. Check browser console for error patterns
3. Test with different networks/browsers
4. Contact support with test results and error logs
