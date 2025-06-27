import React from "react";
import { cn } from "@/lib/utils";

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridGap = "none" | "sm" | "md" | "lg" | "xl";
export type GridAlign = "start" | "center" | "end" | "stretch";
export type GridJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns in the grid
   * @default 12
   */
  cols?: GridCols;
  /**
   * Number of columns on small screens
   */
  colsSm?: GridCols;
  /**
   * Number of columns on medium screens
   */
  colsMd?: GridCols;
  /**
   * Number of columns on large screens
   */
  colsLg?: GridCols;
  /**
   * Number of columns on extra large screens
   */
  colsXl?: GridCols;
  /**
   * Gap between grid items
   * @default "md"
   */
  gap?: GridGap;
  /**
   * Vertical gap between grid items
   */
  gapY?: GridGap;
  /**
   * Horizontal gap between grid items
   */
  gapX?: GridGap;
  /**
   * Vertical alignment of grid items
   * @default "stretch"
   */
  align?: GridAlign;
  /**
   * Horizontal alignment of grid items
   * @default "start"
   */
  justify?: GridJustify;
  /**
   * Whether the grid should be full width
   * @default false
   */
  fullWidth?: boolean;
}

const gapStyles: Record<GridGap, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const gapXStyles: Record<GridGap, string> = {
  none: "gap-x-0",
  sm: "gap-x-2",
  md: "gap-x-4",
  lg: "gap-x-6",
  xl: "gap-x-8",
};

const gapYStyles: Record<GridGap, string> = {
  none: "gap-y-0",
  sm: "gap-y-2",
  md: "gap-y-4",
  lg: "gap-y-6",
  xl: "gap-y-8",
};

const alignStyles: Record<GridAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyStyles: Record<GridJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols = 12,
      colsSm,
      colsMd,
      colsLg,
      colsXl,
      gap = "md",
      gapX,
      gapY,
      align = "stretch",
      justify = "start",
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          `grid-cols-${cols}`,
          colsSm && `sm:grid-cols-${colsSm}`,
          colsMd && `md:grid-cols-${colsMd}`,
          colsLg && `lg:grid-cols-${colsLg}`,
          colsXl && `xl:grid-cols-${colsXl}`,
          gapStyles[gap],
          gapX && gapXStyles[gapX],
          gapY && gapYStyles[gapY],
          alignStyles[align],
          justifyStyles[justify],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

// Grid Item component for individual grid cells
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns this item should span
   * @default 1
   */
  span?: GridCols;
  /**
   * Number of columns on small screens
   */
  spanSm?: GridCols;
  /**
   * Number of columns on medium screens
   */
  spanMd?: GridCols;
  /**
   * Number of columns on large screens
   */
  spanLg?: GridCols;
  /**
   * Number of columns on extra large screens
   */
  spanXl?: GridCols;
  /**
   * Starting column for this item
   */
  start?: GridCols;
  /**
   * Starting column on small screens
   */
  startSm?: GridCols;
  /**
   * Starting column on medium screens
   */
  startMd?: GridCols;
  /**
   * Starting column on large screens
   */
  startLg?: GridCols;
  /**
   * Starting column on extra large screens
   */
  startXl?: GridCols;
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      span = 1,
      spanSm,
      spanMd,
      spanLg,
      spanXl,
      start,
      startSm,
      startMd,
      startLg,
      startXl,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          `col-span-${span}`,
          spanSm && `sm:col-span-${spanSm}`,
          spanMd && `md:col-span-${spanMd}`,
          spanLg && `lg:col-span-${spanLg}`,
          spanXl && `xl:col-span-${spanXl}`,
          start && `col-start-${start}`,
          startSm && `sm:col-start-${startSm}`,
          startMd && `md:col-start-${startMd}`,
          startLg && `lg:col-start-${startLg}`,
          startXl && `xl:col-start-${startXl}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = "GridItem";
