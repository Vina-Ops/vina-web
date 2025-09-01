"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  File,
  X,
} from "lucide-react";
import VideoCall from "@/components/chat/VideoCall";
import IncomingCall from "@/components/chat/IncomingCall";
import { useChatVideoCall } from "@/hooks/useChatVideoCall";
import { CallParticipant } from "@/services/video-call-service";
import { useUser } from "@/context/user-context";
import { fetchToken } from "@/helpers/get-token";
import {
  getTherapistByUuid,
  getMyTherapySessions,
} from "@/services/general-service";
import { User } from "iconsax-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "therapist" | "ai";
  timestamp: string;
  type: "text" | "image" | "file" | "audio";
  isRead: boolean;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isTherapist: boolean;
  specialization?: string;
  lastSeen: string;
}

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useUser();
  const [tokens, setTokens] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [therapist, setTherapist] = useState<ChatParticipant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const chatId = params?.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Video call integration with complete flow
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
    currentUserId: (user as any)?.id || "", // Type assertion for user ID
    roomId: chatId, // Use the chat room ID from URL
    token: tokens || undefined, // Add token for authentication
  });

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => ({
    ...item,
    isActive: item.href
      ? pathname === item.href || pathname?.startsWith(item.href)
      : false,
  }));

  // Fetch token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await fetchToken();
        setTokens(token);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };
    getToken();
  }, []);

  // Fetch therapist information
  useEffect(() => {
    const fetchTherapistInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get the therapy sessions to find the therapist ID for this chat room
        console.log(
          "Fetching therapy sessions to find therapist for room:",
          chatId
        );
        const sessions = await getMyTherapySessions();
        console.log("All therapy sessions:", sessions);

        // Find the session that matches our chat room ID
        const currentSession = sessions.find(
          (session) => session.room_id === chatId
        );

        if (!currentSession) {
          throw new Error("Chat room not found in therapy sessions");
        }

        console.log("Found current session:", currentSession);
        const therapistId = currentSession.therapist.id;
        console.log("Therapist ID from session:", therapistId);

        // Now fetch the therapist details using the correct therapist ID
        const therapistData = await getTherapistByUuid(therapistId);
        console.log("Therapist data received:", therapistData);

        if (!therapistData || !therapistData.id) {
          throw new Error("Invalid therapist data received");
        }

        // Construct name from various possible fields
        let therapistName = "";
        if (therapistData.first_name || therapistData.last_name) {
          therapistName = `${therapistData.first_name || ""} ${
            therapistData.last_name || ""
          }`.trim();
        } else if (therapistData.name) {
          therapistName = therapistData.name;
        } else if (therapistData.full_name) {
          therapistName = therapistData.full_name;
        }

        if (!therapistName) {
          throw new Error("Therapist name not found in data");
        }

        const therapistInfo: ChatParticipant = {
          id: therapistData.id,
          name: therapistName,
          avatar:
            therapistData.profile_image ||
            therapistData.image_url ||
            therapistData.avatar ||
            "",
          isOnline: true, // You might want to get this from WebSocket
          isTherapist: true,
          specialization:
            therapistData.specialties?.join(", ") ||
            therapistData.specialization ||
            "",
          lastSeen: "2 minutes ago",
        };

        console.log("Processed therapist info:", therapistInfo);
        setTherapist(therapistInfo);
      } catch (err) {
        console.error("Failed to fetch therapist info:", err);
        setError("Failed to load therapist information");
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchTherapistInfo();
    }
  }, [chatId]);

  // WebSocket connection state
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  // WebSocket message handling
  useEffect(() => {
    if (!tokens || !chatId || !user) return;

    // Set up WebSocket connection for chat messages
    const baseUrl =
      process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://vina-ai.onrender.com";
    const wsUrl = `${baseUrl}/safe-space/${chatId}?userId=${
      (user as any)?.id
    }&roomId=${chatId}&token=${tokens}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to chat WebSocket");
      setWsConnection(ws);
      setWsConnected(true);
      // Send join room message
      ws.send(
        JSON.stringify({
          type: "join-room",
          data: { roomId: chatId },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "new-message":
            const newMessage: Message = {
              id: data.id || Date.now().toString(),
              content: data.content,
              sender: data.sender === (user as any)?.id ? "user" : "therapist",
              timestamp:
                data.timestamp ||
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              type: "text",
              isRead: data.sender === (user as any)?.id,
            };
            setMessages((prev) => [...prev, newMessage]);
            break;

          case "user-typing":
            setIsTyping(data.isTyping);
            break;

          case "user-joined":
            console.log("User joined chat:", data);
            break;

          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from chat WebSocket");
      setWsConnection(null);
      setWsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Connection error");
      setWsConnection(null);
      setWsConnected(false);
    };

    return () => {
      ws.close();
      setWsConnection(null);
    };
  }, [tokens, chatId, user]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (
      newMessage.trim() &&
      wsConnection &&
      wsConnection.readyState === WebSocket.OPEN
    ) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        isRead: false,
      };

      // Add message to local state immediately
      setMessages((prev) => [...prev, message]);

      // Send message via WebSocket
      const messageData = {
        type: "send-message",
        data: {
          roomId: chatId,
          content: newMessage,
          sender: (user as any)?.id,
          timestamp: new Date().toISOString(),
        },
      };

      wsConnection.send(JSON.stringify(messageData));
      console.log("Sent message via WebSocket:", messageData);

      setNewMessage("");
    } else if (!wsConnection) {
      console.warn("WebSocket not connected");
      setError("Connection lost. Please refresh the page.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = (type: "image" | "file" | "audio") => {
    // Handle file attachment
    // console.log("Attach", type);
    setShowAttachmentMenu(false);
  };

  const handleVoiceMessage = () => {
    // Handle voice message recording
    // console.log("Record voice message");
  };

  const handleStartVideoCall = async () => {
    if (!therapist) return;

    const participants: CallParticipant[] = [
      {
        id: therapist.id,
        name: therapist.name,
        avatar: therapist.avatar,
        isTherapist: therapist.isTherapist,
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Failed to load chat room data"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-green text-white rounded hover:bg-green/70"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <FixedNavbar
        navItems={updatedNavItems}
        showSearch={true}
        showConnectionStatus={true}
        showThemeToggle={true}
      />
      <div className="flex flex-col flex-1 md:ml-64">
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white ml-4 md:ml-0 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    {therapist?.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={therapist?.avatar}
                        alt={`${therapist?.name} avatar`}
                      />
                    ) : (
                      <div className="h-10 w-10 flex justify-center items-center rounded-full m-auto bg-green">
                        <User
                          className="h-7 w-7 text-white"
                          color="white"
                          variant="Bold"
                        />
                      </div>
                    )}
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                        therapist?.isOnline ? "bg-green-400" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {therapist?.name}
                    </h2>
                    {therapist?.isTherapist && therapist?.specialization && (
                      <p className="text-sm text-green dark:text-white">
                        {therapist.specialization}
                      </p>
                    )}

                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {therapist?.isOnline
                          ? "Online"
                          : "Last seen " + therapist?.lastSeen}
                      </p>

                      <p className="text-2xl px-0.5 w-px h-px py-0.5 bg-gray-600 text-white rounded-md"></p>

                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            wsConnected ? "bg-green" : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {wsConnected ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleStartVideoCall}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-green text-white"
                          : message.sender === "therapist"
                          ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-green-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.timestamp}
                        {message.sender === "user" && (
                          <span className="ml-2">
                            {message.isRead ? "✓✓" : "✓"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-end space-x-2">
                {/* Attachment Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  {showAttachmentMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
                      <button
                        onClick={() => handleAttachment("image")}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Image className="h-4 w-4" />
                        <span>Image</span>
                      </button>
                      <button
                        onClick={() => handleAttachment("file")}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <File className="h-4 w-4" />
                        <span>File</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0.5 focus:ring-green focus:border-green resize-none"
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                  />
                </div>

                {/* Emoji Picker */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Smile className="h-5 w-5" />
                </button>

                {/* Voice Message */}
                <button
                  onClick={handleVoiceMessage}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Mic className="h-5 w-5" />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-green text-white rounded-md hover:bg-green/70 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      "😊",
                      "😂",
                      "😍",
                      "🥰",
                      "😎",
                      "🤔",
                      "😢",
                      "😡",
                      "👍",
                      "👎",
                      "❤️",
                      "💔",
                      "🎉",
                      "🎂",
                      "🌹",
                      "☀️",
                    ].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Video Call Component */}
      {therapist && (
        <VideoCall
          isOpen={showVideoCall}
          onClose={handleCloseVideoCall}
          participants={[
            {
              id: therapist.id,
              name: therapist.name,
              avatar: therapist.avatar,
              isTherapist: therapist.isTherapist,
              isMuted: false,
              isVideoEnabled: true,
            },
          ]}
          currentUserId="current-user-id"
        />
      )}

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
