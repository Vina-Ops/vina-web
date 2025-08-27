"use client";

import React from "react";
import { X } from "lucide-react";

interface SearchHeaderProps {
  onClose: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        {/* Logo placeholder - you can replace with your actual logo */}
        <div className="w-8 h-8 bg-[#013F25] rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">V</span>
        </div>

        {/* Search Title */}
        <h1 className="text-lg font-semibold text-[#013F25]">
          Search messages
        </h1>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Close search"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};
