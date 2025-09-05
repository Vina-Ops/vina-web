"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePeerVideoCall } from "@/hooks/usePeerVideoCall";
import VideoCall from "@/components/chat/VideoCall";
import IncomingCall from "@/components/chat/IncomingCall";
import { CallParticipant } from "@/hooks/usePeerVideoCall";

// Example of how to integrate video calls with your chat room system
export default function ChatRoomWithVideoCall() {
  const [messages, setMessages] = useState<any[]>([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentUserId] = useState("user-123");
  const [therapistId] = useState("therapist-456");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use the integrated video call hook
  const {
    callState,
    localStream,
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
    startRecording,
    stopRecording,
    createChatRoom,
    connectToExistingRoom,
  } = usePeerVideoCall({
    currentUserId,
    roomId: roomId || undefined,
  });

  // Initialize chat room when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      if (!roomId && therapistId) {
        try {
          setIsLoading(true);
          const newRoomId = await createChatRoom(therapistId);
          setRoomId(newRoomId);
          console.log("Chat room created with ID:", newRoomId);
        } catch (error) {
          console.error("Failed to initialize chat:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeChat();
  }, [therapistId, roomId, createChatRoom]);

  const handleStartVideoCall = async () => {
    const participants: CallParticipant[] = [
      {
        id: therapistId,
        name: "Dr. Sarah Johnson",
        avatar: "https://example.com/avatar.jpg",
        isTherapist: true,
        isMuted: false,
        isVideoEnabled: true,
      },
    ];

    try {
      const success = await startCall(participants);
      if (success) {
        setShowVideoCall(true);
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

  const sendMessage = (content: string) => {
    // This would integrate with your existing chat system
    const message = {
      id: Date.now().toString(),
      content,
      from: currentUserId,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating chat room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Chat with Therapist</h1>
            {currentRoomId && (
              <p className="text-sm text-gray-500">Room ID: {currentRoomId}</p>
            )}
          </div>
          <div className="flex space-x-2">
            {isConnecting && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Connecting...</span>
              </div>
            )}
            <button
              onClick={handleStartVideoCall}
              disabled={isConnecting || !currentRoomId}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Start Video Call
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id || `msg-${index}`}
                className={`flex ${
                  message.from === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.from === currentUserId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector("input");
                if (input && input.value.trim()) {
                  sendMessage(input.value);
                  input.value = "";
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Video Call Component */}
      <VideoCall
        isOpen={showVideoCall}
        onClose={handleCloseVideoCall}
        participants={[
          {
            id: therapistId,
            name: "Dr. Sarah Johnson",
            avatar: "https://example.com/avatar.jpg",
            isTherapist: true,
            isMuted: false,
            isVideoEnabled: true,
          },
        ]}
        currentUserId={currentUserId}
        localStream={localStream}
        remoteStreams={remoteStreams}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        isMuted={callState.isMuted}
        isVideoEnabled={callState.isVideoEnabled}
        isScreenSharing={callState.isScreenSharing}
        isRecording={callState.isRecording}
        callDuration={callState.callDuration}
        recordingDuration={callState.recordingDuration}
        networkStats={{
          bitrate: 0,
          packetLoss: 0,
          latency: 0,
          resolution: "0x0",
          frameRate: 0,
        }}
        // Ringing overlay props
        isCallOutgoing={callState.isCallOutgoing}
        isCallIncoming={callState.isCallIncoming}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
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
