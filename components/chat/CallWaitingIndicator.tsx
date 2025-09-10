import React, { useState } from "react";
import { Users, Phone, PhoneOff, ChevronDown, ChevronUp } from "lucide-react";
import { QueuedCall } from "@/hooks/usePeerVideoCall";

interface CallWaitingIndicatorProps {
  queuedCalls: QueuedCall[];
  waitingCallsCount: number;
  onAcceptQueuedCall: (callId: string) => void;
  onRejectQueuedCall: (callId: string) => void;
  isMobile?: boolean;
}

const CallWaitingIndicator: React.FC<CallWaitingIndicatorProps> = ({
  queuedCalls,
  waitingCallsCount,
  onAcceptQueuedCall,
  onRejectQueuedCall,
  isMobile = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (waitingCallsCount === 0) {
    return null;
  }

  const formatWaitTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div
      className={`absolute ${
        isMobile ? "top-2 right-2" : "top-4 right-4"
      } z-50`}
    >
      {/* Main Indicator */}
      <div className="bg-orange-600 text-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 ${
            isMobile ? "px-3 py-2" : "px-4 py-3"
          } hover:bg-orange-700 transition-colors`}
        >
          <div className="relative">
            <Users className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
              {waitingCallsCount}
            </div>
          </div>
          <span className={`${isMobile ? "text-sm" : "text-base"} font-medium`}>
            Call Waiting
          </span>
          {isExpanded ? (
            <ChevronUp className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
          ) : (
            <ChevronDown className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
          )}
        </button>

        {/* Expanded List */}
        {isExpanded && (
          <div
            className={`${
              isMobile ? "max-w-xs" : "max-w-sm"
            } bg-white/95 backdrop-blur-sm border-t border-orange-200`}
          >
            <div
              className={`${
                isMobile ? "p-2" : "p-3"
              } space-y-2 max-h-64 overflow-y-auto`}
            >
              {queuedCalls.map((queuedCall, index) => (
                <div
                  key={queuedCall.id}
                  className={`bg-gray-50 rounded-lg p-3 border ${
                    index === 0
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {/* Caller Avatar */}
                      <div
                        className={`${
                          isMobile ? "w-8 h-8" : "w-10 h-10"
                        } rounded-full overflow-hidden bg-gray-300 flex-shrink-0`}
                      >
                        {queuedCall.caller.avatar ? (
                          <img
                            src={queuedCall.caller.avatar}
                            alt={queuedCall.caller.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                            {queuedCall.caller.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Caller Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`${
                            isMobile ? "text-xs" : "text-sm"
                          } font-medium text-gray-900 truncate`}
                        >
                          {queuedCall.caller.name}
                        </p>
                        <p
                          className={`${
                            isMobile ? "text-xs" : "text-sm"
                          } text-gray-500`}
                        >
                          Waiting {formatWaitTime(queuedCall.timestamp)}
                        </p>
                        {index === 0 && (
                          <span
                            className={`${
                              isMobile ? "text-xs" : "text-sm"
                            } text-orange-600 font-medium`}
                          >
                            Next
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {/* Accept Button */}
                      <button
                        onClick={() => onAcceptQueuedCall(queuedCall.id)}
                        className={`${
                          isMobile ? "p-1.5" : "p-2"
                        } bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors`}
                        title="Accept Call"
                      >
                        <Phone className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => onRejectQueuedCall(queuedCall.id)}
                        className={`${
                          isMobile ? "p-1.5" : "p-2"
                        } bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors`}
                        title="Reject Call"
                      >
                        <PhoneOff
                          className={isMobile ? "h-3 w-3" : "h-4 w-4"}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className={`${
                isMobile ? "px-2 py-1" : "px-3 py-2"
              } bg-gray-100 border-t border-gray-200`}
            >
              <p
                className={`${
                  isMobile ? "text-xs" : "text-sm"
                } text-gray-600 text-center`}
              >
                {waitingCallsCount} call{waitingCallsCount !== 1 ? "s" : ""}{" "}
                waiting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallWaitingIndicator;
