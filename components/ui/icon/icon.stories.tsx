import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./icon";
import {
  Home,
  Settings,
  User,
  Bell,
  Star,
  Heart,
  Trash,
  Edit,
  Search,
  Menu,
} from "lucide-react";

const meta: Meta<typeof Icon> = {
  title: "UI/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible icon component that wraps Lucide icons with additional features.",
      },
    },
  },
  argTypes: {
    name: {
      control: "select",
      options: [
        "Home",
        "Settings",
        "User",
        "Bell",
        "Star",
        "Heart",
        "Trash",
        "Edit",
        "Search",
        "Menu",
      ],
      description: "The name of the Lucide icon to display",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "The size of the icon",
    },
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error"],
      description: "The visual variant of the icon",
    },
    animation: {
      control: "select",
      options: ["none", "spin", "pulse", "bounce"],
      description: "The animation style of the icon",
    },
    strokeWidth: {
      control: "number",
      description: "The stroke width of the icon",
    },
    fill: {
      control: "boolean",
      description: "Whether to fill the icon",
    },
    disabled: {
      control: "boolean",
      description: "Whether the icon is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Basic: Story = {
  args: {
    name: "Home",
    size: "md",
    variant: "default",
    animation: "none",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="Home" size="xs" />
      <Icon name="Home" size="sm" />
      <Icon name="Home" size="md" />
      <Icon name="Home" size="lg" />
      <Icon name="Home" size="xl" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="Star" variant="default" />
      <Icon name="Star" variant="primary" />
      <Icon name="Star" variant="success" />
      <Icon name="Star" variant="warning" />
      <Icon name="Star" variant="error" />
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="Settings" animation="none" />
      <Icon name="Settings" animation="spin" />
      <Icon name="Bell" animation="pulse" />
      <Icon name="Heart" animation="bounce" />
    </div>
  ),
};

export const StrokeWidths: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="Edit" strokeWidth={1} />
      <Icon name="Edit" strokeWidth={2} />
      <Icon name="Edit" strokeWidth={3} />
    </div>
  ),
};

export const Filled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="Heart" fill />
      <Icon name="Star" fill />
      <Icon name="Bell" fill />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};

export const CustomColor: Story = {
  args: {
    ...Basic.args,
    color: "#FF6B6B",
  },
};

export const CommonIcons: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon name="Home" />
        <span className="text-xs">Home</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="Settings" />
        <span className="text-xs">Settings</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="User" />
        <span className="text-xs">User</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="Bell" />
        <span className="text-xs">Bell</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="Search" />
        <span className="text-xs">Search</span>
      </div>
    </div>
  ),
};

export const Complex: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Icon name="User" variant="primary" size="lg" />
        <div>
          <h3 className="font-medium">User Profile</h3>
          <p className="text-sm text-gray-600">Manage your account settings</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Icon name="Bell" variant="warning" size="lg" animation="pulse" />
        <div>
          <h3 className="font-medium">Notifications</h3>
          <p className="text-sm text-gray-600">You have 3 new messages</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Icon name="Settings" variant="success" size="lg" animation="spin" />
        <div>
          <h3 className="font-medium">Settings</h3>
          <p className="text-sm text-gray-600">Customize your preferences</p>
        </div>
      </div>
    </div>
  ),
};
