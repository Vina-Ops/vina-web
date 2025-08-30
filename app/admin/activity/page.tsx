"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  UserCheck,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Activity,
  Download,
  Eye,
} from "lucide-react";

interface ActivityLog {
  id: string;
  type: "user" | "therapist" | "system" | "security" | "admin";
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "success" | "warning" | "error" | "info";
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    type: "user",
    action: "user_login",
    description: "User logged in successfully",
    userId: "user_123",
    userName: "john.doe@example.com",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20 15:30:00",
    severity: "low",
    status: "success",
  },
  {
    id: "2",
    type: "therapist",
    action: "therapist_approved",
    description: "Therapist profile approved by admin",
    userId: "therapist_456",
    userName: "Dr. Sarah Johnson",
    timestamp: "2024-01-20 14:45:00",
    severity: "medium",
    status: "success",
  },
  {
    id: "3",
    type: "security",
    action: "failed_login",
    description: "Multiple failed login attempts detected",
    userId: "user_789",
    userName: "unknown@example.com",
    ipAddress: "203.0.113.45",
    timestamp: "2024-01-20 14:20:00",
    severity: "high",
    status: "warning",
  },
  {
    id: "4",
    type: "system",
    action: "backup_completed",
    description: "Daily backup completed successfully",
    timestamp: "2024-01-20 02:00:00",
    severity: "low",
    status: "success",
  },
  {
    id: "5",
    type: "admin",
    action: "settings_updated",
    description: "System settings updated by admin",
    userId: "admin_001",
    userName: "admin@vina.com",
    timestamp: "2024-01-20 13:15:00",
    severity: "medium",
    status: "info",
  },
  {
    id: "6",
    type: "user",
    action: "user_registered",
    description: "New user registration",
    userId: "user_124",
    userName: "jane.smith@example.com",
    ipAddress: "198.51.100.23",
    timestamp: "2024-01-20 12:30:00",
    severity: "low",
    status: "success",
  },
  {
    id: "7",
    type: "security",
    action: "suspicious_activity",
    description: "Unusual activity pattern detected",
    userId: "user_125",
    userName: "mike.johnson@example.com",
    ipAddress: "203.0.113.67",
    timestamp: "2024-01-20 11:45:00",
    severity: "critical",
    status: "error",
  },
  {
    id: "8",
    type: "therapist",
    action: "session_completed",
    description: "Chat session completed",
    userId: "therapist_457",
    userName: "Dr. Emily Rodriguez",
    timestamp: "2024-01-20 10:30:00",
    severity: "low",
    status: "success",
  },
];

const activityTypes = [
  { value: "all", label: "All Activities", icon: Activity },
  { value: "user", label: "User Activities", icon: User },
  { value: "therapist", label: "Therapist Activities", icon: UserCheck },
  { value: "system", label: "System Activities", icon: Shield },
  { value: "security", label: "Security Events", icon: AlertTriangle },
  { value: "admin", label: "Admin Actions", icon: Shield },
];

const severityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
};

const statusIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("24h");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userName &&
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getTimeAgo = (dateTime: string) => {
    const now = new Date();
    const logTime = new Date(dateTime);
    const diffInMinutes = Math.floor(
      (now.getTime() - logTime.getTime()) / 60000
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Activity Log
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor system activities, user actions, and security events
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Events
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {logs.length}
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
                    Security Events
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {logs.filter((l) => l.type === "security").length}
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
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    User Activities
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {logs.filter((l) => l.type === "user").length}
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
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    System Events
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {logs.filter((l) => l.type === "system").length}
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
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {activityTypes.slice(1).map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
              {filteredLogs.length} of {logs.length} events
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const StatusIcon = statusIcons[log.status];
              return (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <StatusIcon
                          className={`h-5 w-5 ${statusColors[log.status]}`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {log.description}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            severityColors[log.severity]
                          }`}
                        >
                          {log.severity}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {log.userName && (
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {log.userName}
                          </span>
                        )}
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDateTime(log.timestamp)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {getTimeAgo(log.timestamp)}
                        </span>
                      </div>
                      {log.userAgent && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                          {log.userAgent}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No activity logs found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity by Type */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Activity by Type
            </h3>
            <div className="space-y-3">
              {activityTypes.slice(1).map((type) => {
                const count = logs.filter((l) => l.type === type.value).length;
                return (
                  <div
                    key={type.value}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <type.icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {type.label}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Severity Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(severityColors).map(([severity, colorClass]) => {
                const count = logs.filter(
                  (l) => l.severity === severity
                ).length;
                return (
                  <div
                    key={severity}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
                      >
                        {severity}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
