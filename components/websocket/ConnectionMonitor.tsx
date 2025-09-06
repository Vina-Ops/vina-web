"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Wifi,
  WifiOff,
  X,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Server,
} from "lucide-react";
import { wsMonitoringTracker } from "@/utils/websocket-monitoring-tracker";

interface ConnectionMonitorProps {
  className?: string;
}

const ConnectionMonitor: React.FC<ConnectionMonitorProps> = ({
  className = "",
}) => {
  const [connections, setConnections] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    limit: 30,
    available: 30,
  });
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Real-time updates
  useEffect(() => {
    const updateStats = (newStats: any) => {
      setStats(newStats);
      setConnections(newStats.connections);
    };

    // Subscribe to changes
    const unsubscribe = wsMonitoringTracker.onStatsChange(updateStats);

    // Initial load
    updateStats(wsMonitoringTracker.getStats());

    return unsubscribe;
  }, []);

  const handleCloseConnection = async (id: string) => {
    setIsLoading(true);
    try {
      const success = wsMonitoringTracker.closeConnection(id);
      if (!success) {
        alert("Failed to close connection - it may already be closed");
      }
    } catch (error) {
      console.error("Error closing connection:", error);
      alert("Error closing connection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveConnection = async (id: string) => {
    if (!confirm("Remove this connection from tracking?")) return;

    setIsLoading(true);
    try {
      wsMonitoringTracker.removeConnection(id);
    } catch (error) {
      console.error("Error removing connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOldest = async () => {
    const count = 3;
    if (!confirm(`Close the ${count} oldest connections?`)) return;

    setIsLoading(true);
    try {
      const closedIds = wsMonitoringTracker.closeOldestConnections(count);
      alert(`Closed ${closedIds.length} connections`);
    } catch (error) {
      console.error("Error closing connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600 bg-green-50 border-green-200";
      case "connecting":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "disconnected":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4" />;
      case "connecting":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const filteredConnections = connections.filter((conn) => {
    if (filter === "all") return true;
    return conn.status === filter;
  });

  const usagePercentage = (stats.active / stats.limit) * 100;
  const isHighUsage = usagePercentage > 80;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            WebSocket Connections
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and manage your WebSocket connections
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCloseOldest}
            disabled={isLoading || stats.active < 3}
            className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Close Oldest
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Active</p>
              <p className="text-2xl font-bold text-blue-900">{stats.active}</p>
            </div>
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Available</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.available}
              </p>
            </div>
            <Server className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.total}
              </p>
            </div>
            <Wifi className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            isHighUsage
              ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
              : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  isHighUsage ? "text-red-700" : "text-gray-700"
                }`}
              >
                Usage
              </p>
              <p
                className={`text-2xl font-bold ${
                  isHighUsage ? "text-red-900" : "text-gray-900"
                }`}
              >
                {Math.round(usagePercentage)}%
              </p>
            </div>
            {isHighUsage && <AlertTriangle className="h-6 w-6 text-red-600" />}
          </div>
          {isHighUsage && (
            <p className="text-xs text-red-600 mt-1">High usage warning</p>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All ({stats.total})</option>
            <option value="connected">
              Connected (
              {connections.filter((c) => c.status === "connected").length})
            </option>
            <option value="connecting">
              Connecting (
              {connections.filter((c) => c.status === "connecting").length})
            </option>
            <option value="disconnected">
              Disconnected (
              {connections.filter((c) => c.status === "disconnected").length})
            </option>
            <option value="error">
              Error ({connections.filter((c) => c.status === "error").length})
            </option>
          </select>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredConnections.length} connections
        </p>
      </div>

      {/* Connections List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredConnections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wifi className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No connections found</p>
          </div>
        ) : (
          filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full border ${getStatusColor(
                    connection.status
                  )}`}
                >
                  {getStatusIcon(connection.status)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{connection.id}</p>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {connection.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {formatTimeAgo(connection.createdAt)}</span>
                    <span>
                      Last activity: {formatTimeAgo(connection.lastActivity)}
                    </span>
                  </div>
                  {connection.url && (
                    <p className="text-xs text-gray-400 truncate max-w-md">
                      {connection.url}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {connection.status === "connected" && (
                  <button
                    onClick={() => handleCloseConnection(connection.id)}
                    disabled={isLoading}
                    className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md disabled:opacity-50"
                    title="Close Connection"
                  >
                    <WifiOff className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleRemoveConnection(connection.id)}
                  disabled={isLoading}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50"
                  title="Remove from Tracking"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectionMonitor;
