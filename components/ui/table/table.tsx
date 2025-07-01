"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { ActionButton } from "./action-button/action-button";
import { StatusBadge } from "./status-badge.tsx/status-badge";

type TableHeaderProps = {
  title: string;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  align?: "left" | "center" | "right";
};

// Table Header Component
const TableHeader = ({
  title,
  sortable,
  sortDirection,
  onSort,
  align = "left",
}: TableHeaderProps) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th
      className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${alignClasses[align]}`}
    >
      <div
        className={`flex items-center gap-1 ${
          align === "center"
            ? "justify-center"
            : align === "right"
            ? "justify-end"
            : ""
        }`}
      >
        {title}
        {sortable && (
          <button
            onClick={onSort}
            className="ml-1 text-gray-400 hover:text-gray-600"
          >
            {sortDirection === "asc" ? (
              <ChevronUp size={14} />
            ) : sortDirection === "desc" ? (
              <ChevronDown size={14} />
            ) : (
              <div className="flex flex-col">
                <ChevronUp size={10} className="-mb-1" />
                <ChevronDown size={10} />
              </div>
            )}
          </button>
        )}
      </div>
    </th>
  );
};

type Column = {
  key: string;
  title: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any, index: number) => React.ReactNode;
};

type DataTableProps = {
  data: Record<string, any>[];
  columns: Column[];
  variant?: "default" | "minimal" | "bordered" | "striped";
  size?: "compact" | "medium" | "large";
  selectable?: boolean;
  actions?: boolean;
  className?: string;
};

// ActionButtons component to fix hooks usage
const ActionButtons = ({ row, index }: { row: any; index: number }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const actionButtons = [
    { icon: "Eye", label: "View" },
    { icon: "Edit", label: "Edit", variant: "primary" },
    { icon: "Trash2", label: "Delete", variant: "danger" },
  ];

  return (
    <div className="flex items-center justify-end" ref={ref}>
      <div
        className="flex items-center overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxWidth: isOpen ? "300px" : "0px",
        }}
      >
        {actionButtons.map((action, idx) => (
          <div
            key={action.label}
            className="transform transition-all duration-300 ease-out mr-1"
            style={{
              transitionDelay: `${isOpen ? 100 + idx * 50 : 0}ms`,
              opacity: isOpen ? 1 : 0,
              transform: `scale(${isOpen ? 1 : 0.9})`,
            }}
          >
            <ActionButton
              icon={action.icon as any}
              label={action.label}
              variant={action.variant as any}
            />
          </div>
        ))}
      </div>
      <div className="flex-shrink-0">
        <ActionButton
          icon={MoreHorizontal}
          label="More"
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>
    </div>
  );
};

// Base Table Component
const DataTable = ({
  data,
  columns,
  variant = "default",
  size = "medium",
  selectable = false,
  actions = true,
  className = "",
}: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState(new Set());

  const variants = {
    default: "bg-white border border-gray-200 rounded-lg overflow-hidden",
    minimal: "bg-white",
    bordered: "bg-white border border-gray-200 rounded-lg overflow-hidden",
    striped: "bg-white border border-gray-200 rounded-lg overflow-hidden",
  };

  const sizes = {
    compact: "text-sm",
    medium: "text-sm",
    large: "text-base",
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${sizes[size]}`}>
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedRows.size === data.length && data.length > 0
                    }
                  />
                </th>
              )}
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  title={column.title}
                  sortable={column.sortable}
                  sortDirection={
                    sortConfig.key === column.key ? sortConfig.direction : null
                  }
                  onSort={() => column.sortable && handleSort(column.key)}
                  align={column.align}
                />
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody
            className={`bg-white divide-y divide-gray-200 ${
              variant === "striped" ? "divide-y-0" : ""
            }`}
          >
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition-colors duration-150 ${
                  variant === "striped" && index % 2 === 1 ? "bg-gray-50" : ""
                } ${selectedRows.has(index) ? "bg-blue-50" : ""}`}
              >
                {selectable && (
                  <td className="px-4 py-3 w-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedRows.has(index)}
                      onChange={(e) => handleSelectRow(index, e.target.checked)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 whitespace-nowrap ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {column.render
                      ? column.render(row[column.key], row, index)
                      : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <ActionButtons row={row} index={index} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
