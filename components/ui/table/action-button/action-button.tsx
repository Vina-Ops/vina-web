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

type ActionButtonProps = {
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  variant?: "ghost" | "primary" | "danger";
};

const ActionButton = ({
  onClick,
  icon: Icon,
  label,
  variant = "ghost",
}: ActionButtonProps) => {
  const variants = {
    ghost: "p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700",
    primary: "p-1 hover:bg-blue-100 rounded text-blue-500 hover:text-blue-700",
    danger: "p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} transition-colors duration-150`}
      title={label}
    >
      <Icon size={16} />
    </button>
  );
};

export { ActionButton };
