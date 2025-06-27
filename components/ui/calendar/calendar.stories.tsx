import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible calendar component for date selection and event display.",
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range", "multiple"],
      description: "The selection mode of the calendar",
    },
    showOutsideDays: {
      control: "boolean",
      description: "Whether to show days from previous/next months",
    },
    fixedWeeks: {
      control: "boolean",
      description: "Whether to always show 6 weeks",
    },
    weekStartsOn: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "The day that starts the week (0 = Sunday)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Basic: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
    fixedWeeks: false,
  },
};

export const WithRangeSelection: Story = {
  args: {
    mode: "range",
    showOutsideDays: true,
    fixedWeeks: false,
  },
};

export const WithMultipleSelection: Story = {
  args: {
    mode: "multiple",
    showOutsideDays: true,
    fixedWeeks: false,
  },
};

export const WithEvents: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
    fixedWeeks: false,
    events: [
      {
        date: new Date(2024, 2, 15),
        label: "Team Meeting",
        color: "bg-blue-500",
      },
      {
        date: new Date(2024, 2, 20),
        label: "Project Deadline",
        color: "bg-red-500",
      },
      {
        date: new Date(2024, 2, 25),
        label: "Client Call",
        color: "bg-green-500",
      },
    ],
  },
};

export const WithDisabledDates: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
    fixedWeeks: false,
    disabled: (date) => {
      // Disable weekends
      const day = date.getDay();
      return day === 0 || day === 6;
    },
  },
};

export const WithDateRange: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
    fixedWeeks: false,
    minDate: new Date(2024, 2, 1),
    maxDate: new Date(2024, 2, 31),
  },
};

export const WithCustomLocale: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
    fixedWeeks: false,
    locale: "fr-FR",
  },
};

export const WithFixedWeeks: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
    fixedWeeks: true,
  },
};

export const WithWeekStartOnMonday: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
    fixedWeeks: false,
    weekStartsOn: 1,
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | null>(null);

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={selected || undefined}
          onSelect={(date) => setSelected(date as Date)}
        />
        {selected && (
          <div className="text-center text-sm text-gray-500">
            Selected date: {selected.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  },
};

export const InteractiveRange: Story = {
  render: () => {
    const [range, setRange] = useState<{ from: Date; to: Date } | null>(null);

    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={range || undefined}
          onSelect={(date) => setRange(date as { from: Date; to: Date })}
        />
        {range && (
          <div className="text-center text-sm text-gray-500">
            Selected range: {range.from.toLocaleDateString()} -{" "}
            {range.to.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  },
};
