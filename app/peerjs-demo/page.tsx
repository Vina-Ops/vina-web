"use client";

import React, { useState } from "react";
import { usePeerVideoCall, CallParticipant } from "@/hooks/usePeerVideoCall";
import { useUser } from "@/context/user-context";
import VideoCall from "@/components/chat/VideoCall";
import IncomingCall from "@/components/chat/IncomingCall";
import PeerConnectionDebug from "@/components/debug/PeerConnectionDebug";

export default function PeerJSDemoPage() {
  const { user } = useUser();
  const [targetPeerId, setTargetPeerId] = useState("");
  const [demoParticipants, setDemoParticipants] = useState<CallParticipant[]>([
    {
      id: "demo-therapist",
      name: "Demo Therapist",
      avatar:
        "https://ui-avatars.com/api/?name=Demo+Therapist&background=EAF7F0&color=013F25",
      isTherapist: true,
      isMuted: false,
      isVideoEnabled: true,
    },
  ]);

  const {
    callState,
    localStream,
    remoteStreams,
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
  } = usePeerVideoCall({
    currentUserId: (user as any)?.id || "demo-user",
    roomId: "demo-room",
  });

  const handleStartCall = async () => {
    if (!targetPeerId.trim()) {
      alert("Please enter a target peer ID");
      return;
    }

    // Update demo participants with the target peer ID
    const updatedParticipants = [
      {
        ...demoParticipants[0],
        id: targetPeerId,
        name: `Peer: ${targetPeerId}`,
      },
    ];
    setDemoParticipants(updatedParticipants);

    try {
      const success = await startCall(updatedParticipants);
      if (success) {
        console.log("Call started successfully");
      } else {
        console.error("Failed to start call");
      }
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleStartLocalCall = async () => {
    // Start a call to yourself for testing
    const selfParticipant = [
      {
        id: (user as any)?.id || "demo-user",
        name: "Self (Test)",
        avatar:
          "https://ui-avatars.com/api/?name=Self+Test&background=EAF7F0&color=013F25",
        isTherapist: false,
        isMuted: false,
        isVideoEnabled: true,
      },
    ];

    try {
      const success = await startCall(selfParticipant);
      if (success) {
        console.log("Local call started successfully");
      } else {
        console.error("Failed to start local call");
      }
    } catch (error) {
      console.error("Error starting local call:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            PeerJS Video Call Demo
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demo Controls */}
            <div className="space-y-6">
              {/* Debug Component */}
              <PeerConnectionDebug roomId="demo-room" />
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  How to Test
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                  <li>Open this page in two different browser tabs/windows</li>
                  <li>Note your Peer ID from the status below</li>
                  <li>
                    In the other tab, enter your Peer ID and click "Start Call"
                  </li>
                  <li>Accept the incoming call</li>
                  <li>Test video, audio, and screen sharing</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Call Controls
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Peer ID:
                  </label>
                  <input
                    type="text"
                    value={targetPeerId}
                    onChange={(e) => setTargetPeerId(e.target.value)}
                    placeholder="Enter peer ID to call"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleStartCall}
                    disabled={!targetPeerId.trim() || isConnecting}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? "Connecting..." : "Start Call"}
                  </button>

                  <button
                    onClick={handleStartLocalCall}
                    disabled={isConnecting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Test Local Call
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Call Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`font-medium ${
                        callState.isInCall ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {callState.isInCall ? "In Call" : "Idle"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Call Active:
                    </span>
                    <span
                      className={
                        callState.isCallActive
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {callState.isCallActive ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Duration:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {callState.callDuration}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Muted:
                    </span>
                    <span
                      className={
                        callState.isMuted ? "text-red-600" : "text-green-600"
                      }
                    >
                      {callState.isMuted ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Video:
                    </span>
                    <span
                      className={
                        callState.isVideoEnabled
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {callState.isVideoEnabled ? "On" : "Off"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Screen Share:
                    </span>
                    <span
                      className={
                        callState.isScreenSharing
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {callState.isScreenSharing ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {callState.isInCall && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Call Controls
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={toggleMute}
                      className={`px-4 py-2 rounded-md ${
                        callState.isMuted
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-gray-600 hover:bg-gray-700 text-white"
                      }`}
                    >
                      {callState.isMuted ? "Unmute" : "Mute"}
                    </button>
                    <button
                      onClick={toggleVideo}
                      className={`px-4 py-2 rounded-md ${
                        callState.isVideoEnabled
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {callState.isVideoEnabled ? "Stop Video" : "Start Video"}
                    </button>
                    <button
                      onClick={toggleScreenShare}
                      className={`px-4 py-2 rounded-md ${
                        callState.isScreenSharing
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {callState.isScreenSharing
                        ? "Stop Share"
                        : "Share Screen"}
                    </button>
                    <button
                      onClick={endCall}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      End Call
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Video Streams
              </h3>

              {/* Local Video */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Local Video
                </h4>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <video
                    ref={(video) => {
                      if (video && getLocalStream()) {
                        video.srcObject = getLocalStream();
                      }
                    }}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>

              {/* Remote Video */}
              {remoteStreams.size > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Remote Video
                  </h4>
                  {Array.from(remoteStreams.entries()).map(
                    ([peerId, stream]) => (
                      <div
                        key={peerId}
                        className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-3"
                      >
                        <video
                          ref={(video) => {
                            if (video) {
                              video.srcObject = stream;
                            }
                          }}
                          autoPlay
                          playsInline
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-2 text-xs text-gray-600 dark:text-gray-400">
                          Peer: {peerId}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {remoteStreams.size === 0 && callState.isInCall && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    Waiting for remote video stream...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Component */}
      {callState.isInCall && (
        <VideoCall
          isOpen={callState.isInCall}
          onClose={() => endCall()}
          participants={Array.from(remoteStreams.keys()).map((userId) => ({
            id: userId,
            name: `Peer ${userId}`,
            avatar:
              "https://ui-avatars.com/api/?name=Peer&background=EAF7F0&color=013F25",
            isTherapist: false,
            isMuted: false,
            isVideoEnabled: true,
          }))}
          currentUserId={(user as any)?.id || "demo-user"}
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
          networkStats={networkStats}
          // Ringing overlay props
          isCallOutgoing={callState.isCallOutgoing}
          isCallIncoming={callState.isCallIncoming}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Incoming Call Component */}
      {incomingCall.isVisible && incomingCall.caller && (
        <IncomingCall
          isVisible={incomingCall.isVisible}
          caller={incomingCall.caller}
          onAccept={() => acceptCall()}
          onReject={() => rejectCall()}
        />
      )}
    </div>
  );
}
