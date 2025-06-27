import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./divider";

const meta: Meta<typeof Divider> = {
  title: "UI/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A divider component that creates a visual separation between content sections.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
      description: "The visual variant of the divider",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "The orientation of the divider",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the divider",
    },
    color: {
      control: "color",
      description: "The color of the divider",
    },
    disabled: {
      control: "boolean",
      description: "Whether the divider is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Basic: Story = {
  args: {
    variant: "solid",
    orientation: "horizontal",
    size: "md",
  },
};

export const WithLabel: Story = {
  args: {
    ...Basic.args,
    label: "OR",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Divider size="sm" />
      <Divider size="md" />
      <Divider size="lg" />
    </div>
  ),
};

export const Orientations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="h-32">
        <Divider orientation="vertical" />
      </div>
      <div className="w-32">
        <Divider orientation="horizontal" />
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <Divider color="#3B82F6" />
      <Divider color="#10B981" />
      <Divider color="#EF4444" />
      <Divider color="#F59E0B" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};

export const WithCustomLabel: Story = {
  args: {
    ...Basic.args,
    label: (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">OR</span>
        <span className="text-xs text-gray-400">continue with</span>
      </div>
    ),
  },
};

export const Complex: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Section 1</h3>
        <p className="mt-2 text-gray-600">
          This is the first section of content.
        </p>
        <Divider className="my-4" />
        <p className="text-gray-600">
          This is the continuation of the first section.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium">Section 2</h3>
        <p className="mt-2 text-gray-600">
          This is the second section of content.
        </p>
        <Divider
          variant="dashed"
          size="sm"
          label="Section Break"
          className="my-4"
        />
        <p className="text-gray-600">
          This is the continuation of the second section.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium">Left Content</h3>
          <p className="mt-2 text-gray-600">This is the left side content.</p>
        </div>
        <Divider orientation="vertical" className="h-32" />
        <div className="flex-1">
          <h3 className="text-lg font-medium">Right Content</h3>
          <p className="mt-2 text-gray-600">This is the right side content.</p>
        </div>
      </div>
    </div>
  ),
};
