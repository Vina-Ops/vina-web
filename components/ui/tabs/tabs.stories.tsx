import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./tabs";
import { Home, User, Settings, Bell, Mail } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible tabs component that supports both horizontal and vertical layouts with various styles.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["line", "enclosed", "soft-rounded", "solid-rounded"],
      description: "Visual variant of the tabs",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the tabs",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the tabs",
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the tabs should take full width",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const basicItems = [
  {
    id: "tab1",
    label: "Tab 1",
    content: (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Tab 1 Content</h3>
        <p className="text-gray-600">
          This is the content of the first tab. You can put any content here.
        </p>
      </div>
    ),
  },
  {
    id: "tab2",
    label: "Tab 2",
    content: (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Tab 2 Content</h3>
        <p className="text-gray-600">
          This is the content of the second tab. You can put any content here.
        </p>
      </div>
    ),
  },
  {
    id: "tab3",
    label: "Tab 3",
    content: (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Tab 3 Content</h3>
        <p className="text-gray-600">
          This is the content of the third tab. You can put any content here.
        </p>
      </div>
    ),
  },
];

// Basic Tabs
export const Basic: Story = {
  args: {
    items: basicItems,
  },
};

// Tabs with Icons
export const WithIcons: Story = {
  args: {
    items: [
      {
        id: "home",
        label: "Home",
        icon: <Home className="w-5 h-5" />,
        content: (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Home</h3>
            <p className="text-gray-600">Welcome to the home page.</p>
          </div>
        ),
      },
      {
        id: "profile",
        label: "Profile",
        icon: <User className="w-5 h-5" />,
        content: (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Profile</h3>
            <p className="text-gray-600">View and edit your profile.</p>
          </div>
        ),
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="w-5 h-5" />,
        content: (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Settings</h3>
            <p className="text-gray-600">Configure your preferences.</p>
          </div>
        ),
      },
    ],
  },
};

// Disabled Tabs
export const WithDisabled: Story = {
  args: {
    items: [
      ...basicItems,
      {
        id: "tab4",
        label: "Disabled Tab",
        disabled: true,
        content: (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Disabled Tab Content</h3>
            <p className="text-gray-600">This tab is disabled.</p>
          </div>
        ),
      },
    ],
  },
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Line Variant</h3>
        <Tabs items={basicItems} variant="line" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Enclosed Variant</h3>
        <Tabs items={basicItems} variant="enclosed" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Soft Rounded Variant</h3>
        <Tabs items={basicItems} variant="soft-rounded" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Solid Rounded Variant</h3>
        <Tabs items={basicItems} variant="solid-rounded" />
      </div>
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Small Size</h3>
        <Tabs items={basicItems} size="sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Medium Size</h3>
        <Tabs items={basicItems} size="md" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large Size</h3>
        <Tabs items={basicItems} size="lg" />
      </div>
    </div>
  ),
};

// Vertical Orientation
export const Vertical: Story = {
  args: {
    items: basicItems,
    orientation: "vertical",
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    items: basicItems,
    fullWidth: true,
  },
};

// Complex Example
export const Complex: Story = {
  args: {
    items: [
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell className="w-5 h-5" />,
        content: (
          <div className="space-y-4">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h4 className="font-medium">New Message</h4>
              <p className="text-sm text-gray-600">
                You have a new message from John Doe
              </p>
              <span className="text-xs text-gray-500">2 minutes ago</span>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h4 className="font-medium">System Update</h4>
              <p className="text-sm text-gray-600">
                System maintenance scheduled for tomorrow
              </p>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
          </div>
        ),
      },
      {
        id: "messages",
        label: "Messages",
        icon: <Mail className="w-5 h-5" />,
        content: (
          <div className="space-y-4">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">JD</span>
                </div>
                <div>
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-gray-600">Hey, how are you?</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium">AS</span>
                </div>
                <div>
                  <h4 className="font-medium">Alice Smith</h4>
                  <p className="text-sm text-gray-600">Can we meet tomorrow?</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    variant: "soft-rounded",
    fullWidth: true,
  },
};
