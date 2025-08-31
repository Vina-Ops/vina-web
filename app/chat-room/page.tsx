"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  User,
  Loader2,
} from "lucide-react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { usePathname } from "next/navigation";
import { getMyTherapySessions } from "@/services/general-service";

// Interface for therapy session data
interface TherapySession {
  id: string;
  therapist_name?: string;
  therapist_first_name?: string;
  therapist_last_name?: string;
  last_message?: string;
  last_message_timestamp?: string;
  unread_count?: number;
  is_online?: boolean;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export default function ChatRoomPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => {
    if (!item.href) return { ...item, isActive: false };

    // Exact match - highest priority
    if (pathname === item.href) {
      return { ...item, isActive: true };
    }

    // For home page, only match exact "/" and nothing else
    if (item.href === "/") {
      return { ...item, isActive: pathname === "/" };
    }

    // For other pages, check if current path starts with the href + "/"
    // This ensures /chat-room matches /chat-room/123 but not /chat-room-settings
    const isActive = pathname.startsWith(item.href + "/");

    return { ...item, isActive };
  });

  // Fetch therapy sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyTherapySessions();
        setSessions(data);
      } catch (err: any) {
        setError(err.message || "Failed to load therapy sessions");
        console.error("Error fetching therapy sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Helper function to get therapist name
  const getTherapistName = (session: TherapySession) => {
    if (session.therapist_name) return session.therapist_name;
    if (session.therapist_first_name && session.therapist_last_name) {
      return `Dr. ${session.therapist_first_name} ${session.therapist_last_name}`;
    }
    return "Unknown Therapist";
  };

  // Helper function to get therapist initials
  const getTherapistInitials = (session: TherapySession) => {
    const name = getTherapistName(session);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const filteredSessions = sessions.filter((session) => {
    const therapistName = getTherapistName(session);
    const matchesSearch = therapistName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "online" && session.is_online) ||
      (filter === "unread" && (session.unread_count || 0) > 0);
    return matchesSearch && matchesFilter;
  });

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
          <div className="flex h-full flex-col lg:flex-row">
            {/* Chat Sessions Sidebar */}
            <div className="w-full lg:w-80 border-b lg:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 lg:h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-green mb-4 ml-4 md:ml-0">
                  Chat Sessions
                </h1>

                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        filter === "all"
                          ? "bg-green text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("online")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        filter === "online"
                          ? "bg-green text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      Online
                    </button>
                    <button
                      onClick={() => setFilter("unread")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        filter === "unread"
                          ? "bg-green text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      Unread
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Sessions List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      Loading sessions...
                    </span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <p className="text-red-600 dark:text-red-400 mb-2">
                        {error}
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-green hover:text-green/80 text-sm"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm
                          ? "No sessions found"
                          : "No therapy sessions yet"}
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session.id)}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedSession === session.id
                          ? "bg-green/10 border-green/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center text-white font-semibold">
                            {getTherapistInitials(session)}
                          </div>
                          {session.is_online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {getTherapistName(session)}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {session.last_message_timestamp
                                  ? formatTimestamp(
                                      session.last_message_timestamp
                                    )
                                  : session.updated_at
                                  ? formatTimestamp(session.updated_at)
                                  : "No activity"}
                              </span>
                              {(session.unread_count || 0) > 0 && (
                                <span className="bg-green text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {session.unread_count}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                            {session.last_message || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-0">
              {selectedSession ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Select a chat session
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose a session from the sidebar to start chatting
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Welcome to Chat Sessions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a chat session from the sidebar to start chatting
                      with your therapist
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
