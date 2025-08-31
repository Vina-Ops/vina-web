"use client";

import React, { useState } from "react";
import { Search, Filter, MessageSquare, Clock, User } from "lucide-react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { usePathname } from "next/navigation";

// Mock data for chat sessions
const mockChatSessions = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    lastMessage: "How are you feeling today?",
    timestamp: "2 hours ago",
    unreadCount: 2,
    avatar: "SJ",
    isOnline: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    lastMessage: "Let's discuss your progress...",
    timestamp: "1 day ago",
    unreadCount: 0,
    avatar: "MC",
    isOnline: false,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    lastMessage: "I'm here to support you.",
    timestamp: "3 days ago",
    unreadCount: 1,
    avatar: "ER",
    isOnline: true,
  },
  {
    id: "4",
    name: "Dr. David Thompson",
    lastMessage: "Great work on your exercises!",
    timestamp: "1 week ago",
    unreadCount: 0,
    avatar: "DT",
    isOnline: false,
  },
];

export default function ChatRoomPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const pathname = usePathname();

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => ({
    ...item,
    isActive: item.href
      ? pathname === item.href || pathname.startsWith(item.href)
      : false,
  }));

  const filteredSessions = mockChatSessions.filter((session) => {
    const matchesSearch = session.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "online" && session.isOnline) ||
      (filter === "unread" && session.unreadCount > 0);
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
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 ml-4 md:ml-0">
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
                {filteredSessions.map((session) => (
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
                          {session.avatar}
                        </div>
                        {session.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {session.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {session.timestamp}
                            </span>
                            {session.unreadCount > 0 && (
                              <span className="bg-green text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {session.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {session.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
