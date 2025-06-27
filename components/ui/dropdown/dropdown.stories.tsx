import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./dropdown";
import { User, Settings, LogOut, ChevronDown, Plus } from "lucide-react";

const meta: Meta<typeof Dropdown> = {
  title: "UI/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A dropdown component that displays a list of options in a popover menu.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "outline", "ghost"],
      description: "The visual variant of the dropdown trigger",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the dropdown trigger",
    },
    placement: {
      control: "select",
      options: ["bottom-start", "bottom-end", "top-start", "top-end"],
      description: "The placement of the dropdown menu",
    },
    closeOnSelect: {
      control: "boolean",
      description: "Whether to close the dropdown when an item is clicked",
    },
    showCheckmark: {
      control: "boolean",
      description: "Whether to show a checkmark for selected items",
    },
    disabled: {
      control: "boolean",
      description: "Whether the dropdown trigger is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const sampleItems = [
  {
    id: "profile",
    label: "Profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "divider-1",
    divider: true,
  },
  {
    id: "logout",
    label: "Logout",
    icon: <LogOut className="h-4 w-4" />,
  },
];

export const Basic: Story = {
  args: {
    label: "Options",
    items: sampleItems,
    variant: "default",
    size: "md",
    placement: "bottom-start",
    closeOnSelect: true,
    showCheckmark: true,
  },
};

export const WithCustomTrigger: Story = {
  args: {
    trigger: (
      <button className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
        <Plus className="h-4 w-4" />
        Add Item
      </button>
    ),
    items: sampleItems,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Dropdown label="Default" items={sampleItems} variant="default" />
      <Dropdown label="Primary" items={sampleItems} variant="primary" />
      <Dropdown label="Outline" items={sampleItems} variant="outline" />
      <Dropdown label="Ghost" items={sampleItems} variant="ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown label="Small" items={sampleItems} size="sm" />
      <Dropdown label="Medium" items={sampleItems} size="md" />
      <Dropdown label="Large" items={sampleItems} size="lg" />
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Dropdown
        label="Bottom Start"
        items={sampleItems}
        placement="bottom-start"
      />
      <Dropdown label="Bottom End" items={sampleItems} placement="bottom-end" />
      <Dropdown label="Top Start" items={sampleItems} placement="top-start" />
      <Dropdown label="Top End" items={sampleItems} placement="top-end" />
    </div>
  ),
};

export const WithSelectedItems: Story = {
  args: {
    label: "Options",
    items: [
      {
        id: "profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
        selected: true,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        id: "divider-1",
        divider: true,
      },
      {
        id: "logout",
        label: "Logout",
        icon: <LogOut className="h-4 w-4" />,
      },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    label: "Options",
    items: [
      {
        id: "profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        disabled: true,
      },
      {
        id: "divider-1",
        divider: true,
      },
      {
        id: "logout",
        label: "Logout",
        icon: <LogOut className="h-4 w-4" />,
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: "Options",
    items: sampleItems,
    disabled: true,
  },
};

export const WithoutCheckmark: Story = {
  args: {
    label: "Options",
    items: sampleItems,
    showCheckmark: false,
  },
};

export const CustomWidth: Story = {
  args: {
    label: "Options",
    items: sampleItems,
    menuWidth: 300,
  },
};

export const Complex: Story = {
  args: {
    label: "Account",
    items: [
      {
        id: "profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
        selected: true,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        id: "divider-1",
        divider: true,
      },
      {
        id: "logout",
        label: "Logout",
        icon: <LogOut className="h-4 w-4" />,
      },
    ],
    variant: "primary",
    size: "md",
    placement: "bottom-end",
    menuWidth: 250,
  },
};
