"use client";

import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Star,
  Eye,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Phone,
  Video,
  X,
  Loader2,
} from "lucide-react";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { Message } from "@/types/chat";
import VideoCall from "@/components/chat/VideoCall";
import IncomingCall from "@/components/chat/IncomingCall";
import { usePeerVideoCall, CallParticipant } from "@/hooks/usePeerVideoCall";
import { useUser } from "@/context/user-context";
import { fetchToken } from "@/helpers/get-token";
import { getMyTherapySessions } from "@/services/general-service";
import notificationSound from "@/utils/notification-sound";
import { useNotification } from "@/context/notification-context";

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

const mockSessions: Session[] = [];

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "no-show":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

const statusLabels = {
  scheduled: "Scheduled",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

const typeColors = {
  individual:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  couples: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  group:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
};

// Main component that uses useSearchParams
function TherapistSessionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { settings } = useNotification();
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chat functionality
  const [showChat, setShowChat] = useState(false);
  const [currentChatSession, setCurrentChatSession] = useState<Session | null>(
    null
  );
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

  // Demo state for testing video call UI
  const [demoCallActive, setDemoCallActive] = useState(false);

  // WebSocket retry mechanism
  const [wsRetryCount, setWsRetryCount] = useState(0);
  const [wsRetryTimeout, setWsRetryTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Message queue for offline messages
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);

  // URL state management utility
  // Usage: updateUrlParams({ chat: sessionId }) to open chat
  //        updateUrlParams({ chat: null }) to close chat
  const updateUrlParams = (params: { [key: string]: string | null }) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() || "");

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  // Video call integration
  const {
    callState,
    remoteStreams,
    localStream,
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
    getCurrentPeerId,
    createChatRoom,
    connectToExistingRoom,
  } = usePeerVideoCall({
    currentUserId: (user as any)?.id || "",
    roomId: currentChatSession?.id || "",
  });

  // Fetch token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        console.log("Fetching token...");
        const token = await fetchToken();
        console.log("Token received:", token);
        console.log("Token type:", typeof token);
        console.log("Token length:", token?.length);
        setTokens(token);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };
    getToken();
  }, []);

  // Cleanup retry timeout on unmount
  useEffect(() => {
    return () => {
      if (wsRetryTimeout) {
        clearTimeout(wsRetryTimeout);
      }
    };
  }, [wsRetryTimeout]);

  // Cleanup WebSocket connection when component unmounts or user leaves page
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🧹 Cleaning up therapist chat WebSocket connection before page unload");
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close(1000, "User leaving page");
        setWsConnection(null);
        setWsConnected(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log("🧹 Cleaning up therapist chat WebSocket connection - page hidden");
        if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
          wsConnection.close(1000, "Page hidden");
          setWsConnection(null);
          setWsConnected(false);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on component unmount
    return () => {
      console.log("🧹 Cleaning up therapist chat WebSocket connection - component unmount");
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close(1000, "Component unmounting");
        setWsConnection(null);
        setWsConnected(false);
      }
    };
  }, [wsConnection]);

  // Debug user context
  useEffect(() => {
    console.log("🔍 User Context Debug:", {
      user: user,
      userId: (user as any)?.id,
      userRole: (user as any)?.role,
      hasUser: !!user,
    });
  }, [user]);

  // Debug chat session state
  useEffect(() => {
    console.log("🔍 Chat Session Debug:", {
      currentChatSession,
      showChat,
      hasSession: !!currentChatSession,
      sessionId: currentChatSession?.id,
    });
  }, [currentChatSession, showChat]);

  // Debug video call state
  useEffect(() => {
    console.log("🔍 Video Call Debug:", {
      callState,
      demoCallActive,
      remoteStreams: remoteStreams.size,
      isInCall: callState.isInCall,
      isCallActive: callState.isCallActive,
    });
  }, [callState, demoCallActive, remoteStreams]);

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
    if (!tokens || !currentChatSession || !user || !showChat) {
      console.log("Missing required data for WebSocket:", {
        hasToken: !!tokens,
        hasSession: !!currentChatSession,
        hasUser: !!user,
        showChat,
      });
      return;
    }

    const roomId = currentChatSession.id;
    const baseUrl =
      process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://vina-ai.onrender.com";
    const wsUrl = `${baseUrl}/safe-space/${roomId}?token=${tokens}`;

    console.log("Creating therapist chat WebSocket connection to:", wsUrl);
    console.log("Token value:", tokens);
    console.log("Room ID:", roomId);
    console.log("Token type:", typeof tokens);
    console.log("Token length:", tokens?.length);
    console.log("Retry count:", wsRetryCount);

    setWsConnecting(true);
    setWsError(null);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket connected successfully");
      setWsConnection(ws);
      setWsConnected(true);
      setWsConnecting(false);
      setWsError(null);

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
            id: data.id || `${Date.now()}`,
            content: data.content,
            sender: messageSender,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
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
              console.log("🔄 Duplicate message detected, skipping:", incoming.content);
              return prev;
            }

            // Add new message and sort by timestamp
            const newMessages = [...prev, incoming];
            return newMessages.sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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

      // Log specific close codes for debugging
      switch (closeCode) {
        case 1000:
          console.log("✅ WebSocket closed normally");
          break;
        case 1001:
          console.log("🔄 WebSocket going away");
          break;
        case 1002:
          console.log("❌ WebSocket protocol error");
          break;
        case 1003:
          console.log("❌ WebSocket unsupported data type");
          break;
        case 1005:
          console.log("❌ WebSocket no status received");
          break;
        case 1006:
          console.log("❌ WebSocket abnormal closure");
          break;
        case 1007:
          console.log("❌ WebSocket invalid frame payload data");
          break;
        case 1008:
          console.log("❌ WebSocket policy violation");
          break;
        case 1009:
          console.log("❌ WebSocket message too big");
          break;
        case 1011:
          console.log("❌ WebSocket server error");
          break;
        case 1015:
          console.log("❌ WebSocket TLS handshake failed");
          break;
        default:
          console.log(`❌ WebSocket closed with unknown code: ${closeCode}`);
      }

      setWsConnected(false);
      setWsConnection(null);
      setWsConnecting(false);
    };

    ws.onerror = (error) => {
      console.error("Therapist chat WebSocket error:", error);
      setWsConnected(false);
      setWsConnection(null);
      setWsConnecting(false);
      setWsError("Connection error occurred");
    };

    return () => {
      // Only close if the WebSocket is actually connected or connecting
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        ws.close();
      }
      setWsConnection(null);
      setWsConnected(false);
    };
  }, [tokens, currentChatSession, user, showChat, wsRetryCount]);

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

  // Fetch therapy sessions from API and map to local Session type
  useEffect(() => {
    const fetchSessions = async () => {
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

        setSessions(mapped);
      } catch (err: any) {
        console.error("Error fetching therapy sessions:", err);
        setError(err?.message || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  // Initialize chat state from URL parameters
  useEffect(() => {
    const chatSessionId = searchParams?.get("chat");
    if (chatSessionId && sessions.length > 0) {
      const session = sessions.find((s) => s.id === chatSessionId);
      if (session) {
        setCurrentChatSession(session);
        setShowChat(true);
        setMessages([]);
      }
    } else if (!chatSessionId) {
      // If no chat parameter in URL, close chat if it's open
      setShowChat(false);
      setCurrentChatSession(null);
    }
  }, [searchParams, sessions]);

  const handleOpenChat = (session: Session) => {
    setCurrentChatSession(session);
    setShowChat(true);
    setMessages([]); // Clear messages for new session
    setMessageQueue([]); // Clear message queue
    // Update URL to include chat session ID
    updateUrlParams({ chat: session.id });
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setCurrentChatSession(null);
    // Remove chat parameter from URL
    updateUrlParams({ chat: null });
  };

  const handleStartVideoCall = async () => {
    if (!currentChatSession) return;

    try {
      console.log("Starting video call...");
      console.log("Current call state before:", callState);

      // Check if we're a therapist or patient
      const isTherapist = (user as any)?.role === "therapist";
      console.log("User role:", (user as any)?.role);

      if (isTherapist) {
        // Therapist initiating call to patient
        console.log("Therapist initiating call to patient...");

        // Create a participant object for the patient
        const patientParticipant: CallParticipant = {
          id: currentChatSession.patientId,
          name: currentChatSession.patientName,
          avatar: currentChatSession.patientAvatar,
          isTherapist: false,
          isMuted: false,
          isVideoEnabled: true,
        };

        console.log("Patient participant:", patientParticipant);
        console.log(
          "🎯 Patient ID from session:",
          currentChatSession.patientId
        );
        console.log("🎯 Current user ID (therapist):", (user as any)?.id);

        // Try to start the call (this will fail if patient is not online)
        const callStarted = await startCall([patientParticipant]);
        console.log("startCall result:", callStarted);

        if (callStarted) {
          console.log(
            "Video call started successfully for patient:",
            currentChatSession.patientName
          );
          console.log("Call state after startCall:", callState);
        } else {
          console.log(
            "Call failed to start - this is expected if patient is not online"
          );
          console.log(
            "For demo purposes, you can manually trigger the call UI"
          );
        }
      } else {
        // Patient initiating call to therapist
        console.log("Patient initiating call to therapist...");

        // Create a participant object for the therapist
        const therapistParticipant: CallParticipant = {
          id: currentChatSession.patientId, // This should be therapist ID in real implementation
          name: "Therapist", // This should be therapist name in real implementation
          avatar: "", // This should be therapist avatar in real implementation
          isTherapist: true,
          isMuted: false,
          isVideoEnabled: true,
        };

        console.log("Therapist participant:", therapistParticipant);

        // Try to start the call
        const callStarted = await startCall([therapistParticipant]);
        console.log("startCall result:", callStarted);

        if (callStarted) {
          console.log("Video call started successfully for therapist");
          console.log("Call state after startCall:", callState);
        } else {
          console.log("Call failed to start - therapist may not be online");
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
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const outgoing: Message = {
      id: messageId,
      content,
      sender: "user",
      timestamp: new Date(),
    };

    // Add to messages immediately (optimistic UI) and sort by timestamp
    setMessages((prev) => {
      const newMessages = [...prev, outgoing];
      return newMessages.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;
    const matchesType = typeFilter === "all" || session.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartSession = (sessionId: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "active" as const } : s
      )
    );
  };

  const handleEndSession = (sessionId: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "completed" as const } : s
      )
    );
  };

  const handleCancelSession = (sessionId: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "cancelled" as const } : s
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sessions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your therapy sessions and patient appointments
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Session
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.filter((s) => s.status === "active").length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.filter((s) => s.status === "completed").length ||
                      0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Avg. Rating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.filter((s) => s.rating).length > 0
                      ? (
                          sessions
                            .filter((s) => s.rating)
                            .reduce((sum, s) => sum + (s.rating || 0), 0) /
                          sessions.filter((s) => s.rating).length
                        ).toFixed(1)
                      : "N/A"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="couples">Couples</option>
                <option value="group">Group</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
              {filteredSessions.length} of {sessions.length || 0} sessions
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading && (
            <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading
              sessions...
            </div>
          )}
          {error && !loading && (
            <div className="text-center py-6 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={session.patientAvatar}
                    alt={session.patientName}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {session.patientName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(session.date)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(session.time)} ({session.duration} min)
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {session.type}
                      </span>
                      {session.rating && (
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          {session.rating}
                        </span>
                      )}
                    </div>
                    {session.sessionNotes && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {session.sessionNotes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[session.status]
                    }`}
                  >
                    {statusLabels[session.status]}
                  </span>

                  {/* Type Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      typeColors[session.type]
                    }`}
                  >
                    {session.type}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {session.status === "scheduled" && (
                      <>
                        <button
                          onClick={() => handleStartSession(session.id)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                          title="Start Session"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCancelSession(session.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                          title="Cancel Session"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {session.status === "active" && (
                      <button
                        onClick={() => handleEndSession(session.id)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                        title="End Session"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenChat(session)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                      title="Open Chat"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {sessions.length === 0
                  ? "No sessions scheduled"
                  : "No sessions found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {sessions.length === 0
                  ? "Get started by scheduling your first therapy session."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && currentChatSession && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="absolute inset-0 flex">
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-xl">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={currentChatSession.patientAvatar}
                    alt={currentChatSession.patientName}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {currentChatSession.patientName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Session: {formatDate(currentChatSession.date)} at{" "}
                        {formatTime(currentChatSession.time)}
                      </p>
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartVideoCall}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                    title="Start Video Call"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                  {/* Demo button to test video call UI */}
                  <button
                    onClick={() => {
                      console.log("Demo: Manually triggering video call UI");
                      setDemoCallActive(!demoCallActive);
                      console.log("Demo call active:", !demoCallActive);
                    }}
                    className={`p-2 rounded-md ${
                      demoCallActive
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    title={
                      demoCallActive ? "Stop Demo Call" : "Start Demo Call"
                    }
                  >
                    {demoCallActive ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>

                  {/* Test local stream button */}
                  <button
                    onClick={async () => {
                      try {
                        console.log("Testing local stream acquisition...");
                        const stream =
                          await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true,
                          });
                        console.log("✅ Local stream acquired:", stream);
                        console.log(
                          "Video tracks:",
                          stream.getVideoTracks().length
                        );
                        console.log(
                          "Audio tracks:",
                          stream.getAudioTracks().length
                        );
                      } catch (error) {
                        console.error("❌ Failed to get local stream:", error);
                      }
                    }}
                    className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    title="Test Local Stream"
                  >
                    📹
                  </button>

                  {/* Test peer connection button */}
                  <button
                    onClick={() => {
                      console.log("🎯 Testing peer connection...");
                      console.log("🎯 Current user ID:", (user as any)?.id);
                      console.log("🎯 Current PeerJS ID:", getCurrentPeerId());
                      console.log(
                        "🎯 Patient ID from session:",
                        currentChatSession?.patientId
                      );
                      console.log("🎯 Call state:", callState);
                      console.log("🎯 Remote streams:", remoteStreams.size);
                      console.log(
                        "🎯 Local stream:",
                        localStream ? "Available" : "Not available"
                      );
                    }}
                    className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    title="Test Peer Connection"
                  >
                    🔗
                  </button>

                  <button
                    onClick={handleCloseChat}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
                    title="Close Chat"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Connection Status Banner */}
              {!wsConnected && (
                <div
                  className={`border-l-4 p-3 mx-4 mt-2 ${
                    wsConnecting
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400"
                      : "bg-red-50 dark:bg-red-900/20 border-red-400"
                  }`}
                >
                  <div className="flex items-center space-x-2">
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
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Welcome message */}
                  <div className="flex justify-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                      Session started with {currentChatSession.patientName}
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
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Chat with {currentChatSession.patientName}
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

              {/* Chat Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
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
        </div>
      )}

      {/* Video Call Component */}
      {(callState.isInCall || demoCallActive) && (
        <VideoCall
          isOpen={callState.isInCall || demoCallActive}
          onClose={() => {
            if (demoCallActive) {
              setDemoCallActive(false);
            } else {
              endCall();
            }
          }}
          participants={
            demoCallActive
              ? [
                  {
                    id: currentChatSession?.patientId || "demo-patient",
                    name: currentChatSession?.patientName || "Demo Patient",
                    avatar: currentChatSession?.patientAvatar || "",
                    isTherapist: false,
                    isMuted: false,
                    isVideoEnabled: true,
                  },
                ]
              : Array.from(remoteStreams.keys()).map((userId) => ({
                  id: userId,
                  name: currentChatSession?.patientName || "Patient",
                  avatar: currentChatSession?.patientAvatar || "",
                  isTherapist: false,
                  isMuted: false,
                  isVideoEnabled: true,
                }))
          }
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
          // Ringing overlay props
          isCallOutgoing={callState.isCallOutgoing}
          isCallIncoming={callState.isCallIncoming}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Debug Video Call State */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
          <div className="font-bold mb-2">🎥 Video Call Debug</div>
          <div>
            Call State: {callState.isInCall ? "✅ Active" : "❌ Inactive"}
          </div>
          <div>Remote Streams: {remoteStreams.size}</div>
          <div>
            Call Duration: {Math.floor(callState.callDuration / 60)}:
            {(callState.callDuration % 60).toString().padStart(2, "0")}
          </div>
          <div>
            Recording: {callState.isRecording ? "🔴 Recording" : "⏸️ Stopped"}
          </div>
          {callState.isRecording && (
            <div>
              Recording Time: {Math.floor(callState.recordingDuration / 60)}:
              {(callState.recordingDuration % 60).toString().padStart(2, "0")}
            </div>
          )}
          <div className="mt-2 font-bold">📊 Network Stats</div>
          <div>Resolution: {networkStats.resolution}</div>
          <div>Frame Rate: {networkStats.frameRate} FPS</div>
          <div>Bitrate: {networkStats.bitrate} kbps</div>
          <div className="mt-2 font-bold">🎤 Controls</div>
          <div>Muted: {callState.isMuted ? "🔇 Yes" : "🔊 No"}</div>
          <div>Video: {callState.isVideoEnabled ? "📹 On" : "❌ Off"}</div>
          <div>
            Screen Share: {callState.isScreenSharing ? "🖥️ Yes" : "❌ No"}
          </div>
        </div>
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

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={selectedSession.patientAvatar}
                    alt={selectedSession.patientName}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedSession.patientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(selectedSession.date)} at{" "}
                      {formatTime(selectedSession.time)}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Duration:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedSession.duration} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Type:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {selectedSession.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[selectedSession.status]
                      }`}
                    >
                      {statusLabels[selectedSession.status]}
                    </span>
                  </div>
                  {selectedSession.rating && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Rating:
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                          {selectedSession.rating}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedSession.sessionNotes && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Session Notes:
                      </span>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedSession.sessionNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TherapistSessionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TherapistSessionsContent />
    </Suspense>
  );
}
