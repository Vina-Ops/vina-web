import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "./breadcrumbs";
import { ChevronRight, Slash, Home, Folder, File } from "lucide-react";

const meta: Meta<typeof Breadcrumbs> = {
  title: "UI/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible breadcrumbs component that shows the current page's location within a navigational hierarchy.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "solid", "transparent"],
      description: "The visual variant of the breadcrumbs",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the breadcrumbs",
    },
    showHomeIcon: {
      control: "boolean",
      description: "Whether to show the home icon for the first item",
    },
    showLastItemAsLink: {
      control: "boolean",
      description: "Whether to show the last item as a link",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// Basic Breadcrumbs
export const Basic: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Products", href: "#" },
      { label: "Category", href: "#" },
      { label: "Current Page" },
    ],
  },
};

// With Icons
export const WithIcons: Story = {
  args: {
    items: [
      { label: "Home", href: "#", icon: <Home className="w-4 h-4" /> },
      { label: "Documents", href: "#", icon: <Folder className="w-4 h-4" /> },
      { label: "Reports", href: "#", icon: <Folder className="w-4 h-4" /> },
      { label: "Current File", icon: <File className="w-4 h-4" /> },
    ],
  },
};

// With Home Icon
export const WithHomeIcon: Story = {
  args: {
    showHomeIcon: true,
    items: [
      { label: "Home", href: "#" },
      { label: "Products", href: "#" },
      { label: "Category", href: "#" },
      { label: "Current Page" },
    ],
  },
};

// Different Separators
export const DifferentSeparators: Story = {
  render: () => (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
        separator={<ChevronRight className="w-4 h-4" />}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
        separator={<Slash className="w-4 h-4" />}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
        separator="/"
      />
    </div>
  ),
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Breadcrumbs
        variant="default"
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
      />
      <Breadcrumbs
        variant="solid"
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
      />
      <Breadcrumbs
        variant="transparent"
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
      />
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Breadcrumbs
        size="sm"
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
      />
      <Breadcrumbs
        size="md"
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
      />
      <Breadcrumbs
        size="lg"
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Current Page" },
        ]}
      />
    </div>
  ),
};

// With Max Items
export const WithMaxItems: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Products", href: "#" },
      { label: "Category", href: "#" },
      { label: "Subcategory", href: "#" },
      { label: "Item", href: "#" },
      { label: "Current Page" },
    ],
    maxItems: 4,
  },
};

// Last Item as Link
export const LastItemAsLink: Story = {
  args: {
    showLastItemAsLink: true,
    items: [
      { label: "Home", href: "#" },
      { label: "Products", href: "#" },
      { label: "Category", href: "#" },
      { label: "Current Page", href: "#" },
    ],
  },
};

// Complex Example
export const Complex: Story = {
  args: {
    variant: "solid",
    showHomeIcon: true,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-4 h-4" /> },
      { label: "Projects", href: "#", icon: <Folder className="w-4 h-4" /> },
      { label: "Website", href: "#", icon: <Folder className="w-4 h-4" /> },
      { label: "Components", href: "#", icon: <Folder className="w-4 h-4" /> },
      { label: "Breadcrumbs", icon: <File className="w-4 h-4" /> },
    ],
  },
};
