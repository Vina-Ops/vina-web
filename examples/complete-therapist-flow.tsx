"use client";

import React, { useState, useEffect } from "react";
import { useChatVideoCall } from "@/hooks/useChatVideoCall";
import { getTherapists, chatWithTherapist } from "@/services/general-service";
import VideoCall from "@/components/chat/VideoCall";
import IncomingCall from "@/components/chat/IncomingCall";
import { CallParticipant } from "@/services/video-call-service";

// Complete flow: Find Therapist → Create Chat → Connect WS → Video Call
export default function CompleteTherapistFlow() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [currentUserId] = useState("user-123");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Video call hook with complete integration
  const {
    callState,
    remoteStreams,
    incomingCall,
    currentRoomId,
    isConnecting,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    createChatRoom,
    connectToExistingRoom,
  } = useChatVideoCall({
    currentUserId,
    therapistId: selectedTherapist?.id,
    roomId: roomId || undefined,
  });

  // Step 1: Load therapists
  useEffect(() => {
    const loadTherapists = async () => {
      try {
        const therapistList = await getTherapists();
        setTherapists(therapistList);
      } catch (error) {
        console.error("Failed to load therapists:", error);
      }
    };

    loadTherapists();
  }, []);

  // Step 2: Create chat room when therapist is selected
  const handleSelectTherapist = async (therapist: any) => {
    setSelectedTherapist(therapist);
    setIsLoading(true);

    try {
      // Create chat room via API
      const newRoomId = await createChatRoom(therapist.id);
      setRoomId(newRoomId);

      console.log(`✅ Chat room created: ${newRoomId}`);
      console.log(
        `✅ WebSocket connected: wss://vina-ai.onrender.com/safe-space/${newRoomId}`
      );
    } catch (error) {
      console.error("Failed to create chat room:", error);
      alert("Failed to create chat room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Start video call
  const handleStartVideoCall = async () => {
    if (!selectedTherapist || !currentRoomId) {
      alert("Please select a therapist first");
      return;
    }

    const participants: CallParticipant[] = [
      {
        id: selectedTherapist.id,
        name: `${selectedTherapist.first_name} ${selectedTherapist.last_name}`,
        avatar:
          selectedTherapist.avatar || "https://example.com/default-avatar.jpg",
        isTherapist: true,
        isMuted: false,
        isVideoEnabled: true,
      },
    ];

    try {
      const success = await startCall(participants);
      if (success) {
        setShowVideoCall(true);
        console.log("✅ Video call started successfully");
      } else {
        alert(
          "Failed to start video call. Please check your camera and microphone permissions."
        );
      }
    } catch (error) {
      console.error("Error starting video call:", error);
      alert("Failed to start video call. Please try again.");
    }
  };

  const handleAcceptCall = async () => {
    try {
      const success = await acceptCall();
      if (success) {
        setShowVideoCall(true);
      }
    } catch (error) {
      console.error("Error accepting call:", error);
      alert("Failed to accept call. Please try again.");
    }
  };

  const handleRejectCall = () => {
    rejectCall();
  };

  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
    endCall();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Complete Therapist Flow
        </h1>

        {/* Step 1: Find Therapist */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Find Therapist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedTherapist?.id === therapist.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleSelectTherapist(therapist)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      therapist.avatar ||
                      "https://example.com/default-avatar.jpg"
                    }
                    alt={`${therapist.first_name} ${therapist.last_name}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">
                      {therapist.first_name} {therapist.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {therapist.specialization}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Chat Room Status */}
        {selectedTherapist && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Step 2: Chat Room Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Selected Therapist:</span>
                <span className="font-medium">
                  {selectedTherapist.first_name} {selectedTherapist.last_name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Room ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {currentRoomId || "Not created yet"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">WebSocket Status:</span>
                <div className="flex items-center space-x-2">
                  {isConnecting && (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-sm">Connecting...</span>
                    </div>
                  )}
                  {currentRoomId && !isConnecting && (
                    <span className="text-green-600 text-sm">✅ Connected</span>
                  )}
                  {!currentRoomId && !isConnecting && (
                    <span className="text-gray-400 text-sm">Not connected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Video Call Controls */}
        {selectedTherapist && currentRoomId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Video Call</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleStartVideoCall}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Start Video Call
              </button>

              {callState.isCallActive && (
                <button
                  onClick={handleCloseVideoCall}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                >
                  End Call
                </button>
              )}
            </div>

            {callState.isCallActive && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Call Controls:</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleMute}
                    className={`px-4 py-2 rounded ${
                      callState.isMuted
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {callState.isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    onClick={toggleVideo}
                    className={`px-4 py-2 rounded ${
                      !callState.isVideoEnabled
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {callState.isVideoEnabled
                      ? "Turn Off Video"
                      : "Turn On Video"}
                  </button>
                  <button
                    onClick={toggleScreenShare}
                    className={`px-4 py-2 rounded ${
                      callState.isScreenSharing
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {callState.isScreenSharing
                      ? "Stop Sharing"
                      : "Share Screen"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Flow Summary */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            Flow Summary
          </h2>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>Find and select a therapist from the list</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>
                API creates chat room: POST
                /therapy-chat-rooms/create-by-client/{selectedTherapist?.id}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>
                WebSocket connects: wss://your-base-url/safe-space/
                {currentRoomId}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>
                Video call uses the same WebSocket connection for signaling
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Component */}
      <VideoCall
        isOpen={showVideoCall}
        onClose={handleCloseVideoCall}
        participants={
          selectedTherapist
            ? [
                {
                  id: selectedTherapist.id,
                  name: `${selectedTherapist.first_name} ${selectedTherapist.last_name}`,
                  avatar:
                    selectedTherapist.avatar ||
                    "https://example.com/default-avatar.jpg",
                  isTherapist: true,
                  isMuted: false,
                  isVideoEnabled: true,
                },
              ]
            : []
        }
        currentUserId={currentUserId}
      />

      {/* Incoming Call Component */}
      <IncomingCall
        isVisible={incomingCall.isVisible}
        caller={incomingCall.caller!}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </div>
  );
}


