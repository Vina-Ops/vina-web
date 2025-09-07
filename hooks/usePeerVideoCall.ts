"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Peer, { MediaConnection, DataConnection } from "peerjs";
import { getPeerConfig } from "@/lib/peer-config";

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isTherapist: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export interface CallState {
  isInCall: boolean;
  isCallActive: boolean;
  isCallOutgoing: boolean;
  isCallIncoming: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  callDuration: number;
  recordingDuration: number;
}

export interface IncomingCall {
  isVisible: boolean;
  caller: CallParticipant | null;
  call: MediaConnection | null;
}

export interface NetworkStats {
  latency: number;
  packetLoss: number;
  bandwidth: number;
}

export interface ConnectionDiagnostics {
  iceConnectionState: string;
  iceGatheringState: string;
  connectionState: string;
  signalingState: string;
  iceCandidates: number;
  turnServersUsed: string[];
  stunServersUsed: string[];
  connectionType: string;
  localCandidateType: string;
  remoteCandidateType: string;
}

interface UsePeerVideoCallProps {
  currentUserId: string;
  roomId: string;
  userRole?: "therapist" | "patient";
  sessionData?: {
    therapistName?: string;
    patientName?: string;
    therapistAvatar?: string;
    patientAvatar?: string;
  };
}

export const usePeerVideoCall = ({
  currentUserId,
  roomId,
  userRole,
  sessionData,
}: UsePeerVideoCallProps) => {
  // Core state
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isCallActive: false,
    isCallOutgoing: false,
    isCallIncoming: false,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false,
    isRecording: false,
    callDuration: 0,
    recordingDuration: 0,
  });

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [connectionDiagnostics, setConnectionDiagnostics] =
    useState<ConnectionDiagnostics>({
      iceConnectionState: "new",
      iceGatheringState: "new",
      connectionState: "new",
      signalingState: "stable",
      iceCandidates: 0,
      turnServersUsed: [],
      stunServersUsed: [],
      connectionType: "unknown",
      localCandidateType: "unknown",
      remoteCandidateType: "unknown",
    });

  // Track active calls to prevent duplicates and ensure proper cleanup
  const activeCallsRef = useRef<Map<string, MediaConnection>>(new Map());
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall>({
    isVisible: false,
    caller: null,
    call: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentPeerId, setCurrentPeerId] = useState<string>("");
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    latency: 0,
    packetLoss: 0,
    bandwidth: 0,
  });

  // Refs
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const networkStatsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const isDestroyedRef = useRef(false);

  // Generate deterministic peer ID
  const generatePeerId = useCallback(
    (userId: string, roomId: string): string => {
      return `${userId}-${roomId}`;
    },
    []
  );

  // Initialize peer with proper error handling
  const initializePeer = useCallback(async (): Promise<Peer | null> => {
    // Check if peer is already initialized and not destroyed
    if (peerRef.current && !peerRef.current.destroyed) {
      console.log("🔄 Peer already initialized and active");
      return peerRef.current;
    }

    // If peer was destroyed, we need to create a new one
    if (peerRef.current && peerRef.current.destroyed) {
      console.log("🔄 Peer was destroyed, creating new instance");
      peerRef.current = null;
      isInitializedRef.current = false;
    }

    try {
      const peerId = generatePeerId(currentUserId, roomId);
      console.log(`🎯 Initializing PeerJS with ID: ${peerId}`);

      const config = getPeerConfig();
      console.log("🔧 Using PeerJS config:", config);

      // Create new peer instance
      const peer = new Peer(peerId, config);
      peerRef.current = peer;
      setIsConnecting(true);

      return new Promise<Peer>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.log("⏰ PeerJS initialization timeout");
          setIsConnecting(false);
          resolve(peer); // Resolve anyway to prevent hanging
        }, 10000);

        peer.on("open", (id) => {
          clearTimeout(timeout);
          console.log(`✅ PeerJS connected with ID: ${id}`);
          console.log(`✅ PeerJS connection details:`, {
            peerId: id,
            currentUserId,
            roomId,
            generatedPeerId: generatePeerId(currentUserId, roomId),
            expectedPeerId: generatePeerId(currentUserId, roomId),
          });
          setCurrentPeerId(id);
          setIsConnecting(false);
          isInitializedRef.current = true;
          resolve(peer);
        });

        peer.on("error", (error) => {
          clearTimeout(timeout);
          console.error("❌ PeerJS error:", error);
          setIsConnecting(false);

          // Don't reject on certain errors that are recoverable
          if (error.type === "peer-unavailable" || error.type === "network") {
            console.log("🔄 Recoverable error, resolving anyway");
            resolve(peer);
          } else {
            reject(error);
          }
        });

        peer.on("disconnected", () => {
          console.log("🔌 PeerJS disconnected");
          setIsConnecting(false);
        });

        peer.on("close", () => {
          console.log("🔒 PeerJS closed");
          setIsConnecting(false);
          isInitializedRef.current = false;
        });
      });
    } catch (error) {
      console.error("❌ Failed to initialize PeerJS:", error);
      setIsConnecting(false);
      return null;
    }
  }, [currentUserId, roomId, generatePeerId]);

  // Get local media stream
  const getLocalStream = useCallback(async (): Promise<MediaStream | null> => {
    try {
      if (localStreamRef.current) {
        return localStreamRef.current;
      }

      console.log("🎥 Getting local media stream...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      console.log("✅ Local stream acquired");
      return stream;
    } catch (error) {
      console.error("❌ Failed to get local stream:", error);
      return null;
    }
  }, []);

  // Handle incoming calls
  const handleIncomingCall = useCallback(
    (call: MediaConnection) => {
      console.log("📞 Incoming call from:", call.peer);
      console.log("📞 Incoming call details:", {
        peerId: call.peer,
        callType: call.type,
        currentPeerId: peerRef.current?.id,
        roomId,
        callOpen: call.open,
      });

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

      // Extract caller information from peer ID
      // Peer ID format: userId-roomId
      const peerIdParts = call.peer.split("-");
      const callerUserId = peerIdParts.slice(0, -1).join("-"); // Remove the last part (roomId)
      const callerRoomId = peerIdParts[peerIdParts.length - 1];

      console.log("📞 Extracted caller info:", {
        fullPeerId: call.peer,
        callerUserId,
        callerRoomId,
        currentRoomId: roomId,
      });

      // Determine caller information based on available data
      let callerName = "Unknown Caller";
      let callerAvatar = "";
      let isCallerTherapist = false;

      if (sessionData) {
        // Use session data if available
        if (userRole === "therapist") {
          // Current user is therapist, so caller is patient
          callerName = sessionData.patientName || "Patient";
          callerAvatar =
            sessionData.patientAvatar ||
            "https://ui-avatars.com/api/?name=Patient&background=E3F2FD&color=1976D2";
          isCallerTherapist = false;
        } else if (userRole === "patient") {
          // Current user is patient, so caller is therapist
          callerName = sessionData.therapistName || "Therapist";
          callerAvatar =
            sessionData.therapistAvatar ||
            "https://ui-avatars.com/api/?name=Therapist&background=EAF7F0&color=013F25";
          isCallerTherapist = true;
        }
      } else {
        // Fallback: determine based on user ID comparison
        isCallerTherapist = callerUserId !== currentUserId;
        callerName = isCallerTherapist ? "Therapist" : "Patient";
        callerAvatar = isCallerTherapist
          ? "https://ui-avatars.com/api/?name=Therapist&background=EAF7F0&color=013F25"
          : "https://ui-avatars.com/api/?name=Patient&background=E3F2FD&color=1976D2";
      }

      const caller: CallParticipant = {
        id: callerUserId,
        name: callerName,
        avatar: callerAvatar,
        isTherapist: isCallerTherapist,
        isMuted: false,
        isVideoEnabled: true,
      };

      console.log("📞 Caller participant created:", caller);

      setIncomingCall({
        isVisible: true,
        caller,
        call,
      });

      setCallState((prev) => ({
        ...prev,
        isCallIncoming: true,
      }));

      console.log("✅ Incoming call state set:", {
        isVisible: true,
        caller: caller.id,
        callerName: caller.name,
        isCallIncoming: true,
      });
    },
    [roomId, currentUserId, userRole, sessionData]
  );

  // Accept incoming call
  const acceptCall = useCallback(async (): Promise<void> => {
    if (!incomingCall.call) {
      console.log("❌ No incoming call to accept");
      return;
    }

    try {
      console.log("✅ Accepting incoming call...");
      const stream = await getLocalStream();

      if (stream) {
        incomingCall.call.answer(stream);

        // Track this incoming call
        activeCallsRef.current.set(incomingCall.call.peer, incomingCall.call);

        // Start monitoring ICE connection
        monitorIceConnection(incomingCall.call);

        incomingCall.call.on("stream", (remoteStream) => {
          console.log(
            "📺 Received remote stream from:",
            incomingCall.call!.peer
          );
          setRemoteStreams((prev) =>
            new Map(prev).set(incomingCall.call!.peer, remoteStream)
          );

          // Update call state when stream is received (call is fully established)
          setCallState((prev) => {
            const newState = {
              ...prev,
              isInCall: true,
              isCallActive: true,
              isCallIncoming: false,
            };
            console.log(
              "📞 Call state updated to answered (incoming side):",
              newState
            );
            return newState;
          });
        });

        // Handle call close event for incoming calls
        incomingCall.call.on("close", () => {
          console.log(
            `📞 Incoming call ended by remote peer: ${incomingCall.call!.peer}`
          );

          // Remove from active calls tracking
          activeCallsRef.current.delete(incomingCall.call!.peer);

          setRemoteStreams((prev) => {
            const newMap = new Map(prev);
            newMap.delete(incomingCall.call!.peer);
            return newMap;
          });

          // Check if we have any remaining active calls
          const remainingCalls = activeCallsRef.current.size;
          console.log(
            `📞 Remaining active calls after incoming call end: ${remainingCalls}`
          );

          // Update call state when call is closed
          setCallState((prev) => ({
            ...prev,
            isInCall: remainingCalls > 0,
            isCallActive: remainingCalls > 0,
            isCallIncoming: false,
          }));

          // Clear incoming call
          setIncomingCall({
            isVisible: false,
            caller: null,
            call: null,
          });

          // Only stop timers if no more calls
          if (remainingCalls === 0) {
            stopCallTimer();
            stopNetworkStatsMonitoring();
          }
        });

        // Handle call error event for incoming calls
        incomingCall.call.on("error", (error) => {
          console.error(`❌ Incoming call error:`, error);

          // Remove from active calls tracking
          activeCallsRef.current.delete(incomingCall.call!.peer);

          // Check remaining calls
          const remainingCalls = activeCallsRef.current.size;

          setCallState((prev) => ({
            ...prev,
            isInCall: remainingCalls > 0,
            isCallActive: remainingCalls > 0,
            isCallIncoming: false,
          }));

          // Clear incoming call
          setIncomingCall({
            isVisible: false,
            caller: null,
            call: null,
          });

          // Only stop timers if no more calls
          if (remainingCalls === 0) {
            stopCallTimer();
            stopNetworkStatsMonitoring();
          }
        });

        setCallState((prev) => {
          const newState = {
            ...prev,
            isInCall: true,
            isCallActive: true,
            isCallIncoming: false,
          };
          console.log("📞 Call state updated to accepted:", newState);
          return newState;
        });

        setIncomingCall({
          isVisible: false,
          caller: null,
          call: null,
        });

        startCallTimer();
        console.log("✅ Call accepted successfully");
      }
    } catch (error) {
      console.error("❌ Failed to accept call:", error);
    }
  }, [incomingCall, getLocalStream]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (incomingCall.call) {
      console.log("❌ Rejecting incoming call");
      incomingCall.call.close();
    }

    setIncomingCall({
      isVisible: false,
      caller: null,
      call: null,
    });

    setCallState((prev) => ({
      ...prev,
      isCallIncoming: false,
    }));
  }, [incomingCall]);

  // Start call
  const startCall = useCallback(
    async (participants: CallParticipant[]): Promise<boolean> => {
      if (!participants.length) {
        console.log("❌ No participants provided");
        return false;
      }

      try {
        console.log("🎯 Starting call with participants:", participants);
        console.log("🎯 Current room ID:", roomId);
        console.log("🎯 Current user ID:", currentUserId);

        // Initialize peer if not already done
        const peer = await initializePeer();
        if (!peer || peer.destroyed) {
          console.log("❌ Peer not available for call");
          return false;
        }

        console.log("✅ Peer is available for call:", {
          peerId: peer.id,
          destroyed: peer.destroyed,
          open: peer.open,
        });

        // Get local stream
        const stream = await getLocalStream();
        if (!stream) {
          console.log("❌ Failed to get local stream");
          return false;
        }

        console.log("✅ Local stream acquired:", {
          videoTracks: stream.getVideoTracks().length,
          audioTracks: stream.getAudioTracks().length,
          active: stream.active,
        });

        // Start calls to all participants
        const calls: MediaConnection[] = [];

        for (const participant of participants) {
          const targetPeerId = generatePeerId(participant.id, roomId);
          console.log(`📞 Calling peer: ${targetPeerId}`);
          console.log(`📞 Participant details:`, participant);
          console.log(`📞 Current peer ID: ${peer.id}`);
          console.log(`📞 Target peer ID: ${targetPeerId}`);
          console.log(`📞 Peer connection state:`, {
            open: peer.open,
            destroyed: peer.destroyed,
            disconnected: peer.disconnected,
          });

          try {
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

            // Start monitoring ICE connection
            monitorIceConnection(call);

            console.log(`📞 Call object created:`, {
              peer: call.peer,
              type: call.type,
              open: call.open,
            });

            call.on("stream", (remoteStream) => {
              console.log(
                `📺 Received stream from ${participant.id} - call answered!`
              );
              setRemoteStreams((prev) =>
                new Map(prev).set(participant.id, remoteStream)
              );

              // Update call state when stream is received (call is answered)
              setCallState((prev) => {
                const newState = {
                  ...prev,
                  isInCall: true,
                  isCallActive: true,
                  isCallOutgoing: false, // No longer outgoing, now active
                };
                console.log(
                  "📞 Call state updated to answered (outgoing side):",
                  newState
                );
                return newState;
              });
            });

            call.on("close", () => {
              console.log(`📞 Call with ${participant.id} ended`);

              // Remove from active calls tracking
              activeCallsRef.current.delete(targetPeerId);

              setRemoteStreams((prev) => {
                const newMap = new Map(prev);
                newMap.delete(participant.id);
                return newMap;
              });

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

            call.on("error", (error) => {
              console.error(`❌ Call error with ${participant.id}:`, error);
              console.error(`❌ Call error details:`, {
                errorType: error.type,
                errorMessage: error.message,
                targetPeerId,
                currentPeerId: peer.id,
              });

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
          } catch (error) {
            console.error(`❌ Failed to call ${participant.id}:`, error);
            console.error(`❌ Call failure details:`, {
              error,
              targetPeerId,
              currentPeerId: peer.id,
              participant,
            });
          }
        }

        if (calls.length > 0) {
          setCallState((prev) => {
            const newState = {
              ...prev,
              isInCall: true,
              isCallActive: false, // Not active yet, waiting for answer
              isCallOutgoing: true,
            };
            console.log("📞 Call state updated to outgoing:", newState);
            return newState;
          });

          startCallTimer();
          console.log(
            "✅ Call started successfully with",
            calls.length,
            "calls"
          );
          return true;
        } else {
          console.log("❌ No calls were established");
          return false;
        }
      } catch (error) {
        console.error("❌ Failed to start call:", error);
        return false;
      }
    },
    [initializePeer, getLocalStream, generatePeerId, roomId, currentUserId]
  );

  // End call
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

    // Close all active call connections from peer
    if (peerRef.current && !peerRef.current.destroyed) {
      // Close all connections in the peer's connections object
      Object.values(peerRef.current.connections).forEach((connections) => {
        if (Array.isArray(connections)) {
          connections.forEach((connection) => {
            if (connection && connection.type === "media") {
              console.log(
                "📞 Closing active call connection:",
                connection.peer
              );
              try {
                connection.close();
              } catch (error) {
                console.warn("Error closing connection:", error);
              }
            }
          });
        }
      });
    }

    // Close incoming call if it exists
    if (incomingCall.call) {
      console.log("📞 Closing incoming call");
      try {
        incomingCall.call.close();
      } catch (error) {
        console.warn("Error closing incoming call:", error);
      }
    }

    // Close all remote streams
    setRemoteStreams(new Map());

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }

    // Stop screen share
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    // Reset call state
    setCallState({
      isInCall: false,
      isCallActive: false,
      isCallOutgoing: false,
      isCallIncoming: false,
      isMuted: false,
      isVideoEnabled: true,
      isScreenSharing: false,
      isRecording: false,
      callDuration: 0,
      recordingDuration: 0,
    });

    // Clear incoming call
    setIncomingCall({
      isVisible: false,
      caller: null,
      call: null,
    });

    stopCallTimer();
    stopNetworkStatsMonitoring();
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });

      setCallState((prev) => ({
        ...prev,
        isMuted: !prev.isMuted,
      }));
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });

      setCallState((prev) => ({
        ...prev,
        isVideoEnabled: !prev.isVideoEnabled,
      }));
    }
  }, []);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    try {
      if (callState.isScreenSharing) {
        // Stop screen sharing
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach((track) => track.stop());
          screenStreamRef.current = null;
        }

        setCallState((prev) => ({
          ...prev,
          isScreenSharing: false,
        }));
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = screenStream;

        setCallState((prev) => ({
          ...prev,
          isScreenSharing: true,
        }));
      }
    } catch (error) {
      console.error("❌ Failed to toggle screen share:", error);
    }
  }, [callState.isScreenSharing]);

  // Start recording
  const startRecording = useCallback(() => {
    console.log("🔴 Starting recording");
    setCallState((prev) => ({
      ...prev,
      isRecording: true,
    }));

    recordingTimerRef.current = setInterval(() => {
      setCallState((prev) => ({
        ...prev,
        recordingDuration: prev.recordingDuration + 1,
      }));
    }, 1000);
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    console.log("⏹️ Stopping recording");
    setCallState((prev) => ({
      ...prev,
      isRecording: false,
    }));

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  // Call timer
  const startCallTimer = useCallback(() => {
    callTimerRef.current = setInterval(() => {
      setCallState((prev) => ({
        ...prev,
        callDuration: prev.callDuration + 1,
      }));
    }, 1000);
  }, []);

  const stopCallTimer = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  }, []);

  // Network stats monitoring
  const startNetworkStatsMonitoring = useCallback(() => {
    networkStatsTimerRef.current = setInterval(() => {
      // Simulate network stats (in real implementation, get from RTCPeerConnection)
      setNetworkStats({
        latency: Math.random() * 100,
        packetLoss: Math.random() * 5,
        bandwidth: Math.random() * 1000,
      });
    }, 5000);
  }, []);

  const stopNetworkStatsMonitoring = useCallback(() => {
    if (networkStatsTimerRef.current) {
      clearInterval(networkStatsTimerRef.current);
      networkStatsTimerRef.current = null;
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log("🧹 Cleaning up PeerJS resources");

    endCall();

    if (peerRef.current && !peerRef.current.destroyed) {
      peerRef.current.destroy();
    }

    peerRef.current = null;
    isInitializedRef.current = false;
    // Don't set isDestroyedRef to true to allow reinitialization
  }, [endCall]);

  // Initialize peer on mount
  useEffect(() => {
    if (currentUserId && roomId) {
      initializePeer()
        .then((peer) => {
          if (peer && peer.open) {
            console.log("🎯 Peer initialized successfully, ready for calls");
            console.log("🎯 Peer ID:", peer.id);
            console.log("🎯 Room ID:", roomId);
            console.log("🎯 User ID:", currentUserId);
          }
        })
        .catch((error) => {
          console.error("❌ Failed to initialize PeerJS:", error);
        });
    }

    return () => {
      cleanup();
    };
  }, [currentUserId, roomId, initializePeer, cleanup]);

  // Debug: Log call state changes
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("📞 Call state changed:", {
        isInCall: callState.isInCall,
        isCallActive: callState.isCallActive,
        isCallOutgoing: callState.isCallOutgoing,
        isCallIncoming: callState.isCallIncoming,
        callDuration: callState.callDuration,
        remoteStreamsCount: remoteStreams.size,
        hasIncomingCall: incomingCall.isVisible,
        currentPeerId: peerRef.current?.id,
      });
    }
  }, [callState, remoteStreams.size, incomingCall.isVisible]);

  // Set up peer event listeners
  useEffect(() => {
    const peer = peerRef.current;
    if (!peer || peer.destroyed) return;

    const handleCall = (call: MediaConnection) => {
      handleIncomingCall(call);
    };

    peer.on("call", handleCall);

    return () => {
      if (peer && !peer.destroyed) {
        peer.off("call", handleCall);
      }
    };
  }, [handleIncomingCall]);

  // Function to monitor ICE connection states
  const monitorIceConnection = useCallback((call: MediaConnection) => {
    const pc = call.peerConnection;
    if (!pc) return;

    const updateDiagnostics = () => {
      setConnectionDiagnostics((prev) => ({
        ...prev,
        iceConnectionState: pc.iceConnectionState,
        iceGatheringState: pc.iceGatheringState,
        connectionState: pc.connectionState,
        signalingState: pc.signalingState,
      }));
    };

    // Monitor ICE connection state changes
    pc.addEventListener("iceconnectionstatechange", () => {
      console.log(`🧊 ICE Connection State: ${pc.iceConnectionState}`);
      updateDiagnostics();

      if (pc.iceConnectionState === "connected") {
        console.log("✅ ICE connection established successfully");
      } else if (pc.iceConnectionState === "failed") {
        console.error(
          "❌ ICE connection failed - this usually means NAT traversal failed"
        );
        console.log("💡 Try using TURN servers or check firewall settings");
      } else if (pc.iceConnectionState === "disconnected") {
        console.warn("⚠️ ICE connection disconnected");
      }
    });

    // Monitor ICE gathering state
    pc.addEventListener("icegatheringstatechange", () => {
      console.log(`🔍 ICE Gathering State: ${pc.iceGatheringState}`);
      updateDiagnostics();
    });

    // Monitor connection state
    pc.addEventListener("connectionstatechange", () => {
      console.log(`🔗 Connection State: ${pc.connectionState}`);
      updateDiagnostics();
    });

    // Monitor ICE candidates
    pc.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        console.log("🧊 ICE Candidate:", {
          type: event.candidate.type,
          protocol: event.candidate.protocol,
          address: event.candidate.address,
          port: event.candidate.port,
          candidate: event.candidate.candidate,
        });

        setConnectionDiagnostics((prev) => ({
          ...prev,
          iceCandidates: prev.iceCandidates + 1,
          localCandidateType: event.candidate?.type || prev.localCandidateType,
        }));
      }
    });

    // Monitor ICE candidate errors
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
        console.warn(
          "🔄 TURN Server Connection Failed (trying other servers):",
          {
            errorCode: event.errorCode,
            errorText: event.errorText,
            url: event.url,
          }
        );
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

    // Initial state
    updateDiagnostics();
  }, []);

  return {
    // State
    callState,
    localStream,
    remoteStreams,
    incomingCall,
    isConnecting,
    currentPeerId,
    networkStats,
    connectionDiagnostics,

    // Actions
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    startRecording,
    stopRecording,

    // Utilities
    getLocalStream,
  };
};
