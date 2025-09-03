"use client";

import React, { useState } from "react";
import { Video, Phone, PhoneOff } from "lucide-react";
import VideoCall from "./VideoCall";
import IncomingCall from "./IncomingCall";
import { CallParticipant } from "@/hooks/usePeerVideoCall";

export default function VideoCallDemo() {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);

  const mockParticipants: CallParticipant[] = [
    {
      id: "therapist-1",
      name: "Dr. Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      isTherapist: true,
      isMuted: false,
      isVideoEnabled: true,
    },
    {
      id: "therapist-2",
      name: "Dr. Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      isTherapist: true,
      isMuted: false,
      isVideoEnabled: true,
    },
  ];

  const mockCaller: CallParticipant = {
    id: "therapist-1",
    name: "Dr. Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    isTherapist: true,
    isMuted: false,
    isVideoEnabled: true,
  };

  const handleStartCall = () => {
    setShowVideoCall(true);
  };

  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
  };

  const handleShowIncomingCall = () => {
    setShowIncomingCall(true);
  };

  const handleAcceptCall = () => {
    setShowIncomingCall(false);
    setShowVideoCall(true);
  };

  const handleRejectCall = () => {
    setShowIncomingCall(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Video Call Demo
      </h2>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Features
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Real-time video and audio communication</li>
            <li>• Screen sharing capability</li>
            <li>• Mute/unmute and video toggle</li>
            <li>• Incoming call notifications</li>
            <li>• Call duration tracking</li>
            <li>• Minimize/maximize call window</li>
            <li>• Device settings panel</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleStartCall}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Video className="h-5 w-5" />
            <span>Start Video Call</span>
          </button>

          <button
            onClick={handleShowIncomingCall}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>Simulate Incoming Call</span>
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Instructions
          </h4>
          <ol className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
            <li>1. Click "Start Video Call" to initiate a video call</li>
            <li>2. Click "Simulate Incoming Call" to see incoming call UI</li>
            <li>
              3. Use the call controls to test mute, video, and screen sharing
            </li>
            <li>4. Try minimizing the call window</li>
            <li>5. Check the settings panel for device selection</li>
          </ol>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
            Note
          </h4>
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            This is a demo implementation. In a real application, you would
            need:
            <br />• A WebSocket server for signaling
            <br />• Proper user authentication
            <br />• HTTPS for WebRTC to work
            <br />• Camera and microphone permissions
          </p>
        </div>
      </div>

      {/* Video Call Component */}
      <VideoCall
        isOpen={showVideoCall}
        onClose={handleCloseVideoCall}
        participants={mockParticipants}
        currentUserId="demo-user-id"
        localStream={null}
        remoteStreams={new Map()}
        onToggleMute={() => {}}
        onToggleVideo={() => {}}
        onToggleScreenShare={() => {}}
        onStartRecording={() => {}}
        onStopRecording={() => {}}
        isMuted={false}
        isVideoEnabled={true}
        isScreenSharing={false}
        isRecording={false}
        callDuration={0}
        recordingDuration={0}
        networkStats={{
          bitrate: 0,
          packetLoss: 0,
          latency: 0,
          resolution: "0x0",
          frameRate: 0,
        }}
        // Ringing overlay props
        isCallOutgoing={false}
        isCallIncoming={false}
        onAccept={() => {}}
        onReject={() => {}}
      />

      {/* Incoming Call Component */}
      <IncomingCall
        isVisible={showIncomingCall}
        caller={mockCaller}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </div>
  );
}
