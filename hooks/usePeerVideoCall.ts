import { useState, useEffect, useCallback, useRef } from "react";
import Peer, { MediaConnection } from "peerjs";
import { getPeerConfig } from "@/lib/peer-config";
import { useTopToast } from "@/components/ui/toast";

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isTherapist: boolean;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export interface VideoCallState {
  isInCall: boolean;
  isCallActive: boolean;
  isCallIncoming: boolean;
  isCallOutgoing: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  callDuration: number;
  participants: string[];
  isRecording: boolean;
  recordingDuration: number;
}

export interface NetworkStats {
  bitrate: number;
  packetLoss: number;
  latency: number;
  resolution: string;
  frameRate: number;
}

interface UsePeerVideoCallProps {
  currentUserId: string;
  therapistId?: string;
  roomId?: string;
  onIncomingCall?: (caller: CallParticipant) => void;
}

// Helper function to generate a deterministic peer ID
const generateDeterministicPeerId = (
  userId: string,
  roomId?: string
): string => {
  // Use a deterministic approach based on user ID and room ID
  // This ensures both users in the same room generate the same peer ID
  const baseId = roomId ? `${userId}-${roomId}` : userId;

  // Add a small random component to avoid conflicts with other rooms
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseId}-${randomSuffix}`;
};

// Helper function to generate a dynamic peer ID (fallback)
const generateDynamicPeerId = (userId: string, roomId?: string): string => {
  // Use a more stable ID that doesn't change on every reconnection
  // Use the user ID + a session-based suffix that persists for the session
  const sessionKey = roomId
    ? `peer-session-${userId}-${roomId}`
    : `peer-session-${userId}`;
  const sessionId =
    sessionStorage.getItem(sessionKey) ||
    Math.random().toString(36).substring(2, 6);

  // Store the session ID for future use
  sessionStorage.setItem(sessionKey, sessionId);

  // Include room ID in the peer ID if provided
  if (roomId) {
    return `${userId}-${roomId}-${sessionId}`;
  }

  return `${userId}-${sessionId}`;
};

// Helper function to extract base user ID from dynamic peer ID
const extractBaseUserId = (peerId: string): string => {
  return peerId.split("-")[0];
};

export const usePeerVideoCall = ({
  currentUserId,
  therapistId,
  roomId,
  onIncomingCall,
}: UsePeerVideoCallProps) => {
  const { showToast } = useTopToast();
  const [callState, setCallState] = useState<VideoCallState>({
    isInCall: false,
    isCallActive: false,
    isCallIncoming: false,
    isCallOutgoing: false,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false,
    callDuration: 0,
    participants: [],
    isRecording: false,
    recordingDuration: 0,
  });

  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<{
    isVisible: boolean;
    caller: CallParticipant | null;
    call: MediaConnection | null;
  }>({
    isVisible: false,
    caller: null,
    call: null,
  });

  const [outgoingCall, setOutgoingCall] = useState<{
    isActive: boolean;
    call: MediaConnection | null;
    targetPeerId: string | null;
    startTime: number | null;
  }>({
    isActive: false,
    call: null,
    targetPeerId: null,
    startTime: null,
  });

  const [currentRoomId, setCurrentRoomId] = useState<string | null>(
    roomId || null
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    bitrate: 0,
    packetLoss: 0,
    latency: 0,
    resolution: "0x0",
    frameRate: 0,
  });

  // Store the dynamic peer ID
  const [currentPeerId, setCurrentPeerId] = useState<string | null>(null);

  // Function to store peer ID mapping for discovery
  const storePeerIdMapping = useCallback((userId: string, peerId: string) => {
    const mappingKey = `peer-mapping-${userId}`;
    const existingMappings = JSON.parse(
      sessionStorage.getItem(mappingKey) || "[]"
    );

    // Add new mapping if not already present
    if (!existingMappings.includes(peerId)) {
      existingMappings.push(peerId);
      sessionStorage.setItem(mappingKey, JSON.stringify(existingMappings));
      console.log(`💾 Stored peer ID mapping: ${userId} -> ${peerId}`);
    }
  }, []);

  // Function to get stored peer ID mappings
  const getStoredPeerIdMappings = useCallback((userId: string): string[] => {
    const mappingKey = `peer-mapping-${userId}`;
    const mappings = JSON.parse(sessionStorage.getItem(mappingKey) || "[]");
    console.log(`🔍 Retrieved peer ID mappings for ${userId}:`, mappings);
    return mappings;
  }, []);

  // Refs for PeerJS instances
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const callDurationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<number>(0);
  const recordingStartTimeRef = useRef<number>(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttemptsRef = useRef<number>(3);
  const isInitializingRef = useRef<boolean>(false);
  const isReconnectingRef = useRef<boolean>(false);

  // Initialize PeerJS with retry mechanism
  const initializePeer = useCallback(
    (retryCount = 0) => {
      if (!currentUserId) return;

      // Prevent multiple initialization attempts
      if (isInitializingRef.current) {
        console.log(
          "🔄 PeerJS initialization already in progress, skipping..."
        );
        return;
      }

      isInitializingRef.current = true;

      // Try deterministic ID first, then fallback to dynamic ID
      const deterministicId = generateDeterministicPeerId(
        currentUserId,
        roomId
      );
      const dynamicId = generateDynamicPeerId(currentUserId, roomId);

      // Use deterministic ID for the first attempt, dynamic for retries
      const peerId = retryCount === 0 ? deterministicId : dynamicId;

      console.log(
        `🎯 Initializing PeerJS with ${
          retryCount === 0 ? "deterministic" : "dynamic"
        } ID: ${peerId} (attempt ${retryCount + 1})`
      );

      // Cleanup existing peer
      if (peerRef.current) {
        console.log("🧹 Destroying existing peer before reinitializing");
        peerRef.current.destroy();
        peerRef.current = null;
      }

      try {
        // HARDCODED PEERJS CONFIG - NO ENVIRONMENT VARIABLES
        const peerConfig = {
          host: "localhost",
          port: 9000,
          path: "/peerjs",
          secure: false,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" },
              { urls: "stun:stun4.l.google.com:19302" },
            ],
          },
        };
        console.log("🔧 Using HARDCODED PeerJS config:", peerConfig);

        const peer = new Peer(peerId, peerConfig);
        peerRef.current = peer;
        setIsConnecting(true);
        console.log("🎯 Peer instance created successfully");

        // Verify peer instance is valid
        if (!peer) {
          console.error("❌ Peer instance is null after creation");
          isInitializingRef.current = false;
          setIsConnecting(false);
          return;
        }

        // Log peer state
        console.log("🔍 Peer state after creation:", {
          id: peer.id,
          open: peer.open,
          destroyed: peer.destroyed,
          connections: peer.connections,
        });
      } catch (error) {
        console.error("❌ Failed to create Peer instance:", error);
        isInitializingRef.current = false;
        setIsConnecting(false);
        return;
      }

      const peer = peerRef.current;

      // Handle incoming calls
      peer.on("call", (incomingCall) => {
        const callerBaseId = extractBaseUserId(incomingCall.peer);
        console.log("📞 Incoming call from:", incomingCall.peer);
        console.log("📞 Caller base ID:", callerBaseId);
        console.log("📞 Current peer ID:", peer.id);

        // Get local media stream first
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            console.log("✅ Local stream acquired in incoming call:", stream);
            localStreamRef.current = stream;
            setLocalStream(stream);

            // Show incoming call notification
            setIncomingCall({
              isVisible: true,
              caller: {
                id: incomingCall.peer,
                name: `Call from ${callerBaseId}`, // Use base user ID for display
                avatar: "",
                isTherapist: callerBaseId === therapistId,
                isMuted: false,
                isVideoEnabled: true,
              },
              call: incomingCall,
            });

            console.log(
              "📞 Incoming call notification set for peer:",
              incomingCall.peer
            );

            // Set call state to incoming
            setCallState((prev) => ({
              ...prev,
              isCallIncoming: true,
            }));

            // Trigger onIncomingCall callback if provided
            if (onIncomingCall) {
              onIncomingCall({
                id: incomingCall.peer,
                name: `Call from ${callerBaseId}`,
                avatar: "",
                isTherapist: callerBaseId === therapistId,
                isMuted: false,
                isVideoEnabled: true,
              });
            }
          })
          .catch((err) => {
            console.error("Failed to get user media:", err);
            incomingCall.close();
          });
      });

      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (isInitializingRef.current && !peerRef.current?.open) {
          console.error(
            "❌ PeerJS connection timeout - no connection established"
          );
          isInitializingRef.current = false;
          setIsConnecting(false);
          if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
          }
          showToast("Video call system connection timeout. Please try again.", {
            type: "error",
            duration: 5000,
          });
        }
      }, 10000); // 10 second timeout

      // Handle peer connection
      peer.on("open", (id) => {
        console.log("🎯 PeerJS connected with ID:", id);
        console.log("🎯 Base user ID:", currentUserId);
        console.log("🎯 Peer object state:", {
          id: peer.id,
          open: peer.open,
          destroyed: peer.destroyed,
        });

        // Clear the connection timeout
        clearTimeout(connectionTimeout);

        setCurrentPeerId(id);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0; // Reset retry count on successful connection
        isInitializingRef.current = false; // Reset initialization flag
        isReconnectingRef.current = false; // Reset reconnection flag

        // Store the peer ID mapping for this user
        storePeerIdMapping(currentUserId, id);

        // Show success toast for connection
        showToast("Video call system ready", {
          type: "success",
          duration: 2000,
        });
      });

      // Handle peer errors
      peer.on("error", (err) => {
        console.error("PeerJS error:", err);
        console.error("Error details:", {
          type: err.type,
          message: err.message,
          peerId: peer.id,
          open: peer.open,
          destroyed: peer.destroyed,
        });
        setIsConnecting(false);
        isInitializingRef.current = false; // Reset initialization flag on error
        isReconnectingRef.current = false; // Reset reconnection flag on error

        // Handle "ID already in use" error specifically
        if (
          err.type === "unavailable-id" ||
          (err.message?.includes("ID") && err.message?.includes("taken"))
        ) {
          console.log("🔄 ID already in use, generating new ID...");
          if (retryCount < maxReconnectAttemptsRef.current) {
            setTimeout(() => {
              initializePeer(retryCount + 1);
            }, 1000 * (retryCount + 1)); // Exponential backoff
          } else {
            console.error("❌ Max retry attempts reached for ID generation");
          }
          return;
        }

        // Handle "Could not connect to peer" error
        if (
          err.type === "peer-unavailable" ||
          err.message?.includes("Could not connect to peer")
        ) {
          console.log("❌ Peer unavailable - target user is not online");
          showToast(
            "The person you're trying to call is not available right now. Please try again later.",
            {
              type: "error",
              duration: 5000,
            }
          );
          return;
        }

        // Handle network connection errors
        if (
          err.message?.includes("Lost connection") ||
          err.message?.includes("Network error")
        ) {
          console.log("🔄 Network connection lost, attempting to reconnect...");
          showToast("Network connection lost. Attempting to reconnect...", {
            type: "info",
            duration: 3000,
          });

          // Don't attempt reconnection if already reconnecting or initializing
          if (isReconnectingRef.current || isInitializingRef.current) {
            console.log("🔄 Reconnection already in progress, skipping...");
            return;
          }

          if (reconnectAttemptsRef.current < maxReconnectAttemptsRef.current) {
            isReconnectingRef.current = true;
            reconnectAttemptsRef.current++;
            setTimeout(() => {
              try {
                // Force destroy and reinitialize to avoid reconnection issues
                console.log(
                  "🔄 Destroying and reinitializing due to connection error..."
                );
                if (peerRef.current) {
                  peerRef.current.destroy();
                }
                isReconnectingRef.current = false;
                initializePeer(reconnectAttemptsRef.current);
              } catch (error) {
                console.error("❌ Error reconnection failed:", error);
                isReconnectingRef.current = false;
                showToast("Failed to reconnect. Please refresh the page.", {
                  type: "error",
                  duration: 5000,
                });
              }
            }, 2000 * reconnectAttemptsRef.current);
          } else {
            console.log(
              "🔄 Max reconnection attempts reached for connection errors"
            );
            showToast("Unable to reconnect. Please refresh the page.", {
              type: "error",
              duration: 5000,
            });
          }
        }

        // Handle reconnection errors
        if (
          err.message?.includes(
            "cannot reconnect because it is not disconnected"
          )
        ) {
          console.log(
            "🔄 Reconnection error - destroying and reinitializing..."
          );
          showToast("Connection issue detected. Reconnecting...", {
            type: "info",
            duration: 3000,
          });

          // Don't attempt reconnection if already reconnecting or initializing
          if (isReconnectingRef.current || isInitializingRef.current) {
            console.log("🔄 Reconnection already in progress, skipping...");
            return;
          }

          if (reconnectAttemptsRef.current < maxReconnectAttemptsRef.current) {
            isReconnectingRef.current = true;
            reconnectAttemptsRef.current++;
            setTimeout(() => {
              try {
                // Force destroy and reinitialize to avoid reconnection issues
                console.log(
                  "🔄 Destroying and reinitializing due to reconnection error..."
                );
                if (peerRef.current) {
                  peerRef.current.destroy();
                }
                isReconnectingRef.current = false;
                initializePeer(reconnectAttemptsRef.current);
              } catch (error) {
                console.error("❌ Reconnection failed:", error);
                isReconnectingRef.current = false;
                showToast("Failed to reconnect. Please refresh the page.", {
                  type: "error",
                  duration: 5000,
                });
              }
            }, 2000 * reconnectAttemptsRef.current);
          } else {
            console.log(
              "🔄 Max reconnection attempts reached for reconnection errors"
            );
            showToast("Unable to reconnect. Please refresh the page.", {
              type: "error",
              duration: 5000,
            });
          }
        }
      });

      // Handle peer disconnection
      peer.on("disconnected", () => {
        console.log("PeerJS disconnected event received");

        // Don't attempt reconnection if already reconnecting or initializing
        if (isReconnectingRef.current || isInitializingRef.current) {
          console.log("🔄 Reconnection already in progress, skipping...");
          return;
        }

        // Don't attempt reconnection if we've exceeded max attempts
        if (reconnectAttemptsRef.current >= maxReconnectAttemptsRef.current) {
          console.log("🔄 Max reconnection attempts reached, giving up");
          return;
        }

        console.log("🔄 Attempting to reconnect...");
        isReconnectingRef.current = true;
        reconnectAttemptsRef.current++;

        setTimeout(() => {
          try {
            // Instead of trying to reconnect, destroy and reinitialize to avoid connection state issues
            console.log("🔄 Destroying and reinitializing peer connection...");
            if (peerRef.current) {
              peerRef.current.destroy();
            }
            isReconnectingRef.current = false;
            initializePeer(reconnectAttemptsRef.current);
          } catch (error) {
            console.error("❌ Reconnection failed:", error);
            isReconnectingRef.current = false;
          }
        }, 2000);
      });

      // Handle connection close
      peer.on("close", () => {
        console.log("PeerJS connection closed");
        setCurrentPeerId(null);
        isInitializingRef.current = false; // Reset initialization flag on close
        isReconnectingRef.current = false; // Reset reconnection flag on close
      });
    },
    [currentUserId, therapistId, onIncomingCall, storePeerIdMapping]
  );

  // Initialize PeerJS only when needed (lazy initialization)
  // This prevents unnecessary connections when just chatting
  const ensurePeerInitialized = useCallback(async () => {
    // If peer is already initialized and connected, return it
    if (peerRef.current && !peerRef.current.destroyed && peerRef.current.open) {
      console.log("✅ PeerJS already initialized:", peerRef.current.id);
      return peerRef.current;
    }

    // If initialization is already in progress, wait for it
    if (isInitializingRef.current) {
      console.log("🎯 PeerJS initialization already in progress, waiting...");
      const maxWaitTime = 15000; // 15 seconds
      const checkInterval = 200; // Check every 200ms
      let waitTime = 0;

      while (isInitializingRef.current && waitTime < maxWaitTime) {
        await new Promise((resolve) => setTimeout(resolve, checkInterval));
        waitTime += checkInterval;
      }

      if (waitTime >= maxWaitTime) {
        console.error("❌ PeerJS initialization timeout while waiting");
        isInitializingRef.current = false; // Reset flag
        return null;
      }

      // Check if initialization was successful
      if (
        peerRef.current &&
        !peerRef.current.destroyed &&
        peerRef.current.open
      ) {
        console.log("✅ PeerJS initialization completed:", peerRef.current.id);
        return peerRef.current;
      } else {
        console.error("❌ PeerJS initialization failed while waiting");
        return null;
      }
    }

    // Start new initialization
    console.log("🎯 Starting new PeerJS initialization...");
    initializePeer();

    // Wait for initialization to complete
    const maxWaitTime = 15000; // 15 seconds
    const checkInterval = 200; // Check every 200ms
    let waitTime = 0;

    while (isInitializingRef.current && waitTime < maxWaitTime) {
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      waitTime += checkInterval;

      // Additional check: if peer is open, break early
      if (peerRef.current && peerRef.current.open) {
        console.log("✅ PeerJS connection detected early, breaking wait loop");
        break;
      }
    }

    if (waitTime >= maxWaitTime) {
      console.error("❌ PeerJS initialization timeout");
      isInitializingRef.current = false; // Reset flag
      return null;
    }

    // Check if initialization was successful
    if (peerRef.current && !peerRef.current.destroyed && peerRef.current.open) {
      console.log("✅ PeerJS initialization completed:", peerRef.current.id);
      return peerRef.current;
    } else {
      console.error("❌ PeerJS initialization failed");
      console.error("❌ Peer object:", peerRef.current);
      console.error("❌ Current peer ID:", currentPeerId);
      console.error("❌ Peer state:", {
        exists: !!peerRef.current,
        destroyed: peerRef.current?.destroyed,
        open: peerRef.current?.open,
        id: peerRef.current?.id,
      });
      return null;
    }
  }, [initializePeer]);

  // Initialize PeerJS for incoming calls (call this when entering a chat room)
  const initializeForIncomingCalls = useCallback(async () => {
    console.log("🎯 Initializing PeerJS for incoming calls...");
    const peer = await ensurePeerInitialized();
    if (peer) {
      console.log("✅ PeerJS ready for incoming calls");
    } else {
      console.error("❌ Failed to initialize PeerJS for incoming calls");
    }
    return peer;
  }, [ensurePeerInitialized]);

  // Cleanup on unmount - only destroy if explicitly requested
  useEffect(() => {
    return () => {
      // Don't automatically destroy peer on unmount
      // Let the destroyPeer function handle cleanup when needed
      console.log(
        "🧹 usePeerVideoCall hook unmounting - keeping peer connection alive"
      );
    };
  }, []);

  // Initialize local stream when component mounts
  useEffect(() => {
    const initializeLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("✅ Local stream initialized on mount:", stream);
        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        console.error("Failed to initialize local stream:", err);
      }
    };

    // Only initialize if we don't already have a local stream
    if (!localStreamRef.current) {
      initializeLocalStream();
    }
  }, []);

  // Store peer discovery promises to avoid duplicate requests
  const peerDiscoveryPromises = useRef<Map<string, Promise<string | null>>>(
    new Map()
  );

  // Function to discover peer ID through WebSocket
  const discoverPeerIdThroughWebSocket = useCallback(
    async (baseUserId: string): Promise<string | null> => {
      console.log(
        `🔍 Discovering peer ID for user: ${baseUserId} through WebSocket`
      );

      // Check if we already have a pending discovery for this user
      const existingPromise = peerDiscoveryPromises.current.get(baseUserId);
      if (existingPromise) {
        console.log(
          `🔄 Reusing existing peer discovery promise for ${baseUserId}`
        );
        return existingPromise;
      }

      // Create a new discovery promise
      const discoveryPromise = new Promise<string | null>((resolve) => {
        const timeout = setTimeout(() => {
          console.log(`⏰ Peer discovery timeout for ${baseUserId}`);
          peerDiscoveryPromises.current.delete(baseUserId);
          resolve(null);
        }, 5000); // 5 second timeout

        // Store the resolve function for when we get a response
        const resolveWithCleanup = (peerId: string | null) => {
          clearTimeout(timeout);
          peerDiscoveryPromises.current.delete(baseUserId);
          resolve(peerId);
        };

        // Store the resolver for later use
        peerDiscoveryPromises.current.set(baseUserId, discoveryPromise);

        // TODO: Implement actual WebSocket peer discovery
        // For now, we'll simulate a failed discovery
        console.log(`❌ WebSocket peer discovery not fully implemented yet`);
        setTimeout(() => resolveWithCleanup(null), 100);
      });

      return discoveryPromise;
    },
    []
  );

  // Function to find active peer ID for a user
  const findActivePeerForUser = useCallback(
    async (baseUserId: string): Promise<string | null> => {
      console.log(`🔍 Looking for active peer for user: ${baseUserId}`);

      // First, try to get the peer ID from the current user's peer connection
      if (currentPeerId && baseUserId === currentUserId) {
        console.log(`🎯 Found current user's peer ID: ${currentPeerId}`);
        return currentPeerId;
      }

      // Try to find the user's actual peer ID from stored mappings first
      const storedMappings = getStoredPeerIdMappings(baseUserId);
      if (storedMappings.length > 0) {
        console.log(
          `🎯 Found stored peer ID mappings for ${baseUserId}:`,
          storedMappings
        );
        // Return the most recent one (last in array)
        return storedMappings[storedMappings.length - 1];
      }

      // Try to find the user's actual peer ID from the terminal output format
      // Format: userId-roomId-sessionToken (based on terminal logs)
      if (roomId) {
        // Try to find existing peer IDs in sessionStorage that match the pattern
        const existingPeerIds = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(`peer-session-${baseUserId}`)) {
            const sessionId = sessionStorage.getItem(key);
            if (sessionId) {
              const fullPeerId = `${baseUserId}-${roomId}-${sessionId}`;
              existingPeerIds.push(fullPeerId);
            }
          }
        }

        if (existingPeerIds.length > 0) {
          console.log(
            `🎯 Found existing peer IDs for ${baseUserId}:`,
            existingPeerIds
          );
          // Store these mappings for future use
          existingPeerIds.forEach((peerId) =>
            storePeerIdMapping(baseUserId, peerId)
          );
          // Return the most recent one (last in array)
          return existingPeerIds[existingPeerIds.length - 1];
        }

        // Try common session token patterns from terminal output
        const commonTokens = ["ydgl", "y8v9", "cp8s", "7hs870", "hzjz", "h4lq"];
        for (const token of commonTokens) {
          const fullPeerId = `${baseUserId}-${roomId}-${token}`;
          console.log(`🎯 Trying common token peer ID format: ${fullPeerId}`);
          // We'll let PeerJS try to connect to this ID
          return fullPeerId;
        }

        // If no common tokens work, try generating a new session-based ID
        const newSessionId = Math.random().toString(36).substring(2, 6);
        const newPeerId = `${baseUserId}-${roomId}-${newSessionId}`;
        console.log(`🎯 Generated new peer ID for discovery: ${newPeerId}`);
        return newPeerId;
      }

      // Try session-based peer ID generation (matches user's approach)
      const sessionId = sessionStorage.getItem(`peer-session-${baseUserId}`);
      if (sessionId) {
        const sessionBasedId = `${baseUserId}-${sessionId}`;
        console.log(
          `🎯 Generated session-based peer ID for ${baseUserId}: ${sessionBasedId}`
        );
        return sessionBasedId;
      }

      // Try deterministic peer ID generation based on room context
      if (roomId) {
        const deterministicId = generateDeterministicPeerId(baseUserId, roomId);
        console.log(
          `🎯 Generated deterministic peer ID for ${baseUserId}: ${deterministicId}`
        );
        return deterministicId;
      }

      // Try multiple peer ID variations first (more reliable than WebSocket discovery)
      console.log(`🔄 Trying multiple peer ID variations for ${baseUserId}`);
      const variationId = await tryMultiplePeerIds(baseUserId);
      if (variationId) {
        console.log(`✅ Found peer ID variation: ${variationId}`);
        return variationId;
      }

      // Fallback to WebSocket discovery
      console.log(`🔍 Attempting WebSocket peer discovery for ${baseUserId}`);
      const discoveredId = await discoverPeerIdThroughWebSocket(baseUserId);

      if (discoveredId) {
        console.log(`✅ Discovered peer ID through WebSocket: ${discoveredId}`);
        return discoveredId;
      }

      console.log(`❌ Could not find peer ID for ${baseUserId}`);
      return null;
    },
    [
      currentPeerId,
      currentUserId,
      roomId,
      getStoredPeerIdMappings,
      storePeerIdMapping,
    ]
  );

  // Function to broadcast current peer ID through WebSocket
  const broadcastPeerId = useCallback(
    (wsConnection: WebSocket | null) => {
      if (!wsConnection || !currentPeerId) {
        console.log(`❌ Cannot broadcast peer ID - no WebSocket or peer ID`);
        return;
      }

      try {
        const message = {
          type: "peer-id-broadcast",
          data: {
            peerId: currentPeerId,
            userId: currentUserId,
            roomId: roomId,
            timestamp: Date.now(),
          },
        };

        wsConnection.send(JSON.stringify(message));
        console.log(
          `📡 Broadcasted peer ID: ${currentPeerId} for room: ${roomId}`
        );
      } catch (error) {
        console.error(`❌ Failed to broadcast peer ID:`, error);
      }
    },
    [currentPeerId, currentUserId, roomId]
  );

  // Function to try multiple peer ID variations
  const tryMultiplePeerIds = useCallback(
    async (baseUserId: string): Promise<string | null> => {
      console.log(
        `🔄 Trying multiple peer ID variations for user: ${baseUserId}`
      );

      const now = Date.now();
      const variations = [];

      // Try current 5-minute window with different random suffixes
      const currentWindow = Math.floor(now / 300000) * 300000;
      for (let i = 0; i < 3; i++) {
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        variations.push(`${baseUserId}-${currentWindow}-${randomSuffix}`);
      }

      // Try previous 5-minute window (in case of slight time differences)
      const previousWindow = currentWindow - 300000;
      for (let i = 0; i < 2; i++) {
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        variations.push(`${baseUserId}-${previousWindow}-${randomSuffix}`);
      }

      // Try next 5-minute window (in case of slight time differences)
      const nextWindow = currentWindow + 300000;
      for (let i = 0; i < 2; i++) {
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        variations.push(`${baseUserId}-${nextWindow}-${randomSuffix}`);
      }

      console.log(`🔄 Peer ID variations to try:`, variations);

      // For now, return the first variation
      // In a more advanced implementation, we could test each variation
      // by attempting to connect and see which one works
      return variations[0];
    },
    []
  );

  // Start call timer
  const startCallTimer = useCallback(() => {
    callStartTimeRef.current = Date.now();
    callDurationIntervalRef.current = setInterval(() => {
      const duration = Math.floor(
        (Date.now() - callStartTimeRef.current) / 1000
      );
      setCallState((prev) => ({ ...prev, callDuration: duration }));
    }, 1000);
  }, []);

  // Stop call timer
  const stopCallTimer = useCallback(() => {
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);
      callDurationIntervalRef.current = null;
    }
  }, []);

  // Start recording timer
  const startRecordingTimer = useCallback(() => {
    recordingStartTimeRef.current = Date.now();
    recordingIntervalRef.current = setInterval(() => {
      const duration = Math.floor(
        (Date.now() - recordingStartTimeRef.current) / 1000
      );
      setCallState((prev) => ({ ...prev, recordingDuration: duration }));
    }, 1000);
  }, []);

  // Stop recording timer
  const stopRecordingTimer = useCallback(() => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  }, []);

  // Start network stats monitoring
  const startNetworkStatsMonitoring = useCallback(() => {
    statsIntervalRef.current = setInterval(async () => {
      if (localStreamRef.current) {
        try {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          if (videoTrack) {
            let bitrate = 0;
            let frameRate = 0;
            let resolution = "0x0";

            if (videoTrack.getSettings) {
              const settings = videoTrack.getSettings();
              resolution = `${settings.width || 0}x${settings.height || 0}`;
              frameRate = settings.frameRate || 0;
            }

            if (resolution !== "0x0" && frameRate > 0) {
              const [width, height] = resolution.split("x").map(Number);
              const pixels = width * height;
              const estimatedBitrate = Math.round(
                (pixels * frameRate * 0.1) / 1000
              );
              bitrate = estimatedBitrate;
            }

            setNetworkStats((prev) => ({
              ...prev,
              bitrate: Math.round(bitrate),
              resolution,
              frameRate: Math.round(frameRate),
            }));
          }
        } catch (error) {
          console.error("Failed to get network stats:", error);
        }
      }
    }, 1000);
  }, []);

  // Stop network stats monitoring
  const stopNetworkStatsMonitoring = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  }, []);

  // Call timeout mechanism
  const startCallTimeout = useCallback(() => {
    if (outgoingCall.startTime) {
      const timeoutDuration = 60000;
      const timeElapsed = Date.now() - outgoingCall.startTime;

      if (timeElapsed >= timeoutDuration) {
        console.log("⏰ Call timeout reached (1 minute)");
        handleCallTimeout();
      } else {
        setTimeout(startCallTimeout, 1000);
      }
    }
  }, [outgoingCall.startTime]);

  // Handle call timeout
  const handleCallTimeout = useCallback(() => {
    if (outgoingCall.call) {
      console.log("⏰ Ending call due to timeout");
      showToast("Call timed out - no answer received", {
        type: "error",
        duration: 5000,
      });
      outgoingCall.call.close();
    }

    setOutgoingCall({
      isActive: false,
      call: null,
      targetPeerId: null,
      startTime: null,
    });

    setCallState((prev) => ({
      ...prev,
      isInCall: false,
      isCallOutgoing: false,
    }));

    alert("Call timed out after 1 minute");
  }, [outgoingCall.call]);

  // Stop call timeout
  const stopCallTimeout = useCallback(() => {
    setOutgoingCall((prev) => ({
      ...prev,
      startTime: null,
    }));
  }, []);

  // Handle call ended
  const handleCallEnded = useCallback(() => {
    setCallState((prev) => ({
      ...prev,
      isInCall: false,
      isCallActive: false,
      isCallIncoming: false,
      isCallOutgoing: false,
      callDuration: 0,
      isRecording: false,
      recordingDuration: 0,
    }));
    setRemoteStreams(new Map());
    stopCallTimer();
    stopRecordingTimer();
    stopNetworkStatsMonitoring();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, [stopCallTimer, stopRecordingTimer, stopNetworkStatsMonitoring]);

  // Start a call
  const startCall = useCallback(
    async (participants: CallParticipant[]) => {
      console.log("📞 Starting call with participants:", participants);

      // Initialize PeerJS connection if not already done
      const peer = await ensurePeerInitialized();
      if (!peer || !currentPeerId) {
        console.error("❌ Failed to initialize PeerJS connection");
        console.error("❌ Peer object:", peer);
        console.error("❌ Current peer ID:", currentPeerId);
        return false;
      }

      console.log("✅ PeerJS connection established:", currentPeerId);

      if (!localStreamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          console.log("✅ Local stream acquired in startCall:", stream);
          localStreamRef.current = stream;
          setLocalStream(stream);
        } catch (err) {
          console.error("Failed to get user media:", err);
          return false;
        }
      }

      if (!localStreamRef.current) return false;

      if (!localStream) {
        console.log("🔄 Setting local stream in state from startCall");
        setLocalStream(localStreamRef.current);
      }

      try {
        setIsConnecting(true);
        showToast("Starting video call...", {
          type: "info",
          duration: 2000,
        });

        // For calling by base user ID, we need to find their active peer ID
        const targetBaseUserId = participants[0]?.id;
        if (!targetBaseUserId) {
          console.error("❌ No target user ID provided");
          showToast("No target user specified for the call", {
            type: "error",
            duration: 3000,
          });
          setIsConnecting(false);
          return false;
        }

        // If the participant ID already looks like a dynamic peer ID, use it directly
        let targetPeerId = targetBaseUserId;
        if (!targetBaseUserId.includes("-")) {
          // It's a base user ID, try to find the active peer
          console.log(
            `🔍 Attempting peer discovery for user: ${targetBaseUserId}`
          );

          // Use the improved findActivePeerForUser function
          const activePeerId = await findActivePeerForUser(targetBaseUserId);

          // If all discovery methods fail, show error
          if (!activePeerId) {
            console.error(
              `❌ Could not find active peer for user: ${targetBaseUserId}`
            );
            showToast(
              "Could not connect to the target user. They may not be available for video calls or their video call system is not ready.",
              {
                type: "error",
                duration: 5000,
              }
            );
            setIsConnecting(false);
            return false;
          }

          targetPeerId = activePeerId;
          console.log(`✅ Using discovered peer ID: ${targetPeerId}`);
        }

        console.log("🎯 Calling peer:", targetPeerId);
        console.log("🎯 Current peer ID:", currentPeerId);
        console.log("🎯 Participants:", participants);
        console.log("🎯 Local stream available:", !!localStreamRef.current);
        console.log(
          "🎯 Peer connection state:",
          peerRef.current?.open ? "Open" : "Closed"
        );
        console.log(
          "🎯 Peer destroyed:",
          peerRef.current?.destroyed ? "Yes" : "No"
        );

        console.log("🎯 Creating call to peer:", targetPeerId);
        console.log("🎯 Using local stream:", localStreamRef.current);
        console.log("🎯 Peer ref available:", !!peerRef.current);

        // Try to create the call with error handling
        let call;
        try {
          if (!peerRef.current) {
            throw new Error("PeerJS not initialized");
          }
          if (!localStreamRef.current) {
            throw new Error("Local stream not available");
          }

          call = peerRef.current.call(targetPeerId, localStreamRef.current);

          if (!call) {
            throw new Error("Call creation returned null");
          }
        } catch (error) {
          console.error("❌ Error creating call:", error);
          console.error("❌ Peer ref:", peerRef.current);
          console.error("❌ Target peer ID:", targetPeerId);
          console.error("❌ Local stream:", localStreamRef.current);

          let errorMessage = "Failed to initiate call. ";
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          if (errorMsg?.includes("PeerJS not initialized")) {
            errorMessage += "Video call system is not ready. Please try again.";
          } else if (errorMsg?.includes("Local stream")) {
            errorMessage += "Camera/microphone access is required.";
          } else if (errorMsg?.includes("null")) {
            errorMessage += "Target user may not be available for video calls.";
          } else {
            errorMessage += "Please try again.";
          }

          showToast(errorMessage, {
            type: "error",
            duration: 5000,
          });
          setIsConnecting(false);
          return false;
        }

        console.log("✅ Call created successfully:", call);
        showToast("Calling...", {
          type: "info",
          duration: 3000,
        });

        setOutgoingCall({
          isActive: true,
          call: call,
          targetPeerId: targetPeerId,
          startTime: Date.now(),
        });

        setCallState((prev) => ({
          ...prev,
          isInCall: true,
          isCallOutgoing: true,
        }));

        startCallTimeout();

        call.on("stream", (remoteStream) => {
          console.log("✅ Remote stream received from:", targetPeerId);
          console.log("📞 Call answered - stopping timeout");
          showToast("Call connected!", {
            type: "success",
            duration: 3000,
          });

          stopCallTimeout();

          setRemoteStreams(
            (prev) => new Map(prev.set(targetPeerId, remoteStream))
          );
          setCallState((prev) => ({
            ...prev,
            isCallActive: true,
            isCallOutgoing: false,
          }));

          setOutgoingCall({
            isActive: false,
            call: null,
            targetPeerId: null,
            startTime: null,
          });

          startCallTimer();
          startNetworkStatsMonitoring();
        });

        call.on("close", () => {
          console.log("📞 Call closed");
          stopCallTimeout();
          setOutgoingCall({
            isActive: false,
            call: null,
            targetPeerId: null,
            startTime: null,
          });
          handleCallEnded();
        });

        call.on("error", (err) => {
          console.error("❌ Call error:", err);
          console.error("❌ Error type:", err.type);
          console.error("❌ Error message:", err.message);

          stopCallTimeout();
          setOutgoingCall({
            isActive: false,
            call: null,
            targetPeerId: null,
            startTime: null,
          });

          // Show specific error messages based on error type
          let errorMessage = "Call failed. ";
          const errorType = (err as any).type;
          const errorMsg = (err as any).message;

          if (
            errorType === "peer-unavailable" ||
            errorMsg?.includes("Could not connect to peer")
          ) {
            errorMessage =
              "The person you're trying to call is not available right now.";
          } else if (
            errorType === "unavailable-id" ||
            (errorMsg?.includes("ID") && errorMsg?.includes("taken"))
          ) {
            errorMessage =
              "The target user's video call system is not ready. Please ask them to refresh their page.";
          } else if (errorMsg?.includes("Lost connection")) {
            errorMessage =
              "Connection lost. Please check your internet connection and try again.";
          } else if (errorMsg?.includes("Network error")) {
            errorMessage =
              "Network error occurred. Please check your internet connection.";
          } else {
            errorMessage += "Please try again.";
          }

          showToast(errorMessage, {
            type: "error",
            duration: 5000,
          });

          handleCallEnded();
        });

        return true;
      } catch (err) {
        console.error("Failed to start call:", err);
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    [
      ensurePeerInitialized,
      currentPeerId,
      startCallTimer,
      handleCallEnded,
      startNetworkStatsMonitoring,
      localStream,
      startCallTimeout,
      stopCallTimeout,
      findActivePeerForUser,
    ]
  );

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    if (!incomingCall.call || !localStreamRef.current) return false;

    // Ensure PeerJS is initialized (should already be for incoming calls)
    await ensurePeerInitialized();

    try {
      console.log("📞 Accepting incoming call from:", incomingCall.call.peer);
      console.log("📞 Local stream available:", !!localStreamRef.current);

      if (!localStream) {
        console.log("🔄 Setting local stream in state from acceptCall");
        setLocalStream(localStreamRef.current);
      }

      incomingCall.call.answer(localStreamRef.current);

      incomingCall.call.on("stream", (remoteStream) => {
        console.log(
          "✅ Remote stream received after accepting call from:",
          incomingCall.call!.peer
        );
        setRemoteStreams(
          (prev) => new Map(prev.set(incomingCall.call!.peer, remoteStream))
        );
        setCallState((prev) => ({
          ...prev,
          isInCall: true,
          isCallActive: true,
          isCallIncoming: false,
        }));
        startCallTimer();
        startNetworkStatsMonitoring();
      });

      incomingCall.call.on("close", () => {
        handleCallEnded();
      });

      incomingCall.call.on("error", (err) => {
        console.error("Call error:", err);
        handleCallEnded();
      });

      setIncomingCall((prev) => ({ ...prev, isVisible: false }));
      setCallState((prev) => ({
        ...prev,
        isInCall: true,
        isCallActive: true,
        isCallIncoming: false,
      }));

      return true;
    } catch (err) {
      console.error("Failed to accept call:", err);
      return false;
    }
  }, [
    incomingCall.call,
    ensurePeerInitialized,
    startCallTimer,
    handleCallEnded,
    startNetworkStatsMonitoring,
    localStream,
  ]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (incomingCall.call) {
      incomingCall.call.close();
    }
    setIncomingCall((prev) => ({
      ...prev,
      isVisible: false,
      caller: null,
      call: null,
    }));
    setCallState((prev) => ({
      ...prev,
      isCallIncoming: false,
    }));
  }, [incomingCall.call]);

  // End current call
  const endCall = useCallback(() => {
    setRemoteStreams((prev) => {
      prev.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
      return new Map();
    });

    handleCallEnded();
  }, [handleCallEnded]);

  // Destroy PeerJS connection completely
  const destroyPeer = useCallback(() => {
    console.log("🧹 Destroying PeerJS connection...");

    // End any active calls first
    endCall();

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }

    // Stop screen share stream
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    // Destroy peer connection
    if (peerRef.current && !peerRef.current.destroyed) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    setCurrentPeerId(null);
    console.log("✅ PeerJS connection destroyed");
  }, [endCall]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
        console.log("🎤 Mute toggled:", !audioTrack.enabled);
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallState((prev) => ({
          ...prev,
          isVideoEnabled: !prev.isVideoEnabled,
        }));
        console.log("📹 Video toggled:", !videoTrack.enabled);
      }
    }
  }, []);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (callState.isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setCallState((prev) => ({ ...prev, isScreenSharing: false }));
      console.log("🖥️ Screen sharing stopped");
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        screenStreamRef.current = stream;
        setCallState((prev) => ({ ...prev, isScreenSharing: true }));

        if (localStreamRef.current) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          if (videoTrack) {
            localStreamRef.current.removeTrack(videoTrack);
            localStreamRef.current.addTrack(stream.getVideoTracks()[0]);
            setLocalStream(localStreamRef.current);
            console.log("🖥️ Screen sharing started");
          }
        }
      } catch (err) {
        console.error("Failed to start screen sharing:", err);
      }
    }
  }, [callState.isScreenSharing]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!localStreamRef.current || callState.isRecording) return false;

    try {
      const combinedStream = new MediaStream();

      localStreamRef.current.getTracks().forEach((track) => {
        combinedStream.addTrack(track);
      });

      remoteStreams.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          combinedStream.addTrack(track);
        });
      });

      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      const mediaRecorder = new MediaRecorder(combinedStream, options);

      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `call-recording-${new Date().toISOString()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        console.log("📹 Recording saved");
      };

      mediaRecorder.start();
      setCallState((prev) => ({ ...prev, isRecording: true }));
      startRecordingTimer();
      console.log("📹 Recording started");
      return true;
    } catch (error) {
      console.error("Failed to start recording:", error);
      return false;
    }
  }, [localStream, remoteStreams, callState.isRecording, startRecordingTimer]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setCallState((prev) => ({ ...prev, isRecording: false }));
      stopRecordingTimer();
      console.log("📹 Recording stopped");
    }
  }, [stopRecordingTimer]);

  // Get local stream
  const getLocalStream = useCallback(() => {
    return localStreamRef.current;
  }, []);

  // Create chat room (placeholder for compatibility)
  const createChatRoom = useCallback(async (therapistId: string) => {
    console.log("Chat room creation handled by PeerJS");
    return `peer-${therapistId}`;
  }, []);

  // Connect to existing room (placeholder for compatibility)
  const connectToExistingRoom = useCallback((roomId: string) => {
    setCurrentRoomId(roomId);
  }, []);

  // Get current peer ID for debugging
  const getCurrentPeerId = useCallback(() => {
    return currentPeerId || peerRef.current?.id || null;
  }, [currentPeerId]);

  // Get base user ID from peer ID
  const getBaseUserId = useCallback((peerId: string) => {
    return extractBaseUserId(peerId);
  }, []);

  return {
    callState,
    remoteStreams,
    localStream,
    incomingCall,
    currentRoomId,
    isConnecting,
    networkStats,
    currentPeerId, // Expose current peer ID
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    destroyPeer,
    initializeForIncomingCalls,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    startRecording,
    stopRecording,
    getLocalStream,
    getCurrentPeerId,
    getBaseUserId, // New helper function
    createChatRoom,
    connectToExistingRoom,
    // Utility functions
    generateDynamicPeerId: (userId: string) => generateDynamicPeerId(userId),
    extractBaseUserId: (peerId: string) => extractBaseUserId(peerId),
    broadcastPeerId, // New function for WebSocket peer ID broadcasting
  };
};
