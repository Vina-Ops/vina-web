import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import DataTable from "./table";
import StatusBadge from "./status-badge.tsx/status-badge";

type StatusType =
  | "delivered"
  | "pending"
  | "cancelled"
  | "processing"
  | "active"
  | "inactive";

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

const meta: Meta<typeof DataTable> = {
  title: "UI/Table",
  component: DataTable,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "minimal", "bordered", "striped"],
    },
    size: {
      control: "select",
      options: ["compact", "medium", "large"],
    },
    selectable: {
      control: "boolean",
    },
    actions: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        status: "delivered",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        status: "pending",
      },
    ],
    columns: [
      {
        key: "name",
        title: "Name",
        sortable: true,
      },
      {
        key: "email",
        title: "Email",
      },
      {
        key: "status",
        title: "Status",
        render: (value: StatusType) => <StatusBadge status={value} />,
      },
    ],
  },
};

// Sample data
const sampleData = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Wireless Headphones",
    qty: 2,
    total: "$199.98",
    status: "delivered",
    date: "2024-06-15",
  },
  {
    id: "ORD-002",
    customer: "Sarah Chen",
    product: "Smart Watch",
    qty: 1,
    total: "$299.99",
    status: "processing",
    date: "2024-06-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Laptop Stand",
    qty: 1,
    total: "$79.99",
    status: "pending",
    date: "2024-06-13",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    product: "USB-C Hub",
    qty: 3,
    total: "$149.97",
    status: "cancelled",
    date: "2024-06-12",
  },
  {
    id: "ORD-005",
    customer: "Alex Wilson",
    product: "Monitor Stand",
    qty: 1,
    total: "$89.99",
    status: "delivered",
    date: "2024-06-11",
  },
];

const basicColumns: Column[] = [
  { key: "id", title: "Order ID", sortable: true },
  { key: "customer", title: "Customer", sortable: true },
  { key: "product", title: "Product", sortable: true },
  { key: "qty", title: "Qty", sortable: true, align: "center" },
  { key: "total", title: "Total", sortable: true, align: "right" },
  {
    key: "status",
    title: "Status",
    align: "center",
    render: (value: StatusType) => (
      <StatusBadge status={value} variant="pill" />
    ),
  },
  { key: "date", title: "Date", sortable: true },
];

export const DefaultTable: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    variant: "default",
    size: "medium",
    selectable: true,
    actions: true,
  },
};

export const MinimalTable: Story = {
  args: {
    data: sampleData.slice(0, 3),
    columns: basicColumns,
    variant: "minimal",
    size: "medium",
    selectable: false,
    actions: false,
  },
};

export const BorderedTable: Story = {
  args: {
    data: sampleData.slice(0, 3),
    columns: basicColumns,
    variant: "bordered",
    size: "compact",
    selectable: true,
    actions: true,
  },
};

export const StripedTable: Story = {
  args: {
    data: sampleData.slice(0, 4),
    columns: basicColumns,
    variant: "striped",
    size: "medium",
    selectable: true,
    actions: true,
  },
};

export const CompactSizeTable: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    variant: "default",
    size: "compact",
    selectable: true,
    actions: true,
  },
};

export const LargeSizeTable: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    variant: "default",
    size: "large",
    selectable: true,
    actions: true,
  },
};

export const WithoutActionsTable: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    variant: "default",
    size: "medium",
    selectable: true,
    actions: false,
  },
};

export const WithoutSelectionTable: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    variant: "default",
    size: "medium",
    selectable: false,
    actions: true,
  },
};

// Different data types
const usersData = [
  {
    name: "Alex Thompson",
    email: "alex@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2 hours ago",
  },
  {
    name: "Jessica Wong",
    email: "jessica@example.com",
    role: "Editor",
    status: "active",
    lastLogin: "1 day ago",
  },
  {
    name: "David Miller",
    email: "david@example.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: "1 week ago",
  },
  {
    name: "Lisa Anderson",
    email: "lisa@example.com",
    role: "Editor",
    status: "active",
    lastLogin: "3 hours ago",
  },
];

const userColumns: Column[] = [
  { key: "name", title: "Name", sortable: true },
  { key: "email", title: "Email", sortable: true },
  { key: "role", title: "Role", sortable: true },
  {
    key: "status",
    title: "Status",
    align: "center",
    render: (value: StatusType) => <StatusBadge status={value} variant="dot" />,
  },
  { key: "lastLogin", title: "Last Login", sortable: true },
];

export const UsersTable: Story = {
  args: {
    data: usersData,
    columns: userColumns,
    variant: "default",
    size: "medium",
    selectable: true,
    actions: true,
  },
};

const productsData = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    brand: "TechCorp",
    stock: 45,
    price: "$99.99",
    status: "active",
  },
  {
    name: "Smart Watch",
    category: "Wearables",
    brand: "TechCorp",
    stock: 23,
    price: "$299.99",
    status: "active",
  },
  {
    name: "Laptop Stand",
    category: "Accessories",
    brand: "OfficeGear",
    stock: 0,
    price: "$79.99",
    status: "inactive",
  },
  {
    name: "USB-C Hub",
    category: "Electronics",
    brand: "ConnectPro",
    stock: 67,
    price: "$49.99",
    status: "active",
  },
];

const productColumns: Column[] = [
  { key: "name", title: "Product Name", sortable: true },
  { key: "category", title: "Category", sortable: true },
  { key: "brand", title: "Brand", sortable: true },
  {
    key: "stock",
    title: "Stock",
    sortable: true,
    align: "center",
    render: (value: number) => (
      <span
        className={`font-medium ${
          value === 0
            ? "text-red-600"
            : value < 30
            ? "text-orange-600"
            : "text-green-600"
        }`}
      >
        {value}
      </span>
    ),
  },
  { key: "price", title: "Price", sortable: true, align: "right" },
  {
    key: "status",
    title: "Status",
    align: "center",
    render: (value: StatusType) => <StatusBadge status={value} />,
  },
];

export const ProductsTable: Story = {
  args: {
    data: productsData,
    columns: productColumns,
    variant: "default",
    size: "medium",
    selectable: true,
    actions: true,
  },
};

// Empty state
export const EmptyTable: Story = {
  args: {
    data: [],
    columns: basicColumns,
    variant: "default",
    size: "medium",
    selectable: true,
    actions: true,
  },
};
