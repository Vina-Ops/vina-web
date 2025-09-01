"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Settings,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  videoCallService,
  VideoCallState,
  CallParticipant,
} from "@/services/video-call-service";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participants: CallParticipant[];
  currentUserId: string;
}

export default function VideoCall({
  isOpen,
  onClose,
  participants,
  currentUserId,
}: VideoCallProps) {
  const [callState, setCallState] = useState<VideoCallState>(
    videoCallService.getState()
  );
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    if (!isOpen) return;

    videoCallService.initializeSocket(currentUserId, "chat-room-id");

    const handleCallStateChange = () => {
      setCallState(videoCallService.getState());
    };

    const handleRemoteStream = ({
      userId,
      stream,
    }: {
      userId: string;
      stream: MediaStream;
    }) => {
      setRemoteStreams((prev) => new Map(prev.set(userId, stream)));
    };

    const handleCallStarted = () => {
      setCallState(videoCallService.getState());
    };

    const handleCallEnded = () => {
      setCallState(videoCallService.getState());
      onClose();
    };

    videoCallService.on("call-started", handleCallStarted);
    videoCallService.on("call-ended", handleCallEnded);
    videoCallService.on("remote-stream", handleRemoteStream);
    videoCallService.on("mute-toggled", handleCallStateChange);
    videoCallService.on("video-toggled", handleCallStateChange);
    videoCallService.on("screen-share-started", handleCallStateChange);
    videoCallService.on("screen-share-stopped", handleCallStateChange);

    return () => {
      videoCallService.off("call-started", handleCallStarted);
      videoCallService.off("call-ended", handleCallEnded);
      videoCallService.off("remote-stream", handleRemoteStream);
      videoCallService.off("mute-toggled", handleCallStateChange);
      videoCallService.off("video-toggled", handleCallStateChange);
      videoCallService.off("screen-share-started", handleCallStateChange);
      videoCallService.off("screen-share-stopped", handleCallStateChange);
    };
  }, [isOpen, currentUserId, onClose]);

  useEffect(() => {
    const localStream = videoCallService.getLocalStream();
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [callState.isCallActive]);

  useEffect(() => {
    remoteStreams.forEach((stream, userId) => {
      const videoElement = remoteVideoRefs.current.get(userId);
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  const handleStartCall = async () => {
    const success = await videoCallService.startCall(participants);
    if (!success) {
      alert(
        "Failed to start call. Please check your camera and microphone permissions."
      );
    }
  };

  const handleEndCall = () => {
    videoCallService.endCall();
    onClose();
  };

  const handleToggleMute = () => {
    videoCallService.toggleMute();
  };

  const handleToggleVideo = () => {
    videoCallService.toggleVideo();
  };

  const handleToggleScreenShare = async () => {
    if (callState.isScreenSharing) {
      videoCallService.stopScreenShare();
    } else {
      const success = await videoCallService.startScreenShare();
      if (!success) {
        alert("Failed to start screen sharing. Please check your permissions.");
      }
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const formatCallDuration = (seconds: number): string => {
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

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Video Call Active
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatCallDuration(callState.callDuration)}
              </p>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Video Call
            </h3>
            {callState.isCallActive && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatCallDuration(callState.callDuration)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-gray-900 overflow-hidden">
          {!callState.isCallActive ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Start Video Call
                </h3>
                <p className="text-gray-400 mb-6">
                  Call with {participants.length} participant
                  {participants.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={handleStartCall}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
                >
                  <Phone className="h-5 w-5" />
                  <span>Start Call</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!callState.isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <VideoOff className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-sm">Camera Off</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  You
                </div>
              </div>

              {/* Remote Videos */}
              {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
                const participant = participants.find((p) => p.id === userId);
                return (
                  <div
                    key={userId}
                    className="relative bg-gray-800 rounded-lg overflow-hidden"
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
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleToggleMute}
              className={`p-3 rounded-full ${
                callState.isMuted
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } hover:opacity-80`}
            >
              {callState.isMuted ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={handleToggleVideo}
              className={`p-3 rounded-full ${
                !callState.isVideoEnabled
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } hover:opacity-80`}
            >
              {callState.isVideoEnabled ? (
                <Video className="h-6 w-6" />
              ) : (
                <VideoOff className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={handleToggleScreenShare}
              className={`p-3 rounded-full ${
                callState.isScreenSharing
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } hover:opacity-80`}
            >
              {callState.isScreenSharing ? (
                <MonitorOff className="h-6 w-6" />
              ) : (
                <Monitor className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={handleToggleSpeaker}
              className={`p-3 rounded-full ${
                isSpeakerOn
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  : "bg-red-600 text-white"
              } hover:opacity-80`}
            >
              {isSpeakerOn ? (
                <Volume2 className="h-6 w-6" />
              ) : (
                <VolumeX className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={handleEndCall}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-64">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Call Settings
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Camera
                </label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Default Camera</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Microphone
                </label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Default Microphone</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Speaker
                </label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Default Speaker</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
