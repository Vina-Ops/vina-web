import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "./radio";

const meta: Meta<typeof Radio> = {
  title: "UI/Radio",
  component: Radio,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible radio component for single-choice selections with various styles and states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error"],
      description: "The visual variant of the radio",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the radio",
    },
    disabled: {
      control: "boolean",
      description: "Whether the radio is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

// Basic Radio
export const Basic: Story = {
  args: {
    label: "Option 1",
  },
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: "Option 1",
    helperText: "This is a helper text",
  },
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Radio label="Default" variant="default" />
      <Radio label="Primary" variant="primary" />
      <Radio label="Success" variant="success" />
      <Radio label="Warning" variant="warning" />
      <Radio label="Error" variant="error" />
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Radio label="Small" size="sm" />
      <Radio label="Medium" size="md" />
      <Radio label="Large" size="lg" />
    </div>
  ),
};

// With Error
export const WithError: Story = {
  args: {
    label: "Option 1",
    error: true,
    errorMessage: "This field is required",
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    label: "Option 1",
    disabled: true,
  },
};

// Radio Group
export const Group: Story = {
  render: () => {
    const [value, setValue] = React.useState("option1");

    return (
      <RadioGroup
        name="options"
        value={value}
        onChange={setValue}
        label="Select an option"
        helperText="Choose one of the following options"
      >
        <Radio label="Option 1" value="option1" />
        <Radio label="Option 2" value="option2" />
        <Radio label="Option 3" value="option3" />
      </RadioGroup>
    );
  },
};

// Horizontal Group
export const HorizontalGroup: Story = {
  render: () => {
    const [value, setValue] = React.useState("option1");

    return (
      <RadioGroup
        name="options"
        value={value}
        onChange={setValue}
        label="Select an option"
        orientation="horizontal"
      >
        <Radio label="Option 1" value="option1" />
        <Radio label="Option 2" value="option2" />
        <Radio label="Option 3" value="option3" />
      </RadioGroup>
    );
  },
};

// Complex Example
export const Complex: Story = {
  render: () => {
    const [value, setValue] = React.useState("option1");

    return (
      <div className="space-y-6">
        <RadioGroup
          name="options"
          value={value}
          onChange={setValue}
          label="Select a plan"
          helperText="Choose the plan that best fits your needs"
        >
          <Radio
            label="Basic Plan"
            value="basic"
            helperText="Perfect for individuals"
          />
          <Radio
            label="Pro Plan"
            value="pro"
            helperText="Great for small teams"
          />
          <Radio
            label="Enterprise Plan"
            value="enterprise"
            helperText="For large organizations"
          />
        </RadioGroup>

        <RadioGroup
          name="billing"
          label="Billing Cycle"
          orientation="horizontal"
        >
          <Radio label="Monthly" value="monthly" />
          <Radio label="Yearly" value="yearly" />
        </RadioGroup>
      </div>
    );
  },
};
