"use client";

import React from "react";
import ConnectionMonitor from "@/components/websocket/ConnectionMonitor";
import ConnectionStatus from "@/components/websocket/ConnectionStatus";

export default function WebSocketMonitorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                WebSocket Connection Monitor
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monitor and manage WebSocket connections across the application
              </p>
            </div>
            <ConnectionStatus showDetails={false} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConnectionMonitor />
      </div>
    </div>
  );
}
