"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useTransition,
  startTransition,
} from "react";
import { Check, X } from "lucide-react";
import { CloseCircle, TickCircle } from "iconsax-react";

interface Toast {
  id: number;
  message: React.ReactNode;
  type?: "success" | "info" | "error" | "loading";
  duration?: number;
}

interface TopToastContextType {
  showToast: (
    message: React.ReactNode,
    options?: { type?: string; duration?: number }
  ) => void;
  hideToast: () => void;
}

const TopToastContext = createContext<TopToastContextType | undefined>(
  undefined
);

// Spinner for loading toast
const Spinner = ({ className = "" }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

// The actual toast UI
const TopToast = ({
  message,
  onClose,
  type = "success",
}: {
  message: React.ReactNode;
  onClose: () => void;
  type?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Use startTransition for smooth animations
    startTransition(() => {
      setVisible(true);
    });

    return () => {
      startTransition(() => {
        setVisible(false);
      });
    };
  }, [startTransition]);

  // Animate exit before unmount
  const handleCloseWithAnimation = useCallback(() => {
    startTransition(() => {
      setVisible(false);
    });

    // Use a more reliable timeout mechanism
    const timeoutId = setTimeout(() => {
      onClose();
    }, 300); // match transition duration

    return () => clearTimeout(timeoutId);
  }, [onClose, startTransition]);

  // Get icon and background based on type
  const getToastStyles = () => {
    switch (type) {
      case "error":
        return {
          icon: <X className="w-5 h-5 text-red-600" />,
          iconBg: "bg-red-100",
        };
      case "info":
        return {
          icon: <Check className="w-5 h-5 text-blue-600" />,
          iconBg: "bg-blue-100",
        };
      case "loading":
        return {
          icon: <Spinner className="w-5 h-5 text-green-600" />,
          iconBg: "bg-green-100",
        };
      default:
        return {
          icon: (
            <TickCircle
              variant="Bold"
              color="#257D3A"
              className="w-5 h-5 text-green-600"
            />
          ),
          iconBg: "bg-green-100",
        };
    }
  };

  const { icon, iconBg } = getToastStyles();

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        zIndex: 9999,
        transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transformOrigin: "top center",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-30px)",
      }}
      className="bg-white rounded-2xl shadow-lg flex items-center px-3 py-2 min-w-[400px] max-w-[90vw] border border-gray-200 backdrop-blur-sm"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={`flex items-center justify-center rounded-full w-7 h-7 mr-3 ${iconBg}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="text-gray-900 font-semibold text-sm flex-1">
        {message}
      </span>
      <span className="mx-4 h-6 border-l border-gray-200" aria-hidden="true" />
      <button
        onClick={handleCloseWithAnimation}
        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Close notification"
        type="button"
      >
        <CloseCircle
          variant="Outline"
          color="#4B4B4B"
          className="w-5 h-5 text-gray-400"
          size={16}
        />
      </button>
    </div>
  );
};

export const TopToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queue, setQueue] = useState<Toast[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = useCallback(
    (
      message: React.ReactNode,
      options?: { type?: string; duration?: number }
    ) => {
      startTransition(() => {
        setQueue((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            message,
            type:
              (options?.type as "success" | "error" | "info" | "loading") ||
              "success",
            duration: options?.duration || 4000,
          },
        ]);
      });
    },
    [startTransition]
  );

  const hideToast = useCallback(() => {
    startTransition(() => {
      setQueue((prev) => prev.slice(1));
    });
  }, [startTransition]);

  // Auto-hide toast after duration
  useEffect(() => {
    if (queue.length > 0 && queue[0].type !== "loading") {
      const duration = queue[0].duration || 4000;

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [queue, hideToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast]
  );

  return (
    <TopToastContext.Provider value={contextValue}>
      {queue.length > 0 && (
        <TopToast
          key={queue[0].id}
          message={queue[0].message}
          onClose={hideToast}
          type={queue[0].type}
        />
      )}
      {children}
    </TopToastContext.Provider>
  );
};

export function useTopToast() {
  const context = useContext(TopToastContext);
  if (!context) {
    throw new Error("useTopToast must be used within a TopToastProvider");
  }
  return context;
}
