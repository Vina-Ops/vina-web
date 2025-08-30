"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  MessageSquare,
  Clock,
  User,
  UserCheck,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  therapistId?: string;
  therapistName?: string;
  status: "active" | "completed" | "abandoned";
  startTime: string;
  endTime?: string;
  duration: number;
  messageCount: number;
  userRating?: number;
  flagged: boolean;
  notes?: string;
}

const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    userId: "user_123",
    userName: "John Doe",
    therapistId: "therapist_456",
    therapistName: "Dr. Sarah Johnson",
    status: "completed",
    startTime: "2024-01-20 14:30:00",
    endTime: "2024-01-20 15:45:00",
    duration: 75,
    messageCount: 45,
    userRating: 5,
    flagged: false,
  },
  {
    id: "2",
    userId: "user_124",
    userName: "Jane Smith",
    status: "active",
    startTime: "2024-01-20 16:00:00",
    duration: 30,
    messageCount: 12,
    flagged: true,
    notes: "User expressed concerning thoughts",
  },
  {
    id: "3",
    userId: "user_125",
    userName: "Mike Johnson",
    therapistId: "therapist_457",
    therapistName: "Dr. Emily Rodriguez",
    status: "completed",
    startTime: "2024-01-20 13:15:00",
    endTime: "2024-01-20 14:00:00",
    duration: 45,
    messageCount: 28,
    userRating: 4,
    flagged: false,
  },
  {
    id: "4",
    userId: "user_126",
    userName: "Sarah Wilson",
    status: "abandoned",
    startTime: "2024-01-20 10:30:00",
    endTime: "2024-01-20 10:35:00",
    duration: 5,
    messageCount: 2,
    flagged: false,
  },
  {
    id: "5",
    userId: "user_127",
    userName: "David Brown",
    therapistId: "therapist_458",
    therapistName: "Dr. Lisa Thompson",
    status: "completed",
    startTime: "2024-01-20 09:00:00",
    endTime: "2024-01-20 10:30:00",
    duration: 90,
    messageCount: 67,
    userRating: 5,
    flagged: false,
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  abandoned: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusLabels = {
  active: "Active",
  completed: "Completed",
  abandoned: "Abandoned",
};

export default function ChatSessionsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(mockChatSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.therapistName &&
        session.therapistName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chat Sessions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and manage chat conversations between users and therapists
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
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
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
              {filteredSessions.length} of {sessions.length} sessions
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {session.userName}
                      </h3>
                      {session.flagged && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {session.userName}
                      </span>
                      {session.therapistName && (
                        <span className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-1" />
                          {session.therapistName}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateTime(session.startTime)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(session.duration)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {session.messageCount} messages
                      </span>
                      {session.userRating && (
                        <span className="flex items-center text-yellow-600">
                          {session.userRating}★
                        </span>
                      )}
                      {session.notes && (
                        <span className="text-orange-600 dark:text-orange-400">
                          Has notes
                        </span>
                      )}
                    </div>
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

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No chat sessions found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.length}
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
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.filter((s) => s.status === "completed").length}
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
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.filter((s) => s.status === "active").length}
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
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Flagged
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.filter((s) => s.flagged).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
