import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible progress component that supports both determinate and indeterminate states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error"],
      description: "The visual variant of the progress",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the progress",
    },
    shape: {
      control: "select",
      options: ["rounded", "square"],
      description: "The shape of the progress",
    },
    showValue: {
      control: "boolean",
      description: "Whether to show the progress value",
    },
    disabled: {
      control: "boolean",
      description: "Whether the progress is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

// Basic Progress
export const Basic: Story = {
  args: {
    value: 50,
  },
};

// With Label
export const WithLabel: Story = {
  args: {
    value: 75,
    label: "Loading...",
    showValue: true,
  },
};

// Indeterminate
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: "Loading...",
  },
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Progress value={75} variant="default" label="Default" showValue />
      <Progress value={75} variant="success" label="Success" showValue />
      <Progress value={75} variant="warning" label="Warning" showValue />
      <Progress value={75} variant="error" label="Error" showValue />
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Progress value={75} size="sm" label="Small" showValue />
      <Progress value={75} size="md" label="Medium" showValue />
      <Progress value={75} size="lg" label="Large" showValue />
    </div>
  ),
};

// Different Shapes
export const Shapes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Progress value={75} shape="rounded" label="Rounded" showValue />
      <Progress value={75} shape="square" label="Square" showValue />
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  args: {
    value: 75,
    label: "Disabled",
    showValue: true,
    disabled: true,
  },
};

// Animated Progress
export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-full max-w-md">
        <Progress
          value={progress}
          label="Downloading..."
          showValue
          variant="success"
        />
      </div>
    );
  },
};

// Complex Example
export const Complex: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <Progress
        value={75}
        variant="success"
        size="lg"
        label="System Update"
        showValue
      />
      <Progress
        value={45}
        variant="warning"
        size="md"
        label="File Upload"
        showValue
      />
      <Progress
        indeterminate
        variant="default"
        size="sm"
        label="Processing..."
      />
    </div>
  ),
};
