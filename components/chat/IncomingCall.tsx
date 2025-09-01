"use client";

import React, { useEffect } from "react";
import { Phone, PhoneOff, Video } from "lucide-react";
import { CallParticipant } from "@/services/video-call-service";
import notificationSound from "@/utils/notification-sound";
import { useNotification } from "@/context/notification-context";

interface IncomingCallProps {
  isVisible: boolean;
  caller: CallParticipant;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCall({
  isVisible,
  caller,
  onAccept,
  onReject,
}: IncomingCallProps) {
  const { settings } = useNotification();
  
  // Play incoming call sound when call becomes visible
  useEffect(() => {
    if (isVisible && settings.incomingCallSoundEnabled) {
      notificationSound.playIncomingCall(settings.volume);
    }
  }, [isVisible, settings.incomingCallSoundEnabled, settings.volume]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Caller Avatar */}
          <div className="relative mx-auto mb-4">
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-20 h-20 rounded-full object-cover mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Video className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Caller Info */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {caller.name}
          </h3>
          {caller.isTherapist && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
              Therapist
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Incoming video call...
          </p>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={onAccept}
              className="w-14 h-14 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center justify-center"
            >
              <Phone className="h-6 w-6" />
            </button>
            <button
              onClick={onReject}
              className="w-14 h-14 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center justify-center"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>

          {/* Call Animation */}
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

