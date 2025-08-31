"use client";
import { useEffect, useRef, useState } from "react";

interface CompositionAnimationProps {
  className?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  duration?: number;
}

export default function CompositionAnimation({
  className = "",
  width = 400,
  height = 400,
  autoPlay = true,
  loop = true,
  duration = 3000,
}: CompositionAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Animation steps
  const animationSteps = [
    { name: "background", duration: 500 },
    { name: "main-shapes", duration: 800 },
    { name: "details", duration: 600 },
    { name: "highlights", duration: 400 },
    { name: "final", duration: 300 },
  ];

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(0);

    let stepIndex = 0;
    const animateStep = () => {
      if (stepIndex >= animationSteps.length) {
        if (loop) {
          stepIndex = 0;
          setTimeout(animateStep, 1000); // Pause before restart
        } else {
          setIsAnimating(false);
        }
        return;
      }

      setCurrentStep(stepIndex);
      stepIndex++;
      setTimeout(animateStep, animationSteps[stepIndex - 1].duration);
    };

    animateStep();
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }
  }, [autoPlay]);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox="0 0 400 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f3e6" stopOpacity="0">
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
                begin={currentStep >= 0 ? "0s" : "indefinite"}
              />
            </stop>
            <stop offset="100%" stopColor="#83cd20" stopOpacity="0.3">
              <animate
                attributeName="stop-opacity"
                values="0.3;0.8;0.3"
                dur="3s"
                repeatCount="indefinite"
                begin={currentStep >= 0 ? "0s" : "indefinite"}
              />
            </stop>
          </linearGradient>

          <radialGradient id="highlightGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8">
              <animate
                attributeName="stop-opacity"
                values="0.8;0.2;0.8"
                dur="2s"
                repeatCount="indefinite"
                begin={currentStep >= 3 ? "0s" : "indefinite"}
              />
            </stop>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0">
              <animate
                attributeName="stop-opacity"
                values="0;0.4;0"
                dur="2s"
                repeatCount="indefinite"
                begin={currentStep >= 3 ? "0s" : "indefinite"}
              />
            </stop>
          </radialGradient>

          {/* Filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Elements */}
        <g className="background-elements">
          {/* Main background circle */}
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="url(#bgGradient)"
            stroke="#034835"
            strokeWidth="2"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.5s"
              fill="freeze"
              begin={currentStep >= 0 ? "0s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;180"
              dur="0.8s"
              fill="freeze"
              begin={currentStep >= 0 ? "0s" : "indefinite"}
            />
          </circle>

          {/* Decorative circles */}
          <circle cx="100" cy="100" r="20" fill="#83cd20" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.6"
              dur="0.4s"
              fill="freeze"
              begin={currentStep >= 1 ? "0.2s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;20"
              dur="0.6s"
              fill="freeze"
              begin={currentStep >= 1 ? "0.2s" : "indefinite"}
            />
          </circle>

          <circle cx="300" cy="120" r="15" fill="#034835" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.7"
              dur="0.4s"
              fill="freeze"
              begin={currentStep >= 1 ? "0.4s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;15"
              dur="0.6s"
              fill="freeze"
              begin={currentStep >= 1 ? "0.4s" : "indefinite"}
            />
          </circle>

          <circle cx="80" cy="280" r="12" fill="#83cd20" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.5"
              dur="0.4s"
              fill="freeze"
              begin={currentStep >= 1 ? "0.6s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;12"
              dur="0.6s"
              fill="freeze"
              begin={currentStep >= 1 ? "0.6s" : "indefinite"}
            />
          </circle>
        </g>

        {/* Main Composition Elements */}
        <g className="main-composition">
          {/* Central geometric shape */}
          <path
            d="M 150 150 L 250 150 L 250 250 L 150 250 Z"
            fill="none"
            stroke="#034835"
            strokeWidth="3"
            opacity="0"
            strokeDasharray="400"
            strokeDashoffset="400"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="400;0"
              dur="1s"
              fill="freeze"
              begin={currentStep >= 1 ? "0s" : "indefinite"}
            />
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.5s"
              fill="freeze"
              begin={currentStep >= 1 ? "0s" : "indefinite"}
            />
            <animate
              attributeName="fill"
              values="transparent;#f1f3e6"
              dur="0.8s"
              fill="freeze"
              begin={currentStep >= 1 ? "0.5s" : "indefinite"}
            />
          </path>

          {/* Diagonal lines */}
          <line
            x1="150"
            y1="150"
            x2="250"
            y2="250"
            stroke="#83cd20"
            strokeWidth="2"
            opacity="0"
            strokeDasharray="141"
            strokeDashoffset="141"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="141;0"
              dur="0.6s"
              fill="freeze"
              begin={currentStep >= 2 ? "0s" : "indefinite"}
            />
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.3s"
              fill="freeze"
              begin={currentStep >= 2 ? "0s" : "indefinite"}
            />
          </line>

          <line
            x1="250"
            y1="150"
            x2="150"
            y2="250"
            stroke="#83cd20"
            strokeWidth="2"
            opacity="0"
            strokeDasharray="141"
            strokeDashoffset="141"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="141;0"
              dur="0.6s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.2s" : "indefinite"}
            />
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.3s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.2s" : "indefinite"}
            />
          </line>
        </g>

        {/* Detail Elements */}
        <g className="detail-elements">
          {/* Corner accents */}
          <circle cx="150" cy="150" r="8" fill="#83cd20" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.3s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.5s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;8"
              dur="0.4s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.5s" : "indefinite"}
            />
          </circle>

          <circle cx="250" cy="150" r="8" fill="#83cd20" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.3s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.7s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;8"
              dur="0.4s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.7s" : "indefinite"}
            />
          </circle>

          <circle cx="250" cy="250" r="8" fill="#83cd20" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.3s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.9s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;8"
              dur="0.4s"
              fill="freeze"
              begin={currentStep >= 2 ? "0.9s" : "indefinite"}
            />
          </circle>

          <circle cx="150" cy="250" r="8" fill="#83cd20" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.3s"
              fill="freeze"
              begin={currentStep >= 2 ? "1.1s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;8"
              dur="0.4s"
              fill="freeze"
              begin={currentStep >= 2 ? "1.1s" : "indefinite"}
            />
          </circle>
        </g>

        {/* Highlight Elements */}
        <g className="highlight-elements">
          {/* Center highlight */}
          <circle
            cx="200"
            cy="200"
            r="30"
            fill="url(#highlightGradient)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.6"
              dur="0.5s"
              fill="freeze"
              begin={currentStep >= 3 ? "0s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="0;30"
              dur="0.6s"
              fill="freeze"
              begin={currentStep >= 3 ? "0s" : "indefinite"}
            />
          </circle>

          {/* Pulsing effect */}
          <circle
            cx="200"
            cy="200"
            r="40"
            fill="none"
            stroke="#83cd20"
            strokeWidth="1"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.3;0"
              dur="2s"
              repeatCount="indefinite"
              begin={currentStep >= 4 ? "0s" : "indefinite"}
            />
            <animate
              attributeName="r"
              values="40;60;40"
              dur="2s"
              repeatCount="indefinite"
              begin={currentStep >= 4 ? "0s" : "indefinite"}
            />
          </circle>
        </g>

        {/* Floating particles */}
        <g className="particles">
          {[...Array(6)].map((_, i) => (
            <circle
              key={i}
              cx={120 + i * 30}
              cy={120 + (i % 2) * 20}
              r="2"
              fill="#83cd20"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.8;0"
                dur="3s"
                repeatCount="indefinite"
                begin={currentStep >= 4 ? `${i * 0.2}s` : "indefinite"}
              />
              <animate
                attributeName="cy"
                values={`${120 + (i % 2) * 20};${100 + (i % 2) * 20};${
                  120 + (i % 2) * 20
                }`}
                dur="3s"
                repeatCount="indefinite"
                begin={currentStep >= 4 ? `${i * 0.2}s` : "indefinite"}
              />
            </circle>
          ))}
        </g>
      </svg>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={startAnimation}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
        >
          Play
        </button>
        <button
          onClick={resetAnimation}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Animation progress indicator */}
      <div className="absolute top-4 right-4 text-xs text-gray-600">
        Step: {currentStep + 1}/{animationSteps.length}
      </div>
    </div>
  );
}
