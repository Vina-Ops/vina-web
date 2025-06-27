import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tree } from "./tree";
import {
  Folder,
  File,
  Settings,
  User,
  Bell,
  Lock,
  Database,
} from "lucide-react";

const meta: Meta<typeof Tree> = {
  title: "UI/Tree",
  component: Tree,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A hierarchical tree component for displaying nested data structures with support for selection, expansion, and custom icons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "compact"],
      description: "The visual variant of the tree",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the tree nodes",
    },
    selectionMode: {
      control: "select",
      options: ["single", "multiple", "none"],
      description: "The selection mode of the tree",
    },
    showChevron: {
      control: "boolean",
      description: "Whether to show the chevron icon",
    },
    showDefaultIcons: {
      control: "boolean",
      description: "Whether to show the default folder/file icons",
    },
    animateChevron: {
      control: "boolean",
      description: "Whether to animate the chevron rotation",
    },
    indentWidth: {
      control: "number",
      description: "The indentation width in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

const sampleData = [
  {
    id: "1",
    label: "Documents",
    icon: <Folder className="text-blue-500" />,
    children: [
      {
        id: "1-1",
        label: "Work",
        icon: <Folder className="text-blue-500" />,
        children: [
          {
            id: "1-1-1",
            label: "Project A",
            icon: <File className="text-gray-500" />,
          },
          {
            id: "1-1-2",
            label: "Project B",
            icon: <File className="text-gray-500" />,
          },
        ],
      },
      {
        id: "1-2",
        label: "Personal",
        icon: <Folder className="text-blue-500" />,
        children: [
          {
            id: "1-2-1",
            label: "Photos",
            icon: <File className="text-gray-500" />,
          },
          {
            id: "1-2-2",
            label: "Videos",
            icon: <File className="text-gray-500" />,
          },
        ],
      },
    ],
  },
];

const settingsData = [
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="text-gray-500" />,
    children: [
      {
        id: "profile",
        label: "Profile",
        icon: <User className="text-gray-500" />,
        children: [
          {
            id: "personal-info",
            label: "Personal Information",
            icon: <File className="text-gray-500" />,
          },
          {
            id: "preferences",
            label: "Preferences",
            icon: <File className="text-gray-500" />,
          },
        ],
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell className="text-gray-500" />,
        children: [
          {
            id: "email",
            label: "Email Notifications",
            icon: <File className="text-gray-500" />,
          },
          {
            id: "push",
            label: "Push Notifications",
            icon: <File className="text-gray-500" />,
          },
        ],
      },
      {
        id: "security",
        label: "Security",
        icon: <Lock className="text-gray-500" />,
        children: [
          {
            id: "password",
            label: "Password",
            icon: <File className="text-gray-500" />,
          },
          {
            id: "2fa",
            label: "Two-Factor Authentication",
            icon: <File className="text-gray-500" />,
          },
        ],
      },
    ],
  },
];

export const Basic: Story = {
  args: {
    data: sampleData,
    variant: "default",
    size: "md",
    selectionMode: "none",
    showChevron: true,
    showDefaultIcons: true,
    animateChevron: true,
    indentWidth: 20,
  },
};

export const WithSelection: Story = {
  args: {
    ...Basic.args,
    selectionMode: "single",
  },
};

export const MultipleSelection: Story = {
  args: {
    ...Basic.args,
    selectionMode: "multiple",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Default</h3>
        <Tree data={sampleData} variant="default" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Bordered</h3>
        <Tree data={sampleData} variant="bordered" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Compact</h3>
        <Tree data={sampleData} variant="compact" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <Tree data={sampleData} size="sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Medium</h3>
        <Tree data={sampleData} size="md" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <Tree data={sampleData} size="lg" />
      </div>
    </div>
  ),
};

export const WithoutChevron: Story = {
  args: {
    ...Basic.args,
    showChevron: false,
  },
};

export const WithoutDefaultIcons: Story = {
  args: {
    ...Basic.args,
    showDefaultIcons: false,
  },
};

export const CustomIndentation: Story = {
  args: {
    ...Basic.args,
    indentWidth: 32,
  },
};

export const Complex: Story = {
  args: {
    data: settingsData,
    variant: "bordered",
    size: "md",
    selectionMode: "single",
    showChevron: true,
    showDefaultIcons: true,
    animateChevron: true,
    indentWidth: 24,
  },
};

export const WithDisabledNodes: Story = {
  args: {
    data: [
      {
        id: "1",
        label: "Enabled Node",
        icon: <Folder className="text-blue-500" />,
        children: [
          {
            id: "1-1",
            label: "Disabled Node",
            icon: <File className="text-gray-500" />,
            disabled: true,
          },
          {
            id: "1-2",
            label: "Enabled Node",
            icon: <File className="text-gray-500" />,
          },
        ],
      },
    ],
    variant: "default",
    size: "md",
    selectionMode: "single",
  },
};

export const WithDefaultExpanded: Story = {
  args: {
    ...Basic.args,
    defaultExpanded: ["1", "1-1"],
  },
};

export const WithDefaultSelected: Story = {
  args: {
    ...Basic.args,
    selectionMode: "single",
    defaultSelected: ["1-1-1"],
  },
};
