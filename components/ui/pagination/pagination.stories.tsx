import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "UI/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible pagination component that supports various configurations for handling large datasets.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "solid", "transparent"],
      description: "The visual variant of the pagination",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the pagination",
    },
    showFirstLast: {
      control: "boolean",
      description: "Whether to show the first and last page buttons",
    },
    showNumbers: {
      control: "boolean",
      description: "Whether to show the page numbers",
    },
    disabled: {
      control: "boolean",
      description: "Whether the pagination is disabled",
    },
    siblingCount: {
      control: { type: "number", min: 0, max: 3 },
      description:
        "The number of pages to show before and after the current page",
    },
    boundaryCount: {
      control: { type: "number", min: 0, max: 3 },
      description: "The number of pages to show at the start and end",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Basic Pagination
export const Basic: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

// With Many Pages
export const WithManyPages: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
  },
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Pagination currentPage={1} totalPages={10} variant="default" />
      <Pagination currentPage={1} totalPages={10} variant="solid" />
      <Pagination currentPage={1} totalPages={10} variant="transparent" />
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Pagination currentPage={1} totalPages={10} size="sm" />
      <Pagination currentPage={1} totalPages={10} size="md" />
      <Pagination currentPage={1} totalPages={10} size="lg" />
    </div>
  ),
};

// Without Numbers
export const WithoutNumbers: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    showNumbers: false,
  },
};

// Without First/Last
export const WithoutFirstLast: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    showFirstLast: false,
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    disabled: true,
  },
};

// With Custom Sibling Count
export const WithCustomSiblingCount: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    siblingCount: 2,
  },
};

// With Custom Boundary Count
export const WithCustomBoundaryCount: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    boundaryCount: 2,
  },
};

// Complex Example
export const Complex: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: "solid",
    size: "lg",
    siblingCount: 2,
    boundaryCount: 1,
  },
};
