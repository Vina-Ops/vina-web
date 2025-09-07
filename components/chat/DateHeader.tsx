"use client";

import React from "react";
import { Message } from "@/types/chat";

interface DateHeaderProps {
  messages: Message[];
  currentDate?: Date;
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  messages,
  currentDate,
}) => {
  // Use the current date from props, or get it from the first message, or use today
  const dateToShow =
    currentDate || (messages.length > 0 ? messages[0].timestamp : new Date());

  const formattedDate = new Date(dateToShow).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex justify-center absolute top-5 left-[20%] right-0 z-50 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200 pointer-events-auto">
        <span className="text-sm text-gray-600 font-medium">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};
