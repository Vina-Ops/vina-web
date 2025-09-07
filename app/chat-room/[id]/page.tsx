"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  LogOut,
  Languages,
} from "lucide-react";
import VideoCall from "@/components/chat/VideoCall";
import IncomingCall from "@/components/chat/IncomingCall";
import { TranslationPanel } from "@/components/chat/TranslationPanel";
import { LanguageSelector } from "@/components/chat/LanguageSelector";
import { usePeerVideoCall, CallParticipant } from "@/hooks/usePeerVideoCall";
import { useUser } from "@/context/user-context";
import { fetchToken } from "@/helpers/get-token";
import {
  getTherapistByUuid,
  getMyTherapySessions,
} from "@/services/general-service";
import { User } from "iconsax-react";
import notificationSound from "@/utils/notification-sound";
import { useNotification } from "@/context/notification-context";
import { wsManager } from "@/utils/websocket-manager";
import { generateUniqueMessageId } from "@/utils/message-id-generator";
import { wsConnectionTracker } from "@/utils/websocket-connection-tracker";
import { wsMonitoringTracker } from "@/utils/websocket-monitoring-tracker";
import ConnectionStatus from "@/components/websocket/ConnectionStatus";

interface Message {
  id: string;
  content: string;
  sender: "user" | "therapist" | "ai";
  timestamp: string;
  type: "text" | "image" | "file" | "audio";
  isRead: boolean;
  status?: "sending" | "sent" | "delivered" | "failed";
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
  const { settings } = useNotification();
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
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [pendingMessages, setPendingMessages] = useState<Set<string>>(
    new Set()
  );
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [showTranslationPanel, setShowTranslationPanel] = useState(false);

