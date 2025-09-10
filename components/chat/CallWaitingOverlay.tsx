import React from "react";
import { Phone, PhoneOff, Clock, Users } from "lucide-react";
import { QueuedCall } from "@/hooks/usePeerVideoCall";

interface CallWaitingOverlayProps {
  queuedCalls: QueuedCall[];
  waitingCallsCount: number;
  onAcceptQueuedCall: (callId: string) => void;
  onRejectQueuedCall: (callId: string) => void;
  isMobile?: boolean;
}

const CallWaitingOverlay: React.FC<CallWaitingOverlayProps> = ({
  queuedCalls,
  waitingCallsCount,
  onAcceptQueuedCall,
  onRejectQueuedCall,
  isMobile = false,
}) => {
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
    <div className="absolute inset-0 z-40 bg-black bg-opacity-90 flex flex-col items-center justify-center">
      <div className={`text-center text-white ${isMobile ? "px-4" : "px-8"}`}>
        {/* Call Waiting Header */}
        <div className={`${isMobile ? "mb-6" : "mb-8"}`}>
          <div className="relative">
            <div
              className={`${
                isMobile ? "w-16 h-16" : "w-20 h-20"
              } bg-orange-600 rounded-full mx-auto animate-pulse`}
            ></div>
            <div
              className={`absolute inset-0 ${
                isMobile ? "w-16 h-16" : "w-20 h-20"
              } bg-orange-400 rounded-full mx-auto animate-ping`}
            ></div>
            <div
              className={`absolute inset-2 ${
                isMobile ? "w-12 h-12" : "w-16 h-16"
              } bg-orange-200 rounded-full mx-auto animate-pulse`}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className={isMobile ? "h-8 w-8" : "h-10 w-10"} />
            </div>
          </div>
        </div>

        {/* Call Waiting Text */}
        <h2
          className={`${isMobile ? "text-xl" : "text-2xl"} font-bold ${
            isMobile ? "mb-3" : "mb-4"
          }`}
        >
          Call Waiting
        </h2>

        <div
          className={`${isMobile ? "text-base" : "text-lg"} text-gray-300 ${
            isMobile ? "mb-6" : "mb-8"
          }`}
        >
          <p>
            {waitingCallsCount} call{waitingCallsCount !== 1 ? "s" : ""} waiting
          </p>
          <p
            className={`${isMobile ? "text-xs" : "text-sm"} text-gray-400 mt-2`}
          >
            Tap to answer or swipe to decline
          </p>
        </div>

        {/* Queued Calls List */}
        <div
          className={`space-y-3 ${isMobile ? "max-w-xs" : "max-w-md"} mx-auto`}
        >
          {queuedCalls.map((queuedCall, index) => (
            <div
              key={queuedCall.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 ${
                index === 0 ? "ring-2 ring-orange-400" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Caller Avatar */}
                  <div
                    className={`${
                      isMobile ? "w-10 h-10" : "w-12 h-12"
                    } rounded-full overflow-hidden bg-gray-600`}
                  >
                    {queuedCall.caller.avatar ? (
                      <img
                        src={queuedCall.caller.avatar}
                        alt={queuedCall.caller.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                        {queuedCall.caller.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Caller Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`${
                        isMobile ? "text-sm" : "text-base"
                      } font-medium text-white truncate`}
                    >
                      {queuedCall.caller.name}
                    </p>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock
                        className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
                      />
                      <span className={`${isMobile ? "text-xs" : "text-sm"}`}>
                        Waiting {formatWaitTime(queuedCall.timestamp)}
                      </span>
                    </div>
                    {index === 0 && (
                      <span
                        className={`${
                          isMobile ? "text-xs" : "text-sm"
                        } text-orange-400 font-medium`}
                      >
                        Next in queue
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Accept Button */}
                  <button
                    onClick={() => onAcceptQueuedCall(queuedCall.id)}
                    className={`${
                      isMobile ? "p-3" : "p-4"
                    } bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors`}
                    title="Accept Call"
                  >
                    <Phone className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => onRejectQueuedCall(queuedCall.id)}
                    className={`${
                      isMobile ? "p-3" : "p-4"
                    } bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors`}
                    title="Reject Call"
                  >
                    <PhoneOff className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className={`${isMobile ? "mt-6" : "mt-8"} text-center`}>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-400`}>
            You can accept one call at a time. Other calls will remain in queue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallWaitingOverlay;
