"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
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
import { useChatVideoCall } from "@/hooks/useChatVideoCall";
import { CallParticipant } from "@/services/video-call-service";
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
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

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
    currentUserId: (user as any)?.id || "",
    roomId: currentChatSession?.id || "",
    token: tokens || undefined,
  });

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

  // Connect to therapist chat WS for selected room using unified payloads
  useEffect(() => {
    if (!tokens || !currentChatSession || !user || !showChat) return;

    const roomId = currentChatSession.id;
    const baseUrl =
      process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://vina-ai.onrender.com";
    const wsUrl = `${baseUrl}/safe-space/${roomId}?userId=${
      (user as any)?.id
    }&roomId=${roomId}&token=${tokens}`;

    console.log("Creating therapist chat WebSocket connection to:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnection(ws);
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data &&
          typeof data === "object" &&
          "content" in data &&
          ("sender" in data || "timestamp" in data)
        ) {
          const incoming: Message = {
            id: data.id || `${Date.now()}`,
            content: data.content,
            sender: data.sender === (user as any)?.id ? "user" : "ai",
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
          };
          setMessages((prev) => [...prev, incoming]);
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onclose = (event) => {
      console.log("Therapist chat WebSocket closed:", event.code, event.reason);
      setWsConnected(false);
      setWsConnection(null);
    };

    ws.onerror = (error) => {
      console.error("Therapist chat WebSocket error:", error);
      setWsConnected(false);
      setWsConnection(null);
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
  }, [tokens, currentChatSession, user, showChat]);

  // Play notification sound for new messages in therapist chat
  useEffect(() => {
    if (messages.length > previousMessageCount && previousMessageCount > 0) {
      // Only play sound for incoming messages (not the first load)
      const newMessages = messages.slice(previousMessageCount);
      const hasIncomingMessages = newMessages.some(
        (msg) => msg.sender === "ai"
      );

      if (hasIncomingMessages && settings.soundEnabled) {
        notificationSound.play(settings.volume);
      }
    }
    setPreviousMessageCount(messages.length);
  }, [messages, previousMessageCount]);

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
    setMessages([]);
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
      const roomId = await createChatRoom(currentChatSession.patientId);
      console.log("Video call room created:", roomId);
    } catch (error) {
      console.error("Failed to start video call:", error);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const content = chatMessage.trim();
    if (!content) return;

    // optimistic UI
    const outgoing: Message = {
      id: `${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, outgoing]);

    // send unified format
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({ content }));
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Session: {formatDate(currentChatSession.date)} at{" "}
                      {formatTime(currentChatSession.time)}
                    </p>
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
                  <button
                    onClick={handleCloseChat}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
                    title="Close Chat"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

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
                <form
                  onSubmit={handleSendChatMessage}
                  className="flex items-end gap-3"
                >
                  <div className="flex-1 relative">
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full resize-none rounded-lg border py-2 px-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      rows={1}
                      style={{
                        minHeight: "44px",
                        maxHeight: "100px",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!chatMessage.trim()}
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-600 text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    title="Send Message"
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
      {callState.isInCall && (
        <VideoCall
          isOpen={callState.isInCall}
          onClose={() => endCall()}
          participants={Array.from(remoteStreams.keys()).map((userId) => ({
            id: userId,
            name: currentChatSession?.patientName || "Patient",
            avatar: currentChatSession?.patientAvatar || "",
            isTherapist: false,
            isMuted: false,
            isVideoEnabled: true,
          }))}
          currentUserId={(user as any)?.id || ""}
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
