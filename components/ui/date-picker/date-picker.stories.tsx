import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, DateRangePicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A DatePicker component that allows users to select dates with a calendar popup. It supports various visual variants, sizes, and date formats.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error"],
      description: "The visual variant of the date picker",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the date picker",
    },
    disabled: {
      control: "boolean",
      description: "Whether the date picker is disabled",
    },
    error: {
      control: "boolean",
      description: "Whether the date picker is in an error state",
    },
    showIcon: {
      control: "boolean",
      description: "Whether to show the calendar icon",
    },
    clearable: {
      control: "boolean",
      description: "Whether the date picker is clearable",
    },
    showTime: {
      control: "boolean",
      description: "Whether to show the time picker",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {
  args: {
    label: "Select Date",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Select Date",
    helperText: "Choose a date for your appointment",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <DatePicker label="Default DatePicker" variant="default" />
      <DatePicker label="Primary DatePicker" variant="primary" />
      <DatePicker label="Success DatePicker" variant="success" />
      <DatePicker label="Warning DatePicker" variant="warning" />
      <DatePicker label="Error DatePicker" variant="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <DatePicker label="Small DatePicker" size="sm" />
      <DatePicker label="Medium DatePicker" size="md" />
      <DatePicker label="Large DatePicker" size="lg" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "Select Date",
    error: true,
    errorMessage: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Select Date",
    disabled: true,
  },
};

export const Clearable: Story = {
  args: {
    label: "Select Date",
    clearable: true,
  },
};

export const WithMinMaxDate: Story = {
  args: {
    label: "Select Date",
    minDate: new Date(),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
};

export const DateRange: Story = {
  render: () => (
    <DateRangePicker
      label="Select Date Range"
      helperText="Choose a date range for your booking"
    />
  ),
};

export const DateRangeWithMinMax: Story = {
  render: () => (
    <DateRangePicker
      label="Select Date Range"
      minDate={new Date()}
      maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
    />
  ),
};

export const Complex: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DatePicker
        label="Appointment Date"
        helperText="Select your preferred appointment date"
        variant="primary"
        clearable
        showIcon
      />

      <DateRangePicker
        label="Booking Period"
        helperText="Select your booking period"
        variant="success"
        clearable
        showIcon
      />

      <DatePicker
        label="Event Date"
        error={true}
        errorMessage="Please select a valid date"
        variant="error"
        disabled
      />
    </div>
  ),
};
