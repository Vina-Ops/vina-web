import { useState, useEffect, useCallback } from "react";
import {
  videoCallService,
  VideoCallState,
  CallParticipant,
} from "@/services/video-call-service";
import { chatWithTherapist } from "@/services/general-service";

interface UseChatVideoCallProps {
  currentUserId: string;
  therapistId?: string;
  roomId?: string;
  chatSocket?: any; // Optional existing chat socket
  token?: string; // Optional authentication token
}

export const useChatVideoCall = ({
  currentUserId,
  therapistId,
  roomId,
  chatSocket,
  token,
}: UseChatVideoCallProps) => {
  const [callState, setCallState] = useState<VideoCallState>(
    videoCallService.getState()
  );
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [incomingCall, setIncomingCall] = useState<{
    isVisible: boolean;
    caller: CallParticipant | null;
  }>({
    isVisible: false,
    caller: null,
  });
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(
    roomId || null
  );
  const [isConnecting, setIsConnecting] = useState(false);

  // Create chat room and connect to WebSocket
  const createChatRoom = useCallback(
    async (therapistId: string) => {
      try {
        setIsConnecting(true);

        // Create chat room via API
        const response = await chatWithTherapist(therapistId);
        const newRoomId = response.data?.id || response.room_id || response.id; // Adjust based on your API response

        if (!newRoomId) {
          throw new Error("Failed to get room ID from API response");
        }

        setCurrentRoomId(newRoomId);

        // Connect to the chat room WebSocket
        videoCallService.connectToChatRoom(newRoomId, currentUserId, token);

        return newRoomId;
      } catch (error) {
        console.error("Failed to create chat room:", error);
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    [currentUserId]
  );

  // Connect to existing chat room
  const connectToExistingRoom = useCallback(
    (roomId: string) => {
      setCurrentRoomId(roomId);
      videoCallService.connectToChatRoom(roomId, currentUserId, token);
    },
    [currentUserId, token]
  );

  useEffect(() => {
    // If we have an existing chat socket, use it
    if (chatSocket) {
      videoCallService.setSocket(chatSocket);
      return;
    }

    // If we have a room ID, connect to it
    if (roomId) {
      connectToExistingRoom(roomId);
    }

    // Set up event listeners
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

    const handleCallIncoming = (data: {
      from: string;
      participant: CallParticipant;
    }) => {
      setIncomingCall({ isVisible: true, caller: data.participant });
    };

    const handleCallStarted = () => {
      setCallState(videoCallService.getState());
    };

    const handleCallEnded = () => {
      setCallState(videoCallService.getState());
      setRemoteStreams(new Map());
    };

    const handleCallRejected = () => {
      setIncomingCall({ isVisible: false, caller: null });
    };

    // Register event listeners
    videoCallService.on("call-started", handleCallStarted);
    videoCallService.on("call-ended", handleCallEnded);
    videoCallService.on("call-incoming", handleCallIncoming);
    videoCallService.on("call-rejected", handleCallRejected);
    videoCallService.on("remote-stream", handleRemoteStream);
    videoCallService.on("mute-toggled", handleCallStateChange);
    videoCallService.on("video-toggled", handleCallStateChange);
    videoCallService.on("screen-share-started", handleCallStateChange);
    videoCallService.on("screen-share-stopped", handleCallStateChange);

    return () => {
      // Clean up event listeners
      videoCallService.off("call-started", handleCallStarted);
      videoCallService.off("call-ended", handleCallEnded);
      videoCallService.off("call-incoming", handleCallIncoming);
      videoCallService.off("call-rejected", handleCallRejected);
      videoCallService.off("remote-stream", handleRemoteStream);
      videoCallService.off("mute-toggled", handleCallStateChange);
      videoCallService.off("video-toggled", handleCallStateChange);
      videoCallService.off("screen-share-started", handleCallStateChange);
      videoCallService.off("screen-share-stopped", handleCallStateChange);
    };
  }, [chatSocket, roomId, connectToExistingRoom]);

  const startCall = useCallback(
    async (participants: CallParticipant[]) => {
      // If we don't have a room ID and we have a therapist ID, create a room first
      if (!currentRoomId && therapistId) {
        try {
          await createChatRoom(therapistId);
        } catch (error) {
          console.error("Failed to create chat room for video call:", error);
          return false;
        }
      }

      const success = await videoCallService.startCall(
        participants,
        currentRoomId || undefined
      );
      return success;
    },
    [currentRoomId, therapistId, createChatRoom]
  );

  const acceptCall = useCallback(async () => {
    const success = await videoCallService.acceptCall();
    if (success) {
      setIncomingCall({ isVisible: false, caller: null });
    }
    return success;
  }, []);

  const rejectCall = useCallback(() => {
    videoCallService.rejectCall();
    setIncomingCall({ isVisible: false, caller: null });
  }, []);

  const endCall = useCallback(() => {
    videoCallService.endCall();
  }, []);

  const toggleMute = useCallback(() => {
    videoCallService.toggleMute();
  }, []);

  const toggleVideo = useCallback(() => {
    videoCallService.toggleVideo();
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (callState.isScreenSharing) {
      videoCallService.stopScreenShare();
    } else {
      const success = await videoCallService.startScreenShare();
      if (!success) {
        throw new Error("Failed to start screen sharing");
      }
    }
  }, [callState.isScreenSharing]);

  const getLocalStream = useCallback(() => {
    return videoCallService.getLocalStream();
  }, []);

  return {
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
    getLocalStream,
    createChatRoom,
    connectToExistingRoom,
  };
};