  const chatId = params?.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Video call integration with complete flow
  const {
    callState,
    localStream,
    remoteStreams,
    incomingCall,
    isConnecting,
    currentPeerId,
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
    connectionDiagnostics,
  } = usePeerVideoCall({
    currentUserId: (user as any)?.id || "", // Type assertion for user ID
    roomId: chatId, // Use the chat room ID from URL
    userRole: "patient",
    sessionData: therapist
      ? {
          therapistName: therapist.name,
          patientName: (user as any)?.name || "Patient",
          therapistAvatar: therapist.avatar,
          patientAvatar:
            (user as any)?.avatar ||
            "https://ui-avatars.com/api/?name=Patient&background=E3F2FD&color=1976D2",
        }
      : undefined,
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
        console.log("🔑 Fetching token...");
        const token = await fetchToken();
        console.log("🔑 Token fetched:", token ? "✅ Present" : "❌ Missing");
        setTokens(token);
      } catch (error) {
        console.error("❌ Failed to fetch token:", error);
        setError("Failed to authenticate. Please refresh the page.");
      }
    };
    getToken();
  }, []);

  // Initialize PeerJS for incoming calls when chat room loads
  // This allows the user to receive video calls from the therapist
  useEffect(() => {
    if (user && chatId) {
      console.log(
        "🎯 Chat room loaded - PeerJS will auto-initialize for incoming calls"
      );
    }
  }, [user, chatId]);

  // Fetch therapist information
  useEffect(() => {
    const fetchTherapistInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const sessions = await getMyTherapySessions();

        // Find the session that matches our chat room ID
        const currentSession = sessions.find(
          (session) => session.room_id === chatId
        );

        if (!currentSession) {
          throw new Error("Chat room not found in therapy sessions");
        }

        const therapistId = currentSession.therapist.id;

        // Now fetch the therapist details using the correct therapist ID
        const therapistData = await getTherapistByUuid(therapistId);

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
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttemptsRef = useRef(5);

  // WebSocket connection function with enhanced reconnection logic
  const connectWebSocket = useCallback(
    (connectionId: string) => {
      console.log("🔌 Attempting WebSocket connection (User Side)...");
      console.log("🔌 Tokens:", tokens ? "✅ Present" : "❌ Missing");
      console.log("🔌 ChatId:", chatId ? "✅ Present" : "❌ Missing");
      console.log("🔌 User:", user ? "✅ Present" : "❌ Missing");

      if (!tokens || !chatId || !user) {
        console.log("❌ Cannot connect WebSocket - missing required data");
        return null;
      }

      // Don't create a new connection if one already exists and is open
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        console.log("🔄 WebSocket already connected, skipping new connection");
        return wsConnection;
      }

      // Set up WebSocket connection for chat messages
      const baseUrl =
        process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://vina-ai.onrender.com";
      const wsUrl = `${baseUrl}/safe-space/${chatId}?token=${tokens}`;

      console.log("Creating user WebSocket connection to:", wsUrl);

      // Create direct WebSocket connection (like therapist side) for better stability
      const ws = new WebSocket(wsUrl);

      // Set up event handlers
      ws.onopen = () => {
        console.log("✅ User WebSocket connected successfully");
        setWsConnection(ws);
        setWsConnected(true);
        setReconnectAttempts(0); // Reset reconnect attempts on successful connection
        reconnectAttemptsRef.current = 0; // Reset ref as well
        setError(null); // Clear any previous errors

        // Track this connection
        wsMonitoringTracker.trackConnection(
          connectionId,
          "user-chat",
          ws,
          wsUrl,
          {
            userId: user?.id,
            roomId: chatId,
            userType: "patient",
          }
        );

        // Start heartbeat to keep connection alive
        startHeartbeat(ws);

        // Broadcast current peer ID if available
        // Note: currentPeerId will be available from the hook once initialized
      };

      ws.onmessage = (event) => {
        // Message handler
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket received message:", data);
          console.log("Current user ID:", (user as any)?.id);
          console.log("Message sender:", data.sender);

          // Handle unified message format: { sender: "uuid", timestamp: time, content: "abc" }
          if (
            typeof data === "object" &&
            data !== null &&
            "content" in data &&
            "sender" in data &&
            "timestamp" in data
          ) {
            // Determine if the message is from the current user or the therapist
            const isFromCurrentUser = data.sender === (user as any)?.id;
            const messageSender = isFromCurrentUser ? "user" : "therapist";

            // Check if this message is already in our state (to prevent duplicates)
            setMessages((prevMessages) => {
              const isDuplicate = prevMessages.some(
                (msg) =>
                  msg.content === data.content &&
                  msg.sender === messageSender &&
                  Math.abs(
                    new Date(msg.timestamp).getTime() -
                      new Date(data.timestamp).getTime()
                  ) < 1000
              );

              console.log("Duplicate check:", {
                content: data.content,
                sender: messageSender,
                isFromCurrentUser,
                isDuplicate,
                existingMessages: prevMessages.length,
              });

              if (!isDuplicate) {
                const incoming: Message = {
                  id: data.id || generateUniqueMessageId(),
                  content: data.content,
                  sender: messageSender,
                  timestamp: data.timestamp || new Date().toISOString(),
                  type: "text",
                  status: "delivered",
                  isRead: isFromCurrentUser,
                };
                console.log("Adding new message:", incoming);
                return [...prevMessages, incoming];
              } else {
                console.log("Skipping duplicate message");
              }
              return prevMessages;
            });

            // If this is a confirmation of our own message, mark it as delivered
            if (isFromCurrentUser) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.content === data.content && msg.status === "sending"
                    ? { ...msg, status: "delivered" as const }
                    : msg
                )
              );
              // Remove from pending messages
              setPendingMessages((prev) => {
                const newSet = new Set(prev);
                // Find the message that was just confirmed and remove it from pending
                const confirmedMessage = messages.find(
                  (msg) =>
                    msg.content === data.content && msg.status === "sending"
                );
                if (confirmedMessage) {
                  newSet.delete(confirmedMessage.id);
                }
                return newSet;
              });
            }

            // Play notification sound for incoming messages
            if (!isFromCurrentUser && settings.soundEnabled) {
              notificationSound.play(settings.volume);
            }

            return;
          }

          // Legacy typed messages fallback
          switch (data.type) {
            case "new-message":
              setMessages((prev) => [
                ...prev,
                {
                  id: data.id || generateUniqueMessageId(),
                  content: data.content,
                  sender:
                    data.sender === (user as any)?.id ? "user" : "therapist",
                  timestamp:
                    data.timestamp ||
                    new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  type: "text",
                  isRead: data.sender === (user as any)?.id,
                },
              ]);

              // Play notification sound for incoming messages
              if (data.sender !== (user as any)?.id && settings.soundEnabled) {
                notificationSound.play(settings.volume);
              }
              break;
            case "user-typing":
              setIsTyping(data.isTyping);
              break;
            case "user-joined":
              console.log("User joined chat:", data);
              break;
            case "peer-id-broadcast":
              console.log("📡 Received peer ID broadcast:", data.data);
              // Store the peer ID for future use
              if (
                data.data &&
                data.data.peerId &&
                data.data.userId !== (user as any)?.id
              ) {
                const sessionId = data.data.peerId
                  .split("-")
                  .slice(1)
                  .join("-");
                sessionStorage.setItem(
                  `peer-session-${data.data.userId}`,
                  sessionId
                );
                console.log(
                  `📡 Stored peer ID for user ${data.data.userId}: ${data.data.peerId}`
                );
              }
              break;
            case "ping":
              // Handle ping responses (optional)
              console.log("💓 Received ping response");
              break;
            default:
              console.log("Unknown message format:", data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log(
          "🔌 User WebSocket connection closed:",
          event.code,
          event.reason
        );
        setWsConnected(false);
        setWsConnection(null);
        stopHeartbeat();

        // Always attempt reconnection unless it's a normal closure (user leaving page)
        if (event.code !== 1000) {
          reconnectAttemptsRef.current += 1;
          setReconnectAttempts(reconnectAttemptsRef.current);

          console.log(
            `🔄 Attempting to reconnect user WebSocket (attempt ${reconnectAttemptsRef.current})`
          );

          // Exponential backoff
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current - 1),
            10000
          );
          setTimeout(() => {
            // Always try to reconnect
            console.log("🔄 Reconnecting user WebSocket...");
            const newConnectionId = `user-chat-${chatId}-${Date.now()}`;
            connectWebSocket(newConnectionId);
          }, delay);
        } else {
          console.log("✅ WebSocket closed normally (user leaving page)");
        }
      };

      ws.onerror = (error) => {
        console.error("❌ User WebSocket connection error:", error);
        setWsConnected(false);
        setError("Connection error occurred");
      };

      return ws;
    },
    [tokens, chatId, user, wsConnection]
  );

  // Heartbeat function to keep WebSocket alive
  const startHeartbeat = useCallback((ws: WebSocket) => {
    stopHeartbeat(); // Clear any existing heartbeat

    let missedPings = 0;
    const maxMissedPings = 3;

    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          // Send a simple ping message that the server can handle
          ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
          console.log("💓 Sent heartbeat ping");
          missedPings = 0; // Reset missed pings on successful send
        } catch (error) {
          console.error("Failed to send heartbeat:", error);
          missedPings++;

          if (missedPings >= maxMissedPings) {
            console.error(
              "💔 Too many missed heartbeats, marking connection as lost"
            );
            setWsConnected(false);
            stopHeartbeat();
          }
        }
      } else {
        console.log("💓 WebSocket not open, stopping heartbeat");
        stopHeartbeat();
      }
    }, 15000); // Send ping every 15 seconds
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // WebSocket message handling
  useEffect(() => {
    console.log("🔄 WebSocket effect triggered");
    console.log("🔄 Tokens:", tokens ? "✅ Present" : "❌ Missing");
    console.log("🔄 ChatId:", chatId ? "✅ Present" : "❌ Missing");
    console.log("🔄 User:", user ? "✅ Present" : "❌ Missing");

    if (!tokens || !chatId || !user) {
      console.log(
        "❌ WebSocket effect - missing required data, skipping connection"
      );
      return;
    }

    // Generate connection ID for tracking (moved outside connectWebSocket)
    const connectionId = `user-chat-${chatId}-${Date.now()}`;

    console.log("✅ WebSocket effect - all data present, connecting...");
    // Connect to WebSocket
    const ws = connectWebSocket(connectionId);
    if (!ws) {
      console.log("❌ WebSocket connection failed");
      return;
    }

    return () => {
      // Close WebSocket on useEffect cleanup to prevent connection accumulation
      console.log("🧹 WebSocket useEffect cleanup - closing connection");
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("🔌 Closing WebSocket on useEffect cleanup");
        ws.close(1000, "Effect cleanup");
      }
      // Remove from monitoring tracker
      wsMonitoringTracker.removeConnection(connectionId);
      stopHeartbeat();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [tokens, chatId, user]);

  // Cleanup WebSocket connection when leaving the page or component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🧹 User leaving page - closing user WebSocket connection");
      stopHeartbeat();
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close(1000, "User leaving page");
      }
    };

    // Listen for page unload/refresh
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on component unmount - close WebSocket to prevent connection maxing out
    return () => {
      console.log(
        "🧹 Component unmounting - closing user WebSocket connection"
      );
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Close WebSocket connection on component unmount
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        console.log("🔌 Closing user WebSocket on component unmount");
        wsConnection.close(1000, "Component unmounting");
      }
      stopHeartbeat();
    };
  }, [chatId, user, stopHeartbeat, wsConnection]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Debug: Log messages state
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("User chat messages state:", {
        totalMessages: messages.length,
        messages: messages.map((m) => ({
          id: m.id,
          content: m.content,
          sender: m.sender,
          timestamp: m.timestamp,
          status: m.status,
        })),
      });
    }
  }, [messages]);

  const handleRetryMessage = (message: Message) => {
    if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
      setError("Connection lost. Please refresh the page.");
      return;
    }

    // Update message status back to sending
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id ? { ...msg, status: "sending" as const } : msg
      )
    );
    setPendingMessages((prev) => new Set(prev).add(message.id));

    // Resend the message
    const payload = { content: message.content };
    wsConnection.send(JSON.stringify(payload));
    console.log("Retrying message:", payload);

    // Set timeout again
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id && msg.status === "sending"
            ? { ...msg, status: "failed" as const }
            : msg
        )
      );
      setPendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(message.id);
        return newSet;
      });
    }, 10000);
  };

  const handleSendMessage = () => {
    if (
      newMessage.trim() &&
      wsConnection &&
      wsConnection.readyState === WebSocket.OPEN
    ) {
      const messageId = generateUniqueMessageId();
      const message: Message = {
        id: messageId,
        content: newMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
        type: "text",
        isRead: false,
        status: "sending",
      };

      // Add message to local state immediately
      setMessages((prev) => [...prev, message]);
      setPendingMessages((prev) => new Set(prev).add(messageId));

      // Send message via WebSocket in unified format: { content: "message" }
      const payload = { content: newMessage };
      wsConnection.send(JSON.stringify(payload));
      console.log("Sent message via WebSocket:", payload);
      console.log("Current user ID:", (user as any)?.id);

      // Set timeout to mark message as failed if no confirmation received
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId && msg.status === "sending"
              ? { ...msg, status: "failed" as const }
              : msg
          )
        );
        setPendingMessages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }, 10000); // 10 seconds timeout

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
      await acceptCall();
      setShowVideoCall(true);
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

  const handleLeaveChat = () => {
    setShowLeaveConfirmation(true);
  };

  const confirmLeaveChat = () => {
    // Clean up WebSocket connection directly
    stopHeartbeat();
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.close(1000, "User leaving chat");
    }

    // End any active calls (PeerJS will auto-cleanup on unmount)
    endCall();

    // Navigate back to the main page or therapy sessions
    router.push("/chat-room");
  };

  const cancelLeaveChat = () => {
    setShowLeaveConfirmation(false);
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
                            wsConnected ? "bg-green-500" : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {wsConnected ? "Connected" : "Disconnected"}
                        </span>
                        {!wsConnected && (
                          <span className="text-xs text-red-500">
                            ({reconnectAttempts}/{maxReconnectAttempts})
                          </span>
                        )}
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
                  <button
                    onClick={handleLeaveChat}
                    className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                    title="Leave Chat"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <LanguageSelector compact={true} />
            </div>

            {/* Connection Status */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Connection Status:
                </span>
                <div className="flex items-center space-x-4">
                  <span
                    className={`flex items-center ${
                      wsConnected ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        wsConnected ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    {wsConnected ? "Connected" : "Disconnected"}
                  </span>
                  <ConnectionStatus />
                  {pendingMessages.size > 0 && (
                    <span className="text-orange-600 text-xs">
                      {pendingMessages.size} pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Connection Status Banner */}
            {!wsConnected && (
              <div className="bg-red-100 dark:bg-red-900 border-b border-red-200 dark:border-red-700 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-700 dark:text-red-300">
                      Connection lost. Attempting to reconnect... (
                      {reconnectAttempts}/{maxReconnectAttempts})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      console.log("🔄 Manual reconnection triggered");
                      if (tokens && chatId && user) {
                        const newConnectionId = `user-chat-${chatId}-${Date.now()}`;
                        connectWebSocket(newConnectionId);
                      }
                    }}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                // Sort messages by timestamp to ensure proper chronological order
                [...messages]
                  .sort((a, b) => {
                    const timestampA = new Date(a.timestamp).getTime();
                    const timestampB = new Date(b.timestamp).getTime();
                    const result = timestampA - timestampB;

                    // Debug logging
                    if (process.env.NODE_ENV === "development") {
                      console.log("User chat message sort:", {
                        messageA: {
                          content: a.content,
                          timestamp: a.timestamp,
                          sender: a.sender,
                        },
                        messageB: {
                          content: b.content,
                          timestamp: b.timestamp,
                          sender: b.sender,
                        },
                        result,
                      });
                    }

                    return result;
                  })
                  .map((message) => (
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
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {message.sender === "user" && message.status && (
                            <span className="ml-2 text-xs">
                              {message.status === "sending" && "⏳"}
                              {message.status === "sent" && "✓"}
                              {message.status === "delivered" && "✓✓"}
                              {message.status === "failed" && (
                                <span className="flex items-center">
                                  ❌
                                  <button
                                    onClick={() => handleRetryMessage(message)}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                    title="Retry message"
                                  >
                                    🔄
                                  </button>
                                </span>
                              )}
                            </span>
                          )}
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
              {!wsConnected && (
                <div className="mb-2 p-2 bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded text-sm text-yellow-700 dark:text-yellow-300">
                  ⚠️ Messages will be queued until connection is restored
                </div>
              )}
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

                {/* Translation Button */}
                <button
                  onClick={() => setShowTranslationPanel(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Translate chat"
                >
                  <Languages className="h-5 w-5" />
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
              id: user?.id || "",
              name: user?.name || "User",
              avatar: user?.avatar || "/default-avatar.png",
              isTherapist: false,
              isMuted: callState.isMuted,
              isVideoEnabled: callState.isVideoEnabled,
            },
            {
              id: therapist.id,
              name: therapist.name,
              avatar: therapist.avatar || "/default-avatar.png",
              isTherapist: true,
              isMuted: false,
              isVideoEnabled: true,
            },
          ]}
          currentUserId={user?.id || ""}
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
          connectionDiagnostics={connectionDiagnostics}
          // Ringing overlay props
          isCallOutgoing={callState.isCallOutgoing}
          isCallIncoming={callState.isCallIncoming}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {/* Incoming Call Component */}
      {incomingCall && (
        <IncomingCall
          isVisible={incomingCall.isVisible}
          caller={incomingCall.caller!}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {/* Leave Chat Confirmation Dialog */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Leave Chat
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to leave this chat? You will be disconnected
              from the conversation and any ongoing video calls will end.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelLeaveChat}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmLeaveChat}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Leave Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Translation Panel */}
      <TranslationPanel
        messages={messages}
        onMessagesUpdate={(updatedMessages) => {
          setMessages(updatedMessages);
        }}
        isOpen={showTranslationPanel}
        onClose={() => setShowTranslationPanel(false)}
      />
    </div>
  );
}
