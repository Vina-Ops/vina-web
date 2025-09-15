"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";

interface MessageBubble {
  id: string;
  content: string;
  side: "left" | "right" | "top";
  delay: number;
  duration: number;
  position: number;
}

// This will be generated dynamically based on translations

export const PopupMessageBubbles: React.FC = () => {
  const [visibleBubbles, setVisibleBubbles] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  // Generate message bubbles from translations
  const messageBubbles: MessageBubble[] = [
    {
      id: "1",
      content: t("popupBubbles.messages.0"),
      side: "left",
      delay: 0,
      duration: 2500,
      position: 15,
    },
    {
      id: "2",
      content: t("popupBubbles.messages.1"),
      side: "top",
      delay: 800,
      duration: 2200,
      position: 35,
    },
    {
      id: "3",
      content: t("popupBubbles.messages.2"),
      side: "left",
      delay: 1600,
      duration: 2400,
      position: 55,
    },
    {
      id: "4",
      content: t("popupBubbles.messages.3"),
      side: "right",
      delay: 2400,
      duration: 2600,
      position: 25,
    },
    {
      id: "5",
      content: t("popupBubbles.messages.4"),
      side: "left",
      delay: 3200,
      duration: 2300,
      position: 75,
    },
    {
      id: "6",
      content: t("popupBubbles.messages.5"),
      side: "top",
      delay: 4000,
      duration: 2500,
      position: 45,
    },
    {
      id: "7",
      content: t("popupBubbles.messages.6"),
      side: "left",
      delay: 4800,
      duration: 2400,
      position: 20,
    },
    {
      id: "8",
      content: t("popupBubbles.messages.7"),
      side: "right",
      delay: 5600,
      duration: 2300,
      position: 60,
    },
    {
      id: "9",
      content: t("popupBubbles.messages.8"),
      side: "left",
      delay: 6400,
      duration: 2400,
      position: 40,
    },
    {
      id: "10",
      content: t("popupBubbles.messages.9"),
      side: "right",
      delay: 7200,
      duration: 2500,
      position: 30,
    },
    {
      id: "11",
      content: t("popupBubbles.messages.10"),
      side: "left",
      delay: 8000,
      duration: 2400,
      position: 65,
    },
    {
      id: "12",
      content: t("popupBubbles.messages.11"),
      side: "top",
      delay: 8800,
      duration: 2300,
      position: 50,
    },
    {
      id: "13",
      content: t("popupBubbles.messages.12"),
      side: "left",
      delay: 9600,
      duration: 2500,
      position: 25,
    },
    {
      id: "14",
      content: t("popupBubbles.messages.13"),
      side: "right",
      delay: 10400,
      duration: 2400,
      position: 70,
    },
    {
      id: "15",
      content: t("popupBubbles.messages.14"),
      side: "top",
      delay: 11200,
      duration: 2300,
      position: 35,
    },
    {
      id: "16",
      content: t("popupBubbles.messages.15"),
      side: "right",
      delay: 12000,
      duration: 2400,
      position: 55,
    },
    {
      id: "17",
      content: t("popupBubbles.messages.16"),
      side: "left",
      delay: 12800,
      duration: 2300,
      position: 15,
    },
    // {
    //   id: "18",
    //   content: t("popupBubbles.messages.17"),
    //   side: "right",
    //   delay: 13600,
    //   duration: 2400,
    //   position: 10,
    // },
    {
      id: "19",
      content: t("popupBubbles.messages.18"),
      side: "right",
      delay: 14400,
      duration: 2300,
      position: 5,
    },
  ];

  useEffect(() => {
    const totalDuration = 14400; // Total cycle duration (12 seconds)
    let cycleCount = 0;

    const runCycle = () => {
      const timeouts: NodeJS.Timeout[] = [];

      messageBubbles.forEach((bubble) => {
        // Show bubble
        const showTimeout = setTimeout(() => {
          setVisibleBubbles((prev) => new Set(prev).add(bubble.id));
        }, bubble.delay);

        // Hide bubble
        const hideTimeout = setTimeout(() => {
          setVisibleBubbles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(bubble.id);
            return newSet;
          });
        }, bubble.delay + bubble.duration);

        timeouts.push(showTimeout, hideTimeout);
      });

      // Schedule next cycle
      const nextCycleTimeout = setTimeout(() => {
        cycleCount++;
        runCycle();
      }, totalDuration);

      timeouts.push(nextCycleTimeout);

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    };

    const cleanup = runCycle();

    return cleanup;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {messageBubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute transition-all duration-500 ease-out ${
            visibleBubbles.has(bubble.id)
              ? "opacity-100 transform translate-x-0 translate-y-0"
              : bubble.side === "left"
              ? "opacity-0 transform -translate-x-full"
              : bubble.side === "right"
              ? "opacity-0 transform translate-x-full"
              : "opacity-0 transform -translate-y-full"
          }`}
          style={{
            top: bubble.side === "top" ? "4%" : `${bubble.position}%`,
            left:
              bubble.side === "left"
                ? "4%"
                : bubble.side === "top"
                ? `${bubble.position}%`
                : "auto",
            right: bubble.side === "right" ? "4%" : "auto",
            zIndex: 10,
          }}
        >
          <div
            className={`relative max-w-md px-4 py-3 rounded-2xl shadow-lg z-10 ${
              bubble.side === "left"
                ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-l-4 border-green-500"
                : bubble.side === "right"
                ? "bg-green text-white border-r-4 border-green"
                : "bg-gray-400 text-white border-t-4 border-gray-600"
            } transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="text-sm font-medium leading-relaxed">
              {bubble.content}
            </div>

            {/* Tail */}
            <div
              className={`absolute top-1/2 w-3 h-3 transform -translate-y-1/2 ${
                bubble.side === "left"
                  ? "-left-1.5 bg-white dark:bg-gray-800 border-l border-t border-green-500 rotate-45"
                  : "-right-1.5 bg-green-500 border-r border-t border-green-600 rotate-45"
              }`}
            />

            {/* Sparkle effect */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          </div>
        </div>
      ))}
    </div>
  );
};
