"use client";

import React, { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";

interface SearchPageProps {
  messages: Message[];
  onClose: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  messages,
  onClose,
}) => {
  const [isSearching, setIsSearching] = useState(true); // Start with search active
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchResults = (results: Message[]) => {
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle keyboard shortcuts for search page
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape to close search page
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Search Header */}
      {/* <SearchHeader onClose={onClose} /> */}

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <SearchBar
          messages={messages}
          onSearchResults={handleSearchResults}
          onClearSearch={handleClearSearch}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-hidden">
        {searchResults.length > 0 || searchQuery ? (
          <SearchResults results={searchResults} searchQuery={searchQuery} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-lg font-medium mb-2">Search your messages</div>
            <div className="text-sm text-center max-w-md">
              Find specific conversations, topics, or information from your chat
              history
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
