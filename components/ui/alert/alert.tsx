import React from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  X,
  LucideIcon,
} from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  onClose?: () => void;
  closable?: boolean;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-blue-50 text-blue-800 border-blue-200",
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  error: "bg-red-50 text-red-800 border-red-200",
};

const variantIcons: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      title,
      description,
      icon: Icon,
      onClose,
      closable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const AlertIcon = Icon || variantIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative flex items-start gap-3 rounded-lg border p-4",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <AlertIcon className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          {description && (
            <div className="text-sm [&_p]:leading-relaxed">{description}</div>
          )}
          {children}
        </div>
        {closable && (
          <button
            type="button"
            className={cn(
              "ml-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
              variant === "info" && "hover:bg-blue-100",
              variant === "success" && "hover:bg-green-100",
              variant === "warning" && "hover:bg-yellow-100",
              variant === "error" && "hover:bg-red-100"
            )}
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";
