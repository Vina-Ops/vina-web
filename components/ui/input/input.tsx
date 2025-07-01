"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  clearable?: boolean;
  variant?: "default" | "outlined" | "filled" | "underlined" | "ghost";
  size?: "small" | "medium" | "large";
}

export interface SearchInputProps extends Omit<InputProps, "results"> {
  showResults?: boolean;
  results?: Array<{ title: string; subtitle: string }>;
  onResultClick?: (result: { title: string; subtitle: string }) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  success,
  icon: Icon,
  iconPosition = "left",
  clearable,
  variant = "default",
  size = "medium",
  className,
  ...props
}) => {
  const [value, setValue] = React.useState(props.value || "");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setValue("");
    props.onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const inputClasses = [
    "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green",
    variant === "outlined" && "border-2",
    variant === "filled" && "bg-gray-100",
    variant === "underlined" && "border-x-0 border-t-0 rounded-none",
    variant === "ghost" && "border-0 bg-transparent",
    size === "small" && "text-sm py-1",
    size === "large" && "text-lg py-3",
    error && "border-red-500 focus:ring-red-500",
    success && "border-green-500 focus:ring-green-500",
    props.disabled && "opacity-50 cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === "left" && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        <input
          {...props}
          value={value}
          onChange={handleChange}
          className={`${inputClasses} ${
            Icon && iconPosition === "left" ? "pl-10" : ""
          } ${Icon && iconPosition === "right" ? "pr-10" : ""}`}
          type={props.type === "password" && showPassword ? "text" : props.type}
        />
        {Icon && iconPosition === "right" && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        {props.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            Clear
          </button>
        )}
      </div>
      {(helperText || error) && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export const SearchInput: React.FC<SearchInputProps> = ({
  showResults,
  results,
  onResultClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type="search"
        iconPosition="left"
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {showResults && isOpen && results && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          {results.map((result, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
              onClick={() => onResultClick?.(result)}
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-gray-500">{result.subtitle}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const FormGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="space-y-4">{children}</div>;
};
