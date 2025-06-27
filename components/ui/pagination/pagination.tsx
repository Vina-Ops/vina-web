import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export type PaginationVariant = "default" | "solid" | "transparent";
export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The current page number (1-based)
   */
  currentPage: number;
  /**
   * The total number of pages
   */
  totalPages: number;
  /**
   * The number of pages to show before and after the current page
   */
  siblingCount?: number;
  /**
   * The number of pages to show at the start and end
   */
  boundaryCount?: number;
  /**
   * Whether to show the first and last page buttons
   */
  showFirstLast?: boolean;
  /**
   * Whether to show the page numbers
   */
  showNumbers?: boolean;
  /**
   * The visual variant of the pagination
   */
  variant?: PaginationVariant;
  /**
   * The size of the pagination
   */
  size?: PaginationSize;
  /**
   * Whether the pagination is disabled
   */
  disabled?: boolean;
  /**
   * Callback fired when the page is changed
   */
  onPageChange?: (page: number) => void;
}

const variantStyles: Record<PaginationVariant, string> = {
  default: "bg-white border border-gray-200",
  solid: "bg-gray-100",
  transparent: "bg-transparent",
};

const sizeStyles: Record<PaginationSize, string> = {
  sm: "text-sm h-8",
  md: "text-base h-10",
  lg: "text-lg h-12",
};

const buttonStyles: Record<PaginationVariant, string> = {
  default: "hover:bg-gray-50",
  solid: "hover:bg-gray-200",
  transparent: "hover:bg-gray-100",
};

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      siblingCount = 1,
      boundaryCount = 1,
      showFirstLast = true,
      showNumbers = true,
      variant = "default",
      size = "md",
      disabled = false,
      onPageChange,
      className,
      ...props
    },
    ref
  ) => {
    const handlePageChange = (page: number) => {
      if (disabled || page < 1 || page > totalPages) return;
      onPageChange?.(page);
    };

    const generatePaginationItems = () => {
      const items: (number | "ellipsis")[] = [];
      const totalNumbers = siblingCount * 2 + 3;
      const totalBoundaries = boundaryCount * 2 + 2;

      if (totalPages <= totalNumbers + totalBoundaries) {
        // Show all pages
        for (let i = 1; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        // Calculate ranges
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
          currentPage + siblingCount,
          totalPages
        );

        // Always show first boundary
        for (let i = 1; i <= boundaryCount; i++) {
          items.push(i);
        }

        // Add ellipsis if needed
        if (leftSiblingIndex > boundaryCount + 1) {
          items.push("ellipsis");
        }

        // Add siblings
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          if (i > boundaryCount && i <= totalPages - boundaryCount) {
            items.push(i);
          }
        }

        // Add ellipsis if needed
        if (rightSiblingIndex < totalPages - boundaryCount) {
          items.push("ellipsis");
        }

        // Always show last boundary
        for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
          items.push(i);
        }
      }

      return items;
    };

    const items = generatePaginationItems();

    return (
      <nav
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md shadow-sm",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        aria-label="Pagination"
        {...props}
      >
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            className={cn(
              "inline-flex items-center px-2 rounded-l-md",
              buttonStyles[variant],
              "disabled:opacity-50 disabled:cursor-not-allowed",
              size === "sm" ? "px-2" : size === "md" ? "px-3" : "px-4"
            )}
            aria-label="Go to first page"
          >
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4 -ml-2" />
          </button>
        )}

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className={cn(
            "inline-flex items-center",
            buttonStyles[variant],
            "disabled:opacity-50 disabled:cursor-not-allowed",
            size === "sm" ? "px-2" : size === "md" ? "px-3" : "px-4"
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {showNumbers &&
          items.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={cn(
                    "inline-flex items-center px-4",
                    size === "sm" ? "px-2" : size === "md" ? "px-3" : "px-4"
                  )}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            return (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center",
                  buttonStyles[variant],
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  item === currentPage &&
                    "bg-primary text-white hover:bg-primary/90",
                  size === "sm" ? "px-2" : size === "md" ? "px-3" : "px-4"
                )}
                aria-label={`Go to page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
              >
                {item}
              </button>
            );
          })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className={cn(
            "inline-flex items-center",
            buttonStyles[variant],
            "disabled:opacity-50 disabled:cursor-not-allowed",
            size === "sm" ? "px-2" : size === "md" ? "px-3" : "px-4"
          )}
          aria-label="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className={cn(
              "inline-flex items-center px-2 rounded-r-md",
              buttonStyles[variant],
              "disabled:opacity-50 disabled:cursor-not-allowed",
              size === "sm" ? "px-2" : size === "md" ? "px-3" : "px-4"
            )}
            aria-label="Go to last page"
          >
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-2" />
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";
