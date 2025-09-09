"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Square,
  Circle,
  Phone,
} from "lucide-react";
import {
  CallParticipant,
  NetworkStats,
  ConnectionDiagnostics,
} from "@/hooks/usePeerVideoCall";
import ConnectionDiagnosticsComponent from "./ConnectionDiagnostics";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participants: CallParticipant[];
  currentUserId: string;
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isMuted: boolean;
  isVideoEnabled: boolean;
  connectionDiagnostics?: ConnectionDiagnostics;
  isScreenSharing: boolean;
  isRecording: boolean;
  callDuration: number;
  recordingDuration: number;
  networkStats: NetworkStats;
  // Ringing overlay props
  isCallOutgoing: boolean;
  isCallIncoming: boolean;
  onAccept: () => void;
  onReject: () => void;
  // ICE Reconnection props
  isReconnecting?: boolean;
  reconnectionAttempts?: number;
  maxReconnectionAttempts?: number;
}

const VideoCall: React.FC<VideoCallProps> = ({
  isOpen,
  onClose,
  participants,
  currentUserId,
  localStream,
  remoteStreams,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onStartRecording,
  onStopRecording,
  isMuted,
  isVideoEnabled,
  connectionDiagnostics,
  isScreenSharing,
  isRecording,
  callDuration,
  recordingDuration,
  networkStats,
  // Ringing overlay props
  isCallOutgoing,
  isCallIncoming,
  onAccept,
  onReject,
  // ICE Reconnection props
  isReconnecting = false,
  reconnectionAttempts = 0,
  maxReconnectionAttempts = 5,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // State for floating video position and size
  const [floatingVideoPosition, setFloatingVideoPosition] = useState({
    x: 20,
    y: 20,
  });
  const [floatingVideoSize, setFloatingVideoSize] = useState({
    width: 200,
    height: 150,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isMinimized, setIsMinimized] = useState(false);

  // Handle floating video drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - floatingVideoPosition.x,
        y: e.clientY - floatingVideoPosition.y,
      });
    }
  };

  // Handle floating video resize
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: floatingVideoSize.width,
      height: floatingVideoSize.height,
    });
  };

  // Add global mouse event listeners for dragging and resizing
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Keep within screen bounds
        const maxX = window.innerWidth - floatingVideoSize.width;
        const maxY = window.innerHeight - floatingVideoSize.height - 100; // Account for control bar

        setFloatingVideoPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = Math.max(
          150,
          Math.min(400, resizeStart.width + deltaX)
        );
        const newHeight = Math.max(
          100,
          Math.min(300, resizeStart.height + deltaY)
        );

        setFloatingVideoSize({ width: newWidth, height: newHeight });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, floatingVideoSize]);

  useEffect(() => {
    console.log("VideoCall: localStream changed:", localStream);
    console.log("VideoCall: localVideoRef.current:", !!localVideoRef.current);
    if (localStream && localVideoRef.current) {
      console.log("VideoCall: Setting local video srcObject");
      localVideoRef.current.srcObject = localStream;

      // Ensure the video plays
      localVideoRef.current.play().catch((err) => {
        console.error("Failed to play local video:", err);
      });
    } else {
      console.log(
        "VideoCall: Cannot set local video - stream:",
        !!localStream,
        "ref:",
        !!localVideoRef.current
      );
    }
  }, [localStream]);

  useEffect(() => {
    console.log("VideoCall: propRemoteStreams changed:", remoteStreams.size);
    remoteStreams.forEach((stream, userId) => {
      const videoElement = remoteVideoRefs.current.get(userId);
      if (videoElement) {
        console.log("VideoCall: Setting remote video for user:", userId);
        videoElement.srcObject = stream;
      } else {
        console.log(
          "VideoCall: Remote video element not found for user:",
          userId
        );
      }
    });
  }, [remoteStreams]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black">
      {/* Header with call duration and network stats */}
      <div className="absolute top-0 left-0 right-0 z-[99999]	 bg-black bg-opacity-75 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE</span>
            </div>
            <div className="text-sm">
              Call Duration: {formatDuration(callDuration)}
            </div>
            {isRecording && (
              <div className="flex items-center space-x-2 text-red-400">
                <Circle className="w-3 h-3 animate-pulse fill-current" />
                <span className="text-sm">
                  Recording: {formatDuration(recordingDuration)}
                </span>
              </div>
            )}
            {isReconnecting && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm">
                  Reconnecting... ({reconnectionAttempts}/
                  {maxReconnectionAttempts})
                </span>
              </div>
            )}
          </div>

          {/* Network Stats and Connection Diagnostics */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <span>🌐</span>
              <span>{networkStats.bandwidth} kbps</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <span>{networkStats.latency}ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📉</span>
              <span>{networkStats.packetLoss}%</span>
            </div>
            {/* Debug: Local Stream Status */}
            <div className="flex items-center space-x-2">
              <span>🎥</span>
              <span className={localStream ? "text-green-400" : "text-red-400"}>
                {localStream ? "Local OK" : "No Local"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-red-600 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Debug Display - Only show when on call */}
      {callDuration > 0 && (
        <div className="absolute top-20 left-0 right-0 z-10 bg-black bg-opacity-75 text-white p-3 text-xs">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>Call Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👥</span>
                <span>Participants: {participants.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📹</span>
                <span>Remote Streams: {remoteStreams.size}</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span>🎤</span>
                <span className={isMuted ? "text-red-400" : "text-green-400"}>
                  {isMuted ? "Muted" : "Unmuted"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📷</span>
                <span
                  className={isVideoEnabled ? "text-green-400" : "text-red-400"}
                >
                  {isVideoEnabled ? "Video On" : "Video Off"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🖥️</span>
                <span
                  className={
                    isScreenSharing ? "text-blue-400" : "text-gray-400"
                  }
                >
                  {isScreenSharing ? "Screen Sharing" : "No Screen Share"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ringing Overlay - Show when call is ringing (outgoing or incoming) */}
      {(isCallOutgoing || isCallIncoming) && (
        <div className="absolute inset-0 z-20 bg-black bg-opacity-90 flex flex-col items-center justify-center">
          <div className="text-center text-white">
            {/* Ringing Animation */}
            <div className="mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto animate-pulse"></div>
                <div className="absolute inset-0 w-24 h-24 bg-blue-400 rounded-full mx-auto animate-ping"></div>
                <div className="absolute inset-2 w-20 h-20 bg-blue-200 rounded-full mx-auto animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Phone className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Call Status Text */}
            <h2 className="text-3xl font-bold mb-4">
              {isCallOutgoing ? "Calling..." : "Incoming Call"}
            </h2>

            {isCallOutgoing ? (
              <div className="text-xl text-gray-300 mb-8">
                <p>Ringing...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Waiting for {participants[0]?.name || "recipient"} to answer
                </p>
              </div>
            ) : (
              <div className="text-xl text-gray-300 mb-8">
                <p>From: {participants[0]?.name || "Unknown"}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Tap to answer or swipe to decline
                </p>
              </div>
            )}

            {/* Call Controls */}
            <div className="flex items-center justify-center space-x-6">
              {isCallOutgoing ? (
                <>
                  {/* Cancel Call Button */}
                  <button
                    onClick={onClose}
                    className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    title="Cancel Call"
                  >
                    <Phone className="h-8 w-8 rotate-135" />
                  </button>
                </>
              ) : (
                <>
                  {/* Reject Call Button */}
                  <button
                    onClick={onReject}
                    className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    title="Reject Call"
                  >
                    <Phone className="h-8 w-8 rotate-135" />
                  </button>

                  {/* Accept Call Button */}
                  <button
                    onClick={onAccept}
                    className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                    title="Accept Call"
                  >
                    <Phone className="h-8 w-8" />
                  </button>
                </>
              )}
            </div>

            {/* Call Duration for Outgoing Calls */}
            {isCallOutgoing && (
              <div className="mt-8 text-sm text-gray-400">
                <p>Call will timeout in 1 minute if not answered</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Video Area - Full Screen Remote Video */}
      <div className={`h-full w-full ${callDuration > 0 ? "pt-32" : "pt-20"}`}>
        {/* Remote Video - Full Screen */}
        {remoteStreams.size > 0 ? (
          Array.from(remoteStreams.entries()).map(([userId, stream]) => {
            const participant = participants.find((p) => p.id === userId);
            return (
              <div key={userId} className="relative h-full w-full bg-gray-800">
                <video
                  ref={(el) => {
                    if (el) remoteVideoRefs.current.set(userId, el);
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-3 py-2 rounded-lg">
                  {participant?.name || "Unknown"}
                </div>
              </div>
            );
          })
        ) : (
          // No remote video - show placeholder
          <div className="h-full w-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xl">Waiting for video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Local Video - Picture in Picture */}
      {localStream && (
        <div
          className="absolute z-30 bg-gray-900 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 cursor-move select-none"
          style={{
            left: floatingVideoPosition.x,
            top: floatingVideoPosition.y,
            width: isMinimized ? 120 : floatingVideoSize.width,
            height: isMinimized ? 90 : floatingVideoSize.height,
          }}
          onMouseDown={handleMouseDown}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => {
              console.log("VideoCall: Local video metadata loaded");
            }}
            onCanPlay={() => {
              console.log("VideoCall: Local video can play");
            }}
            onError={(e) => {
              console.error("VideoCall: Local video error:", e);
            }}
          />

          {/* Local Video Overlay */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            You {isMuted && "🔇"} {!isVideoEnabled && "📷❌"}
          </div>

          {isScreenSharing && (
            <div className="absolute top-2 right-8 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              🖥️ Screen
            </div>
          )}

          {/* Minimize/Maximize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-50 text-white text-xs rounded hover:bg-opacity-70 flex items-center justify-center"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? "⤢" : "⤡"}
          </button>

          {/* Resize Handle - Only show when not minimized */}
          {!isMinimized && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-white/30 cursor-se-resize"
              onMouseDown={handleResizeMouseDown}
            >
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-4 border-l-transparent border-b-4 border-b-white/60"></div>
            </div>
          )}
        </div>
      )}

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>

          {/* Video Button */}
          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-full transition-colors ${
              !isVideoEnabled
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title={!isVideoEnabled ? "Enable Video" : "Disable Video"}
          >
            {!isVideoEnabled ? (
              <VideoOff className="h-6 w-6" />
            ) : (
              <Video className="h-6 w-6" />
            )}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={onToggleScreenShare}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title={isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
          >
            <Monitor className="h-6 w-6" />
          </button>

          {/* Recording Button */}
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`p-3 rounded-full transition-colors ${
              isRecording
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? (
              <Square className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            title="End Call"
          >
            <Phone className="h-6 w-6 rotate-135" />
          </button>
        </div>
      </div>

      {/* Participant Count Badge */}
      <div className="absolute top-20 right-4 bg-black bg-opacity-75 text-white text-xs px-3 py-2 rounded-full">
        {1 + remoteStreams.size} participant
        {1 + remoteStreams.size !== 1 ? "s" : ""}
      </div>

      {/* Connection Diagnostics */}
      {connectionDiagnostics && (
        <div
          className="absolute top-20 left-4 max-w-sm z-30
        "
        >
          <ConnectionDiagnosticsComponent
            diagnostics={connectionDiagnostics}
            className="bg-white/90 backdrop-blur-sm"
          />
        </div>
      )}
    </div>
  );
};

export default VideoCall;
