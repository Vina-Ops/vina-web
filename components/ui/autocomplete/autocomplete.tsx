import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  noOptionsMessage?: string;
  clearable?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  maxHeight?: string;
  groupBy?: boolean;
  customOption?: (option: AutocompleteOption) => React.ReactNode;
}

export function Autocomplete({
  options,
  value,
  onChange,
  onSearch,
  placeholder = "Select an option",
  disabled = false,
  loading = false,
  error,
  className,
  inputClassName,
  dropdownClassName,
  optionClassName,
  emptyMessage = "No options available",
  loadingMessage = "Loading...",
  noOptionsMessage = "No results found",
  clearable = true,
  searchable = true,
  multiple = false,
  maxHeight = "300px",
  groupBy = false,
  customOption,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    value ? (multiple ? value.split(",") : [value]) : []
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group options if groupBy is true
  const groupedOptions = groupBy
    ? filteredOptions.reduce((groups, option) => {
        const group = option.group || "Other";
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
        return groups;
      }, {} as Record<string, AutocompleteOption[]>)
    : null;

  const handleSelect = React.useCallback(
    (option: AutocompleteOption) => {
      if (option.disabled) return;

      if (multiple) {
        const newValues = selectedValues.includes(option.value)
          ? selectedValues.filter((v) => v !== option.value)
          : [...selectedValues, option.value];
        setSelectedValues(newValues);
        onChange?.(newValues.join(","));
      } else {
        setSelectedValues([option.value]);
        onChange?.(option.value);
        setIsOpen(false);
      }
    },
    [multiple, onChange, selectedValues]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredOptions.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSelect(filteredOptions[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredOptions, handleSelect]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.("");
    setSearchQuery("");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const getSelectedLabels = () => {
    return selectedValues
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex min-h-[38px] w-full items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500",
          disabled && "cursor-not-allowed bg-gray-50 opacity-50",
          error &&
            "border-red-500 focus-within:border-red-500 focus-within:ring-red-500",
          inputClassName
        )}
      >
        {multiple ? (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <div
                  key={value}
                  className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm"
                >
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleSelect(option!)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setIsOpen(true)}
              placeholder={selectedValues.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={searchable ? searchQuery : getSelectedLabels()}
            onChange={handleSearch}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none"
          />
        )}
        <div className="flex items-center gap-1">
          {clearable && selectedValues.length > 0 && (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-[9999] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg",
            dropdownClassName
          )}
          style={{ maxHeight }}
        >
          {loading ? (
            <div className="p-2 text-sm text-gray-500">{loadingMessage}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              {searchQuery ? noOptionsMessage : emptyMessage}
            </div>
          ) : (
            <div className="overflow-auto">
              {groupBy
                ? Object.entries(groupedOptions!).map(([group, options]) => (
                    <div key={group}>
                      <div className="px-2 py-1 text-xs font-medium text-gray-500">
                        {group}
                      </div>
                      {options.map((option, index) => (
                        <div
                          key={option.value}
                          className={cn(
                            "flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100",
                            option.disabled && "cursor-not-allowed opacity-50",
                            selectedIndex === index && "bg-gray-100",
                            optionClassName
                          )}
                          onClick={() => handleSelect(option)}
                        >
                          {customOption ? (
                            customOption(option)
                          ) : (
                            <>
                              <span>{option.label}</span>
                              {selectedValues.includes(option.value) && (
                                <Check className="h-4 w-4 text-primary-600" />
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                : filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100",
                        option.disabled && "cursor-not-allowed opacity-50",
                        selectedIndex === index && "bg-gray-100",
                        optionClassName
                      )}
                      onClick={() => handleSelect(option)}
                    >
                      {customOption ? (
                        customOption(option)
                      ) : (
                        <>
                          <span>{option.label}</span>
                          {selectedValues.includes(option.value) && (
                            <Check className="h-4 w-4 text-primary-600" />
                          )}
                        </>
                      )}
                    </div>
                  ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
