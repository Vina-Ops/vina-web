# Call Management Improvements

## Problem Solved

**Issue**: When a user disconnects from their end during a video call, the therapist's end still shows as "calling" and when the user calls back, it shows multiple call connections.

## Root Causes

1. **Incomplete Call Cleanup**: Calls weren't properly cleaned up when one party disconnected
2. **No Duplicate Prevention**: Multiple calls from the same user weren't prevented
3. **Poor State Synchronization**: Call states weren't properly synchronized between parties
4. **Missing Call Tracking**: No centralized tracking of active calls

## Solutions Implemented

### 1. Active Call Tracking System

**File**: `hooks/usePeerVideoCall.ts`

```typescript
// Track active calls to prevent duplicates and ensure proper cleanup
const activeCallsRef = useRef<Map<string, MediaConnection>>(new Map());
const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);
```

**Benefits**:

- Centralized tracking of all active calls
- Prevents duplicate calls from the same peer
- Enables proper cleanup when calls end

### 2. Enhanced Call Cleanup

**Improved `endCall` function**:

```typescript
const endCall = useCallback(() => {
  console.log("📞 Ending call - comprehensive cleanup");

  // Clear any pending call timeouts
  if (callTimeoutRef.current) {
    clearTimeout(callTimeoutRef.current);
    callTimeoutRef.current = null;
  }

  // Close all tracked active calls
  activeCallsRef.current.forEach((call, peerId) => {
    console.log(`📞 Closing tracked call to: ${peerId}`);
    try {
      call.close();
    } catch (error) {
      console.warn(`Error closing call to ${peerId}:`, error);
    }
  });
  activeCallsRef.current.clear();

  // ... additional cleanup logic
}, []);
```

**Features**:

- Clears all tracked calls
- Handles errors gracefully
- Resets all call states
- Stops timers and monitoring

### 3. Duplicate Call Prevention

**In `startCall` function**:

```typescript
// Check if we already have an active call to this peer
if (activeCallsRef.current.has(targetPeerId)) {
  console.log(
    `⚠️ Already have an active call to ${targetPeerId}, skipping duplicate`
  );
  continue;
}

const call = peer.call(targetPeerId, stream);
calls.push(call);

// Track this call
activeCallsRef.current.set(targetPeerId, call);
```

**In `handleIncomingCall` function**:

```typescript
// Check if we already have an active call from this peer
if (activeCallsRef.current.has(call.peer)) {
  console.log(
    `⚠️ Already have an active call from ${call.peer}, rejecting duplicate`
  );
  call.close();
  return;
}

// Check if we already have an incoming call
if (incomingCall.isVisible && incomingCall.call) {
  console.log(
    `⚠️ Already have an incoming call, rejecting new call from ${call.peer}`
  );
  call.close();
  return;
}
```

### 4. Improved Call State Synchronization

**Enhanced call event handlers**:

```typescript
call.on("close", () => {
  console.log(`📞 Call with ${participant.id} ended`);

  // Remove from active calls tracking
  activeCallsRef.current.delete(targetPeerId);

  // Check if we have any remaining active calls
  const remainingCalls = activeCallsRef.current.size;
  console.log(`📞 Remaining active calls: ${remainingCalls}`);

  // Update call state when call is closed
  setCallState((prev) => ({
    ...prev,
    isInCall: remainingCalls > 0,
    isCallActive: remainingCalls > 0,
    isCallOutgoing: false,
  }));

  // If no more calls, stop timers
  if (remainingCalls === 0) {
    stopCallTimer();
    stopNetworkStatsMonitoring();
  }
});
```

**Features**:

- Tracks remaining active calls
- Only updates state when all calls end
- Prevents premature timer stopping
- Maintains accurate call state

### 5. Comprehensive Error Handling

**Enhanced error handling**:

```typescript
call.on("error", (error) => {
  console.error(`❌ Call error with ${participant.id}:`, error);

  // Remove from active calls tracking on error
  activeCallsRef.current.delete(targetPeerId);

  // Update call state on error
  const remainingCalls = activeCallsRef.current.size;
  setCallState((prev) => ({
    ...prev,
    isInCall: remainingCalls > 0,
    isCallActive: remainingCalls > 0,
    isCallOutgoing: false,
  }));
});
```

**Features**:

- Handles call errors gracefully
- Maintains call state consistency
- Prevents stuck call states

## Key Improvements

### 1. **Call State Accuracy**

- ✅ Call states now accurately reflect actual connection status
- ✅ No more "stuck" calling states when users disconnect
- ✅ Proper state transitions between calling/connected/ended

### 2. **Duplicate Prevention**

- ✅ Prevents multiple calls from the same user
- ✅ Rejects duplicate incoming calls
- ✅ Maintains single active call per peer

### 3. **Proper Cleanup**

- ✅ All calls are properly closed when ending
- ✅ Resources are freed (streams, timers, monitoring)
- ✅ No memory leaks from abandoned calls

### 4. **Better User Experience**

- ✅ Users see accurate call status
- ✅ No confusion about call state
- ✅ Smooth call transitions

## Testing Scenarios

### Scenario 1: User Disconnects During Call

1. **Before**: Therapist shows "calling" indefinitely
2. **After**: Call state immediately updates to "ended"

### Scenario 2: User Calls Back After Disconnect

1. **Before**: Multiple call connections shown
2. **After**: Single clean call connection

### Scenario 3: Multiple Call Attempts

1. **Before**: Multiple calls could be initiated
2. **After**: Duplicate calls are automatically rejected

### Scenario 4: Network Issues

1. **Before**: Call state could get stuck
2. **After**: Errors are handled gracefully, state is reset

## Debugging Features

### Enhanced Logging

```typescript
console.log(`📞 Remaining active calls: ${remainingCalls}`);
console.log(
  `⚠️ Already have an active call to ${targetPeerId}, skipping duplicate`
);
console.log(`📞 Closing tracked call to: ${peerId}`);
```

### Call Tracking

- Real-time tracking of active calls
- Clear logging of call state changes
- Error tracking and reporting

## Browser Console Monitoring

During calls, you can monitor the call management in the browser console:

```
📞 Call with user-123 ended
📞 Remaining active calls: 0
📞 Call state updated to ended
⚠️ Already have an active call to user-456, skipping duplicate
📞 Closing tracked call to: user-789
```

## Best Practices

1. **Always check for existing calls** before initiating new ones
2. **Track all active calls** in a centralized system
3. **Handle errors gracefully** and update state accordingly
4. **Clean up resources** when calls end
5. **Provide user feedback** on call state changes
6. **Monitor call quality** and connection status

## Future Enhancements

1. **Call History**: Track call duration and quality metrics
2. **Reconnection Logic**: Automatically reconnect dropped calls
3. **Call Queuing**: Queue incoming calls when busy
4. **Quality Monitoring**: Real-time call quality indicators
5. **Analytics**: Track call success rates and issues

## Troubleshooting

### Issue: Call state still shows as "calling"

**Solution**: Check browser console for cleanup logs. Ensure `endCall()` is being called.

### Issue: Multiple calls still appearing

**Solution**: Verify `activeCallsRef.current.has()` checks are working. Check for race conditions.

### Issue: Calls not ending properly

**Solution**: Ensure all call event handlers are properly removing calls from tracking.

## Contact

If issues persist after these improvements:

1. Check browser console for call management logs
2. Verify call state transitions are working
3. Test with different network conditions
4. Contact support with detailed logs
