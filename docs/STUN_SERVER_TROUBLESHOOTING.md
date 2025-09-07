# STUN Server Troubleshooting Guide

## Problem: STUN and TURN Server Connection Errors

**STUN Error**: `ICE Candidate Error: {errorCode: 701, errorText: 'STUN host lookup received error.'}`
**TURN Error**: `ICE Candidate Error: {errorCode: 701, errorText: 'Failed to establish connection'}`

These errors indicate that some STUN/TURN servers in the configuration are not accessible or have connection issues.

## What Are STUN and TURN Servers?

**STUN (Session Traversal Utilities for NAT)** servers help WebRTC applications discover their public IP addresses and determine what type of NAT they're behind. They're essential for establishing peer-to-peer connections.

**TURN (Traversal Using Relays around NAT)** servers act as relays when direct peer-to-peer connections fail due to strict NAT or firewall restrictions. They're crucial for ensuring connectivity in challenging network environments.

## Root Causes

1. **DNS Resolution Issues**: STUN/TURN server hostnames can't be resolved
2. **Network Firewall**: Corporate or home firewalls blocking STUN/TURN traffic
3. **Server Unavailability**: Some STUN/TURN servers may be temporarily down
4. **Network Configuration**: ISP or network blocking certain ports/protocols
5. **TURN Server Overload**: Free TURN servers may be overloaded or rate-limited
6. **Transport Protocol Issues**: TCP transport may be blocked or unreliable

## Solutions Implemented

### 1. Updated STUN and TURN Server Configuration

**File**: `lib/peer-config.ts`

**Removed problematic STUN servers**:

- `stun:stun.ekiga.net` (often unreachable)
- `stun:stun.ideasip.com` (DNS issues)
- `stun:stun.schlund.de` (unreliable)
- `stun:stun.qq.com` (region-specific)
- `stun:stun.miwifi.com` (region-specific)

**Removed problematic TURN servers**:

