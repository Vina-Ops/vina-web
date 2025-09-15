"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MessageSquare,
  Video,
  Phone,
  Send,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Loader2,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { Message } from "@/types/chat";
import VideoCall from "@/components/chat/VideoCall";
import IncomingCall from "@/components/chat/IncomingCall";
import { usePeerVideoCall, CallParticipant } from "@/hooks/usePeerVideoCall";
import { useUser } from "@/context/user-context";
import { fetchToken } from "@/helpers/get-token";
import { fetchWsToken } from "@/helpers/get-ws-token";
import { getMyTherapySessions } from "@/services/general-service";
import notificationSound from "@/utils/notification-sound";
import { useNotification } from "@/context/notification-context";
import { wsConnectionTracker } from "@/utils/websocket-connection-tracker";
import { wsMonitoringTracker } from "@/utils/websocket-monitoring-tracker";
import ConnectionStatus from "@/components/websocket/ConnectionStatus";
import { generateUniqueMessageId } from "@/utils/message-id-generator";

interface Session {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "active" | "completed" | "cancelled" | "no-show";
  type: "individual" | "couples" | "group";
  notes?: string;
  rating?: number;
  patientAvatar: string;
  sessionNotes?: string;
}

export default function TherapistChatPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const { user } = useUser();
  const { settings } = useNotification();

  // Session state
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat functionality
  const [tokens, setTokens] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [wsConnecting, setWsConnecting] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  // WebSocket retry mechanism
  const [wsRetryCount, setWsRetryCount] = useState(0);
  const [wsRetryTimeout, setWsRetryTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const wsRetryCountRef = useRef(0);
  const maxWsRetryAttemptsRef = useRef(5);
  const wsConnectionRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Message queue for offline messages
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);

  // Video call integration
  const {
    callState,
    remoteStreams,
    localStream,
    incomingCall,
    isConnecting,
    networkStats,
    currentPeerId,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    startRecording,
    stopRecording,
    connectionDiagnostics,
  } = usePeerVideoCall({
    currentUserId: (user as any)?.id || "",
    roomId: sessionId || "",
    userRole: "therapist",
    sessionData: session
      ? {
          therapistName: (user as any)?.name || "Therapist",
          patientName: session.patientName,
          therapistAvatar:
            (user as any)?.avatar ||
            "https://ui-avatars.com/api/?name=Therapist&background=EAF7F0&color=013F25",
          patientAvatar: session.patientAvatar,
        }
      : undefined,
  });

  // Fetch token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        console.log("Fetching token...");
        const token = await fetchWsToken();
        console.log("Token received:", token);
        setTokens(token);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };
    getToken();
  }, []);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyTherapySessions();

        const mapped: Session[] = (data || []).map((s: any) => {
          const isTherapist = (user as any)?.role === "therapist";
          const otherParty = isTherapist ? s?.client : s?.therapist;
          const name = otherParty?.name || "Unknown";
          const id = otherParty?.id?.toString?.() || "";
          const createdAt = s?.created_at || new Date().toISOString();
          const dateObj = new Date(createdAt);
          const dateStr = dateObj.toISOString().slice(0, 10);
          const timeStr = dateObj.toTimeString().slice(0, 5);
          const statusRaw = (s?.status || "active").toLowerCase();
          const allowedStatuses = [
            "scheduled",
            "active",
            "completed",
            "cancelled",
            "no-show",
          ];
          const status = (
            allowedStatuses.includes(statusRaw) ? statusRaw : "active"
          ) as Session["status"];

          return {
            id:
              s?.room_id?.toString?.() ||
              id ||
              Math.random().toString(36).slice(2),
            patientName: name,
            patientId: id,
            date: dateStr,
            time: timeStr,
            duration: 60,
            status,
            type: "individual",
            notes: undefined,
            rating: undefined,
            patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&background=EAF7F0&color=013F25`,
            sessionNotes: s?.last_message || undefined,
          } as Session;
        });

        const foundSession = mapped.find((s) => s.id === sessionId);
        if (foundSession) {
          setSession(foundSession);
        } else {
          setError("Session not found");
        }
      } catch (err: any) {
        console.error("Error fetching session:", err);
        setError(err?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && user) {
      fetchSession();
    }
  }, [sessionId, user]);

  // Cleanup retry timeout on unmount
  useEffect(() => {
    return () => {
      if (wsRetryTimeout) {
        clearTimeout(wsRetryTimeout);
      }
    };
  }, [wsRetryTimeout]);

  // Cleanup WebSocket connection when leaving the page or component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log(
        "🧹 User leaving page - closing therapist WebSocket connection"
      );
      if (
        wsConnectionRef.current &&
        wsConnectionRef.current.readyState === WebSocket.OPEN
      ) {
        wsConnectionRef.current.close(1000, "User leaving page");
        setWsConnection(null);
        setWsConnected(false);
      }
      stopHeartbeat();
    };

    // Listen for page unload/refresh
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      console.log(
        "🧹 Component unmounting - closing therapist WebSocket connection"
      );
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Close WebSocket connection on component unmount
      if (
        wsConnectionRef.current &&
        wsConnectionRef.current.readyState === WebSocket.OPEN
      ) {
        console.log("🔌 Closing therapist WebSocket on component unmount");
        wsConnectionRef.current.close(1000, "Component unmounting");
        setWsConnection(null);
        setWsConnected(false);
      }
      stopHeartbeat();
    };
  }, []);

  // Heartbeat function to keep WebSocket alive
  const startHeartbeat = useCallback((ws: WebSocket) => {
    stopHeartbeat(); // Clear any existing heartbeat

    let missedPings = 0;
    const maxMissedPings = 3;

    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          // Send a simple ping message that the server can handle

          console.log("💓 Sent heartbeat ping (therapist)");
          missedPings = 0; // Reset missed pings on successful send
        } catch (error) {
          console.error("Failed to send heartbeat (therapist):", error);
          missedPings++;

          if (missedPings >= maxMissedPings) {
            console.error(
              "💔 Too many missed heartbeats, marking connection as lost (therapist)"
            );
            setWsConnected(false);
            stopHeartbeat();
          }
        }
      } else {
        console.log("💓 WebSocket not open, stopping heartbeat (therapist)");
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

  // WebSocket retry function
  const retryWebSocketConnection = useCallback(() => {
    if (wsRetryTimeout) {
      clearTimeout(wsRetryTimeout);
    }

    setWsRetryCount((prev) => prev + 1);
    setWsError(null);

    // Retry after 2 seconds
    const timeout = setTimeout(() => {
      console.log("🔄 Retrying WebSocket connection...");
      // Force re-run of the WebSocket useEffect
      setWsRetryCount((prev) => prev);
    }, 2000);

    setWsRetryTimeout(timeout);
  }, [wsRetryTimeout]);

  // Connect to therapist chat WS for selected room using unified payloads
  useEffect(() => {
    if (!tokens || !session || !user) {
      console.log("Missing required data for WebSocket:", {
        hasToken: !!tokens,
        hasSession: !!session,
        hasUser: !!user,
      });
      return;
    }

    // Check if we can create a new connection
    if (!wsMonitoringTracker.canCreateConnection()) {
      setWsError(
        `Connection limit reached (${wsMonitoringTracker.getActiveCount()}/30)`
      );
      console.warn("Cannot create WebSocket - connection limit reached");
      return;
    }

    // Don't create a new connection if one already exists for this session
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected, skipping new connection");
      return;
    }

    const roomId = session.id;
    const baseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL;
    const wsUrl = `${baseUrl}/safe-space/${roomId}?token=${tokens}`;

    console.log("Creating therapist chat WebSocket connection to:", wsUrl);
    console.log("Token value:", tokens);
    console.log("Room ID:", roomId);
    console.log("Retry count:", wsRetryCount);

    setWsConnecting(true);
    setWsError(null);

    const ws = new WebSocket(wsUrl);
    const connectionId = `therapist-chat-${roomId}-${user?.id}`;

    // Track this connection immediately
    const isTracked = wsMonitoringTracker.trackConnection(
      connectionId,
      "therapist-chat",
      ws,
      wsUrl,
      {
        userId: (user as any)?.id,
        roomId: roomId,
        patientName: session.patientName,
        sessionType: "therapy",
      }
    );

    if (!isTracked) {
      console.error("Failed to track WebSocket connection");
      ws.close();
      setWsError("Failed to track connection");
      return;
    }

    ws.onopen = () => {
      console.log("✅ WebSocket connected successfully");
      setWsConnection(ws);
      wsConnectionRef.current = ws; // Update ref
      setWsConnected(true);
      setWsConnecting(false);
      setWsError(null);
      setWsRetryCount(0); // Reset retry count on successful connection
      wsRetryCountRef.current = 0; // Reset ref as well

      // Start heartbeat to keep connection alive
      startHeartbeat(ws);

      // Broadcast current peer ID if available
      // if (currentPeerId) {
      //   try {
      //     ws.send(
      //       JSON.stringify({
      //         type: "peer-id-broadcast",
      //         data: {
      //           peerId: currentPeerId,
      //           userId: (user as any)?.id,
      //           timestamp: Date.now(),
      //         },
      //       })
      //     );
      //     console.log(
      //       "📡 Broadcasted therapist peer ID on WebSocket connect:",
      //       currentPeerId
      //     );
      //   } catch (error) {
      //     console.error("Failed to broadcast therapist peer ID:", error);
      //   }
      // }

      // Send any queued messages
      if (messageQueue.length > 0) {
        console.log(`📤 Sending ${messageQueue.length} queued messages...`);
        messageQueue.forEach((queuedMessage) => {
          try {
            ws.send(JSON.stringify({ content: queuedMessage.content }));
            console.log("✅ Queued message sent:", queuedMessage.content);
          } catch (error) {
            console.error("Failed to send queued message:", error);
          }
        });
        // Clear the queue after sending
        setMessageQueue([]);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle peer ID broadcast from users
        if (data.type === "peer-id-broadcast" && data.data) {
          console.log("📡 Received peer ID broadcast from user:", data.data);
          // Store the peer ID for future video calls
          if (data.data.peerId && data.data.userId) {
            const sessionId = data.data.peerId.split("-").slice(1).join("-");
            sessionStorage.setItem(
              `peer-session-${data.data.userId}`,
              sessionId
            );
            console.log(
              `📡 Stored peer ID for user ${data.data.userId}: ${data.data.peerId}`
            );
          }
          return;
        }

        if (
          data &&
          typeof data === "object" &&
          "content" in data &&
          "sender" in data &&
          "timestamp" in data
        ) {
          // Determine if the message is from the current user (therapist) or the patient
          const isFromCurrentUser = data.sender === (user as any)?.id;
          const messageSender = isFromCurrentUser ? "user" : "ai";

          const incoming: Message = {
            id: data.id || generateUniqueMessageId(),
            content: data.content,
            sender: messageSender,
            timestamp: data.timestamp || new Date().toISOString(),
            type: "text",
            isRead: false,
          };

          // Check for duplicates before adding
          setMessages((prev) => {
            // Check if this message already exists (by content and timestamp)
            const isDuplicate = prev.some(
              (msg) =>
                msg.content === incoming.content &&
                Math.abs(
                  new Date(msg.timestamp).getTime() -
                    new Date(incoming.timestamp).getTime()
                ) < 1000 // Within 1 second
            );

            if (isDuplicate) {
              console.log(
                "🔄 Duplicate message detected, skipping:",
                incoming.content
              );
              return prev;
            }

            // Add new message and sort by timestamp
            const newMessages = [...prev, incoming];
            return newMessages.sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            );
          });
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onclose = (event) => {
      const closeCode = event.code;
      const closeReason = event.reason || "No reason provided";

      console.log("Therapist chat WebSocket closed:", closeCode, closeReason);

      setWsConnected(false);
      setWsConnection(null);
      wsConnectionRef.current = null; // Clear ref
      setWsConnecting(false);
      stopHeartbeat(); // Stop heartbeat on connection close

      // Always attempt reconnection unless it's a normal closure (user leaving page)
      if (closeCode !== 1000 && session) {
        wsRetryCountRef.current += 1;
        setWsRetryCount(wsRetryCountRef.current);

        console.log(
          `🔄 Attempting to reconnect therapist WebSocket (attempt ${wsRetryCountRef.current})...`
        );

        // Exponential backoff
        const delay = Math.min(
          1000 * Math.pow(2, wsRetryCountRef.current - 1),
          10000
        );
        setTimeout(() => {
          // Always try to reconnect
          console.log("🔄 Reconnecting therapist WebSocket...");
          // Trigger reconnection by updating the effect dependencies
          setWsRetryCount((prev) => prev + 1);
        }, delay);
      } else if (closeCode === 1000) {
        console.log("✅ WebSocket closed normally (user leaving page)");
      }
    };

    ws.onerror = (error) => {
      console.error("Therapist chat WebSocket error:", error);
      setWsConnected(false);
      setWsConnection(null);
      wsConnectionRef.current = null; // Clear ref
      setWsConnecting(false);
      setWsError("Connection error occurred");
      stopHeartbeat(); // Stop heartbeat on error
    };

    return () => {
      // Close WebSocket on useEffect cleanup to prevent connection accumulation
      console.log("🧹 WebSocket useEffect cleanup - closing connection");
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("🔌 Closing WebSocket on useEffect cleanup");
        ws.close(1000, "Effect cleanup");
      }
      // Remove from tracker
      wsMonitoringTracker.removeConnection(connectionId);
      stopHeartbeat();
    };
  }, [tokens, session, user, wsRetryCount]);

  // Play notification sound for new messages in therapist chat
  useEffect(() => {
    if (messages.length > previousMessageCount && previousMessageCount > 0) {
      // Only play sound for incoming messages (not the first load)
      const newMessages = messages.slice(previousMessageCount);
      const hasIncomingMessages = newMessages.some(
        (msg) => msg.sender === "ai" // "ai" represents messages from the patient
      );

      if (hasIncomingMessages && settings.soundEnabled) {
        notificationSound.play(settings.volume);
      }
    }
    setPreviousMessageCount(messages.length);
  }, [messages, previousMessageCount, settings.soundEnabled, settings.volume]);

  const handleStartVideoCall = async () => {
    if (!session) {
      console.log("❌ No current session for video call");
      return;
    }

    try {
      console.log("🎯 Starting video call...");
      console.log("🎯 Current call state before:", callState);
      console.log("🎯 User data:", {
        id: (user as any)?.id,
        role: (user as any)?.role,
        hasUser: !!user,
      });
      console.log("🎯 Session:", {
        id: session.id,
        patientId: session.patientId,
        patientName: session.patientName,
      });

      // Check if we're a therapist or patient
      const isTherapist = (user as any)?.role === "therapist";
      console.log(
        "🎯 User role:",
        (user as any)?.role,
        "isTherapist:",
        isTherapist
      );

      if (isTherapist) {
        // Therapist initiating call to patient
        console.log("Therapist initiating call to patient...");

        // Create a participant object for the patient
        const patientParticipant: CallParticipant = {
          id: session.patientId,
          name: session.patientName,
          avatar: session.patientAvatar,
          isTherapist: false,
          isMuted: false,
          isVideoEnabled: true,
        };

        console.log("Patient participant:", patientParticipant);
        console.log("🎯 Patient ID from session:", session.patientId);
        console.log("🎯 Current user ID (therapist):", (user as any)?.id);

        // Try to start the call (this will fail if patient is not online)
        const callStarted = await startCall([patientParticipant]);
        console.log("startCall result:", callStarted);

        if (callStarted) {
          console.log(
            "Video call started successfully for patient:",
            session.patientName
          );
          console.log("Call state after startCall:", callState);
        } else {
          console.log(
            "Call failed to start - this is expected if patient is not online"
          );
        }
      }
    } catch (error) {
      console.error("Failed to start video call:", error);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const content = chatMessage.trim();
    if (!content) return;

    // Create message object with unique ID
    const messageId = generateUniqueMessageId();
    const outgoing: Message = {
      id: messageId,
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: false,
    };

    // Add to messages immediately (optimistic UI) and sort by timestamp
    setMessages((prev) => {
      const newMessages = [...prev, outgoing];
      return newMessages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });

    // Try to send via WebSocket if connected
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      try {
        wsConnection.send(JSON.stringify({ content }));
        console.log("✅ Message sent via WebSocket");
      } catch (error) {
        console.error("Failed to send message via WebSocket:", error);
        // Add to queue if sending fails
        setMessageQueue((prev) => [...prev, outgoing]);
      }
    } else {
      // WebSocket not connected, add to queue
      console.log("📝 WebSocket not connected, adding message to queue");
      setMessageQueue((prev) => [...prev, outgoing]);
    }

    setChatMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage(e);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading session...</span>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || "Session not found"}
          </h2>
          <button
            onClick={() => router.push("/therapist/sessions")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 sticky top-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="grid lg:flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/therapist/sessions")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
              title="Back to Sessions"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={session.patientAvatar}
                alt={session.patientName}
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {session.patientName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(session.date)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(session.time)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Connection Status Indicator */}
            <div className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  wsConnected
                    ? "bg-green-500 animate-pulse"
                    : wsConnecting
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span
                className={`text-xs ${
                  wsConnected
                    ? "text-green-600 dark:text-green-400"
                    : wsConnecting
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {wsConnected
                  ? "Connected"
                  : wsConnecting
                  ? "Connecting..."
                  : "Disconnected"}
              </span>
            </div>
            <ConnectionStatus />
            <button
              onClick={handleStartVideoCall}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
              title="Start Video Call"
            >
              <Video className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status Banner */}
      {!wsConnected && (
        <div
          className={`absolute z-50 top-20 left-0 right-0 flex-shrink-0 border-l-4 p-3 ${
            wsConnecting
              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-400"
          }`}
        >
          <div className="grid lg:flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                wsConnecting ? "bg-yellow-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                wsConnecting
                  ? "text-yellow-700 dark:text-yellow-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {wsConnecting
                ? "Connecting to WebSocket..."
                : "WebSocket Disconnected"}
            </span>
            <span
              className={`text-xs ${
                wsConnecting
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {wsConnecting
                ? "Please wait while establishing connection..."
                : "Messages may not be delivered"}
            </span>
            {!wsConnecting && (
              <button
                onClick={retryWebSocketConnection}
                className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Container - Flexible height */}
      <div className="flex-1 h-[calc(100vh-200px)] min-h-0 p-4">
        <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Chat Messages - Scrollable area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Welcome message */}
              <div className="flex justify-center">
                <div className="bg-green-50 dark:bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                  Session started with {session.patientName}
                </div>
              </div>

              {/* Chat Messages */}
              {messages.length > 0 ? (
                <ChatMessages
                  messages={messages}
                  isTyping={isTyping}
                  messagesEndRef={messagesEndRef}
                />
              ) : (
                <div className="text-center py-8 h-[calc(100vh-350px)]">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Chat with {session.patientName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start a conversation or begin a video call to provide
                    therapy support.
                  </p>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Connection Warning */}
            {!wsConnected && (
              <div
                className={`mb-3 p-2 border rounded-md ${
                  wsConnecting
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div
                  className={`flex items-center justify-between ${
                    wsConnecting
                      ? "text-yellow-800 dark:text-yellow-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        wsConnecting ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-xs">
                      {wsConnecting
                        ? "Connecting to chat server..."
                        : "Connection lost. Messages will be queued until reconnected."}
                    </span>
                  </div>
                  {!wsConnecting && (
                    <div className="flex items-center space-x-2">
                      {messageQueue.length > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {messageQueue.length} message
                          {messageQueue.length !== 1 ? "s" : ""} queued
                        </span>
                      )}
                      <button
                        onClick={retryWebSocketConnection}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSendChatMessage}
              className="flex items-end gap-3"
            >
              <div className="flex-1 relative">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    wsConnected
                      ? "Type your message..."
                      : wsConnecting
                      ? "Connecting... Please wait"
                      : "Connection lost"
                  }
                  disabled={!wsConnected}
                  className={`w-full resize-none rounded-lg border py-2 px-4 ${
                    wsConnected
                      ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  } placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                  rows={1}
                  style={{
                    minHeight: "44px",
                    maxHeight: "100px",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!chatMessage.trim() || !wsConnected}
                className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                  wsConnected && chatMessage.trim()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : wsConnecting
                    ? "bg-yellow-500 text-white cursor-wait"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={
                  !wsConnected
                    ? wsConnecting
                      ? "Connecting to chat server..."
                      : "Waiting for connection..."
                    : !chatMessage.trim()
                    ? "Type a message to send"
                    : "Send Message"
                }
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Video Call Component */}
      {callState.isInCall && (
        <VideoCall
          isOpen={callState.isInCall}
          onClose={endCall}
          participants={Array.from(remoteStreams.keys()).map((userId) => ({
            id: userId,
            name: session?.patientName || "Patient",
            avatar: session?.patientAvatar || "",
            isTherapist: false,
            isMuted: false,
            isVideoEnabled: true,
          }))}
          currentUserId={(user as any)?.id || ""}
          // PeerJS video call props
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
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Incoming Call Component */}
      {incomingCall?.isVisible && incomingCall?.caller && (
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
