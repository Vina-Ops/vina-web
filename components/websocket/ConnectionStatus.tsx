"use client";

import React, { useState, useEffect } from "react";
import { Activity, Wifi, WifiOff, AlertTriangle, Server } from "lucide-react";
import { wsMonitoringTracker } from "@/utils/websocket-monitoring-tracker";

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = "",
  showDetails = false,
}) => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    limit: 30,
    available: 30,
    connections: [] as any[],
  });

  // Initialize connection tracker
  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = wsMonitoringTracker.onStatsChange(setStats);

    // Initial load
    setStats(wsMonitoringTracker.getStats());

    return unsubscribe;
  }, []);

  const isHighUsage = stats.active / stats.limit > 0.8;
  const usagePercentage = (stats.active / stats.limit) * 100;

  if (showDetails) {
    return (
      <div
        className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
          isHighUsage
            ? "bg-red-50 border border-red-200"
            : "bg-white border border-gray-200"
        } ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div
              className={`w-3 h-3 rounded-full ${
                stats.active === 0
                  ? "bg-gray-400"
                  : isHighUsage
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            />
            <span className="text-sm font-medium">
              {stats.active}/{stats.limit} connections
            </span>
          </div>

          {isHighUsage && (
            <button
              onClick={() => {
                const count = 3;
                if (confirm(`Close ${count} oldest connections?`)) {
                  const closed =
                    wsMonitoringTracker.closeOldestConnections(count);
                  console.log(`Closed ${closed.length} connections`);
                }
              }}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Free up slots
            </button>
          )}
        </div>

        {stats.available <= 5 && (
          <div className="mt-2 text-xs text-red-600">
            Warning: Only {stats.available} slots remaining
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          stats.active === 0
            ? "bg-gray-400"
            : isHighUsage
            ? "bg-red-500 animate-pulse"
            : "bg-green-500"
        }`}
      />
      <span
        className={`text-xs font-medium ${
          stats.active === 0
            ? "text-gray-500"
            : isHighUsage
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {stats.active}/{stats.limit}
      </span>
      {isHighUsage && <AlertTriangle className="h-3 w-3 text-red-500" />}
    </div>
  );
};

export default ConnectionStatus;