- `turn:openrelay.metered.ca:443?transport=tcp` (connection failures)
- `turn:relay.metered.ca:443?transport=tcp` (connection failures)

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
  const isStunServer = event.url?.includes("stun:");
  const isTurnServer = event.url?.includes("turn:");

  // Critical errors for essential STUN servers
  const isCriticalStunError =
    event.errorCode === 701 &&
    isStunServer &&
    (event.url?.includes("stun.l.google.com") ||
      event.url?.includes("stun.cloudflare.com") ||
      event.url?.includes("stun.stunprotocol.org"));

  // TURN server errors are generally non-critical (we have multiple fallbacks)
  const isTurnError = isTurnServer && event.errorCode === 701;

  if (isCriticalStunError) {
    console.error("❌ Critical STUN Server Error:", {
      errorCode: event.errorCode,
      errorText: event.errorText,
      url: event.url,
      address: event.address,
      port: event.port,
    });
  } else if (isTurnError) {
    console.warn("🔄 TURN Server Connection Failed (trying other servers):", {
      errorCode: event.errorCode,
      errorText: event.errorText,
      url: event.url,
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
- TURN server failures are handled gracefully with fallbacks
- Continues operation with remaining working servers

### 3. Enhanced Server Testing Utility

**File**: `utils/stun-server-test.js`

A comprehensive utility to test both STUN and TURN server connectivity:

```javascript
// In browser console:
testAllServers(); // Test all servers (recommended)
testStunServers(); // Test STUN servers only
testTurnServers(); // Test TURN servers only
```

**Features**:

- Tests all configured STUN and TURN servers
- Reports working, failed, and timeout servers
- Provides detailed recommendations based on results
- Helps diagnose network connectivity issues
- Separate testing for STUN and TURN servers
- Comprehensive overall connectivity assessment

## Testing Server Connectivity

### Method 1: Browser Console Test

1. **Open browser DevTools** (F12)
2. **Load the test utility**:

   ```javascript
   // Copy and paste the content of utils/stun-server-test.js
   // Then run:
   testAllServers(); // Recommended - tests everything
   testStunServers(); // STUN servers only
   testTurnServers(); // TURN servers only
   ```

3. **Review results**:

   ```
   🧪 Testing WebRTC server connectivity...

   🧪 Testing STUN server connectivity...

   Testing Google STUN 1...
   ✅ Google STUN 1: Working
   Testing Google STUN 2...
   ✅ Google STUN 2: Working
   Testing Cloudflare STUN...
   ✅ Cloudflare STUN: Working
   Testing STUN Protocol...
   ❌ STUN Protocol: 701: STUN host lookup received error.

   📊 STUN Server Results:
   ========================
   ✅ Working STUN servers: 3
   ❌ Failed STUN servers: 1
   ⏰ Timeout STUN servers: 0

   🔄 Testing TURN server connectivity...

   Testing Metered TURN 80...
   ✅ Metered TURN 80: Working
   Testing Metered TURN 443...
   ❌ Metered TURN 443: 701: Failed to establish connection
   Testing Relay TURN 80...
   ✅ Relay TURN 80: Working
   Testing Relay TURN 443...
   ❌ Relay TURN 443: 701: Failed to establish connection

   📊 TURN Server Results:
   ========================
   ✅ Working TURN servers: 2
   ❌ Failed TURN servers: 2
   ⏰ Timeout TURN servers: 0

   📊 Overall Results:
   ===================
   ✅ Total working servers: 5
   ❌ Total failed servers: 3
   ⏰ Total timeout servers: 0

   💡 Recommendations:
   ✅ Good connectivity - WebRTC should work well
   ```

### Method 2: WebRTC Samples Test

Visit: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

Add these servers one by one:

**STUN Servers:**

```
stun:stun.l.google.com:19302
stun:stun.cloudflare.com:3478
stun:stun.stunprotocol.org:3478
```

**TURN Servers:**

```
turn:openrelay.metered.ca:80
turn:openrelay.metered.ca:443
turn:relay.metered.ca:80
turn:relay.metered.ca:443
```

**Note**: For TURN servers, you'll need to add username and credential:

- Username: `openrelayproject`
- Credential: `openrelayproject`

### Method 3: Manual DNS Test

```bash
# Test DNS resolution for STUN servers
nslookup stun.l.google.com
nslookup stun.cloudflare.com
nslookup stun.stunprotocol.org

# Test DNS resolution for TURN servers
nslookup openrelay.metered.ca
nslookup relay.metered.ca

# Test connectivity
ping stun.l.google.com
ping stun.cloudflare.com
ping openrelay.metered.ca
ping relay.metered.ca
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
   - Allow TCP traffic on ports 80, 443 (for TURN servers)
   - Allow STUN/TURN protocol traffic
   - Check Windows Firewall or router settings

### For Developers

1. **Monitor Console Logs**

   ```javascript
   // Look for these patterns:
   ✅ Working: "ICE Candidate: {type: 'host', ...}"
   ❌ Critical: "Critical STUN Server Error: {errorCode: 701, ...}"
   🔄 TURN: "TURN Server Connection Failed (trying other servers)"
   ⚠️ Warning: "Non-critical ICE Candidate Error"
   ```

2. **Test Individual Servers**

   ```javascript
   // Test specific STUN server
   const pc = new RTCPeerConnection({
     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
   });

   // Test specific TURN server
   const pc2 = new RTCPeerConnection({
     iceServers: [
       {
         urls: "turn:openrelay.metered.ca:80",
         username: "openrelayproject",
         credential: "openrelayproject",
       },
     ],
   });
   ```

3. **Check Network Configuration**
   - Verify DNS resolution for both STUN and TURN servers
   - Test UDP connectivity (STUN servers)
   - Test TCP connectivity (TURN servers)
   - Check firewall rules for all required ports

## Common Error Codes

| Error Code | Description                           | Solution                                                  |
| ---------- | ------------------------------------- | --------------------------------------------------------- |
| 701        | STUN/TURN host lookup received error  | DNS resolution failed, try different server               |
| 701        | Failed to establish connection (TURN) | TURN server overloaded or blocked, try other TURN servers |
| 702        | STUN/TURN host lookup timeout         | Network timeout, check connectivity                       |
| 703        | STUN/TURN host lookup network error   | Network issue, check firewall                             |
| 704        | STUN/TURN host lookup DNS error       | DNS server issue, try different DNS                       |

## Best Practices

1. **Use Multiple STUN and TURN Servers**

   - Always include Google STUN servers (most reliable)
   - Add Cloudflare STUN servers for redundancy
   - Include multiple TURN servers for fallback
   - Include region-specific servers if needed

2. **Prioritize Reliability**

   - Use well-known, maintained STUN/TURN servers
   - Avoid servers that frequently have DNS issues
   - Avoid TCP transport TURN servers if they're unreliable
   - Test servers before adding to production

3. **Handle Errors Gracefully**

   - Don't fail on non-critical STUN/TURN server errors
   - Continue with working servers
   - Provide fallback mechanisms
   - TURN server failures are generally non-critical

4. **Monitor Performance**
   - Track STUN/TURN server success rates
   - Monitor connection establishment times
   - Log and analyze error patterns
   - Monitor TURN server bandwidth usage

## Alternative Solutions

### If STUN/TURN Servers Continue to Fail

1. **Use Premium TURN Servers**

   - Commercial TURN servers are more reliable
   - Better support and uptime guarantees
   - Higher bandwidth usage but better performance

2. **Custom STUN/TURN Server**

   - Deploy your own STUN/TURN server
   - Full control over availability
   - Requires server maintenance and bandwidth

3. **Hybrid Approach**
   - Use STUN for discovery
   - Fall back to TURN for relay
   - Best of both worlds

## Environment Variables

For custom STUN/TURN server configuration:

```bash
# Custom STUN servers
NEXT_PUBLIC_CUSTOM_STUN_SERVERS=stun:your-stun-server.com:3478,stun:another-server.com:3478

# Custom TURN servers
NEXT_PUBLIC_CUSTOM_TURN_SERVERS=turn:your-turn-server.com:3478,turn:another-turn-server.com:3478

# Disable problematic servers
NEXT_PUBLIC_DISABLE_STUN_SERVERS=stun.ideasip.com,stun.ekiga.net
NEXT_PUBLIC_DISABLE_TURN_SERVERS=openrelay.metered.ca:443?transport=tcp
```

## Monitoring and Analytics

### Key Metrics to Track

1. **STUN/TURN Server Success Rate**

   - Percentage of successful STUN/TURN requests
   - Per-server success rates
   - Geographic distribution of failures

2. **Connection Establishment Time**

   - Time to gather ICE candidates
   - STUN/TURN server response times
   - Overall connection setup time

3. **Error Patterns**
   - Most common error codes
   - Geographic correlation of errors
   - Time-based error patterns

### Recommended Monitoring

```javascript
// Track STUN/TURN server performance
const serverStats = {
  stun: {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
  },
  turn: {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    bandwidthUsed: 0,
  },
};

// Log server metrics
console.log("WebRTC Server Stats:", serverStats);
```

## Support and Resources

- **WebRTC Samples**: https://webrtc.github.io/samples/
- **ICE Connectivity Test**: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
- **STUN Server List**: https://gist.github.com/zziuni/3741933
- **WebRTC Troubleshooting**: https://webrtc.org/getting-started/troubleshooting

## Contact

If STUN/TURN server issues persist:

1. Run the comprehensive server test utility (`testAllServers()`)
2. Check browser console for error patterns
3. Test with different networks/browsers
4. Contact support with test results and error logs
