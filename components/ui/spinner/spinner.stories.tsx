import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "UI/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A spinner component that indicates loading states with various animation styles.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error"],
      description: "The visual variant of the spinner",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "The size of the spinner",
    },
    style: {
      control: "select",
      options: ["circular", "dots", "pulse"],
      description: "The style of the spinner",
    },
    speed: {
      control: "number",
      description: "The speed of the spinner animation in milliseconds",
    },
    disabled: {
      control: "boolean",
      description: "Whether the spinner is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Basic: Story = {
  args: {
    variant: "default",
    size: "md",
    style: "circular",
  },
};

export const WithLabel: Story = {
  args: {
    ...Basic.args,
    label: "Loading...",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <Spinner variant="default" />
      <Spinner variant="primary" />
      <Spinner variant="success" />
      <Spinner variant="warning" />
      <Spinner variant="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const Styles: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <Spinner style="circular" />
      <Spinner style="dots" />
      <Spinner style="pulse" />
    </div>
  ),
};

export const CustomSpeed: Story = {
  args: {
    ...Basic.args,
    speed: 1000,
  },
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};

export const Complex: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Spinner variant="primary" size="sm" />
        <span className="text-sm text-gray-600">Loading data...</span>
      </div>

      <div className="flex items-center gap-4">
        <Spinner variant="success" size="md" style="dots" />
        <span className="text-base text-gray-600">Processing request...</span>
      </div>

      <div className="flex items-center gap-4">
        <Spinner variant="warning" size="lg" style="pulse" />
        <span className="text-lg text-gray-600">Uploading files...</span>
      </div>

      <div className="flex items-center gap-4">
        <Spinner variant="error" size="xl" />
        <span className="text-xl text-gray-600">Something went wrong...</span>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium">Loading Profile</h3>
        <div className="mt-4 flex items-center gap-4">
          <Spinner variant="primary" size="sm" />
          <span className="text-sm text-gray-600">Fetching user data...</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium">Processing Payment</h3>
        <div className="mt-4 flex items-center gap-4">
          <Spinner variant="success" size="md" style="dots" />
          <span className="text-base text-gray-600">
            Verifying transaction...
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium">Error Recovery</h3>
        <div className="mt-4 flex items-center gap-4">
          <Spinner variant="error" size="lg" style="pulse" />
          <span className="text-lg text-gray-600">
            Attempting to recover...
          </span>
        </div>
      </div>
    </div>
  ),
};
