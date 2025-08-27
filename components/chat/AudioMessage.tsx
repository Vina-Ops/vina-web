"use client";

import React, { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface AudioMessageProps {
  audioUrl: string;
  duration: number; // in seconds
  isUserMessage?: boolean;
  onTranscribe?: (transcription: string) => void;
}

export const AudioMessage: React.FC<AudioMessageProps> = ({
  audioUrl,
  duration,
  isUserMessage = false,
  onTranscribe,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate waveform bars (mock data for now)
  const generateWaveform = () => {
    const bars = 20;
    return Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);
  };

  const waveform = generateWaveform();

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTranscribe = async () => {
    if (onTranscribe) {
      // Mock transcription for now
      // In a real app, you would send the audio to a transcription service
      const mockTranscription = "This is a mock transcription of the audio message.";
      onTranscribe(mockTranscription);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isUserMessage
            ? "bg-white/20 hover:bg-white/30 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>

      {/* Waveform */}
      <div className="flex items-center space-x-1 flex-1">
        {waveform.map((height, index) => (
          <div
            key={index}
            className={`rounded-sm transition-all duration-200 ${
              isUserMessage ? "bg-white/60" : "bg-gray-400"
            }`}
            style={{
              width: "2px",
              height: `${height * 24}px`,
              opacity: currentTime / duration > index / waveform.length ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <span
        className={`text-sm font-medium ${
          isUserMessage ? "text-white" : "text-gray-600"
        }`}
      >
        {formatTime(duration)}
      </span>

      {/* Transcribe Button (for user messages) */}
      {isUserMessage && onTranscribe && (
        <button
          onClick={handleTranscribe}
          className="ml-2 px-2 py-1 text-xs bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
        >
          Transcribe
        </button>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
};
