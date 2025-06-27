import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch, SwitchGroup } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A Switch component that allows users to toggle between two states. It supports various visual variants, sizes, and states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error"],
      description: "The visual variant of the switch",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the switch",
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
    error: {
      control: "boolean",
      description: "Whether the switch is in an error state",
    },
    controlled: {
      control: "boolean",
      description: "Whether to show the switch in a controlled state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Basic: Story = {
  args: {
    label: "Enable notifications",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Enable notifications",
    helperText: "Receive notifications about new messages",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="Default Switch" variant="default" />
      <Switch label="Primary Switch" variant="primary" />
      <Switch label="Success Switch" variant="success" />
      <Switch label="Warning Switch" variant="warning" />
      <Switch label="Error Switch" variant="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="Small Switch" size="sm" />
      <Switch label="Medium Switch" size="md" />
      <Switch label="Large Switch" size="lg" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "Enable notifications",
    error: true,
    errorMessage: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Enable notifications",
    disabled: true,
  },
};

export const GroupedSwitches: Story = {
  render: () => (
    <SwitchGroup
      label="Notification Settings"
      helperText="Configure your notification preferences"
    >
      <Switch label="Email Notifications" />
      <Switch label="Push Notifications" />
      <Switch label="SMS Notifications" />
    </SwitchGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: () => (
    <SwitchGroup label="Theme Settings" orientation="horizontal">
      <Switch label="Dark Mode" />
      <Switch label="High Contrast" />
    </SwitchGroup>
  ),
};

export const Complex: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SwitchGroup
        label="Account Settings"
        helperText="Manage your account preferences"
      >
        <Switch
          label="Two-Factor Authentication"
          helperText="Add an extra layer of security to your account"
        />
        <Switch
          label="Email Notifications"
          helperText="Receive email updates about your account"
        />
      </SwitchGroup>

      <SwitchGroup label="Privacy Settings" orientation="horizontal">
        <Switch label="Profile Visibility" variant="primary" />
        <Switch label="Activity Status" variant="primary" />
      </SwitchGroup>

      <SwitchGroup
        label="System Settings"
        error={true}
        errorMessage="Some settings require admin approval"
      >
        <Switch label="Automatic Updates" size="lg" variant="success" />
        <Switch label="Debug Mode" size="lg" variant="warning" disabled />
      </SwitchGroup>
    </div>
  ),
};
