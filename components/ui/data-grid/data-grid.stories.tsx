import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "./data-grid";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { Avatar } from "../avatar/avatar";

const meta: Meta<typeof DataGrid> = {
  title: "UI/DataGrid",
  component: DataGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible data grid component for displaying and managing tabular data.",
      },
    },
  },
  argTypes: {
    pageSize: {
      control: "number",
      description: "Number of items per page",
    },
    selectable: {
      control: "boolean",
      description: "Whether rows can be selected",
    },
    loading: {
      control: "boolean",
      description: "Whether the grid is in a loading state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

// Sample data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-03-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2024-03-14",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "Active",
    lastLogin: "2024-03-13",
  },
  // Add more sample data as needed
];

// Basic columns configuration
const basicColumns = [
  {
    key: "name",
    header: "Name",
    accessorKey: "name",
    sortable: true,
  },
  {
    key: "email",
    header: "Email",
    accessorKey: "email",
    sortable: true,
  },
  {
    key: "role",
    header: "Role",
    accessorKey: "role",
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    accessorKey: "status",
    sortable: true,
  },
  {
    key: "lastLogin",
    header: "Last Login",
    accessorKey: "lastLogin",
    sortable: true,
  },
];

export const Basic: Story = {
  args: {
    data: users,
    columns: basicColumns,
    keyField: "id",
    pageSize: 10,
  },
};

// Complex columns with custom cell rendering
const complexColumns = [
  {
    key: "name",
    header: "Name",
    accessorKey: "name",
    sortable: true,
    cell: (row: any) => (
      <div className="flex items-center gap-3">
        <Avatar
          src={`https://i.pravatar.cc/150?u=${row.email}`}
          alt={row.name}
          size="sm"
        />
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    accessorKey: "role",
    sortable: true,
    cell: (row: any) => (
      <Badge variant={row.role === "Admin" ? "primary" : "secondary"} size="sm">
        {row.role}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    accessorKey: "status",
    sortable: true,
    cell: (row: any) => (
      <Badge
        variant={row.status === "Active" ? "success" : "warning"}
        size="sm"
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: (row: any) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Edit
        </Button>
        <Button size="sm" variant="outline" color="error">
          Delete
        </Button>
      </div>
    ),
  },
];

export const Complex: Story = {
  args: {
    data: users,
    columns: complexColumns,
    keyField: "id",
    pageSize: 10,
  },
};

export const Selectable: Story = {
  args: {
    data: users,
    columns: basicColumns,
    keyField: "id",
    pageSize: 10,
    selectable: true,
    onSelectionChange: (selectedRows) => {
      console.log("Selected rows:", selectedRows);
    },
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns: basicColumns,
    keyField: "id",
    pageSize: 10,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: basicColumns,
    keyField: "id",
    pageSize: 10,
    emptyState: (
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">No users found</p>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new user.
        </p>
        <Button className="mt-4">Create User</Button>
      </div>
    ),
  },
};

export const WithRowClick: Story = {
  args: {
    data: users,
    columns: basicColumns,
    keyField: "id",
    pageSize: 10,
    onRowClick: (row) => {
      console.log("Row clicked:", row);
    },
  },
};

export const CustomLoadingState: Story = {
  args: {
    data: [],
    columns: basicColumns,
    keyField: "id",
    pageSize: 10,
    loading: true,
    loadingState: (
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        <p className="text-lg font-medium text-gray-900">Loading users...</p>
        <p className="mt-1 text-sm text-gray-500">
          Please wait while we fetch the data.
        </p>
      </div>
    ),
  },
};
