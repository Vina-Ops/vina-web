"use client";

import React from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";

interface SearchResultsProps {
  results: Message[];
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
}) => {
  // Group results by date
  const groupResultsByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  // Get relative date string
  const getRelativeDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return "Today";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      const diffTime = Math.abs(today.getTime() - messageDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    }
  };

  // Highlight search terms in text
  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const groupedResults = groupResultsByDate(results);
  const sortedDates = Object.keys(groupedResults).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-lg font-medium mb-2">No results found</div>
        <div className="text-sm">Try searching for different keywords</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {sortedDates.map((date) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm text-gray-600 font-medium">
                {getRelativeDate(new Date(date))}
              </span>
            </div>
          </div>

          {/* Messages for this date */}
          {groupedResults[date].map((message) => (
            <div key={message.id} className="mb-4">
              <ChatMessage
                message={{
                  ...message,
                  content:
                    typeof message.content === "string"
                      ? highlightSearchTerms(message.content, searchQuery)
                      : message.content,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
