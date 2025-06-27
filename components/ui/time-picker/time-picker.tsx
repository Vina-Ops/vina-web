import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../button/button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";

export type TimePickerVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type TimePickerSize = "sm" | "md" | "lg";
export type TimeFormat = "12h" | "24h";
export type TimeStep = 1 | 5 | 10 | 15 | 30 | 60;

export interface TimePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "onChange"
  > {
  /**
   * The visual variant of the time picker
   */
  variant?: TimePickerVariant;
  /**
   * The size of the time picker
   */
  size?: TimePickerSize;
  /**
   * The label text for the time picker
   */
  label?: string;
  /**
   * The helper text for the time picker
   */
  helperText?: string;
  /**
   * Whether the time picker is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * The selected time value
   */
  value?: string;
  /**
   * Callback when the time changes
   */
  onChange?: (time: string) => void;
  /**
   * The time format to use
   */
  format?: TimeFormat;
  /**
   * The time step in minutes
   */
  step?: TimeStep;
  /**
   * The minimum time allowed
   */
  minTime?: string;
  /**
   * The maximum time allowed
   */
  maxTime?: string;
  /**
   * Whether to show the clock icon
   */
  showIcon?: boolean;
  /**
   * Whether the time picker is clearable
   */
  clearable?: boolean;
  /**
   * The placeholder text
   */
  placeholder?: string;
}

const variantStyles: Record<TimePickerVariant, string> = {
  default: "border-gray-300 focus:border-gray-400",
  primary: "border-primary focus:border-primary-600",
  success: "border-green-500 focus:border-green-600",
  warning: "border-yellow-500 focus:border-yellow-600",
  error: "border-red-500 focus:border-red-600",
};

const sizeStyles: Record<TimePickerSize, { input: string; icon: string }> = {
  sm: {
    input: "h-8 px-2 text-sm",
    icon: "h-4 w-4",
  },
  md: {
    input: "h-10 px-3 text-base",
    icon: "h-5 w-5",
  },
  lg: {
    input: "h-12 px-4 text-lg",
    icon: "h-6 w-6",
  },
};

const labelSizeStyles: Record<TimePickerSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const generateTimeOptions = (step: TimeStep, format: TimeFormat) => {
  const options: string[] = [];
  const totalMinutes = 24 * 60;

  for (let minutes = 0; minutes < totalMinutes; minutes += step) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let time = "";

    if (format === "12h") {
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      time = `${displayHours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")} ${period}`;
    } else {
      time = `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
    }

    options.push(time);
  }

  return options;
};

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error = false,
      errorMessage,
      value,
      onChange,
      format = "12h",
      step = 15,
      minTime,
      maxTime,
      showIcon = true,
      clearable = false,
      placeholder = "Select time",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(value || "");
    const timeOptions = generateTimeOptions(step, format);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTimeSelect = (time: string) => {
      setSelectedTime(time);
      onChange?.(time);
      setOpen(false);
    };

    const handleClear = () => {
      setSelectedTime("");
      onChange?.("");
    };

    const filteredOptions = timeOptions.filter((time) => {
      if (minTime && time < minTime) return false;
      if (maxTime && time > maxTime) return false;
      return true;
    });

    return (
      <div className="flex flex-col gap-1" ref={containerRef}>
        {label && (
          <label
            className={cn(
              "font-medium text-gray-700",
              labelSizeStyles[size],
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size={size}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedTime && "text-gray-500",
                variantStyles[variant],
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
              disabled={disabled}
            >
              {showIcon && (
                <Clock className={cn("mr-2", sizeStyles[size].icon)} />
              )}
              {selectedTime || placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="max-h-[200px] overflow-y-auto p-2">
              {filteredOptions.map((time) => (
                <button
                  key={time}
                  className={cn(
                    "w-full rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100",
                    selectedTime === time && "bg-gray-100"
                  )}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            {clearable && selectedTime && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        {helperText && !error && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )}
        {error && errorMessage && (
          <span className="text-sm text-red-500">{errorMessage}</span>
        )}
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";
