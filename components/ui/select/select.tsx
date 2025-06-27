import React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "default" | "bordered" | "ghost";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: "text-sm py-1.5 px-3",
  md: "text-base py-2 px-4",
  lg: "text-lg py-2.5 px-5",
};

const variantClasses: Record<SelectVariant, string> = {
  default: "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  bordered:
    "bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  ghost:
    "bg-transparent border-none hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500",
};

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      label,
      error,
      helperText,
      size = "md",
      variant = "default",
      disabled = false,
      required = false,
      multiple = false,
      searchable = false,
      clearable = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const selectRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selectedValues = React.useMemo(() => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    }, [value]);

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchable, searchQuery]);

    const handleSelect = (optionValue: string) => {
      if (
        disabled ||
        options.find((opt) => opt.value === optionValue)?.disabled
      ) {
        return;
      }

      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : "");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "Enter" && isOpen) {
        e.preventDefault();
        const firstOption = filteredOptions[0];
        if (firstOption && !firstOption.disabled) {
          handleSelect(firstOption.value);
        }
      }
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabels = options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label)
      .join(", ");

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div
          ref={selectRef}
          className={cn(
            "relative w-full rounded-lg border transition-all duration-200",
            sizeClasses[size],
            variantClasses[variant],
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            isOpen && "ring-2 ring-blue-500 ring-opacity-50"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="select-options"
          tabIndex={disabled ? -1 : 0}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {searchable && isOpen ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={selectedLabels || placeholder}
                />
              ) : (
                <span
                  className={cn(
                    "block truncate",
                    !selectedLabels && "text-gray-500"
                  )}
                >
                  {selectedLabels || placeholder}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {clearable && selectedValues.length > 0 && (
                <button
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-500 transition-transform",
                  isOpen && "transform rotate-180"
                )}
              />
            </div>
          </div>

          {isOpen && (
            <div
              id="select-options"
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
              role="listbox"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "px-4 py-2 cursor-pointer flex items-center justify-between",
                      selectedValues.includes(option.value) && "bg-blue-50",
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={selectedValues.includes(option.value)}
                  >
                    <span>{option.label}</span>
                    {selectedValues.includes(option.value) && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1 text-sm",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
