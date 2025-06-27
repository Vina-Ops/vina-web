import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";
import Button from "../button/button";
import { Info, HelpCircle, Settings, Star } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible tooltip component that displays additional information on hover or focus.",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Position of the tooltip",
    },
    variant: {
      control: "select",
      options: ["default", "light", "dark"],
      description: "Visual variant of the tooltip",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the tooltip",
    },
    delay: {
      control: "number",
      description: "Delay before showing the tooltip (in milliseconds)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the tooltip is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Basic Tooltip
export const Basic: Story = {
  args: {
    content: "This is a basic tooltip",
    children: <Button>Hover me</Button>,
  },
};

// Tooltip with Icon
export const WithIcon: Story = {
  args: {
    content: "Click to view more information",
    children: (
      <button className="p-2 text-gray-500 hover:text-gray-700">
        <Info className="w-5 h-5" />
      </button>
    ),
  },
};

// Different Positions
export const Positions: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <Tooltip content="Top tooltip" position="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <Button>Right</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <Button>Left</Button>
      </Tooltip>
    </div>
  ),
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <Tooltip content="Default variant" variant="default">
        <Button>Default</Button>
      </Tooltip>
      <Tooltip content="Light variant" variant="light">
        <Button>Light</Button>
      </Tooltip>
      <Tooltip content="Dark variant" variant="dark">
        <Button>Dark</Button>
      </Tooltip>
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <Tooltip content="Small tooltip" size="sm">
        <Button>Small</Button>
      </Tooltip>
      <Tooltip content="Medium tooltip" size="md">
        <Button>Medium</Button>
      </Tooltip>
      <Tooltip content="Large tooltip" size="lg">
        <Button>Large</Button>
      </Tooltip>
    </div>
  ),
};

// With Custom Delay
export const WithDelay: Story = {
  args: {
    content: "This tooltip appears after 500ms",
    delay: 500,
    children: <Button>Hover me</Button>,
  },
};

// Disabled Tooltip
export const Disabled: Story = {
  args: {
    content: "This tooltip is disabled",
    disabled: true,
    children: <Button>Hover me</Button>,
  },
};

// Complex Content
export const ComplexContent: Story = {
  args: {
    content: (
      <div className="space-y-2">
        <div className="font-medium">Settings</div>
        <p className="text-sm">Configure your preferences here</p>
        <div className="flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4" />
          <span>Click to open settings</span>
        </div>
      </div>
    ),
    children: (
      <button className="p-2 text-gray-500 hover:text-gray-700">
        <Settings className="w-5 h-5" />
      </button>
    ),
  },
};

// Multiple Tooltips
export const MultipleTooltips: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <Tooltip content="Help information">
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <HelpCircle className="w-5 h-5" />
        </button>
      </Tooltip>
      <Tooltip content="Settings panel">
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Settings className="w-5 h-5" />
        </button>
      </Tooltip>
      <Tooltip content="Favorite item">
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Star className="w-5 h-5" />
        </button>
      </Tooltip>
    </div>
  ),
};
