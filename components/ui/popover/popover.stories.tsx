import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./popover";
import { Button } from "../button/button";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A popover component that displays content in a floating container.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "shadow"],
      description: "The visual variant of the popover",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the popover",
    },
    placement: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
      description: "The placement of the popover",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button",
    },
    showArrow: {
      control: "boolean",
      description: "Whether to show an arrow pointing to the trigger",
    },
    disabled: {
      control: "boolean",
      description: "Whether the popover is disabled",
    },
    closeOnClickOutside: {
      control: "boolean",
      description: "Whether to close the popover when clicking outside",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Whether to close the popover when pressing escape",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

const sampleContent = (
  <div className="space-y-2">
    <p>This is a sample popover content.</p>
    <p>You can put any content here.</p>
  </div>
);

export const Basic: Story = {
  args: {
    trigger: <Button>Click me</Button>,
    content: sampleContent,
    variant: "default",
    size: "md",
    placement: "bottom",
    showCloseButton: true,
    showArrow: true,
  },
};

export const WithTitle: Story = {
  args: {
    ...Basic.args,
    title: "Popover Title",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Popover
        trigger={<Button>Default</Button>}
        content={sampleContent}
        variant="default"
      />
      <Popover
        trigger={<Button>Bordered</Button>}
        content={sampleContent}
        variant="bordered"
      />
      <Popover
        trigger={<Button>Shadow</Button>}
        content={sampleContent}
        variant="shadow"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Popover
        trigger={<Button>Small</Button>}
        content={sampleContent}
        size="sm"
      />
      <Popover
        trigger={<Button>Medium</Button>}
        content={sampleContent}
        size="md"
      />
      <Popover
        trigger={<Button>Large</Button>}
        content={sampleContent}
        size="lg"
      />
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Popover
        trigger={<Button>Top</Button>}
        content={sampleContent}
        placement="top"
      />
      <Popover
        trigger={<Button>Bottom</Button>}
        content={sampleContent}
        placement="bottom"
      />
      <Popover
        trigger={<Button>Left</Button>}
        content={sampleContent}
        placement="left"
      />
      <Popover
        trigger={<Button>Right</Button>}
        content={sampleContent}
        placement="right"
      />
      <Popover
        trigger={<Button>Top Start</Button>}
        content={sampleContent}
        placement="top-start"
      />
      <Popover
        trigger={<Button>Top End</Button>}
        content={sampleContent}
        placement="top-end"
      />
    </div>
  ),
};

export const WithoutArrow: Story = {
  args: {
    ...Basic.args,
    showArrow: false,
  },
};

export const WithoutCloseButton: Story = {
  args: {
    ...Basic.args,
    showCloseButton: false,
  },
};

export const CustomWidth: Story = {
  args: {
    ...Basic.args,
    width: 400,
  },
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};

export const Complex: Story = {
  args: {
    trigger: (
      <Button variant="primary" size="lg">
        Open Popover
      </Button>
    ),
    content: (
      <div className="space-y-4">
        <h4 className="font-medium">Welcome to our app!</h4>
        <p>This is a more complex popover with rich content.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </div>
      </div>
    ),
    title: "Complex Popover",
    variant: "bordered",
    size: "md",
    placement: "bottom-end",
    width: 350,
    showArrow: true,
    showCloseButton: true,
  },
};
