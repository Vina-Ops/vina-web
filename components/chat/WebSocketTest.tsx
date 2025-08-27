"use client";

import React, { useState } from "react";
import { getChatWebSocketService } from "@/services/chat-service";
import { getWebSocketUrl } from "@/lib/websocket-config";

export const WebSocketTest: React.FC = () => {
  const [testMessage, setTestMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testConnection = () => {
    const service = getChatWebSocketService();
    addLog("Testing WebSocket connection...");
    addLog(`WebSocket URL: ${getWebSocketUrl()}`);
    addLog(
      `Connection status: ${
        service.isConnected() ? "Connected" : "Disconnected"
      }`
    );
  };

  const sendTestMessage = () => {
    if (testMessage.trim()) {
      const service = getChatWebSocketService();
      addLog(`Sending test message: "${testMessage}"`);
      service.sendMessage(testMessage);
      setTestMessage("");
    }
  };

  const disconnect = () => {
    const service = getChatWebSocketService();
    addLog("Disconnecting WebSocket...");
    service.disconnect();
  };

  const reconnect = () => {
    addLog("Reconnecting WebSocket...");
    // The service will automatically reconnect
  };

  // Set up event listeners for testing
  React.useEffect(() => {
    const service = getChatWebSocketService();

    const handleMessage = (message: any) => {
      addLog(`Received message: ${JSON.stringify(message)}`);
    };

    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
      addLog(`Connection changed: ${connected ? "Connected" : "Disconnected"}`);
    };

    const handleError = (error: string) => {
      addLog(`Error: ${error}`);
    };

    service.onMessage(handleMessage);
    service.onConnectionChange(handleConnectionChange);
    service.onError(handleError);

    // Check initial status
    setIsConnected(service.isConnected());

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">WebSocket Test Panel</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Connection
          </button>

          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>

          <button
            onClick={reconnect}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Reconnect
          </button>

          <span
            className={`px-2 py-1 rounded text-sm ${
              isConnected
                ? "bg-green-200 text-green-800"
                : "bg-yellow-200 text-yellow-800"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={(e) => e.key === "Enter" && sendTestMessage()}
          />
          <button
            onClick={sendTestMessage}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Send
          </button>
        </div>

        <div className="bg-white p-3 rounded border max-h-64 overflow-y-auto">
          <h4 className="font-semibold mb-2">Logs:</h4>
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-gray-600 mb-1">
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-sm text-gray-400">No logs yet...</div>
          )}
        </div>
      </div>
    </div>
  );
};
