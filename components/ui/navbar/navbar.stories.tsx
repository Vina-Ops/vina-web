import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./navbar";
import { Home, Settings, User, Bell, Search, Menu } from "lucide-react";

const meta: Meta<typeof Navbar> = {
  title: "UI/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A flexible navigation bar component that supports responsive layouts, dropdown menus, and mobile navigation.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "transparent", "bordered"],
      description: "The visual variant of the navbar",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the navbar",
    },
    fixed: {
      control: "boolean",
      description: "Whether the navbar should be fixed to the top",
    },
    sticky: {
      control: "boolean",
      description: "Whether the navbar should be sticky",
    },
    transparent: {
      control: "boolean",
      description: "Whether the navbar should be transparent",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

// Basic Navbar
export const Basic: Story = {
  args: {
    brand: <span className="text-xl font-bold">Logo</span>,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      { label: "Settings", href: "#", icon: <Settings className="w-5 h-5" /> },
      { label: "Profile", href: "#", icon: <User className="w-5 h-5" /> },
    ],
  },
};

// With Dropdown
export const WithDropdown: Story = {
  args: {
    brand: <span className="text-xl font-bold">Logo</span>,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      {
        label: "Settings",
        icon: <Settings className="w-5 h-5" />,
        items: [
          { label: "Account", href: "#" },
          { label: "Preferences", href: "#" },
          { label: "Security", href: "#" },
        ],
      },
      { label: "Profile", href: "#", icon: <User className="w-5 h-5" /> },
    ],
  },
};

// With Right Items
export const WithRightItems: Story = {
  args: {
    brand: <span className="text-xl font-bold">Logo</span>,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      { label: "Settings", href: "#", icon: <Settings className="w-5 h-5" /> },
    ],
    rightItems: [
      { label: "Search", href: "#", icon: <Search className="w-5 h-5" /> },
      { label: "Notifications", href: "#", icon: <Bell className="w-5 h-5" /> },
      { label: "Profile", href: "#", icon: <User className="w-5 h-5" /> },
    ],
  },
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Navbar
        variant="default"
        brand={<span className="text-xl font-bold">Default</span>}
        items={[
          { label: "Home", href: "#" },
          { label: "About", href: "#" },
        ]}
      />
      <Navbar
        variant="transparent"
        brand={<span className="text-xl font-bold">Transparent</span>}
        items={[
          { label: "Home", href: "#" },
          { label: "About", href: "#" },
        ]}
      />
      <Navbar
        variant="bordered"
        brand={<span className="text-xl font-bold">Bordered</span>}
        items={[
          { label: "Home", href: "#" },
          { label: "About", href: "#" },
        ]}
      />
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Navbar
        size="sm"
        brand={<span className="text-xl font-bold">Small</span>}
        items={[
          { label: "Home", href: "#" },
          { label: "About", href: "#" },
        ]}
      />
      <Navbar
        size="md"
        brand={<span className="text-xl font-bold">Medium</span>}
        items={[
          { label: "Home", href: "#" },
          { label: "About", href: "#" },
        ]}
      />
      <Navbar
        size="lg"
        brand={<span className="text-xl font-bold">Large</span>}
        items={[
          { label: "Home", href: "#" },
          { label: "About", href: "#" },
        ]}
      />
    </div>
  ),
};

// Fixed Navbar
export const Fixed: Story = {
  args: {
    fixed: true,
    brand: <span className="text-xl font-bold">Fixed Navbar</span>,
    items: [
      { label: "Home", href: "#" },
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  parameters: {
    layout: "fullscreen",
  },
};

// Complex Navbar
export const Complex: Story = {
  args: {
    brand: (
      <div className="flex items-center space-x-2">
        <Menu className="w-6 h-6" />
        <span className="text-xl font-bold">Company</span>
      </div>
    ),
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      {
        label: "Products",
        icon: <Menu className="w-5 h-5" />,
        items: [
          { label: "Category 1", href: "#" },
          { label: "Category 2", href: "#" },
          { label: "Category 3", href: "#" },
        ],
      },
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
    rightItems: [
      { label: "Search", href: "#", icon: <Search className="w-5 h-5" /> },
      {
        label: "Account",
        icon: <User className="w-5 h-5" />,
        items: [
          { label: "Profile", href: "#" },
          { label: "Settings", href: "#" },
          { label: "Logout", href: "#" },
        ],
      },
    ],
  },
};
