import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./sidebar";
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart,
  Mail,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "UI/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A flexible sidebar component that supports collapsible sections, nested items, and responsive behavior.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "expanded"],
      description: "The visual variant of the sidebar",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the sidebar",
    },
    defaultCollapsed: {
      control: "boolean",
      description: "Whether the sidebar should be collapsed by default",
    },
    collapsible: {
      control: "boolean",
      description: "Whether the sidebar should be collapsible",
    },
    fixed: {
      control: "boolean",
      description: "Whether the sidebar should be fixed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Basic Sidebar
export const Basic: Story = {
  args: {
    brand: <span className="text-xl font-bold">Dashboard</span>,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      { label: "Settings", href: "#", icon: <Settings className="w-5 h-5" /> },
      { label: "Users", href: "#", icon: <Users className="w-5 h-5" /> },
    ],
  },
};

// With Nested Items
export const WithNestedItems: Story = {
  args: {
    brand: <span className="text-xl font-bold">Dashboard</span>,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      {
        label: "Analytics",
        icon: <BarChart className="w-5 h-5" />,
        items: [
          { label: "Overview", href: "#" },
          { label: "Reports", href: "#" },
          { label: "Statistics", href: "#" },
        ],
      },
      {
        label: "Documents",
        icon: <FileText className="w-5 h-5" />,
        items: [
          { label: "Files", href: "#" },
          { label: "Folders", href: "#" },
          { label: "Shared", href: "#" },
        ],
      },
    ],
  },
};

// With Badges
export const WithBadges: Story = {
  args: {
    brand: <span className="text-xl font-bold">Dashboard</span>,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      {
        label: "Messages",
        href: "#",
        icon: <Mail className="w-5 h-5" />,
        badge: (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
            3
          </span>
        ),
      },
      {
        label: "Notifications",
        href: "#",
        icon: <Bell className="w-5 h-5" />,
        badge: (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
            5
          </span>
        ),
      },
    ],
  },
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar
        variant="default"
        brand={<span className="text-xl font-bold">Default</span>}
        items={[
          { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
          {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-5 h-5" />,
          },
        ]}
      />
      <Sidebar
        variant="compact"
        brand={<span className="text-xl font-bold">Compact</span>}
        items={[
          { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
          {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-5 h-5" />,
          },
        ]}
      />
      <Sidebar
        variant="expanded"
        brand={<span className="text-xl font-bold">Expanded</span>}
        items={[
          { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
          {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-5 h-5" />,
          },
        ]}
      />
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar
        size="sm"
        brand={<span className="text-xl font-bold">Small</span>}
        items={[
          { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
          {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-5 h-5" />,
          },
        ]}
      />
      <Sidebar
        size="md"
        brand={<span className="text-xl font-bold">Medium</span>}
        items={[
          { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
          {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-5 h-5" />,
          },
        ]}
      />
      <Sidebar
        size="lg"
        brand={<span className="text-xl font-bold">Large</span>}
        items={[
          { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
          {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-5 h-5" />,
          },
        ]}
      />
    </div>
  ),
};

// Collapsed by Default
export const CollapsedByDefault: Story = {
  args: {
    defaultCollapsed: true,
    brand: <span className="text-xl font-bold">Dashboard</span>,
    items: [
      { label: "Home", href: "#", icon: <Home className="w-5 h-5" /> },
      { label: "Settings", href: "#", icon: <Settings className="w-5 h-5" /> },
      { label: "Users", href: "#", icon: <Users className="w-5 h-5" /> },
    ],
  },
};

// Complex Sidebar
export const Complex: Story = {
  args: {
    brand: (
      <div className="flex items-center space-x-2">
        <User className="w-6 h-6" />
        <span className="text-xl font-bold">Admin Panel</span>
      </div>
    ),
    items: [
      { label: "Dashboard", href: "#", icon: <Home className="w-5 h-5" /> },
      {
        label: "Analytics",
        icon: <BarChart className="w-5 h-5" />,
        items: [
          { label: "Overview", href: "#" },
          { label: "Reports", href: "#" },
          { label: "Statistics", href: "#" },
        ],
      },
      {
        label: "Users",
        icon: <Users className="w-5 h-5" />,
        items: [
          { label: "All Users", href: "#" },
          { label: "Roles", href: "#" },
          { label: "Permissions", href: "#" },
        ],
      },
      {
        label: "Settings",
        icon: <Settings className="w-5 h-5" />,
        items: [
          { label: "General", href: "#" },
          { label: "Security", href: "#" },
          { label: "Notifications", href: "#" },
        ],
      },
    ],
  },
};
