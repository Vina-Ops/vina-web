import { useState, useEffect, useCallback, useRef } from "react";
import Peer, { MediaConnection } from "peerjs";
import { getPeerConfig } from "@/lib/peer-config";

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

export const usePeerVideoCall = ({
  currentUserId,
  therapistId,
  roomId,
  onIncomingCall,
}: UsePeerVideoCallProps) => {
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

  // Initialize PeerJS
  useEffect(() => {
    if (!currentUserId) return;

    // Initialize PeerJS with a unique ID
    const peer = new Peer(currentUserId, getPeerConfig());

    peerRef.current = peer;

    // Handle incoming calls
    peer.on("call", (incomingCall) => {
      console.log("📞 Incoming call from:", incomingCall.peer);
      console.log("📞 Current peer ID:", peer.id);
      console.log("📞 Call object:", incomingCall);

      // Get local media stream first
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("✅ Local stream acquired in incoming call:", stream);
          localStreamRef.current = stream;
          setLocalStream(stream);

          // Show incoming call notification instead of auto-answering
          setIncomingCall({
            isVisible: true,
            caller: {
              id: incomingCall.peer,
              name: "Incoming Call", // You can enhance this with actual caller info
              avatar: "",
              isTherapist: false,
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
        })
        .catch((err) => {
          console.error("Failed to get user media:", err);
          incomingCall.close();
        });
    });

    // Handle peer connection
    peer.on("open", (id) => {
      console.log("🎯 PeerJS connected with ID:", id);
      console.log("🎯 Current user ID:", currentUserId);
      setIsConnecting(false);
    });

    // Handle peer errors
    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      setIsConnecting(false);

      // If it's a connection error, try alternative server
      if (
        err.type === "peer-unavailable" ||
        err.message?.includes("Lost connection")
      ) {
        console.log("🔄 Connection failed, trying alternative server...");
        // You can implement server fallback logic here
      }
    });

    // Handle peer disconnection
    peer.on("disconnected", () => {
      console.log("PeerJS disconnected, attempting to reconnect...");
      peer.reconnect();
    });

    return () => {
      peer.destroy();
    };
  }, [currentUserId]);

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
          // Get video track stats using RTCRtpSender if available
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          if (videoTrack) {
            // For now, we'll use basic stats since getStats() on MediaStreamTrack is not widely supported
            // In a real implementation, you'd use RTCRtpSender.getStats() or RTCPeerConnection.getStats()
            let bitrate = 0;
            let frameRate = 0;
            let resolution = "0x0";

            // Get basic video track properties
            if (videoTrack.getSettings) {
              const settings = videoTrack.getSettings();
              resolution = `${settings.width || 0}x${settings.height || 0}`;
              frameRate = settings.frameRate || 0;
            }

            // Estimate bitrate based on resolution and frame rate
            if (resolution !== "0x0" && frameRate > 0) {
              const [width, height] = resolution.split("x").map(Number);
              const pixels = width * height;
              const estimatedBitrate = Math.round(
                (pixels * frameRate * 0.1) / 1000
              ); // Rough estimate
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
      const timeoutDuration = 60000; // 1 minute in milliseconds
      const timeElapsed = Date.now() - outgoingCall.startTime;

      if (timeElapsed >= timeoutDuration) {
        console.log("⏰ Call timeout reached (1 minute)");
        handleCallTimeout();
      } else {
        // Schedule next timeout check
        setTimeout(startCallTimeout, 1000);
      }
    }
  }, [outgoingCall.startTime]);

  // Handle call timeout
  const handleCallTimeout = useCallback(() => {
    if (outgoingCall.call) {
      console.log("⏰ Ending call due to timeout");
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

    // Show timeout notification
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

    // Stop local streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    // Stop recording if active
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
      if (!peerRef.current || !localStreamRef.current) {
        // Get local media stream first
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

      // Ensure local stream is set in state
      if (!localStream) {
        console.log("🔄 Setting local stream in state from startCall");
        setLocalStream(localStreamRef.current);
      }

      try {
        setIsConnecting(true);

        // For now, assume we're calling the first participant (therapist)
        const targetPeerId = participants[0]?.id;
        if (!targetPeerId) return false;

        console.log("🎯 Calling peer:", targetPeerId);
        console.log("🎯 Current peer ID:", peerRef.current?.id);
        console.log("🎯 Participants:", participants);
        console.log("🎯 Local stream available:", !!localStreamRef.current);

        const call = peerRef.current!.call(
          targetPeerId,
          localStreamRef.current
        );

        // Set up outgoing call tracking
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

        // Start call timeout
        startCallTimeout();

        // Set up call event handlers
        call.on("stream", (remoteStream) => {
          console.log("✅ Remote stream received from:", targetPeerId);
          console.log("📞 Call answered - stopping timeout");

          // Stop the timeout since call was answered
          stopCallTimeout();

          setRemoteStreams(
            (prev) => new Map(prev.set(targetPeerId, remoteStream))
          );
          setCallState((prev) => ({
            ...prev,
            isCallActive: true,
            isCallOutgoing: false,
          }));

          // Clear outgoing call tracking
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
          console.error("Call error:", err);
          stopCallTimeout();
          setOutgoingCall({
            isActive: false,
            call: null,
            targetPeerId: null,
            startTime: null,
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
      startCallTimer,
      handleCallEnded,
      startNetworkStatsMonitoring,
      localStream,
      startCallTimeout,
      stopCallTimeout,
    ]
  );

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    if (!incomingCall.call || !localStreamRef.current) return false;

    try {
      console.log("📞 Accepting incoming call from:", incomingCall.call.peer);
      console.log("📞 Local stream available:", !!localStreamRef.current);

      // Ensure local stream is set in state
      if (!localStream) {
        console.log("🔄 Setting local stream in state from acceptCall");
        setLocalStream(localStreamRef.current);
      }

      // Answer the call
      incomingCall.call.answer(localStreamRef.current);

      // Set up call event handlers
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
    // Close all peer connections
    setRemoteStreams((prev) => {
      prev.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
      return new Map();
    });

    handleCallEnded();
  }, [handleCallEnded]);

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
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setCallState((prev) => ({ ...prev, isScreenSharing: false }));
      console.log("🖥️ Screen sharing stopped");
    } else {
      // Start screen sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        screenStreamRef.current = stream;
        setCallState((prev) => ({ ...prev, isScreenSharing: true }));

        // Replace video track in local stream
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

      // Add local stream tracks
      localStreamRef.current.getTracks().forEach((track) => {
        combinedStream.addTrack(track);
      });

      // Add remote stream tracks
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
    // This is now handled by PeerJS, but we keep it for compatibility
    console.log("Chat room creation handled by PeerJS");
    return `peer-${therapistId}`;
  }, []);

  // Connect to existing room (placeholder for compatibility)
  const connectToExistingRoom = useCallback((roomId: string) => {
    setCurrentRoomId(roomId);
    // PeerJS handles connections automatically
  }, []);

  // Get current peer ID for debugging
  const getCurrentPeerId = useCallback(() => {
    return peerRef.current?.id || null;
  }, []);

  return {
    callState,
    remoteStreams,
    localStream,
    incomingCall,
    currentRoomId,
    isConnecting,
    networkStats,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    startRecording,
    stopRecording,
    getLocalStream,
    getCurrentPeerId,
    createChatRoom,
    connectToExistingRoom,
  };
};
