"use client";

import React, { useState, useEffect } from "react";
import { usePeerVideoCall } from "@/hooks/usePeerVideoCall";
import { useUser } from "@/context/user-context";

interface PeerConnectionDebugProps {
  roomId?: string;
}

export const PeerConnectionDebug: React.FC<PeerConnectionDebugProps> = ({
  roomId = "debug-room",
}) => {
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [targetUserId, setTargetUserId] = useState("");

  const {
    callState,
    currentPeerId,
    isConnecting,
    startCall,
  } = usePeerVideoCall({
    currentUserId: (user as any)?.id || "debug-user",
    roomId: roomId,
  });

  // Update debug info periodically
  useEffect(() => {
    const updateDebugInfo = () => {
      const info = {
        currentUserId: (user as any)?.id || "debug-user",
        currentPeerId: currentPeerId || "Not connected",
        roomId: roomId,
        isConnecting: isConnecting,
        callState: callState,
        sessionStorage: {
          peerMappings: Object.keys(sessionStorage)
            .filter((key) => key.startsWith("peer-mapping-"))
            .reduce((acc, key) => {
              const value = sessionStorage.getItem(key);
              if (value !== null) {
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, string>),
          peerSessions: Object.keys(sessionStorage)
            .filter((key) => key.startsWith("peer-session-"))
            .reduce((acc, key) => {
              const value = sessionStorage.getItem(key);
              if (value !== null) {
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, string>),
        },
        timestamp: new Date().toISOString(),
      };
      setDebugInfo(info);
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000);
    return () => clearInterval(interval);
  }, [user, currentPeerId, isConnecting, callState, roomId]);

  const handleInitializePeer = async () => {
    console.log("🔧 Manually initializing PeerJS...");
    // PeerJS initialization is handled automatically by the hook
  };

  const handleStartCall = async () => {
    if (!targetUserId.trim()) {
      alert("Please enter a target user ID");
      return;
    }

    console.log(`🔧 Starting call to user: ${targetUserId}`);
    const participants = [
      {
        id: targetUserId,
        name: `Debug User: ${targetUserId}`,
        avatar: "",
        isTherapist: false,
        isMuted: false,
        isVideoEnabled: true,
      },
    ];

    const success = await startCall(participants);
    console.log(`🔧 Call start result: ${success}`);
  };

  const clearSessionStorage = () => {
    const keysToRemove = Object.keys(sessionStorage).filter(
      (key) =>
        key.startsWith("peer-mapping-") || key.startsWith("peer-session-")
    );
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    console.log("🧹 Cleared peer-related session storage");
    window.location.reload();
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">PeerJS Connection Debug</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Target User ID:
            </label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Enter user ID to call"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleInitializePeer}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Initialize Peer
            </button>

            <button
              onClick={handleStartCall}
              disabled={!targetUserId.trim() || isConnecting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Start Call
            </button>

            <button
              onClick={clearSessionStorage}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Clear Storage
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Connection Status:</h4>
            <div className="text-sm space-y-1">
              <div>User ID: {debugInfo.currentUserId}</div>
              <div>Peer ID: {debugInfo.currentPeerId}</div>
              <div>Room ID: {debugInfo.roomId}</div>
              <div>Connecting: {debugInfo.isConnecting ? "Yes" : "No"}</div>
              <div>In Call: {debugInfo.callState?.isInCall ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Storage Info */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Session Storage:</h4>
        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded text-xs overflow-auto max-h-40">
          <pre>{JSON.stringify(debugInfo.sessionStorage, null, 2)}</pre>
        </div>
      </div>

      {/* Raw Debug Info */}
      <details className="mt-4">
        <summary className="cursor-pointer font-medium">Raw Debug Info</summary>
        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded text-xs overflow-auto max-h-60 mt-2">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
};

export default PeerConnectionDebug;
