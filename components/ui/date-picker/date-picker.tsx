import React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  
  
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../button/button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";
import { Calendar } from "../calendar/calendar";

export type DatePickerVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type DatePickerSize = "sm" | "md" | "lg";
export type DateFormat =
  | "MM/dd/yyyy"
  | "dd/MM/yyyy"
  | "yyyy-MM-dd"
  | "MMMM dd, yyyy";

export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "onChange"
  > {
  /**
   * The visual variant of the date picker
   */
  variant?: DatePickerVariant;
  /**
   * The size of the date picker
   */
  size?: DatePickerSize;
  /**
   * The label text for the date picker
   */
  label?: string;
  /**
   * The helper text for the date picker
   */
  helperText?: string;
  /**
   * Whether the date picker is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * The selected date
   */
  value?: Date;
  /**
   * Callback when the date changes
   */
  onChange?: (date: Date | undefined) => void;
  /**
   * The format to display the date
   */
  dateFormat?: DateFormat;
  /**
   * The minimum selectable date
   */
  minDate?: Date;
  /**
   * The maximum selectable date
   */
  maxDate?: Date;
  /**
   * Whether to show the calendar icon
   */
  showIcon?: boolean;
  /**
   * Whether the date picker is clearable
   */
  clearable?: boolean;
  /**
   * Whether to show the time picker
   */
  showTime?: boolean;
  /**
   * The placeholder text
   */
  placeholder?: string;
}

const variantStyles: Record<DatePickerVariant, string> = {
  default: "border-gray-300 focus:border-gray-400",
  primary: "border-primary focus:border-primary-600",
  success: "border-green-500 focus:border-green-600",
  warning: "border-yellow-500 focus:border-yellow-600",
  error: "border-red-500 focus:border-red-600",
};

const sizeStyles: Record<DatePickerSize, { input: string; icon: string }> = {
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

const labelSizeStyles: Record<DatePickerSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
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
      dateFormat = "MM/dd/yyyy",
      minDate,
      maxDate,
      showIcon = true,
      clearable = false,
      showTime = false,
      placeholder = "Select date",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleDateSelect = (date: Date | undefined) => {
      onChange?.(date);
      if (!showTime) {
        setOpen(false);
      }
    };

    return (
      <div className="flex flex-col gap-1">
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
                !value && "text-gray-500",
                variantStyles[variant],
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
              disabled={disabled}
            >
              {showIcon && (
                <CalendarIcon className={cn("mr-2", sizeStyles[size].icon)} />
              )}
              {value ? format(value, dateFormat) : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              disabled={disabled}
              initialFocus
              minDate={minDate}
              maxDate={maxDate}
            />
            {clearable && value && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDateSelect(undefined)}
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

DatePicker.displayName = "DatePicker";

// Date Range Picker Component
export interface DateRangePickerProps
  extends Omit<DatePickerProps, "value" | "onChange"> {
  /**
   * The selected date range
   */
  value?: { from: Date; to?: Date };
  /**
   * Callback when the date range changes
   */
  onChange?: (range: { from: Date; to?: Date } | undefined) => void;
}

export const DateRangePicker = React.forwardRef<
  HTMLInputElement,
  DateRangePickerProps
>(
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
      dateFormat = "MM/dd/yyyy",
      minDate,
      maxDate,
      showIcon = true,
      clearable = false,
      placeholder = "Select date range",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleDateSelect = (range: { from: Date; to?: Date } | undefined) => {
      onChange?.(range);
      if (range?.to) {
        setOpen(false);
      }
    };

    return (
      <div className="flex flex-col gap-1">
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
                !value && "text-gray-500",
                variantStyles[variant],
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
              disabled={disabled}
            >
              {showIcon && (
                <CalendarIcon className={cn("mr-2", sizeStyles[size].icon)} />
              )}
              {value ? (
                <>
                  {format(value.from, dateFormat)}
                  {value.to && ` - ${format(value.to, dateFormat)}`}
                </>
              ) : (
                placeholder
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={value}
              onSelect={handleDateSelect}
              disabled={disabled}
              initialFocus
              minDate={minDate}
              maxDate={maxDate}
            />
            {clearable && value && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDateSelect(undefined)}
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

DateRangePicker.displayName = "DateRangePicker";
