import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./modal";
import Button from "../button/button";
import { Input } from "../input/input";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible modal component for displaying dialogs, forms, and other content.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "Size of the modal",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button",
    },
    closeOnOverlayClick: {
      control: "boolean",
      description: "Whether to close the modal when clicking the overlay",
    },
    closeOnEsc: {
      control: "boolean",
      description: "Whether to close the modal when pressing the Escape key",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Create proper React components for each story
const BasicModalStory = (args: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
        description="This is a basic modal example."
      >
        <p className="text-gray-600">
          This is the content of the modal. You can put any content here.
        </p>
      </Modal>
    </>
  );
};

const WithFormStory = (args: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Account"
        description="Fill in the form below to create your account."
      >
        <form className="space-y-4">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="Enter your email" />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create Account</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const WithLongContentStory = (args: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Long Content Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Terms and Conditions"
        description="Please read our terms and conditions carefully."
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa
              qui officia deserunt mollit anim id est laborum.
            </p>
            {/* Add more paragraphs to demonstrate scrolling */}
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button variant="primary">Accept</Button>
        </div>
      </Modal>
    </>
  );
};

const CustomSizeStory = (args: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Large Modal"
        description="This is a large modal example."
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Column 1</h3>
            <p className="text-gray-600">
              This is the first column of the large modal.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Column 2</h3>
            <p className="text-gray-600">
              This is the second column of the large modal.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

const WithoutCloseButtonStory = (args: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="No Close Button"
        description="This modal doesn't have a close button."
        showCloseButton={false}
      >
        <p className="text-gray-600">
          You can only close this modal by clicking the button below or
          pressing Escape.
        </p>
        <div className="flex justify-end pt-4">
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

// Basic Modal
export const Basic: Story = {
  render: (args) => <BasicModalStory {...args} />,
};

// Modal with Form
export const WithForm: Story = {
  render: (args) => <WithFormStory {...args} />,
};

// Modal with Long Content
export const WithLongContent: Story = {
  render: (args) => <WithLongContentStory {...args} />,
};

// Modal with Custom Size
export const CustomSize: Story = {
  render: (args) => <CustomSizeStory {...args} />,
};

// Modal without Close Button
export const WithoutCloseButton: Story = {
  render: (args) => <WithoutCloseButtonStory {...args} />,
};