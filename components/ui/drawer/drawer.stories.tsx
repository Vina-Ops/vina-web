import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./drawer";
import Button from "../button/button";

const meta: Meta<typeof Drawer> = {
  title: "UI/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A drawer component that displays content in a sliding panel from the edge of the screen.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "shadow"],
      description: "The visual variant of the drawer",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      description: "The size of the drawer",
    },
    position: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
      description: "The position of the drawer",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button",
    },
    showOverlay: {
      control: "boolean",
      description: "Whether to show the overlay",
    },
    closeOnOverlayClick: {
      control: "boolean",
      description: "Whether to close the drawer when clicking the overlay",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Whether to close the drawer when pressing escape",
    },
    lockScroll: {
      control: "boolean",
      description: "Whether to lock the body scroll when the drawer is open",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const sampleContent = (
  <div className="space-y-4">
    <p>
      This is a sample drawer content. You can put any content here, including
      forms, lists, or other components.
    </p>
    <p>
      The drawer can be positioned on any side of the screen and can have
      different sizes.
    </p>
  </div>
);

const sampleFooter = (
  <div className="flex justify-end gap-2">
    <Button variant="outline" size="small">
      Cancel
    </Button>
    <Button variant="primary" size="small">
      Save Changes
    </Button>
  </div>
);

export const Basic: Story = {
  args: {
    open: true,
    title: "Drawer Title",
    children: sampleContent,
    variant: "default",
    size: "md",
    position: "right",
    showCloseButton: true,
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    lockScroll: true,
  },
};

export const WithFooter: Story = {
  args: {
    ...Basic.args,
    footer: sampleFooter,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Drawer
        open={true}
        title="Default Drawer"
        variant="default"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Bordered Drawer"
        variant="bordered"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Shadow Drawer"
        variant="shadow"
      >
        {sampleContent}
      </Drawer>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Drawer
        open={true}
        title="Small Drawer"
        size="sm"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Medium Drawer"
        size="md"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Large Drawer"
        size="lg"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Full Drawer"
        size="full"
      >
        {sampleContent}
      </Drawer>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="space-y-4">
      <Drawer
        open={true}
        title="Left Drawer"
        position="left"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Right Drawer"
        position="right"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Top Drawer"
        position="top"
      >
        {sampleContent}
      </Drawer>
      <Drawer
        open={true}
        title="Bottom Drawer"
        position="bottom"
      >
        {sampleContent}
      </Drawer>
    </div>
  ),
};

export const WithoutTitle: Story = {
  args: {
    ...Basic.args,
    title: undefined,
  },
};

export const WithoutCloseButton: Story = {
  args: {
    ...Basic.args,
    showCloseButton: false,
  },
};

export const WithoutOverlay: Story = {
  args: {
    ...Basic.args,
    showOverlay: false,
  },
};

export const Complex: Story = {
  render: () => (
    <Drawer
      open={true}
      title="Settings"
      variant="bordered"
      size="md"
      position="right"
      footer={
        <div className="flex justify-end gap-2">
              <Button variant="outline" size="small">
      Cancel
    </Button>
    <Button variant="primary" size="small">
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile Settings</h3>
          <p className="text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your display name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your email"
            />
          </div>
        </div>
      </div>
    </Drawer>
  ),
};