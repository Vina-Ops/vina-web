import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Alert } from "./alert";
import { Bell } from "lucide-react";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible alert component for displaying important messages and notifications.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "Visual variant of the alert",
    },
    title: {
      control: "text",
      description: "Title of the alert",
    },
    description: {
      control: "text",
      description: "Description text of the alert",
    },
    closable: {
      control: "boolean",
      description: "Whether the alert can be closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// Basic Alert
export const Basic: Story = {
  args: {
    title: "Information",
    description: "This is a basic alert message.",
  },
};

// Info Alert
export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    description: "This is an informational message.",
  },
};

// Success Alert
export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    description: "Your changes have been saved successfully.",
  },
};

// Warning Alert
export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    description: "Please review your changes before proceeding.",
  },
};

// Error Alert
export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    description: "Something went wrong. Please try again.",
  },
};

// Closable Alert
const ClosableAlert = (args: any) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
      >
        Show Alert
      </button>
    );
  }

  return (
    <Alert
      {...args}
      closable
      onClose={() => setIsVisible(false)}
      title="Closable Alert"
      description="This alert can be closed by clicking the X button."
    />
  );
};

export const Closable: Story = {
  render: ClosableAlert,
};

// Custom Icon Alert
export const CustomIcon: Story = {
  args: {
    icon: Bell,
    title: "Notification",
    description: "You have a new notification.",
  },
};

// Alert with HTML Content
export const WithHTMLContent: Story = {
  args: {
    title: "Important Update",
    children: (
      <div className="mt-2 text-sm">
        <p>Please note the following changes:</p>
        <ul className="mt-2 list-disc list-inside">
          <li>New feature added</li>
          <li>Bug fixes implemented</li>
          <li>Performance improvements</li>
        </ul>
      </div>
    ),
  },
};

// Alert with Long Content
export const WithLongContent: Story = {
  args: {
    variant: "info",
    title: "System Maintenance",
    description:
      "We will be performing scheduled maintenance on our systems. During this time, some features may be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your patience as we work to improve our services.",
  },
};
