"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Activity,
  MemoryStick,
  Users,
  Key,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Search,
  Eye,
  Zap,
} from "lucide-react";

interface RedisMonitorData {
  info: Record<string, any>;
  memory: {
    used: string;
    peak: string;
    fragmentation: string;
  };
  clients: {
    connected: number;
    blocked: number;
  };
  stats: {
    totalConnections: number;
    instantaneousOps: number;
    keyspace: Record<string, any>;
  };
  keys: {
    total: number;
    byType: Record<string, number>;
    sample: string[];
  };
  performance: {
    latency: number;
    uptime: string;
    version: string;
  };
}

interface RedisMonitorProps {
  className?: string;
}

const RedisMonitor: React.FC<RedisMonitorProps> = ({ className = "" }) => {
  const [data, setData] = useState<RedisMonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [command, setCommand] = useState("");
  const [commandResult, setCommandResult] = useState<any>(null);

  // Fetch Redis data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/redis-monitor");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setLastUpdate(new Date());
      } else {
        setError(result.error || "Failed to fetch Redis data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Execute Redis command
  const executeCommand = async (
    action: string,
    command?: string,
    key?: string,
    value?: string
  ) => {
    try {
      const response = await fetch("/api/redis-monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, command, key, value }),
      });

      const result = await response.json();

      if (result.success) {
        setCommandResult(result.result);
        if (action === "getKeyInfo") {
          setKeyInfo(result.result);
        }
        // Refresh data after command execution
        await fetchData();
      } else {
        setError(result.error || "Command failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Command execution failed");
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Get status color based on metrics
  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good)
      return "text-green-600 bg-green-50 border-green-200";
    if (value <= thresholds.warning)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (loading && !data) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading Redis data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div className="ml-3">
            <p className="text-red-600 font-medium">Redis Connection Error</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Database className="h-6 w-6 mr-2 text-red-600" />
            Redis Monitor
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time Redis database monitoring and management
          </p>
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            Auto-refresh
          </label>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Memory Usage */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Memory Used</p>
              <p className="text-2xl font-bold text-blue-900">
                {data.memory.used}
              </p>
              <p className="text-xs text-blue-600">Peak: {data.memory.peak}</p>
            </div>
            <MemoryStick className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {/* Connected Clients */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">
                Connected Clients
              </p>
              <p className="text-2xl font-bold text-green-900">
                {data.clients.connected}
              </p>
              <p className="text-xs text-green-600">
                Blocked: {data.clients.blocked}
              </p>
            </div>
            <Users className="h-6 w-6 text-green-600" />
          </div>
        </div>

        {/* Total Keys */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Keys</p>
              <p className="text-2xl font-bold text-purple-900">
                {data.keys.total}
              </p>
              <p className="text-xs text-purple-600">
                Types: {Object.keys(data.keys.byType).length}
              </p>
            </div>
            <Key className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        {/* Operations Per Second */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Ops/Sec</p>
              <p className="text-2xl font-bold text-orange-900">
                {data.stats.instantaneousOps}
              </p>
              <p className="text-xs text-orange-600">
                Latency: {data.performance.latency}ms
              </p>
            </div>
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Uptime</p>
              <p className="text-lg font-bold text-gray-900">
                {data.performance.uptime}
              </p>
            </div>
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Version</p>
              <p className="text-lg font-bold text-gray-900">
                {data.performance.version}
              </p>
            </div>
            <Database className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Memory Fragmentation
              </p>
              <p className="text-lg font-bold text-gray-900">
                {data.memory.fragmentation}
              </p>
            </div>
            <Zap className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Key Types Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Key Types Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(data.keys.byType).map(([type, count]) => (
            <div key={type} className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm font-medium text-gray-700 capitalize">
                {type}
              </p>
              <p className="text-xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Explorer */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Key Explorer
          </h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                placeholder="Enter key name..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() =>
                  executeCommand("getKeyInfo", undefined, selectedKey)
                }
                disabled={!selectedKey}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            {keyInfo && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">
                  Key Info: {selectedKey}
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Type:</span> {keyInfo.type}
                  </p>
                  <p>
                    <span className="font-medium">TTL:</span> {keyInfo.ttl}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span> {keyInfo.size}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Command Execution */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Command Execution
          </h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <select
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select command...</option>
                <option value="GET">GET</option>
                <option value="SET">SET</option>
                <option value="DEL">DEL</option>
                <option value="FLUSHDB">FLUSHDB</option>
                <option value="FLUSHALL">FLUSHALL</option>
              </select>
              <button
                onClick={() => executeCommand("execute", command, selectedKey)}
                disabled={!command}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Execute
              </button>
            </div>

            {commandResult !== null && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">Result:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(commandResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sample Keys */}
      {data.keys.sample.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Sample Keys
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border max-h-40 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {data.keys.sample.map((key, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedKey(key)}
                  className="text-left p-2 bg-white rounded border hover:bg-gray-50 text-sm truncate"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedisMonitor;
