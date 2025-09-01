import { useState, useEffect, useCallback } from "react";
import {
  videoCallService,
  VideoCallState,
  CallParticipant,
} from "@/services/video-call-service";

export const useVideoCall = (currentUserId: string, chatId: string) => {
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

  useEffect(() => {
    // Initialize video call service
    videoCallService.initializeSocket(currentUserId, chatId);

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
  }, [currentUserId, chatId]);

  const startCall = useCallback(async (participants: CallParticipant[]) => {
    const success = await videoCallService.startCall(participants);
    return success;
  }, []);

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
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    getLocalStream,
  };
};

