"use client";

import React from "react";

interface LinkPreviewProps {
  url: string;
  title?: string;
  description?: string;
  image?: string | null;
  siteName?: string | null;
  isUserMessage?: boolean;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  title,
  description,
  image,
  siteName,
  isUserMessage = false,
}) => {
  // Extract domain from URL
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  // Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const domain = getDomain(url);

  return (
    <div className="mt-2">
      {/* Clickable URL */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm underline hover:opacity-80 transition-opacity ${
          isUserMessage ? "text-white" : "text-green"
        }`}
      >
        {url}
      </a>

      {/* Link Preview Card */}
      <div
        className={`mt-2 rounded-lg overflow-hidden ${
          isUserMessage
            ? "bg-white/40 backdrop-blur-lg border text-black border-green/30"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        {/* Image */}
        {image && (
          <div className="w-full h-32 bg-gray-200">
            <img
              src={image}
              alt={title || "Link preview"}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide image on error
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-3">
          {/* Domain/Site Name */}
          <div
            className={`text-xs mb-1 ${
              isUserMessage ? "text-blue-100/70" : "text-gray-500"
            }`}
          >
            {siteName || domain}
          </div>

          {/* Title */}
          {title && (
            <div
              className={`font-semibold text-sm mb-1 ${
                isUserMessage ? "text-green/90" : "text-gray-900"
              }`}
            >
              {truncateText(title, 80)}
            </div>
          )}

          {/* Description */}
          {description && (
            <div
              className={`text-sm ${
                isUserMessage ? "text-green/80" : "text-gray-600"
              }`}
            >
              {truncateText(description, 120)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
