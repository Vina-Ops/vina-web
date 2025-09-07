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
import { CallParticipant, NetworkStats, ConnectionDiagnostics } from "@/hooks/usePeerVideoCall";
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

  // Calculate video layout based on participant count
  const getVideoLayout = () => {
    const totalParticipants = 1 + remoteStreams.size; // Local + remote

    if (totalParticipants === 1) {
      return "grid-cols-1";
    } else if (totalParticipants === 2) {
      return "grid-cols-2";
    } else if (totalParticipants <= 4) {
      return "grid-cols-2";
    } else if (totalParticipants <= 6) {
      return "grid-cols-3";
    } else {
      return "grid-cols-4";
    }
  };

  // Get video size classes based on participant count
  const getVideoSizeClasses = () => {
    const totalParticipants = 1 + remoteStreams.size;

    if (totalParticipants === 1) {
      return "h-full w-full";
    } else if (totalParticipants === 2) {
      return "h-full w-full";
    } else if (totalParticipants <= 4) {
      return "h-64 w-full";
    } else if (totalParticipants <= 6) {
      return "h-48 w-full";
    } else {
      return "h-40 w-full";
    }
  };

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

      {/* Video Grid */}
      <div
        className={`grid ${getVideoLayout()} gap-2 h-full p-4 ${
          callDuration > 0 ? "pt-32" : "pt-20"
        }`}
      >
        {/* Local Video */}
        <div
          className={`relative ${getVideoSizeClasses()} bg-gray-900 rounded-lg overflow-hidden`}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => {
              console.log("VideoCall: Local video metadata loaded");
              console.log(
                "VideoCall: Local video readyState:",
                localVideoRef.current?.readyState
              );
              console.log(
                "VideoCall: Local video videoWidth:",
                localVideoRef.current?.videoWidth
              );
              console.log(
                "VideoCall: Local video videoHeight:",
                localVideoRef.current?.videoHeight
              );
            }}
            onCanPlay={() => {
              console.log("VideoCall: Local video can play");
            }}
            onError={(e) => {
              console.error("VideoCall: Local video error:", e);
            }}
          />
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            You {isMuted && "🔇"} {!isVideoEnabled && "📷❌"}
          </div>
          {isScreenSharing && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              🖥️ Screen
            </div>
          )}
        </div>

        {/* Remote Videos */}
        {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
          const participant = participants.find((p) => p.id === userId);
          return (
            <div
              key={userId}
              className={`relative ${getVideoSizeClasses()} bg-gray-800 rounded-lg overflow-hidden`}
            >
              <video
                ref={(el) => {
                  if (el) remoteVideoRefs.current.set(userId, el);
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {participant?.name || "Unknown"}
              </div>
            </div>
          );
        })}
      </div>

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
        <div className="absolute top-20 left-4 max-w-sm">
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
