import React from "react";
import StatusBadge from "./status-badge";
import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  parameters: {
    docs: {
      description: {
        component:
          "A flexible status badge component with multiple variants and status types.",
      },
    },
  },
  argTypes: {
    status: {
      control: { type: "select" },
      options: [
        "delivered",
        "pending",
        "cancelled",
        "processing",
        "active",
        "inactive",
      ],
      description: "The status to display",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "pill", "dot"],
      description: "Visual variant of the badge",
    },
  },
};

export default meta;

const Template: StoryFn<typeof StatusBadge> = (args) => (
  <StatusBadge {...args} />
);

export const Default = Template.bind({});
Default.args = {
  status: "delivered",
  variant: "default",
};

export const Pill = Template.bind({});
Pill.args = {
  status: "active",
  variant: "pill",
};

export const Dot = Template.bind({});
Dot.args = {
  status: "processing",
  variant: "dot",
};

export const AllStatuses = () => (
  <div className="space-y-4">
    <div>
      <h3 className="font-medium mb-2">Default Variant</h3>
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status="delivered" />
        <StatusBadge status="pending" />
        <StatusBadge status="cancelled" />
        <StatusBadge status="processing" />
        <StatusBadge status="active" />
        <StatusBadge status="inactive" />
      </div>
    </div>
    <div>
      <h3 className="font-medium mb-2">Pill Variant</h3>
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status="delivered" variant="pill" />
        <StatusBadge status="pending" variant="pill" />
        <StatusBadge status="cancelled" variant="pill" />
        <StatusBadge status="processing" variant="pill" />
        <StatusBadge status="active" variant="pill" />
        <StatusBadge status="inactive" variant="pill" />
      </div>
    </div>
    <div>
      <h3 className="font-medium mb-2">Dot Variant</h3>
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status="delivered" variant="dot" />
        <StatusBadge status="pending" variant="dot" />
        <StatusBadge status="cancelled" variant="dot" />
        <StatusBadge status="processing" variant="dot" />
        <StatusBadge status="active" variant="dot" />
        <StatusBadge status="inactive" variant="dot" />
      </div>
    </div>
  </div>
);
