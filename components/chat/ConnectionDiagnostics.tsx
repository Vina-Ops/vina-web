"use client";

import React, { useState } from "react";
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ConnectionDiagnostics as ConnectionDiagnosticsType } from "@/hooks/usePeerVideoCall";

interface ConnectionDiagnosticsProps {
  diagnostics: ConnectionDiagnosticsType;
  className?: string;
}

const ConnectionDiagnostics: React.FC<ConnectionDiagnosticsProps> = ({
  diagnostics,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConnectionStatusIcon = () => {
    switch (diagnostics.iceConnectionState) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "connecting":
      case "checking":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (diagnostics.iceConnectionState) {
      case "connected":
        return "text-green-600 bg-green-50 border-green-200";
      case "connecting":
      case "checking":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "disconnected":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getConnectionStatusText = () => {
    switch (diagnostics.iceConnectionState) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "checking":
        return "Checking connection...";
      case "failed":
        return "Connection failed";
      case "disconnected":
        return "Disconnected";
      case "completed":
        return "Connection established";
      default:
        return "Unknown";
    }
  };

  const getTroubleshootingTips = () => {
    if (diagnostics.iceConnectionState === "failed") {
      return [
        "Check your internet connection",
        "Try refreshing the page",
        "Check if your firewall is blocking WebRTC",
        "Try using a different network (mobile hotspot)",
        "Contact support if the issue persists"
      ];
    }
    
    if (diagnostics.iceConnectionState === "disconnected") {
      return [
        "Check your internet connection",
        "Try reconnecting to the call",
        "Check if your network is stable"
      ];
    }
    
    return [];
  };

  const troubleshootingTips = getTroubleshootingTips();

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {getConnectionStatusIcon()}
          <div>
            <h3 className="font-medium text-gray-900">
              Connection Status
            </h3>
            <p className={`text-sm px-2 py-1 rounded-full border inline-block ${getConnectionStatusColor()}`}>
              {getConnectionStatusText()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {diagnostics.iceCandidates} ICE candidates
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Troubleshooting Tips */}
      {troubleshootingTips.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Troubleshooting Tips:
              </h4>
              <ul className="mt-1 text-sm text-yellow-700 space-y-1">
                {troubleshootingTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-yellow-600">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {/* Connection States */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Connection States</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ICE Connection:</span>
                  <span className={`font-medium ${
                    diagnostics.iceConnectionState === "connected" ? "text-green-600" :
                    diagnostics.iceConnectionState === "failed" ? "text-red-600" :
                    "text-yellow-600"
                  }`}>
                    {diagnostics.iceConnectionState}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ICE Gathering:</span>
                  <span className="font-medium text-gray-900">
                    {diagnostics.iceGatheringState}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connection:</span>
                  <span className="font-medium text-gray-900">
                    {diagnostics.connectionState}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Signaling:</span>
                  <span className="font-medium text-gray-900">
                    {diagnostics.signalingState}
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Candidate Info</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ICE Candidates:</span>
                  <span className="font-medium text-gray-900">
                    {diagnostics.iceCandidates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Local Type:</span>
                  <span className="font-medium text-gray-900">
                    {diagnostics.localCandidateType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remote Type:</span>
                  <span className="font-medium text-gray-900">
                    {diagnostics.remoteCandidateType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connection Type:</span>
                  <span className="font-medium text-gray-900">
                    {diagnostics.connectionType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Server Usage */}
          {(diagnostics.turnServersUsed.length > 0 || diagnostics.stunServersUsed.length > 0) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Servers Used</h4>
              <div className="space-y-2">
                {diagnostics.turnServersUsed.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-600">TURN Servers:</span>
                    <div className="mt-1 space-y-1">
                      {diagnostics.turnServersUsed.map((server, index) => (
                        <div key={index} className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                          {server}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {diagnostics.stunServersUsed.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-green-600">STUN Servers:</span>
                    <div className="mt-1 space-y-1">
                      {diagnostics.stunServersUsed.map((server, index) => (
                        <div key={index} className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
                          {server}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionDiagnostics;
