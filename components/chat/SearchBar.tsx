"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Message } from "@/types/chat";

interface SearchBarProps {
  messages: Message[];
  onSearchResults: (results: Message[]) => void;
  onClearSearch: () => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  messages,
  onSearchResults,
  onClearSearch,
  isSearching,
  setIsSearching,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when search is activated
  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  // Search through messages
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      onSearchResults([]);
      return;
    }

    const results = messages.filter((message) => {
      if (typeof message.content !== 'string') return false;
      const content = message.content.toLowerCase();
      const searchTerm = query.toLowerCase();
      return content.includes(searchTerm);
    });

    setSearchResults(results);
    onSearchResults(results);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Handle search activation
  const handleSearchActivate = () => {
    setIsSearching(true);
  };

  // Handle search deactivation
  const handleSearchDeactivate = () => {
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
    onClearSearch();
  };

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleSearchDeactivate();
    }
  };

  if (!isSearching) {
    return (
      <button
        onClick={handleSearchActivate}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search messages</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="flex-1 text-sm outline-none w-full bg-transparent placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
        <button
          onClick={handleSearchDeactivate}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
      )}
    </div>
  );
};
