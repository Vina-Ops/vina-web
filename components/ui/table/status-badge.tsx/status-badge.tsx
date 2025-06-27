import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

type StatusType =
  | "delivered"
  | "pending"
  | "cancelled"
  | "processing"
  | "active"
  | "inactive";

type StatusConfig = {
  [K in StatusType]: {
    color: string;
    icon: LucideIcon;
  };
};

type StatusBadgeProps = {
  status:
    | "delivered"
    | "pending"
    | "cancelled"
    | "processing"
    | "active"
    | "inactive";
  variant?: "default" | "pill" | "dot";
};

// Status Badge Component
const StatusBadge = ({ status, variant = "default" }: StatusBadgeProps) => {
  const statusConfig: StatusConfig = {
    delivered: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: Check,
    },
    pending: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: Clock,
    },
    cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: X },
    processing: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
    },
    active: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: Check,
    },
    inactive: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: AlertCircle,
    },
  };

  const config =
    statusConfig[status.toLowerCase() as StatusType] || statusConfig.pending;
  const Icon = config.icon;

  const variants = {
    default:
      "px-2 py-1 text-xs rounded-full border font-medium inline-flex items-center gap-1",
    pill: "px-3 py-1 text-xs rounded-full border font-medium inline-flex items-center gap-1",
    dot: "px-2 py-1 text-xs rounded font-medium inline-flex items-center gap-1.5",
  };

  return (
    <span className={`${variants[variant]} ${config.color}`}>
      {variant === "dot" ? (
        <div
          className={`w-2 h-2 rounded-full ${
            status.toLowerCase() === "delivered" ||
            status.toLowerCase() === "active"
              ? "bg-green-500"
              : status.toLowerCase() === "pending" ||
                status.toLowerCase() === "processing"
              ? "bg-orange-500"
              : status.toLowerCase() === "cancelled"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        ></div>
      ) : (
        <Icon size={12} />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
